import os
import shutil
import json
import re
import numpy as np
from PIL import Image
import easyocr

print("Initializing EasyOCR reader...", flush=True)
reader = easyocr.Reader(['en'], gpu=False)

bg_dir = r"d:\A to Z prints\templates id card\templates id card bg\ID CARD BG"
ref_dir = r"d:\A to Z prints\templates id card\templates id card bg with elements\id templates"
dest_dir = r"d:\A to Z prints\public\templates\id"

email_pat = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
web_pat = re.compile(r'(www\.|http:|https:|[a-zA-Z0-9-]+\.(com|co|in|net|org|site|agency|biz|io))', re.IGNORECASE)
phone_pat = re.compile(r'[\+\d][\d\s\-\(\)]{6,}')
id_pat = re.compile(r'(id\s*no|emp\s*id|employee\s*id|card\s*no|no\s*:)[:\s]*[a-zA-Z0-9-]+', re.IGNORECASE)
blood_pat = re.compile(r'(blood\s*(group|gp)|blood\s*:)[:\s]*[a-zA-Z\s\+-]+', re.IGNORECASE)

def detect_text_color(ref_img, bg_img, bbox_orig, default_color="#FFFFFF"):
    try:
        x, y, w, h = bbox_orig
        orig_w, orig_h = ref_img.size
        x = max(0, min(orig_w - 1, int(x)))
        y = max(0, min(orig_h - 1, int(y)))
        w = max(1, min(orig_w - x, int(w)))
        h = max(1, min(orig_h - y, int(h)))
        crop_ref = np.array(ref_img.crop((x, y, x + w, y + h))).astype(int)
        crop_bg  = np.array(bg_img.crop((x, y, x + w, y + h))).astype(int)
        diff = np.sum(np.abs(crop_ref - crop_bg), axis=2)
        mask = diff > 35
        if mask.sum() > 50:
            median_c = np.median(crop_ref[mask], axis=0).astype(int)
            return '#{:02x}{:02x}{:02x}'.format(*median_c).upper()
        avg = np.mean(crop_bg.reshape(-1, 3), axis=0)
        brightness = 0.299*avg[0] + 0.587*avg[1] + 0.114*avg[2]
        return "#FFFFFF" if brightness < 127 else "#1A1A1A"
    except:
        return default_color

def process_side(src_ref, src_bg, side_name):
    ref_img = Image.open(src_ref).convert('RGB')
    bg_img  = Image.open(src_bg).convert('RGB')
    orig_w, orig_h = ref_img.size

    # Resize for OCR
    target_w = 800
    target_h = int(orig_h * target_w / orig_w)
    small = ref_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    tmp = src_ref + "_tmp_ocr.png"
    small.save(tmp)
    ocr_raw = reader.readtext(tmp)
    os.remove(tmp)

    # Parse into blocks
    blocks = []
    for bbox, text, prob in ocr_raw:
        x1, y1 = bbox[0]
        x2, y2 = bbox[2]
        w = x2 - x1
        h = y2 - y1
        blocks.append({
            'text': text.strip(),
            'x1': float(x1), 'y1': float(y1),
            'x2': float(x2), 'y2': float(y2),
            'cx': (x1+x2)/2, 'cy': (y1+y2)/2,
            'w': w, 'h': h
        })

    # Sort top-to-bottom
    blocks.sort(key=lambda b: b['y1'])

    # --- CLASSIFY BY CONTENT (contacts) then POSITION (everything else) ---
    classified = {}  # field_name -> block

    # First pass: classify contacts by content
    unmatched = []
    for b in blocks:
        t = b['text']
        tl = t.lower()
        if email_pat.search(t):
            classified.setdefault('email', b)
        elif web_pat.search(t) and '@' not in t:
            classified.setdefault('website', b)
        elif phone_pat.search(t) and sum(c.isdigit() for c in t) >= 7:
            classified.setdefault('phone', b)
        elif id_pat.search(t):
            classified.setdefault('id_no', b)
        elif blood_pat.search(t):
            classified.setdefault('blood_group', b)
        else:
            unmatched.append(b)

    # Second pass: positional classification on unmatched
    # ID card vertical layout zones:
    #   0-20%:   logo / company area
    #   20-45%:  photo area (we'll infer position, not from text)
    #   45-70%:  name / designation
    #   70-85%:  address / extra contact
    #   85-100%: signature / QR

    # Among unmatched: separate by y position
    top_zone   = [b for b in unmatched if b['cy']/target_h < 0.20]  # company name / logo area
    mid_zone   = [b for b in unmatched if 0.20 <= b['cy']/target_h < 0.45]  # mid (often empty text)
    lower_zone = [b for b in unmatched if b['cy']/target_h >= 0.45]  # name, designation, address

    # Company name = largest text in top zone
    if top_zone:
        top_zone_sorted = sorted(top_zone, key=lambda b: b['h'], reverse=True)
        classified['company_name'] = top_zone_sorted[0]

    # In lower zone: sort by y position, assign name then designation
    lower_zone.sort(key=lambda b: b['y1'])
    # Filter out blocks that overlap with already-classified contact fields
    contact_ys = set()
    for field in ['phone', 'email', 'website']:
        if field in classified:
            contact_ys.add(round(classified[field]['y1']))
    lower_zone_text = [b for b in lower_zone if round(b['y1']) not in contact_ys]

    if side_name == 'front':
        # First = Name (usually the largest / topmost in lower zone)
        name_candidates = sorted(lower_zone_text, key=lambda b: b['h'], reverse=True)
        if name_candidates:
            classified['name'] = name_candidates[0]
            remaining = [b for b in lower_zone_text if b is not name_candidates[0]]
            # Next = Designation (immediately below name)
            if remaining:
                remaining.sort(key=lambda b: b['y1'])
                classified['designation'] = remaining[0]

    # Address (anything in lower_zone not yet taken)
    taken = set(id(classified[f]) for f in classified)
    addr_blocks = [b for b in lower_zone if id(b) not in taken]
    if addr_blocks and 'address' not in classified:
        # Only if they look like address content
        for b in addr_blocks:
            tl = b['text'].lower()
            if any(k in tl for k in ['street', 'st.', 'road', 'rd', 'city', 'state', 'anywhere', 'suite', 'floor', 'avenue', 'blvd']):
                classified['address'] = b
                break

    # --- BUILD MAPPINGS ---
    mappings = {}

    # Background brightness for fallback color
    avg = np.mean(np.array(bg_img.resize((100, 100))).reshape(-1, 3), axis=0)
    brightness = 0.299*avg[0] + 0.587*avg[1] + 0.114*avg[2]
    fallback_color = "#FFFFFF" if brightness < 127 else "#1A1A1A"

    # Font size limits per field
    size_cfg = {
        'name':         (13, 22, 0.55),
        'designation':  (9,  13, 0.35),
        'company_name': (10, 16, 0.45),
        'phone':        (8,  10, 0.30),
        'email':        (8,  10, 0.30),
        'website':      (8,  10, 0.30),
        'address':      (7,  9,  0.28),
        'id_no':        (9,  12, 0.35),
        'blood_group':  (9,  11, 0.32),
        'emergency':    (8,  10, 0.30),
    }

    company_box = None

    for field, b in classified.items():
        x_pct = (b['x1'] / target_w) * 100
        y_pct = (b['y1'] / target_h) * 100
        w_pct = (b['w']  / target_w) * 100
        h_pct = (b['h']  / target_h) * 100

        if field == 'company_name':
            company_box = {'x': x_pct, 'y': y_pct, 'w': w_pct, 'h': h_pct}

        mn, mx, sc = size_cfg.get(field, (8, 10, 0.30))
        raw_size = (b['h'] / target_h) * 500 * sc
        font_size = round(max(mn, min(mx, raw_size)), 1)

        # Detect color from original images
        ox = int(b['x1'] * orig_w / target_w)
        oy = int(b['y1'] * orig_h / target_h)
        ow = int(b['w']  * orig_w / target_w)
        oh = int(b['h']  * orig_h / target_h)
        color = detect_text_color(ref_img, bg_img, [ox, oy, ow, oh], fallback_color)

        bold = field in ('name', 'company_name', 'id_no', 'blood_group')
        mappings[field] = {
            "x": round(x_pct, 1),
            "y": round(y_pct, 1),
            "w": round(w_pct, 1),
            "h": round(h_pct, 1),
            "fontSize": font_size,
            "fontWeight": "bold" if bold else "normal",
            "align": "center",
            "color": color
        }

    # --- PHOTO PLACEHOLDER (front only) ---
    if side_name == 'front':
        # Detect visible "photo area" = large whitespace between company zone and name zone
        name_y = mappings.get('name', {}).get('y', 55.0)
        comp_y_bottom = 20.0  # default if no company detected
        if company_box:
            comp_y_bottom = company_box['y'] + company_box['h']

        photo_h = 22.0
        photo_w = 28.0
        photo_y = comp_y_bottom + 2.0   # small gap below company name
        # Don't overlap name
        if photo_y + photo_h > name_y - 3.0:
            photo_h = max(10.0, name_y - 3.0 - photo_y)

        photo_x = 50.0 - photo_w / 2
        photo_y = max(comp_y_bottom + 1.0, photo_y)

        mappings['photo'] = {
            "x": round(photo_x, 1),
            "y": round(photo_y, 1),
            "w": photo_w,
            "h": round(photo_h, 1),
            "type": "image",
            "align": "center"
        }

        # Add default id_no if missing
        if 'id_no' not in mappings:
            name_bottom = mappings.get('name', {}).get('y', 55.0) + mappings.get('name', {}).get('h', 5.0)
            desg_bottom = mappings.get('designation', {}).get('y', 60.0) + mappings.get('designation', {}).get('h', 4.0)
            mappings['id_no'] = {
                "x": 10.0, "y": round(desg_bottom + 1.5, 1),
                "w": 80.0, "h": 4.0,
                "fontSize": 10, "fontWeight": "bold",
                "align": "center", "color": fallback_color
            }

    # --- LOGO PLACEHOLDER (both sides) ---
    logo_w, logo_h = 14.0, 9.0
    if company_box:
        cx = company_box['x'] + company_box['w']/2
        logo_x = cx - logo_w/2
        logo_y = max(2.0, company_box['y'] - logo_h - 1.5)
        if logo_y < 2.0:
            logo_y = company_box['y'] + company_box['h'] + 1.0
    else:
        logo_x = 50.0 - logo_w/2
        logo_y = 5.0 if side_name == 'front' else 8.0
    mappings['logo'] = {
        "x": round(logo_x, 1), "y": round(logo_y, 1),
        "w": logo_w, "h": logo_h,
        "type": "image", "align": "center"
    }

    # --- QR code on back ---
    if side_name == 'back' and 'qr_code' not in mappings:
        mappings['qr_code'] = {
            "x": 37.5, "y": 75.0, "w": 25.0, "h": 16.0,
            "type": "image", "align": "center"
        }

    return mappings


variants = []
all_mappings = {}

for k in range(1, 30):
    k_padded = f"{k:02d}"
    print(f"--- ID Card {k_padded}/29 ---", flush=True)

    front_num = 2*k - 1
    back_num  = 2*k

    # Ref folder: 1-50, then 53-60 (no 51/52)
    ref_front = front_num if front_num <= 50 else front_num + 2
    ref_back  = back_num  if back_num  <= 50 else back_num  + 2

    t_dir = os.path.join(dest_dir, k_padded)
    os.makedirs(t_dir, exist_ok=True)

    src_fb = os.path.join(bg_dir, f"{front_num}.png")
    src_bb = os.path.join(bg_dir, f"{back_num}.png")
    src_fr = os.path.join(ref_dir, f"{ref_front}.png")
    src_br = os.path.join(ref_dir, f"{ref_back}.png")

    if not (os.path.exists(src_fb) and os.path.exists(src_bb)):
        print(f"  SKIP: missing bg files", flush=True); continue
    if not (os.path.exists(src_fr) and os.path.exists(src_br)):
        print(f"  SKIP: missing ref files", flush=True); continue

    shutil.copy(src_fb, os.path.join(t_dir, "front.png"))
    shutil.copy(src_bb, os.path.join(t_dir, "back.png"))
    shutil.copy(src_fr, os.path.join(t_dir, "front_ref.png"))
    shutil.copy(src_br, os.path.join(t_dir, "back_ref.png"))

    front_map = process_side(src_fr, src_fb, "front")
    back_map  = process_side(src_br, src_bb, "back")

    idx = k - 1
    all_mappings[f"{idx}_0"] = front_map
    all_mappings[f"{idx}_1"] = back_map

    variants.append({
        "name": f"Elite Design {k_padded}",
        "hex": "#1A1A1A",
        "wireframe_images": [
            f"/templates/id/{k_padded}/front.png",
            f"/templates/id/{k_padded}/back.png"
        ]
    })
    print(f"  Front: {list(front_map.keys())}", flush=True)
    print(f"  Back:  {list(back_map.keys())}", flush=True)

out = {"variants": variants, "mappings": all_mappings}
with open(r"d:\A to Z prints\scratch\import_data_id.json", "w") as f:
    json.dump(out, f, indent=2)

print(f"\nDone: {len(variants)} cards saved.", flush=True)

import os
import shutil
import json
import re
import numpy as np
from PIL import Image
import cv2
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
    ref_img_pil = Image.open(src_ref).convert('RGB')
    bg_img_pil  = Image.open(src_bg).convert('RGB')
    orig_w, orig_h = ref_img_pil.size

    # 1. OCR (on 800 wide image)
    target_w = 800
    target_h = int(orig_h * target_w / orig_w)
    small = ref_img_pil.resize((target_w, target_h), Image.Resampling.LANCZOS)
    tmp = src_ref + "_tmp_ocr.png"
    small.save(tmp)
    ocr_raw = reader.readtext(tmp)
    os.remove(tmp)

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

    # 2. Visual Difference (on original high-res image)
    ref_cv = cv2.imread(src_ref)
    bg_cv  = cv2.imread(src_bg)
    diff = cv2.absdiff(ref_cv, bg_cv)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    diff_boxes = []
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        if cw * ch > 100:  # ignore noise
            diff_boxes.append({
                'x1': (x / orig_w) * 100,
                'y1': (y / orig_h) * 100,
                'w': (cw / orig_w) * 100,
                'h': (ch / orig_h) * 100,
                'cx': ((x + cw/2) / orig_w) * 100,
                'cy': ((y + ch/2) / orig_h) * 100
            })

    # 3. Classify Contact Fields from OCR
    classified = {}
    unmatched_ocr = []
    for b in blocks:
        t = b['text']
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
            unmatched_ocr.append(b)

    # 4. Positional Classification
    top_zone = [b for b in unmatched_ocr if b['cy']/target_h < 0.22]
    lower_zone = [b for b in unmatched_ocr if b['cy']/target_h >= 0.45]

    # Company name
    if top_zone:
        top_zone.sort(key=lambda b: b['h'], reverse=True)
        classified['company_name'] = top_zone[0]

    # Name and Designation
    if side_name == 'front':
        lower_zone.sort(key=lambda b: b['y1'])
        contact_ys = set()
        for field in ['phone', 'email', 'website', 'id_no', 'blood_group']:
            if field in classified:
                contact_ys.add(round(classified[field]['y1']))
        lower_zone_text = [b for b in lower_zone if round(b['y1']) not in contact_ys]

        # Name is the largest text block remaining
        name_candidates = sorted(lower_zone_text, key=lambda b: b['h'], reverse=True)
        if name_candidates:
            classified['name'] = name_candidates[0]
            remaining = [b for b in lower_zone_text if b is not name_candidates[0]]
            if remaining:
                remaining.sort(key=lambda b: b['y1'])
                classified['designation'] = remaining[0]

    # Address
    taken_ocr = set(id(classified[f]) for f in classified)
    addr_blocks = [b for b in unmatched_ocr if id(b) not in taken_ocr and b['cy']/target_h >= 0.65]
    if addr_blocks and 'address' not in classified:
        for b in addr_blocks:
            tl = b['text'].lower()
            if any(k in tl for k in ['street', 'st.', 'road', 'rd', 'city', 'state', 'anywhere', 'suite', 'floor', 'avenue', 'blvd']):
                classified['address'] = b
                break

    # 5. Build Mappings
    mappings = {}
    avg = np.mean(np.array(bg_img_pil.resize((100, 100))).reshape(-1, 3), axis=0)
    brightness = 0.299*avg[0] + 0.587*avg[1] + 0.114*avg[2]
    fallback_color = "#FFFFFF" if brightness < 127 else "#1A1A1A"

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

    for field, b in classified.items():
        x_pct = (b['x1'] / target_w) * 100
        y_pct = (b['y1'] / target_h) * 100
        w_pct = (b['w']  / target_w) * 100
        h_pct = (b['h']  / target_h) * 100

        mn, mx, sc = size_cfg.get(field, (8, 10, 0.30))
        raw_size = (b['h'] / target_h) * 500 * sc
        font_size = round(max(mn, min(mx, raw_size)), 1)

        ox = int(b['x1'] * orig_w / target_w)
        oy = int(b['y1'] * orig_h / target_h)
        ow = int(b['w']  * orig_w / target_w)
        oh = int(b['h']  * orig_h / target_h)
        color = detect_text_color(ref_img_pil, bg_img_pil, [ox, oy, ow, oh], fallback_color)

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

    # 6. Locate Visual Placeholders (Photo and Logo) using CV2 diff boxes
    # Photo: largest diff box in the middle zone (Y = 15% to 52%), must be relatively square (aspect 0.6 to 1.5)
    if side_name == 'front':
        photo_box = None
        photo_candidates = []
        for box in diff_boxes:
            if 15.0 <= box['cy'] <= 52.0 and box['w'] >= 10.0 and box['h'] >= 10.0:
                aspect = box['w'] / box['h']
                if 0.5 <= aspect <= 1.8:
                    photo_candidates.append(box)
        if photo_candidates:
            # Sort by area
            photo_candidates.sort(key=lambda b: b['w'] * b['h'], reverse=True)
            photo_box = photo_candidates[0]

        if photo_box:
            mappings['photo'] = {
                "x": round(photo_box['x1'], 1),
                "y": round(photo_box['y1'], 1),
                "w": round(photo_box['w'], 1),
                "h": round(photo_box['h'], 1),
                "type": "image",
                "align": "center"
            }
        else:
            # Fallback photo positioning
            comp_y = 20.0
            if 'company_name' in mappings:
                comp_y = mappings['company_name']['y'] + mappings['company_name']['h']
            name_y = mappings.get('name', {}).get('y', 52.0)
            photo_h = min(24.0, name_y - comp_y - 4.0)
            photo_y = comp_y + 2.0
            mappings['photo'] = {
                "x": 36.0, "y": round(photo_y, 1), "w": 28.0, "h": round(photo_h, 1),
                "type": "image", "align": "center"
            }

    # Logo: diff box in the top zone (Y < 22%) that has square/horizontal shape and is not the company name text block
    logo_box = None
    logo_candidates = []
    comp_map = mappings.get('company_name')
    for box in diff_boxes:
        if box['cy'] < 22.0 and 2.0 <= box['w'] <= 25.0 and 2.0 <= box['h'] <= 15.0:
            # check if it overlaps significantly with company_name
            if comp_map:
                cx_overlap = not (box['x1'] + box['w'] < comp_map['x'] or box['x1'] > comp_map['x'] + comp_map['w'])
                cy_overlap = not (box['y1'] + box['h'] < comp_map['y'] or box['y1'] > comp_map['y'] + comp_map['h'])
                if cx_overlap and cy_overlap:
                    continue
            logo_candidates.append(box)
    if logo_candidates:
        # Sort by proximity to top
        logo_candidates.sort(key=lambda b: b['y1'])
        logo_box = logo_candidates[0]

    if logo_box:
        mappings['logo'] = {
            "x": round(logo_box['x1'], 1),
            "y": round(logo_box['y1'], 1),
            "w": round(logo_box['w'], 1),
            "h": round(logo_box['h'], 1),
            "type": "image",
            "align": "center"
        }
    else:
        # Fallback logo
        comp_map = mappings.get('company_name')
        if comp_map:
            mappings['logo'] = {
                "x": round(comp_map['x'] - 16.0, 1),
                "y": round(comp_map['y'], 1),
                "w": 14.0,
                "h": 9.0,
                "type": "image",
                "align": "center"
            }
        else:
            mappings['logo'] = {
                "x": 43.0, "y": 5.0, "w": 14.0, "h": 9.0,
                "type": "image", "align": "center"
            }

    # QR code on back
    if side_name == 'back':
        qr_box = None
        qr_candidates = []
        for box in diff_boxes:
            if box['cy'] > 50.0 and 10.0 <= box['w'] <= 35.0 and 10.0 <= box['h'] <= 35.0:
                qr_candidates.append(box)
        if qr_candidates:
            qr_candidates.sort(key=lambda b: b['w'] * b['h'], reverse=True)
            qr_box = qr_candidates[0]
        
        if qr_box:
            mappings['qr_code'] = {
                "x": round(qr_box['x1'], 1),
                "y": round(qr_box['y1'], 1),
                "w": round(qr_box['w'], 1),
                "h": round(qr_box['h'], 1),
                "type": "image",
                "align": "center"
            }
        else:
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

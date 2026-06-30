import os
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Directory configuration
artifacts_dir = r"C:\Users\Aryan\.gemini\antigravity\brain\55fe8f6c-0df7-487d-a1af-3fc6875b88c4"
dest_dir = r"d:\A to Z prints\public\templates\id"

def draw_elements_on_bg(bg_path, mapping, all_fields, form_data=None):
    img = Image.open(bg_path).convert('RGB')
    draw = ImageDraw.Draw(img)
    w, h = img.size
    
    # Use standard default values if form_data is not provided
    default_vals = {
        'company_name': 'TECH SOLUTIONS INC.',
        'name': 'Johnathan Doe',
        'designation': 'Senior Software Engineer',
        'id_no': 'EMP-2024-001',
        'phone': '+91 98765 43210',
        'email': 'john.doe@company.com',
        'website': 'www.company.com',
        'address': '123 Business Rd, New York, NY'
    }

    # Font path (try to find a clean TTF font)
    font_path = "C:\\Windows\\Fonts\\arialbd.ttf"  # fallback bold
    font_path_reg = "C:\\Windows\\Fonts\\arial.ttf"  # fallback regular
    
    for field_id, m in mapping.items():
        x = (m['x'] / 100) * w
        y = (m['y'] / 100) * h
        box_w = (m['w'] / 100) * w
        box_h = (m['h'] / 100) * h
        
        if m.get('type') == 'image':
            # Draw a placeholder rectangle for photo/logo/qr
            draw.rectangle([x, y, x + box_w, y + box_h], outline="red", width=5)
            # Draw label
            try:
                font = ImageFont.truetype(font_path, 35)
            except:
                font = ImageFont.load_default()
            draw.text((x + 10, y + 10), field_id.upper(), fill="red", font=font)
        else:
            # Text element
            val = default_vals.get(field_id, field_id)
            if form_data and field_id in form_data:
                val = form_data[field_id].get('text', val)
            
            # Select font size and weight
            fs_pixels = int((m.get('fontSize', 14) / 500) * w)
            f_path = font_path if m.get('fontWeight') == 'bold' else font_path_reg
            try:
                font = ImageFont.truetype(f_path, fs_pixels)
            except:
                font = ImageFont.load_default()
                
            color = m.get('color', '#000000')
            # Draw text lines
            lines = val.split('\n')
            lh = m.get('lineHeight', 1.2) * fs_pixels
            for idx, line in enumerate(lines):
                # Text alignment
                line_w = draw.textlength(line, font=font) if hasattr(draw, 'textlength') else font.getbbox(line)[2]
                align = m.get('align', 'center')
                if align == 'center':
                    tx = x + (box_w - line_w) / 2
                elif align == 'right':
                    tx = x + box_w - line_w
                else:
                    tx = x
                
                draw.text((tx, y + (idx * lh)), line, fill=color, font=font)
                
    return img

def verify_card(card_index):
    k_padded = f"{card_index+1:02d}"
    print(f"Verifying Card {k_padded}...")
    
    with open(r"d:\A to Z prints\scratch\import_data_id.json") as f:
        data = json.load(f)
        
    mappings = data['mappings']
    front_map = mappings.get(f"{card_index}_0", {})
    
    # Path configuration
    t_dir = os.path.join(dest_dir, k_padded)
    bg_path = os.path.join(t_dir, "front.png")
    ref_path = os.path.join(t_dir, "front_ref.png")
    
    if not (os.path.exists(bg_path) and os.path.exists(ref_path)):
        print(f"  Files missing for card {k_padded}")
        return
        
    # Render mapped canvas
    rendered = draw_elements_on_bg(bg_path, front_map, None)
    ref_img = Image.open(ref_path).convert('RGB')
    
    # Resize rendered to match ref size if different
    if rendered.size != ref_img.size:
        rendered = rendered.resize(ref_img.size, Image.Resampling.LANCZOS)
        
    # Create side-by-side comparison image
    compare_w = ref_img.size[0] * 2
    compare_h = ref_img.size[1]
    compare_img = Image.new('RGB', (compare_w, compare_h))
    compare_img.paste(ref_img, (0, 0))
    compare_img.paste(rendered, (ref_img.size[0], 0))
    
    # Scale down comparison for easy viewing
    view_w = 800
    view_h = int(compare_h * view_w / compare_w)
    compare_small = compare_img.resize((view_w, view_h), Image.Resampling.LANCZOS)
    
    out_path = os.path.join(artifacts_dir, f"compare_card_{k_padded}.png")
    compare_small.save(out_path)
    print(f"  Saved comparison to {out_path}")

if __name__ == '__main__':
    for idx in range(5):
        verify_card(idx)

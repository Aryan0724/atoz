import os
from PIL import Image

def optimize_images(src_dir, dest_dir, ext_src, ext_dest, max_size=1200):
    os.makedirs(dest_dir, exist_ok=True)
    
    for i in range(1, 31):
        src_file = os.path.join(src_dir, f"{i}.{ext_src}")
        if not os.path.exists(src_file):
            print(f"File not found: {src_file}")
            continue
            
        dest_folder = os.path.join(dest_dir, f"{i:02d}")
        os.makedirs(dest_folder, exist_ok=True)
        dest_file = os.path.join(dest_folder, f"front.{ext_dest}")
        
        try:
            with Image.open(src_file) as img:
                # Convert RGBA to RGB if saving as JPEG
                if ext_dest.lower() in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new("RGB", img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
                    img = background
                
                # Resize if larger than max_size
                width, height = img.size
                if max(width, height) > max_size:
                    if width > height:
                        new_width = max_size
                        new_height = int(height * (max_size / width))
                    else:
                        new_height = max_size
                        new_width = int(width * (max_size / height))
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Save
                if ext_dest.lower() in ['jpg', 'jpeg']:
                    img.save(dest_file, "JPEG", quality=85, optimize=True)
                else:
                    img.save(dest_file, "PNG", optimize=True)
                    
            print(f"Optimized {src_file} -> {dest_file} ({width}x{height} -> {img.size[0]}x{img.size[1]})")
        except Exception as e:
            print(f"Failed to process {src_file}: {e}")

# 1. Optimize Wedding Cards
print("Optimizing Wedding Cards...")
optimize_images(
    src_dir="template wedding card/wedding card bg/Untitled design (1)",
    dest_dir="public/templates/wc",
    ext_src="png",
    ext_dest="jpg"
)

# 2. Optimize Letterheads
print("\nOptimizing Letterheads...")
optimize_images(
    src_dir="template letterhead/bg/Untitled design (1)",
    dest_dir="public/templates/lh",
    ext_src="jpg",
    ext_dest="jpg"
)

print("\nDone!")

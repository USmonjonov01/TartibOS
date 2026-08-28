from PIL import Image

img = Image.open("public/TartibOS_logo.png").convert("RGBA")

sizes = [
    (16, 16),
    (32, 32),
    (48, 48),
    (64, 64),
    (128, 128),
    (256, 256),
]

img.save(
    "public/favicon.ico",
    format="ICO",
    sizes=sizes
)

print("✅ TartibOS favicon.ico yaratildi!")
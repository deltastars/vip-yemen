from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets/vipyemen-official-icon.png')
out = Path('/home/ubuntu/vip-yemen-github/android-native/app/src/main/res')
image = Image.open(source).convert('RGBA')
for density, size in {'mdpi':48, 'hdpi':72, 'xhdpi':96, 'xxhdpi':144, 'xxxhdpi':192}.items():
    target = out / f'mipmap-{density}'
    target.mkdir(parents=True, exist_ok=True)
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(target / 'ic_launcher.png', optimize=True)
    resized.save(target / 'ic_launcher_round.png', optimize=True)

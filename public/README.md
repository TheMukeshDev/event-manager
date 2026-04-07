# Public Assets - Tech Hub BBS Icons

This folder contains all favicon and Open Graph images for the Tech Hub BBS event website.

## Required Icon Files

Place the Tech Hub BBS logo in these formats:

### Favicons (Required)
- `favicon.ico` - Classic favicon (16x16, 32x32, 48x48)
- `favicon-16x16.png` - 16x16 PNG favicon
- `favicon-32x32.png` - 32x32 PNG favicon
- `favicon-96x96.png` - 96x96 PNG favicon

### Apple & Android Icons (Recommended)
- `apple-icon.png` - 180x180 PNG for iPhone/iPad (iOS)
- `android-chrome-192x192.png` - 192x192 PNG for Android

### Social Media & OG Image (SEO)
- `og-image.png` - 1200x630 PNG for Facebook, Twitter, LinkedIn previews

### SVG Icon (Optional but Recommended)
- `icon.svg` - Scalable vector version of the logo

## How to Generate Icon Files

1. **From the Tech Hub BBS logo image:**
   - Use an online tool like [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Or use image editing software (Photoshop, GIMP) to resize and convert
   - Use [ImageMagick](https://imagemagick.org/) command-line tool for batch conversion

2. **Using Python:**
   ```python
   from PIL import Image
   img = Image.open('tech-hub-bbs-logo.png')
   img.save('favicon.ico', format='ICO')
   img.resize((16, 16)).save('favicon-16x16.png')
   img.resize((32, 32)).save('favicon-32x32.png')
   img.resize((96, 96)).save('favicon-96x96.png')
   img.resize((180, 180)).save('apple-icon.png')
   img.resize((192, 192)).save('android-chrome-192x192.png')
   img.resize((1200, 630)).save('og-image.png')
   ```

## Current Setup

The website metadata is configured to use:
- Multiple favicon formats for cross-browser/device compatibility
- Open Graph images for social media sharing
- Apple-specific icon for iOS home screen
- Android Chrome icon for web-to-home shortcut

This ensures your Tech Hub BBS branding appears consistently across:
- Browser tabs
- Bookmarks
- Search results
- Social media links
- Mobile home screens

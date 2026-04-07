# EventManager Setup Guide

## Quick Start

### 1. Installation
```bash
# Install all dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### 2. Project Structure Overview

```
components/
├── navbar.tsx              # Sticky navigation with glass effect
├── footer.tsx              # Professional footer with social links
├── floating-particles.tsx  # Animated background particles
├── scroll-progress.tsx     # Scroll progress bar
└── sections/               # Page sections
    ├── hero.tsx           # Hero banner with stats
    ├── about.tsx          # About with features
    ├── highlights.tsx     # Feature highlights
    ├── tracks.tsx         # Event tracks showcase
    ├── timeline.tsx       # Event schedule
    ├── prizes.tsx         # Prize pool display
    ├── certificate.tsx    # Certificate showcase
    ├── team.tsx           # Team members
    ├── sponsors.tsx       # Sponsor tiers
    └── faq.tsx            # FAQ accordion

lib/
├── types.ts               # TypeScript type definitions
├── mock-data.ts           # Mock data and API service
├── supabase-client.ts     # Supabase configuration template
└── utils.ts               # Utility functions

app/
├── layout.tsx             # Root layout with dark theme
├── globals.css            # Global styles and animations
└── page.tsx               # Main page with all sections
```

## Key Technologies

- **Next.js 16**: React framework with App Router
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **TypeScript**: Type-safe development

## Customization Guide

### Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --primary: #00d9ff;      /* Cyan */
  --secondary: #00ff88;    /* Green */
  --accent: #0088ff;       /* Blue */
  --background: #000000;   /* Black */
}
```

### Fonts
Change fonts in `app/layout.tsx`:
```tsx
import { Poppins, JetBrains_Mono } from 'next/font/google'

const sans = Poppins({ subsets: ['latin'] })
const mono = JetBrains_Mono({ subsets: ['latin'] })
```

Then update in `globals.css`:
```css
@theme inline {
  --font-sans: 'Poppins', ...;
  --font-mono: 'JetBrains Mono', ...;
}
```

### Animation Speed
Adjust timing in individual section components:
```tsx
transition={{ duration: 0.6 }} // Change this value
```

### Content Data
Update mock data in `lib/mock-data.ts`:
```typescript
export const mockEvent: Event = {
  title: 'Your Event Title',
  description: 'Your event description',
  // ... update other fields
}
```

## Component Structure Pattern

All section components follow this pattern:

```tsx
'use client'

import { motion } from 'framer-motion'

export function SectionName() {
  // Animation variants
  const containerVariants = { /* ... */ }
  const itemVariants = { /* ... */ }

  return (
    <section className="section-spacing px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="heading-lg">Section Title</h2>
        {/* Section content */}
      </motion.div>
    </section>
  )
}
```

### Available Animation Presets

**Fade In with Slide Up:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

**Fade In with Slide Left:**
```tsx
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
```

**Staggered Children:**
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}
```

**Scroll Triggered:**
```tsx
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-100px' }}
```

## CSS Classes Reference

### Spacing
- `.section-spacing` - Standard section padding (py-20 md:py-32)

### Typography
- `.heading-xl` - Extra large heading
- `.heading-lg` - Large heading
- `.heading-md` - Medium heading
- `.text-muted` - Muted text color

### Effects
- `.glass` - White glass effect
- `.glass-dark` - Dark glass effect
- `.glow-cyan` - Cyan glow
- `.glow-green` - Green glow
- `.glow-blue` - Blue glow
- `.glow-cyan-lg` - Large cyan glow
- `.hover-glow-cyan` - Hover glow effect
- `.gradient-cyan-green` - Cyan to green gradient text
- `.gradient-cyan-blue` - Cyan to blue gradient text
- `.border-glow` - Glowing border
- `.border-glow-hover` - Hover border glow
- `.neon-button` - Neon styled button

## Building for Production

```bash
# Build optimized production bundle
pnpm build

# Test production build locally
pnpm start

# Deploy to Vercel
vercel deploy
```

## Environment Variables

### Development (.env.local)
```env
# Supabase (when ready)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Production
Set the same variables in Vercel project settings.

## Common Customizations

### Change Event Title Everywhere
Search and replace:
```
TechFest 2024 → Your Event Name
EventManager → Your Platform Name
```

### Add New Section
1. Create new file in `components/sections/`
2. Follow the component pattern
3. Import in `app/page.tsx`
4. Add to page layout

Example:
```tsx
// components/sections/speakers.tsx
'use client'

import { motion } from 'framer-motion'

export function SpeakersSection() {
  return (
    <section className="section-spacing">
      {/* Content */}
    </section>
  )
}
```

Then in `app/page.tsx`:
```tsx
import { SpeakersSection } from '@/components/sections/speakers'

// In the JSX:
<section id="speakers">
  <SpeakersSection />
</section>
```

### Modify Navbar Links
Edit `components/navbar.tsx`:
```tsx
const navItems = [
  { label: 'Your Link', href: '#your-section' },
  // Add more links
]
```

## Performance Tips

1. **Images**: Use Next.js Image component for optimization
2. **Animations**: Use `whileInView` for scroll-triggered animations
3. **Code Splitting**: Components load with the section they're in
4. **CSS**: Tailwind v4 handles optimization automatically

## Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Use them in class names:
```tsx
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>
```

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile: iOS Safari 12+, Chrome Android latest

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

### Animation Not Working
- Check `'use client'` directive is present
- Verify Framer Motion import
- Check animation variants syntax

### Styling Issues
- Clear `.next` folder
- Restart dev server
- Check Tailwind classes are spelled correctly

### Dark Mode Issues
- Ensure `className="dark"` is on `<html>`
- Check CSS custom variables are defined
- Verify `color-scheme: dark` in head

## Next Steps

1. **Customize Content**: Update mock data with real event details
2. **Add Images**: Add your event images and logos
3. **Setup Supabase**: Follow `PREMIUM_HOMEPAGE_GUIDE.md`
4. **Add Authentication**: Implement user sign-up/login
5. **Deploy**: Push to GitHub and deploy with Vercel

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)
- [Supabase Docs](https://supabase.com/docs)

## Support

For issues or questions:
1. Check the documentation
2. Review existing section components for patterns
3. Check browser console for errors
4. Refer to PREMIUM_HOMEPAGE_GUIDE.md

---

**Happy building! 🚀**

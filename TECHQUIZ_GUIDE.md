# TechQuiz Event Platform - Complete Setup Guide

## Overview

This is a premium futuristic full-stack event website for **TechQuiz: Computer Awareness & C Language Challenge** - an online quiz event organized by BBSCET Allahabad.

### Key Features

- **Premium Dark Neon UI** - Glassmorphism, glow effects, smooth animations
- **Fully Responsive** - Works on all devices
- **Supabase Ready** - Backend integration ready (database schema included)
- **Certificate Verification** - Verify certificates with certificate ID
- **Real-time Data** - Dynamic seat counter and leaderboard
- **Mobile Optimized** - Touch-friendly interface

## Project Structure

```
components/
├── navbar.tsx              # Sticky navigation
├── footer.tsx              # Footer
├── floating-particles.tsx  # Animated background
├── scroll-progress.tsx     # Scroll progress bar
└── sections/               # All page sections
    ├── hero.tsx           # Hero section with CTA
    ├── about.tsx          # Event details
    ├── highlights.tsx     # Event features
    ├── tracks.tsx         # Event types
    ├── timeline.tsx       # Event schedule
    ├── prizes.tsx         # Prize details
    ├── certificate.tsx    # Certificate info & verification
    ├── team.tsx           # Organizer contacts
    ├── sponsors.tsx       # Sponsors list
    ├── registration.tsx   # Registration flow
    └── faq.tsx            # FAQs

lib/
├── event-data.ts          # All event constants and data
├── supabase-schema.sql    # Database schema
├── supabase-service.ts    # Backend service functions
└── types.ts               # TypeScript definitions

app/
├── layout.tsx             # Root layout
├── page.tsx               # Main page
├── globals.css            # Global styles & animations
└── favicon.ico

public/                     # Static assets
```

## Quick Start

### 1. Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Customize Event Data

All event details are in `lib/event-data.ts`:

```typescript
export const EVENT_DATA = {
  name: 'TechQuiz: Computer Awareness & C Language Challenge',
  date: '12 April 2026',
  time: '6:00 PM – 6:30 PM IST',
  // ... more details
}
```

Change any details here and they automatically update across the site.

### 3. Update Colors

Edit CSS variables in `app/globals.css`:

```css
--primary: #00d9ff;      /* Cyan */
--secondary: #00ff88;    /* Green */
--accent: #0088ff;       /* Blue */
```

### 4. Add Your Images

Place images in `public/` folder and reference them:

```tsx
<img src="/path/to/image.jpg" alt="description" />
```

## Supabase Integration

### Setup (One-time)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Create Database Tables

1. Go to Supabase SQL Editor
2. Copy-paste entire content from `lib/supabase-schema.sql`
3. Run the SQL

### Use Services

```typescript
import { registerUser, updateQuizScore, issueCertificate } from '@/lib/supabase-service'

// Register user
const result = await registerUser({
  email: 'user@example.com',
  full_name: 'John Doe',
  phone: '+91-xxxx',
  college: 'BBSCET',
  stream: 'CSE'
})

// Update quiz score
await updateQuizScore(registrationId, 85, 420) // score, time in seconds

// Issue certificate
await issueCertificate({
  certificate_id: 'TQ-2026-001',
  user_id: userId,
  event_id: eventId,
  event_name: 'TechQuiz',
  certificate_type: 'participation',
})
```

## Features Explained

### 1. Hero Section
- Event title and description
- Event details (date, seats, organizer)
- Quiz statistics
- CTA buttons (Register, Verify Certificate)

### 2. About Section
- Event purpose
- Quiz details (20 questions, 20 minutes, easy-moderate)

### 3. Highlights
- Why join the event
- 4 key features with icons

### 4. Timeline
- Registration deadline
- Quiz timing
- Result announcement
- Certificate release

### 5. Prizes
- Top 3 winners: Google Swag + Certificate
- All participants: Certificate
- Certificates in 3 days

### 6. Certificate Verification
- Enter certificate ID
- Display certificate details
- Download or share

### 7. Team/Contacts
- Organizer information
- Contact email and phone
- Click-to-contact buttons

### 8. FAQ
- 6 pre-written FAQs
- Expandable accordion
- Smooth animations

### 9. Registration
- Easy 3-step process
- Dynamic seat counter
- Shows availability

## Advanced Customization

### Adding New Sections

1. Create new file: `components/sections/new-section.tsx`
2. Import in `app/page.tsx`
3. Add to page with section ID

### Countdown Timer

```typescript
import { useState, useEffect } from 'react'

export function Countdown() {
  const [time, setTime] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  return <div>{time > 0 ? `${time}s left` : 'Event started'}</div>
}
```

### Live Seat Counter

```typescript
import { useEffect, useState } from 'react'
import { getRegistrationCount } from '@/lib/supabase-service'

export function SeatCounter({ eventId }) {
  const [available, setAvailable] = useState(50)
  
  useEffect(() => {
    const fetch = async () => {
      const { count } = await getRegistrationCount(eventId)
      setAvailable(50 - count)
    }
    fetch()
    const interval = setInterval(fetch, 5000)
    return () => clearInterval(interval)
  }, [])
  
  return <div>{available}/50 seats available</div>
}
```

### QR Code for Certificate Verification

```typescript
import QRCode from 'qrcode.react'

export function CertificateQR({ certificateId }) {
  return (
    <QRCode
      value={`https://yoursite.com/verify/${certificateId}`}
      size={200}
    />
  )
}
```

## Animations

All animations use Framer Motion:

- `initial` - Starting state
- `animate` - Animated state
- `whileHover` - On hover
- `whileInView` - When scrolled into view
- `transition` - Animation duration & easing

Example:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

## Responsive Design

Tailwind breakpoints:

- `sm`: 640px
- `md`: 768px (Default for layout changes)
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Performance Tips

1. **Image Optimization** - Use next/image
2. **Code Splitting** - Sections load separately
3. **Lazy Loading** - whileInView for animations
4. **Memoization** - React.memo for heavy components

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy (automatic on push)

```bash
vercel deploy
```

### Other Platforms

- Netlify
- Railway
- Render
- DigitalOcean

## Environment Variables

Required:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (for server-side only)
```

## Troubleshooting

### Issue: "Module not found: framer-motion"

Solution: `pnpm install` or `npm install`

### Issue: CSS not loading

Solution: Check `app/globals.css` is imported in layout

### Issue: Images not showing

Solution: Place in `public/` folder and use `/path/to/image`

### Issue: Supabase connection error

Solution: Check environment variables in `.env.local`

## Testing

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Support

For issues:

1. Check error message in console
2. Verify environment variables
3. Test in development mode
4. Check network requests in DevTools

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)

## License

This project is ready for use and modification.

---

**TechQuiz Platform** | Built with ❤️ for premium events

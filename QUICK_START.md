# TechQuiz - Quick Start Guide (5 Minutes)

## Installation

```bash
pnpm install
pnpm dev
```

Open: http://localhost:3000

## Event Details

All in one file: `lib/event-data.ts`

```typescript
export const EVENT_DATA = {
  name: 'TechQuiz: Computer Awareness & C Language Challenge',
  date: '12 April 2026',
  time: '6:00 PM – 6:30 PM IST',
  organizer: 'BBSCET Allahabad',
  // Change anything here → updates everywhere!
}
```

## Customize Colors

`app/globals.css`:

```css
--primary: #00d9ff;     /* Cyan */
--secondary: #00ff88;   /* Green */
--accent: #0088ff;      /* Blue */
```

## Add Images

Place in `public/` folder:

```tsx
<img src="/logo.png" alt="Logo" />
```

## Update Contact Info

`lib/event-data.ts`:

```typescript
contacts: [
  {
    name: 'Your Name',
    role: 'Your Role',
    email: 'your@email.com',
    phone: '+91-XXXXX',
  },
]
```

## Update FAQs

`lib/event-data.ts`:

```typescript
faqs: [
  {
    question: 'Your question?',
    answer: 'Your answer here',
  },
]
```

## Update Timeline

`lib/event-data.ts`:

```typescript
timeline: [
  {
    phase: 'Event Phase',
    date: 'Date',
    time: 'Optional time',
    description: 'Description',
  },
]
```

## Update Prizes

`lib/event-data.ts`:

```typescript
prizes: [
  {
    position: '🥇 1st',
    reward: 'Prize here',
    icon: 'Icon name',
  },
]
```

## Build for Production

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

```bash
vercel deploy
```

Or push to GitHub and connect to Vercel UI.

## Add Supabase (Optional)

1. Create account: https://supabase.com
2. Create project
3. Copy keys to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
4. Run SQL from `lib/supabase-schema.sql`
5. Use functions from `lib/supabase-service.ts`

## Page Structure

- `app/page.tsx` - Main page (don't edit, use components)
- `components/navbar.tsx` - Top navigation
- `components/footer.tsx` - Bottom footer
- `components/sections/` - All page sections
- `app/globals.css` - Global styles

## Common Tasks

### Change Page Title

`app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Title Here',
}
```

### Add New Section

1. Create `components/sections/newsection.tsx`
2. Import in `app/page.tsx`
3. Add to page

### Change Animation Speed

Components use Framer Motion. Example:

```typescript
<motion.div
  transition={{ duration: 1 }} // Change this (seconds)
>
</motion.div>
```

### Make Section Full Width

Add to section:
```tsx
<section className="w-full">
```

### Hide a Section

In `app/page.tsx`:
```tsx
{/* <section id="about">
  <AboutSection />
</section> */}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Change port: `pnpm dev -- -p 3001` |
| CSS not loading | Restart dev server |
| Images not showing | Check path in `public/` folder |
| Build fails | Run `pnpm install` again |

## File Locations

```
lib/event-data.ts          ← Update event details here
app/globals.css            ← Change colors here
app/layout.tsx             ← Change page title here
public/                    ← Add images here
components/sections/       ← All sections (11 files)
```

## Environment Variables

Create `.env.local`:

```env
# Optional - only needed for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production
pnpm start

# Check for errors
pnpm lint
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Check for errors |

## Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase Docs](https://supabase.com/docs)

## Performance Tips

1. Optimize images (use JPG/PNG, compress)
2. Use lazy loading for images
3. Code split sections
4. Cache static content

## Mobile Testing

```bash
# Get local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Access from phone
http://YOUR_IP:3000
```

## Need Help?

1. Check `TECHQUIZ_GUIDE.md` for detailed guide
2. Read `VERIFICATION_CHECKLIST.md` for troubleshooting
3. Check console for error messages
4. Review code comments

---

**That's it! You're ready to go. 🚀**

For more details, see TECHQUIZ_GUIDE.md

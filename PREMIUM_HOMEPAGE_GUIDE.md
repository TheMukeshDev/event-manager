# EventManager Premium Homepage

A stunning, high-end dark neon portfolio-inspired homepage for a futuristic college event platform, built with Next.js 16, Tailwind CSS, and Framer Motion.

## 🎨 Design Features

### Premium Aesthetics
- **Dark Neon Theme**: Deep black backgrounds with cyan, green, and blue neon accents
- **Glassmorphism**: Frosted glass effect cards with backdrop blur
- **Smooth Animations**: Staggered section animations with Framer Motion
- **Hover Effects**: Strong glow effects and scale transitions on interactive elements
- **Grid Background**: Subtle animated grid pattern in the background
- **Floating Particles**: Animated particles floating up the page for visual interest

### Component Architecture
- **Sticky Glass Navbar**: Fixed navigation with glass effect, responsive mobile menu
- **Hero Section**: Large hero banner with animated badge, gradient text, and floating stats
- **About Section**: Feature highlights with glow cards and stat cards
- **Highlights Section**: 4-column highlight cards with hover animations
- **Event Tracks Section**: Showcase of event tracks with difficulty indicators
- **Timeline Section**: Interactive event schedule with smooth animations
- **Prize Pool Section**: Prize cards with gradient backgrounds and tier system
- **Certificates Section**: Certificate showcase with verification details
- **Team Section**: Team member cards with hover effects
- **Sponsors Section**: Sponsor showcase by tier (Platinum, Gold, Silver)
- **FAQ Section**: Expandable FAQ accordion with smooth animations
- **Footer**: Professional footer with contact information and social links

## 📁 Project Structure

```
event-manager/
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── globals.css         # Global styles, animations, and design tokens
│   └── page.tsx            # Main page with all sections
├── components/
│   ├── navbar.tsx          # Sticky glass navbar
│   ├── footer.tsx          # Professional footer
│   ├── floating-particles.tsx  # Animated background particles
│   ├── scroll-progress.tsx  # Scroll progress bar
│   └── sections/
│       ├── hero.tsx        # Hero section
│       ├── about.tsx       # About section
│       ├── highlights.tsx  # Highlights section
│       ├── tracks.tsx      # Event tracks section
│       ├── timeline.tsx    # Event timeline section
│       ├── prizes.tsx      # Prize pool section
│       ├── certificate.tsx # Certificates section
│       ├── team.tsx        # Team section
│       ├── sponsors.tsx    # Sponsors section
│       ├── faq.tsx         # FAQ section
│       └── ...
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── mock-data.ts        # Mock data and API service layer
│   └── utils.ts            # Utility functions
└── public/
    └── assets/             # Images and static files
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Animations**: Framer Motion v11
- **Icons**: Lucide React
- **TypeScript**: For type safety
- **Components**: Radix UI components available

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Responsive typography and spacing
- Touch-friendly navigation
- Optimized for all screen sizes

### Performance Optimizations
- Client-side animations for smooth UX
- Lazy loading images
- Optimized CSS with no arbitrary values
- Efficient Framer Motion animations

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- High contrast ratios
- Screen reader friendly

### Reusable Components
All section components follow a consistent pattern:
- Props for data customization
- Animation variants with Framer Motion
- Responsive grid layouts
- Hover and interaction states

## 🔌 Supabase Integration Ready

The project is structured to seamlessly integrate with Supabase:

### Type Definitions (`lib/types.ts`)
Complete TypeScript interfaces for:
- Events
- Event Tracks
- Timeline Items
- Prizes
- Users and Team Members
- Sponsors
- Certificates
- Registrations
- FAQs
- Highlights

### Mock Data Service (`lib/mock-data.ts`)
The data layer uses a service pattern with:
- Mock data for development
- TODO comments showing where to add Supabase calls
- Async functions ready for real API integration
- Example service functions for all data types

### Integration Steps
1. Connect Supabase project to environment variables
2. Create database tables following the type definitions
3. Replace mock data functions with actual Supabase queries:
   ```typescript
   // Before (mock data)
   export async function getEvent(): Promise<Event> {
     return mockEvent
   }

   // After (Supabase)
   export async function getEvent(): Promise<Event> {
     const { data } = await supabase.from('events').select().single()
     return data
   }
   ```
4. Update components to use the real API

## 🎨 Design Tokens

### Colors
- **Primary Cyan**: #00d9ff
- **Secondary Green**: #00ff88
- **Accent Blue**: #0088ff
- **Background Black**: #000000
- **Card Dark**: #0f172a

### CSS Classes
- `.glass-dark`: Glassmorphism effect
- `.glow-cyan`: Cyan glow effect
- `.glow-green`: Green glow effect
- `.glow-blue`: Blue glow effect
- `.gradient-cyan-green`: Gradient text
- `.gradient-cyan-blue`: Gradient text
- `.neon-button`: Neon styled button
- `.section-spacing`: Standard section padding

### Typography Classes
- `.heading-xl`: Extra large heading (3xl-6xl)
- `.heading-lg`: Large heading (2xl-4xl)
- `.heading-md`: Medium heading (xl-2xl)

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables
Create `.env.local`:
```env
# Add Supabase credentials when integrating
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 📝 Component Usage Example

```tsx
import { HeroSection } from '@/components/sections/hero'

export default function Page() {
  return (
    <main>
      <HeroSection />
      {/* Add more sections */}
    </main>
  )
}
```

## 🎬 Animation Patterns

All sections use consistent Framer Motion patterns:
- Staggered children animations
- Scroll-triggered reveal animations
- Hover scale and glow effects
- Smooth transition timing (0.6-0.8s)

## 📱 Mobile Considerations

- Mobile menu in navbar
- Stack grid layouts to single column
- Touch-friendly button sizes
- Optimized animation performance
- Readable font sizes on small screens

## 🔐 Security Ready

- Structure prepared for user authentication
- Database schema with proper relationships
- API layer abstraction for security
- Environment variable handling

## 📊 Future Enhancements

- [ ] Supabase authentication
- [ ] User registration and login
- [ ] Event registration system
- [ ] Attendance tracking
- [ ] Certificate generation
- [ ] Admin dashboard
- [ ] Analytics and metrics
- [ ] Email notifications
- [ ] Real-time updates with Supabase subscriptions
- [ ] Image upload and CDN integration

## 🤝 Contributing

When adding new sections or features:
1. Follow the existing component structure
2. Use consistent animation patterns
3. Maintain responsive design
4. Update types in `lib/types.ts`
5. Add mock data in `lib/mock-data.ts`
6. Document new features

## 📄 License

This project is ready for deployment and modification.

---

**Built with ❤️ for premium event experiences**

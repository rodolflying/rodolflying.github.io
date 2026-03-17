# Rodolfo Sepúlveda — Portfolio Website

## Project Overview
A sleek, modern bilingual (Spanish/English) personal portfolio website for Rodolfo Sepúlveda (Star Apps). Features a cyberpunk/futuristic aesthetic with neon colors, dark backgrounds, and interactive elements.

## Architecture

### Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js (serves static + API routes)
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: wouter
- **Animations**: framer-motion
- **State/Data**: TanStack Query
- **i18n**: react-i18next (ES/EN bilingual)

### Multi-Page Structure
The site uses client-side routing with `wouter`. Each section is a separate page:

| Route | Page | Description |
|-------|------|-------------|
| `/` | `Home.tsx` | Landing: Hero + stats + section preview cards |
| `/about` | `AboutPage.tsx` | About + Skills + Experience sections |
| `/services` | `ServicesPage.tsx` | Services offered |
| `/projects` | `ProjectsPage.tsx` | Portfolio projects |
| `/downloads` | `DownloadsPage.tsx` | Free Python tools (.exe) |
| `/blog` | `BlogPage.tsx` | Tutorials, guides, Medium articles |
| `/contact` | `ContactPage.tsx` | Contact form + info |

### Key Files
- `client/src/App.tsx` — Router + global providers (LanguageProvider at top level)
- `client/src/components/Layout.tsx` — Shared wrapper: Navbar + main + Footer
- `client/src/components/Navbar.tsx` — Navigation with active route detection
- `client/src/components/Footer.tsx` — 3-column footer with nav links + social
- `client/src/hooks/useLanguage.tsx` — Language context (ES default)
- `client/src/data/index.ts` — Skills, experiences, projects data
- `client/src/data/downloads.ts` — Downloadable tools data
- `client/src/data/blog.ts` — Blog post metadata

### Design System
- Primary accent: `#00FFC8` (cyan/neon green)
- Secondary: `#FF2D55` (neon pink/red)
- Tertiary: `#6B38FB` (purple)
- Orange accent: `#FF9500`
- Background: `#0a0a0a` / `#111111`
- Font: `Orbitron` (headings), system sans (body)

### Contact Info
- Email: rodolfo.antonio.sep@gmail.com
- WhatsApp: +56 9 5663 2620
- LinkedIn: rodolfo-sepulveda-847532135
- GitHub: rodolflying
- Medium: @rodolfo.antonio.sep

## User Preferences
- Default language: Spanish (ES)
- Services section was requested to appear first after Hero (now on its own page at `/services`)
- PDF CV opens in new tab
- Phone links open WhatsApp web
- Copyright year: 2025

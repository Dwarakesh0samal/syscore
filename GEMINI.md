# SYS.CORE Project Context

## Architecture
- **Backend:** Flask + PostgreSQL + SQLAlchemy + JWT. Fully functional with Auth, Waitlist, Keys, Billing, and Component API.
  - *Location:* `syscore-backend/`
  - *Usage Tracking:* Free users limited to 20 component copies per month (enforced in `User` model).
  - *Note:* Do not use Express or Firebase for the backend.
- **Frontend:** React + Vite + Tailwind CSS.
  - *API Client:* Centralized Axios client in `src/lib/api.ts`.
  - *Auth:* Custom JWT session management in `src/context/AuthContext.tsx`.
  - *Gallery:* Fully hydrated via `componentsAPI` with skeleton loading and PRO gating.

## Design System (Industrial Brutalist)
- **Typography:** 100% `Space Mono` (monospace). **No Barlow or sans-serif fonts anywhere.**
- **Color Palette:**
  - Page Background: `#0a0a0a`
  - Sidebar Background: `#0f0f0f`
  - Card/Panel Background: `#141414`
  - Input Background: `#1a1a1a`
  - Borders: Default `#222222`, Hover `#2a2a2a`
  - Accent: `#f5c518` (Industrial Yellow), Dim `#a07d00`
  - Text: Primary `#e0e0e0`, Muted `#555555`, Labels `#888888` (small caps)
- **Geometry:** Absolutely NO rounded corners beyond `2px` (`rounded-[2px]`). No box shadows (`shadow-none`). Sharp, terminal-like feel.
- **Layout Constraints:**
  - Sidebar width is strictly **148px**.
  - Top Bar height is **36px**.
  - Bottom Bar height is **20px**.

## Technical Notes
- Firebase has been completely removed from this project (no SDKs, no rules).
- Stripe test mode logic is integrated; update `.env` with actual keys.
- Database schemas are managed via Flask-Migrate.

## Core Pages
- `/` - Landing (Waitlist sync, Hero, Manifesto)
- `/dashboard` - Overview (Live structs, stats)
- `/gallery` - Components Archive
- `/resources` - Documentation and Tooling
- `/templates` - Pro/Free gated Deployable Vaults
- `/settings` - Profile, API Keys, and Stripe Billing

# Eventro — Frontend

The Next.js frontend for the Eventro event management platform. Supports public event discovery, user dashboard, admin panel, payments, and notifications.

---

## Live Demo & Repositories

- **Live Frontend**: [https://eventro-frontend.vercel.app/](https://eventro-frontend.vercel.app/)
- **Live Backend**: [https://eventro-backend.vercel.app/](https://eventro-backend.vercel.app/)
- **Frontend Repository**: [https://github.com/mdtanbirhossen/eventro-frontend](https://github.com/mdtanbirhossen/eventro-frontend)
- **Backend Repository**: [https://github.com/mdtanbirhossen/eventro-backend](https://github.com/mdtanbirhossen/eventro-backend)

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@gmail.com` | `12345678` |
| **User** | `user@gmail.com` | `12345678` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React + HugeIcons |
| Data Fetching | TanStack Query v5 |
| Forms | TanStack Form v1 |
| Validation | Zod 4 |
| HTTP Client | Axios |
| Auth State | Context API + js-cookie |
| Charts | Recharts |
| Carousel | Embla Carousel |
| Notifications | Sonner |
| Theme | next-themes |

---

## Prerequisites

- Node.js >= 20
- npm / yarn / pnpm
- Eventro backend running (see backend README)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/eventro-frontend.git
cd eventro-frontend
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 4. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/
│   ├── (authRouteGroup)/          # Auth pages (no sidebar)
│   │   ├── login/
│   │   └── register/
│   ├── (basicLayout)/             # Public pages (navbar + footer)
│   │   ├── page.tsx               # Landing / Home page
│   │   ├── events/
│   │   │   ├── page.tsx           # Public events listing
│   │   │   └── [slug]/page.tsx    # Event detail page
│   │   ├── payment/
│   │   │   ├── success/page.tsx   # Payment success
│   │   │   └── failed/page.tsx    # Payment failed / cancelled
│   │   ├── about-us/page.tsx      # About Us
│   │   ├── contact-us/page.tsx    # Contact Info
│   │   ├── terms/page.tsx         # Terms of Service
│   │   └── privacy/page.tsx       # Privacy Policy
│   └── (dashboardLayout)/         # Protected layout
│       ├── @user/                 # User dashboard routes
│       │   ├── dashboard/         # User analytics overview
│       │   ├── my-events/         # Created events + create/edit
│       │   ├── joined-events/     # Joined events
│       │   ├── invitations/       # Received invitations
│       │   ├── payments/          # Payment history
│       │   ├── notifications/     # Notifications
│       │   └── settings/          # Profile & account settings
│       └── @admin/                # Admin dashboard routes
│           ├── dashboard/         # Admin analytics overview
│           ├── events/            # Events management table
│           ├── users/             # Users & admins management
│           ├── categories/        # Event categories management
│           └── payments/          # Payments management
│
├── actions/                       # Next.js Server Actions
│   ├── admin.actions.ts
│   ├── event-form.actions.ts
│   ├── notifications.actions.ts
│   ├── payment-pages.actions.ts
│   ├── profile.actions.ts
│   ├── public-events.actions.ts
│   └── user-dashboard.actions.ts
│
├── hooks/                         # TanStack Query hooks
│   ├── admin.hooks.ts
│   ├── event-form.hooks.ts
│   ├── notifications.hooks.ts
│   ├── payment-pages.hooks.ts
│   ├── profile.hooks.ts
│   ├── public-events.hooks.ts
│   └── user-dashboard.hooks.ts
│
├── types/                         # TypeScript interfaces & enums
│   ├── api.types.ts               # ApiResponse, ApiErrorResponse
│   ├── enums.ts                   # All Prisma enums mirrored
│   ├── admin.types.ts
│   ├── event-form.types.ts
│   ├── notifications.types.ts
│   ├── payment-pages.types.ts
│   ├── profile.types.ts
│   ├── public-events.types.ts
│   ├── sendBulkInvitations.types.ts
│   └── user-dashboard.types.ts
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── shared/
│   │   └── Pagination/            # Reusable pagination component
│   ├── events/
│   │   ├── EventCard.tsx          # Public event card
│   │   ├── EventForm.tsx          # Create/edit event form
│   │   └── FeaturedEventSection.tsx
│   ├── payments/
│   │   └── PaymentInvoice.tsx     # Shared invoice component
│   └── modules/
│       ├── Admin/                 # Admin page components
│       ├── Events/                # Event listing/detail components
│       └── Home/                  # Landing page section components
│
├── context/
│   └── AuthContext.tsx            # Auth state (user, token, login, logout)
│
└── lib/
    ├── axios/
    │   └── httpClient.ts          # Axios instance with token refresh
    └── tokenUtils.ts              # JWT decode, cookie helpers
```

---

## Key Features

### ✨ Recent Upgrades
- **Global Theme & UI** — Seamless Dark/Light mode support, sticky navigation, and premium modern aesthetics.
- **Dynamic Landing Page** — Expanded home page with 10+ interactive sections including Statistics, Testimonials, FAQ, Newsletter, and CTA Banners.
- **Smart AI Recommendations** — Intelligent event suggestion engine on the event detail pages.
- **Data Visualization Dashboards** — Integrated Recharts providing Bar, Line, and Pie charts for powerful analytics in both Admin and User panels.
- **Enhanced Authentication** — Demo login capabilities for instant role switching and Social Login integration placeholders.
- **Complete Architecture** — Comprehensive info pages including About Us, Contact Us, Terms, and Privacy.

### Public
- Browse and search all public events with filters (category, fee type, sort)
- Event detail page with join button, organiser info, reviews, related events, and AI recommendations
- Expanded landing page with 10+ sections (Hero, Featured, Statistics, Testimonials, etc.)
- Category-based event browsing
- Clean static pages (About Us, Contact Us, Terms, Privacy)

### User Dashboard
- **Analytics overview** — visual charts (tickets bought, event statuses) and stat cards
- **My Events** — manage created events with status filter, edit, delete, bulk invite
- **Joined Events** — track participation status (approved / pending / banned)
- **Invitations** — accept or decline event invitations
- **Payments** — full transaction history with downloadable invoice/receipt
- **Notifications** — real-time polling (30s), filter by read/unread
- **Profile Settings** — update name, avatar, change password, delete account
- **Create / Edit Event** — full form with banner upload, category, visibility, fee, capacity

### Admin Panel
- **Dashboard** — comprehensive visual charts (events over time, revenue trends, event types) and platform-wide stats
- **Events Management** — filter, search, feature/unfeature, force delete
- **Users & Admins** — view all users, create new admins
- **Categories** — create, edit, delete event categories
- **Payments** — full payment log with status filters and detail modal
- **Participants** — approve, reject, ban per event with reason

### Payments
- SSLCommerz integration — redirect flow
- Payment success page with invoice
- Payment failed / cancelled page with retry button

---

## Authentication Flow

1. User logs in → server returns `accessToken`, `refreshToken`, `user` object
2. Tokens stored in cookies (`js-cookie`)
3. `AuthContext` loads user from cookie on mount
4. `httpClient` (Axios) checks if token is expiring soon and auto-refreshes before each request
5. All server actions run server-side via Next.js Server Actions — cookies forwarded automatically

---

## Data Fetching Pattern

All data fetching uses **TanStack Query** with **Next.js Server Actions**:

```ts
// 1. Server action (server-side, runs in Node.js)
"use server";
export async function getMyEventsAction() {
  const response = await httpClient.get("/events/me/events");
  return response;
}

// 2. TanStack Query hook (client-side cache + state)
"use client";
export function useMyEvents(params) {
  return useQuery({
    queryKey: ["my-events", params],
    queryFn: async () => {
      const res = await getMyEventsAction(params);
      if (!res.success) throw new Error(res.message);
      return { data: res.data, meta: res.meta };
    },
  });
}

// 3. Component usage
const { data, isLoading } = useMyEvents({ page: 1 });
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

---

## SSLCommerz Payment Redirect URLs

Configure these in your backend when creating a payment session:

```
Success → {FRONTEND_URL}/payment/success
Fail    → {FRONTEND_URL}/payment/failed
Cancel  → {FRONTEND_URL}/payment/failed
```

SSLCommerz appends `?tran_id=...&status=...` automatically.

---

## Deployment

### Build

```bash
npm run build
npm run start
```

### Platforms

Compatible with Vercel, Netlify, or any Node.js host. Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL.

---

## License

MIT
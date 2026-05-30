# StudentHub — EdHub360 Frontend

React + TypeScript frontend for the EdHub360 AI-powered learning platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| Auth | Google Identity Services, MSAL (Microsoft), Facebook JS SDK |
| Payments | Stripe |

## Features

- **Dashboard** — personalised study overview and progress tracking
- **AI Chat** — conversational learning assistant
- **Flashcards** — spaced-repetition card decks
- **Quiz Mode** — AI-generated quizzes
- **Courses** — structured curriculum browser
- **Study Planner** — schedule and goal tracking
- **Notebook** — rich-text notes
- **Screenshot Solve** — upload images for AI-powered problem solving
- **Social login** — Google, Microsoft, Facebook OAuth

## Local Development

### Prerequisites
- Node.js 20+
- Backend services running (see `Backend/`)

### Setup

```bash
cd StudentHub
npm install
```

Create `.env` (never commit this):

```env
VITE_API_BASE_URL=          # leave empty — Vite proxy routes /auth to localhost:8001
VITE_MICROSOFT_CLIENT_ID=11fad16e-2c09-4d98-bdc5-e6eed5d204e8
```

### Run

```bash
npm run dev
```

The dev server starts on **https://localhost:5173** (HTTPS required for Facebook OAuth).

> **First run:** accept the self-signed certificate warning in the browser once.

### Why HTTPS in dev?

Facebook's SDK blocks `FB.login()` on HTTP pages (enforced since 2018). The Vite dev server uses `@vitejs/plugin-basic-ssl` to serve over HTTPS. All API calls go through the Vite proxy so there is no mixed-content issue.

### Vite Dev Proxy

| Path prefix | Forwards to |
|---|---|
| `/auth/*` | `http://localhost:8001` (login service) |
| `/health` | `http://localhost:8001` |
| `/subscription-api/*` | `https://subscription-service-*.run.app` |

## Build

```bash
# Production build (deploys to app.edhub360.com)
npm run build

# GitHub Pages staging build
npm run build:github

# Deploy to GitHub Pages
npm run deploy
```

## Environment Variables (production / CI)

Set these in Cloud Build / GitHub Actions — do **not** commit them:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Login service URL |
| `VITE_AICHAT_API_URL` | AI Chat service URL |
| `VITE_NOTES_API_BASE_URL` | Notebook service URL |
| `VITE_CSBOT_API_URL` | CS Bot service URL |
| `VITE_MICROSOFT_CLIENT_ID` | Azure app registration client ID |

## OAuth Setup

### Google
- Console: Google Cloud → APIs & Services → Credentials
- Add `https://localhost:5173` to **Authorized JavaScript origins**

### Microsoft
- Console: Azure Portal → App registrations → Authentication
- Add `https://localhost:5173/auth-redirect.html` as a **SPA redirect URI**
- Supported account types: **Multitenant + personal Microsoft accounts**

### Facebook
- Console: developers.facebook.com → your app → Use cases → Facebook Login
- Add `email` permission
- Set Site URL to `https://localhost:5173`
- App must be in **Development mode** for localhost testing

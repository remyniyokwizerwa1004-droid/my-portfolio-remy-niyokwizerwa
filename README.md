# my-portfolio-remy-niyokwizerwa

here is my portifolio that describes me and all my exprience and skills

Live site: https://remyniyokwizerwa.vercel.app

## Editing the site

Go to **/admin** (https://remyniyokwizerwa.vercel.app/admin), sign in with your password,
change anything, upload photos, and click **Save**. The public page updates immediately; no code
changes or redeploys are needed.

## How it works

| Part | What it does |
| --- | --- |
| `public/index.html` | Public page. Loads all content from `/api/content` and renders it. |
| `public/admin.html` | Password-protected editor for all content, photos, CV and links. |
| `api/*.js` | Vercel serverless functions: content, uploads, files, login/logout, password. |
| Neon Postgres | Stores the content (`content`), uploaded photos/PDFs (`files`), and the editor password hash (`settings`). Tables are created automatically. |

### Environment variables (Vercel → Project → Settings → Environment Variables)

- `DATABASE_URL` — Neon connection string
- `ADMIN_PASSWORD` — initial editor password (used until you change it in the editor)
- `SESSION_SECRET` — random string used to sign login cookies

**Forgot the editor password?** Run `DELETE FROM settings WHERE key = 'password';` in the Neon SQL
editor. The password then falls back to `ADMIN_PASSWORD`, which you can view or change in Vercel.

### Run locally

Create `.env.local` with the three variables above, then:

```
npm install
npm run dev     # http://localhost:3000 and http://localhost:3000/admin
```

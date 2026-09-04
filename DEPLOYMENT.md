# DRISHTI — Full Deployment Guide (Neon + Vercel)

This connects all 3 pieces — **Neon PostgreSQL → backend API → web dashboard**
— from your laptop onto live hosting, so you get URLs you can demo from
anywhere and share with judges.

Total cost: **₹0** (free tiers). Total time: ~30-40 minutes the first time.

---

## Overview — what connects to what

```
Vercel (dashboard)  --VITE_API_URL-->  Railway/Render (backend)  --DATABASE_URL-->  Neon (PostgreSQL)
https://drishti.vercel.app             https://drishti-backend.up.railway.app      Neon cloud (no server to manage)
```

Two environment variables are the glue:
- **`DATABASE_URL`** — tells the backend where the Neon database lives
- **`VITE_API_URL`** — tells the dashboard where the backend lives

Everything else in the code already reads from these — you never hardcode a URL.

Note: Vercel is used only for the **dashboard** (static Vite build). The
FastAPI backend needs a server that stays running and supports Python —
Vercel's serverless functions aren't a good fit for this app, so the backend
goes on Railway or Render (both free-tier, both work the same way below;
steps use Railway).

---

## Part 1 — Push code to GitHub

```bash
cd drishti-app
git init
git add .
git commit -m "Initial commit: backend + dashboard"
```
Create a new empty repo on github.com (no README/license, keep it empty), then:
```bash
git remote add origin https://github.com/<your-username>/drishti-app.git
git branch -M main
git push -u origin main
```

---

## Part 2 — Database (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → sign in with GitHub → **Create a project**
   (pick any name, e.g. `drishti-db`, and the region closest to your backend host)
2. On the project dashboard, find the **Connection string** box. Copy it —
   it looks like:
   `postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require`
3. Change `postgresql://` to `postgresql+psycopg2://` at the start — this is
   your `DATABASE_URL`. Keep the `?sslmode=require` at the end. Keep this
   value, you'll paste it in Part 3.
4. Load the schema: on the Neon dashboard, open the **SQL Editor** tab, open
   `db/schema_postgres.sql` from your project, copy its full contents, paste
   and run.
   (Alternative: from your terminal, run
   `psql "<your DATABASE_URL>" -f db/schema_postgres.sql` )

> Use `db/schema_postgres.sql`, not `db/schema.sql` — the latter is MySQL
> syntax kept only for reference.

---

## Part 3 — Backend (Railway)

1. Go to [railway.app](https://railway.app) → sign in with GitHub → **New Project** → **Deploy from GitHub repo** → select `drishti-app`
2. It'll try to build the whole repo — tell it to only use the backend folder:
   Service **Settings** → **Root Directory** → set to `backend`
3. Go to the service's **Variables** tab, add:
   - `DATABASE_URL` = the value from Part 2, step 3
   - `SECRET_KEY` = any long random string (e.g. run `openssl rand -hex 32` locally and paste the output)
   - `FRONTEND_URL` = leave blank for now, you'll fill it in Part 4
4. Railway auto-detects Python and uses the `Procfile` (already included) to start
   the server. Deploy will run automatically.
5. Once deployed, go to **Settings** → **Networking** → **Generate Domain**.
   You'll get a URL like `https://drishti-backend-production.up.railway.app`
   — **copy this**, you need it in Part 4.
6. Test it: open `<your-backend-url>/docs` in a browser — you should see the
   same Swagger docs page you saw on localhost. If it loads, the backend + Neon
   DB are correctly connected.

---

## Part 4 — Dashboard (Vercel)

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New Project**
2. Import your `drishti-app` repo
3. In the import settings: **Root Directory** → select `dashboard`
   (Vercel auto-detects Vite — framework preset should say "Vite")
4. Before deploying, expand **Environment Variables** and add:
   - `VITE_API_URL` = the backend URL from Part 3, step 5
     (e.g. `https://drishti-backend-production.up.railway.app`)
5. Click **Deploy**. In ~1-2 minutes you'll get a live link like
   `https://drishti-app.vercel.app`
6. Go back to Railway → your backend service → **Variables** → set
   `FRONTEND_URL` to this Vercel URL, so CORS allows it. Redeploy the backend
   service for this to take effect.

---

## Part 5 — Test end-to-end

1. Open `<your-backend-url>/docs`, use `POST /auth/register` to create a user
   with `role: department_official`
2. Open `<your-dashboard-url>/login`, sign in with that same email/password
3. You should land on the dashboard and see the institute register

If login fails with a network error, it's almost always one of:
- `VITE_API_URL` in Vercel doesn't match the actual Railway backend URL exactly
  (check for trailing slashes — there shouldn't be one)
- The backend hasn't redeployed after you added the variable — trigger a
  redeploy from Railway's dashboard
- `FRONTEND_URL` on the backend doesn't match your Vercel URL exactly — CORS
  will block the dashboard's requests until this matches
- Neon DB is on a plan/region that suspends idle databases — the first
  request after idle time can be slow (a few seconds) as it wakes up; this is
  normal on Neon's free tier

---

## Redeploying after code changes

Both Railway and Vercel auto-deploy on every `git push` to `main` — so your
normal workflow becomes:
```bash
git add .
git commit -m "describe what changed"
git push
```
Both services pick it up within a minute or two. No manual redeploy needed.
Neon needs no redeploy — it's just the database, always live.

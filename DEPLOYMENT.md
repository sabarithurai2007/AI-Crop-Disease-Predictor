# AgriGuard AI - Deployment Guide (Render + Vercel)

This guide walks you through deploying **AgriGuard AI** to production for FREE using **Render** (for the Flask backend) and **Vercel** (for the React frontend).

---

## Architecture Overview

```
               ┌──────────────────────────────┐
               │    Vercel (React Frontend)   │
               │   https://<your-app>.vercel.app│
               └──────────────┬───────────────┘
                              │
                    HTTPS API Requests
                              │
                              ▼
               ┌──────────────────────────────┐
               │     Render (Flask Backend)   │
               │https://agriguard-backend...  │
               └──────────────────────────────┘
```

---

## Phase 1: Push Code to GitHub

1. Open your terminal in the project directory:
   ```bash
   cd C:\Users\Sabar\.gemini\antigravity-ide\scratch\crop-disease-predictor
   ```
2. Initialize Git and make a commit:
   ```bash
   git init
   git add .
   git commit -m "Prepare AgriGuard AI for production deployment"
   ```
3. Push your code to a new repository on [GitHub](https://github.com/new).

---

## Phase 2: Deploy Backend to Render (Flask API)

1. Sign up or log into [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Select **Blueprint** (or manually select **Python 3** web service):
   - **Root Directory**: `backend`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn app:app`
5. Under **Environment Variables**, add:
   - `SECRET_KEY`: (Click generate or type any long random key)
   - `PYTHON_VERSION`: `3.10.12`
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend live URL (e.g. `https://agriguard-backend-xyz.onrender.com`).

---

## Phase 3: Deploy Frontend to Vercel (React)

1. Sign up or log into [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your `crop-disease-predictor` GitHub repository.
4. Configure Project Settings:
   - **Root Directory**: Click Edit and select `frontend`
   - **Framework Preset**: `Vite`
5. Expand **Environment Variables** and add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://agriguard-backend-xyz.onrender.com` *(Replace with your Render URL from Phase 2)*
6. Click **Deploy**.

---

## Phase 4: Final Verification

1. Open your Vercel deployment URL (e.g. `https://crop-disease-predictor.vercel.app`).
2. Register a new user account.
3. Upload a leaf specimen photo (Tomato, Potato, Corn, Apple).
4. Run AI Health Diagnosis.
5. Verify diagnosis results, treatment guidelines, history log, and PDF report download!

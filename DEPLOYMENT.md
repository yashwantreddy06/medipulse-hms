# MediPulse Deployment Guide (Free Tier Production Walkthrough)

This guide provides a comprehensive, copy-paste-ready deployment procedure for hosting **MediPulse** using 100% free-tier cloud infrastructure:
- **Database**: MongoDB Atlas (M0 Shared Cluster – Free)
- **Backend API**: Render (Free Web Service)
- **Frontend SPA**: Vercel (Hobby Free Tier)

---

## Deployment Architecture Overview

```
                      +-----------------------------+
                      |   Vercel Edge Network       |
                      |   (React + Vite Frontend)   |
                      |   https://<app>.vercel.app  |
                      +--------------+--------------+
                                     |
                         HTTPS REST API Requests
                                     |
                                     v
                      +-----------------------------+
                      |       Render Web Service    |
                      |    (Express + Node Backend) |
                      |  https://<api>.onrender.com |
                      +--------------+--------------+
                                     |
                          Mongoose TLS Connection
                                     |
                                     v
                      +-----------------------------+
                      |    MongoDB Atlas M0 Cluster |
                      |    (Cloud Database Storage) |
                      +-----------------------------+
```

---

## Master Deployment Checklist

Follow this order strictly to avoid connection or CORS errors:
- [ ] **Step 1**: Provision MongoDB Atlas M0 Cluster, DB User & Network IP Access.
- [ ] **Step 2**: Seed or prepare Atlas connection string (`mongodb+srv://...`).
- [ ] **Step 3**: Deploy Express Backend to Render (`server/` directory).
- [ ] **Step 4**: Verify Render health endpoint (`https://<render-url>/api/health`).
- [ ] **Step 5**: Deploy React Frontend to Vercel (`client/` directory with `VITE_API_URL`).
- [ ] **Step 6**: Update Render `CLIENT_URL` environment variable with Vercel live domain.
- [ ] **Step 7**: Perform end-to-end smoke testing (Register, Browse Doctors, Book Appointment, Admin).

---

## Step 1: Database Setup — MongoDB Atlas (Free Tier)

1. **Sign Up / Log In**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create an account.
2. **Create New Project**:
   - Project Name: `MediPulse-Production`
3. **Deploy a Free Database**:
   - Choose **M0 Free** (Shared RAM, 512 MB storage, always free).
   - Select cloud provider **AWS** or **GCP** in a region close to your users (e.g. `us-east-1` or `ap-south-1`).
   - Cluster Name: `medipulse-cluster`. Click **Create**.
4. **Configure Database Credentials**:
   - In **Security Quickstart** or **Database Access**:
     - Authentication Method: **Password**
     - Username: `medipulse_admin`
     - Password: Choose a strong alphanumeric password (e.g. `MediPulseAtlas2026!`). Record this securely.
     - Role: **Read and write to any database**. Click **Add User**.
5. **Configure Network Access (IP Whitelist)**:
   - Navigate to **Security** > **Network Access** in the left sidebar.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render's cloud servers can connect dynamically.
   - Click **Confirm**.
6. **Obtain Connection String**:
   - In **Database** > **Clusters**, click **Connect**.
   - Choose **Drivers** (Node.js version 5.5 or later).
   - Copy the connection URI:
     ```text
     mongodb+srv://medipulse_admin:<password>@medipulse-cluster.xxxxx.mongodb.net/medipulse?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password and ensure the database name is `/medipulse`.

---

## Step 2: Backend Deployment — Render (Free Web Service)

1. **Create Render Account**:
   - Go to [Render.com](https://render.com/) and sign up with GitHub or Email.
2. **Create Web Service**:
   - Click **New +** > **Web Service**.
   - Connect your GitHub repository containing the `TRAINING PROJ` monorepo.
3. **Configure Service Details**:
   - **Name**: `medipulse-api` (or similar)
   - **Region**: Choose the region closest to your MongoDB Atlas cluster (e.g., Oregon or Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `server` *(Important: Point strictly to the server folder)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: **Free** (0.1 CPU, 512 MB RAM)
4. **Configure Environment Variables**:
   Click **Advanced** > **Add Environment Variable** and enter:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `PORT` | `5000` | Internal port |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `MONGO_URI` | `mongodb+srv://medipulse_admin:...@...` | Your Atlas connection string |
   | `JWT_SECRET` | `medipulse_production_jwt_secret_998877` | 32+ character random string |
   | `CLIENT_URL` | `http://localhost:5173` | Temporary value; will update with Vercel domain in Step 5 |
5. **Deploy & Seed Database**:
   - Click **Create Web Service**. Wait ~2-3 minutes for the build to finish.
   - Once deployed, open the Render **Shell** tab:
     ```bash
     npm run seed
     ```
   - This executes `seed.js` against your Atlas database, creating the Admin and Demo Patient accounts and 8 doctors.
6. **Smoke Test Backend**:
   - Visit: `https://<your-render-service>.onrender.com/api/health`
   - Expect:
     ```json
     {
       "status": "ok",
       "service": "medipulse-backend-api",
       "uptime": 12,
       "timestamp": "2026-11-05T..."
     }
     ```

---

## Step 3: Frontend Deployment — Vercel (Hobby Free Tier)

1. **Create Vercel Account**:
   - Go to [Vercel.com](https://vercel.com/) and authenticate with GitHub.
2. **Import Repository**:
   - Click **Add New...** > **Project**.
   - Select your repository.
3. **Configure Build Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and choose `client`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Configure Environment Variables**:
   - Add the following variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://<your-render-service>.onrender.com/api` *(Ensure no trailing slash after `/api`)*
5. **SPA Routing Support**:
   - MediPulse already includes `client/vercel.json` with SPA rewrite rules:
     ```json
     {
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
   - This prevents 404 errors when reloading deep URLs like `/doctors` or `/my-appointments`.
6. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend in ~30 seconds.
   - Copy your live Vercel production URL: `https://medipulse-<unique>.vercel.app`.

---

## Step 4: Finalize CORS on Render & Smoke Test

1. **Update Render CORS Allowlist**:
   - Return to your [Render Dashboard](https://dashboard.render.com/).
   - Open your `medipulse-api` service.
   - Go to **Environment** > Edit `CLIENT_URL`:
     - Change value to: `https://medipulse-<unique>.vercel.app`
   - Click **Save Changes**. Render will automatically trigger a rapid zero-downtime redeploy.
2. **Execute Full User Journey Smoke Test**:
   - Open `https://medipulse-<unique>.vercel.app` in your web browser.
   - Click **Sign In** > click **Patient Demo** > Log in.
   - Navigate to **Find Doctors** > search for "Cardiology".
   - Click **Book Now** on Dr. Rajesh Sharma.
   - Pick tomorrow's date, time slot, write a symptom note, and confirm booking.
   - Verify that you are redirected to **My Health Appointments** with a "Pending Review" badge.
   - Click **Logout** > click **Sign In** > click **Admin Demo** > Log in.
   - Open **Admin Portal** > Appointments tab > click **Confirm** on the pending appointment.
   - Verify status transitions to "Confirmed" in real time.

---

## Troubleshooting Common Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `Network Error` or CORS blocked on fetch | `CLIENT_URL` on Render doesn't match Vercel URL | Verify `CLIENT_URL` matches your exact Vercel domain (without trailing slash) in Render Environment settings. |
| MongoServerError: `bad auth : authentication failed` | Incorrect Atlas username or password | Re-check username and password in Render's `MONGO_URI`. Escape special characters in password if applicable. |
| MongoServerSelectionError: `connect ETIMEDOUT` | Atlas Network Access whitelist | Ensure `0.0.0.0/0` is active in MongoDB Atlas Network Access tab. |
| 404 on page refresh on Vercel | Missing SPA rewrite rule | Ensure `client/vercel.json` exists with rewrite rule to `/index.html`. |
| Render service takes 40s to respond initially | Render Free tier spin-down after 15 min inactivity | Normal free tier behavior. Subsequent requests respond in milliseconds. |


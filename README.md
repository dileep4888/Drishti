# 🚀 DRISHTI - Quick Start Guide

## Government of India | Department of Social Justice & Empowerment
**DRISHTI** - Digital Real-time Inspection & Surveillance Tracking Interface

---

## 📋 Prerequisites

- **Node.js** 18+ (for dashboard)
- **Python** 3.10+ (for backend)
- **MySQL** 8.0+ (for database)
- **Git** (for version control)

---

## 🛠️ Local Development Setup

### 1. Database Setup

```bash
# Start MySQL server and create database
mysql -u root -p
CREATE DATABASE drishti_db;
exit;

# Import schema
mysql -u root -p drishti_db < db/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Generate secret key
openssl rand -hex 32

# Edit .env and paste the generated key as SECRET_KEY
# Also update DATABASE_URL with your MySQL credentials

# Run server
uvicorn app.main:app --reload
```

Backend will run on: **http://localhost:8000**

### 3. Frontend Setup

```bash
cd dashboard

# Install dependencies
npm install

# (Optional) Create .env for custom backend URL
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

Dashboard will run on: **http://localhost:5173**

---

## 🌐 Production Deployment

### Backend (Railway)

1. **Create Railway Project**
   - Go to https://railway.app
   - Create new project
   - Add MySQL database plugin

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link project
   railway link
   
   # Add environment variables in Railway dashboard:
   # - DATABASE_URL (auto-populated)
   # - SECRET_KEY (generate with: openssl rand -hex 32)
   # - FRONTEND_URL=https://your-app.vercel.app
   
   # Deploy
   railway up
   ```

3. **Note your backend URL**: `https://your-backend.railway.app`

### Frontend (Vercel)

1. **Create Vercel Project**
   - Go to https://vercel.com
   - Import git repository
   - Set root directory to: `dashboard`

2. **Add Environment Variable**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app`

3. **Deploy**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   cd dashboard
   vercel --prod
   ```

4. **Update Backend FRONTEND_URL**
   - Go to Railway dashboard
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

---

## 👥 User Roles

### Available for Self-Registration:
- **Inspector** - Field inspectors who conduct on-site inspections
- **NGO Incharge** - NGO representatives managing institutes

### Requires Admin Approval (Contact Department):
- **PMU Admin** - Programme Management Unit administrators
- **Department Official** - DoSJE department officials

---

## 🧪 Testing the Application

### Test Credentials (Create via Register):
```
Email: test.inspector@dosje.gov.in
Password: Test@1234
Role: Inspector
```

### Security Tests:
1. ✅ Try weak password (should fail)
2. ✅ Try registering as admin (should fail)
3. ✅ Login 6 times with wrong password (rate limit triggers)
4. ✅ Let token expire (auto-logout after 30 min)

---

## 📁 Project Structure

```
drishti-app-main/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── core/         # Config, database, security
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Rate limiting, etc.
│   ├── .env.example
│   └── requirements.txt
├── dashboard/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── api.js       # Axios configuration
│   ├── package.json
│   └── vite.config.js
├── db/
│   └── schema.sql       # Database schema
├── DEPLOYMENT.md        # Detailed deployment guide
└── FIXES_COMPLETED.md   # Complete fix documentation
```

---

## 🔐 Security Features

- ✅ JWT-based authentication with 30-minute expiration
- ✅ Password requirements: 8+ chars, 1 uppercase, 1 number
- ✅ Rate limiting: 5 auth attempts per minute
- ✅ Role-based access control (RBAC)
- ✅ CORS restricted to approved domains
- ✅ Phone number format validation
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ XSS protection (React escaping + CSP headers)

---

## 📞 Support

For technical issues or admin role requests, contact:
- **Technical Team**: tech@dosje.gov.in
- **Department**: dosje-support@nic.in

---

## 📄 License

This application is developed for the Department of Social Justice & Empowerment, Government of India.

**सत्यमेव जयते** | Truth Alone Triumphs

---

**Version:** 1.0.0  
**Last Updated:** September 4, 2026

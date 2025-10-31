# Savings Management System 

A full‑stack platform for managing savings efficiently with separate applications for customers and administrators.


##  Installation Guide

###  Client Application

####  Backend Setup
```bash
cd client-app/backend
npm install
cp .env
# Update .env with your mongoDB connection string
npm run dev
```

####  Frontend Setup
```bash
cd client-app/frontend
npm install
cp .env
# Update .env 
npm run dev
```

---

###  Admin Application

####  Backend Setup
```bash
cd admin-app/backend
npm install
cp .env
# Update .env with your mongoDB connection string
npm run dev
```

####  Frontend Setup
```bash
cd admin-app/frontend
npm install
cp .env
npm run dev
```

---

##  Environment Variables

Each `.env` file must include the following:

```
PORT=5001
NODE_ENV=development

# Database (Same database as client to access user data)
MONGODB_URI=""

# JWT Secret
JWT_SECRET=your_admin_super_secret_jwt_key_change_in_production
JWT_EXPIRE=8h

# Default Admin Credentials
DEFAULT_ADMIN_EMAIL=admin@savings.com
DEFAULT_ADMIN_PASSWORD=Admin@123456

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

---

##  Running All Services Together

You’ll run each server independently on different terminals:

| App | Type | Command |
|------|------|---------|
| Client | Backend | `cd client/backend && npm run dev` |
| Client | Frontend | `cd client/frontend && npm dev` |
| Admin | Backend | `cd admin/backend && npm run dev` |
| Admin | Frontend | `cd admin/frontend && npm dev` |

---

## Features

 Secure Authentication  
 Role‑Based Access  
 Savings Tracking  
Admin Dashboard & Reports  
Modern UI with React  

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT |

---

## swager

Swagger fro client :http://localhost:5000/api-docs
swagger for admin : http://localhost:5001/api-docs


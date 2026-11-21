# ColorLex Creation

Premium Full-Stack Printing & Packaging Platform.

## 🚀 Overview
ColorLex Creation provides custom printing and branding solutions, including photo frames, mugs, photo albums, laser cutting, acrylic boards, glow signs, and customized promotional products.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Cloudinary

## 📦 Project Structure
```
colorlex/
├── client-side/       # React frontend application
├── server-side/       # Express.js backend API
└── package.json       # Monorepo / workspace scripts
```

## ⚙️ Setup & Running

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` in `server-side/` to `.env` and fill in your credentials:
```bash
cp server-side/.env.example server-side/.env
```

### 3. Run Development Servers
- Backend: `npm run server:dev`
- Frontend: `npm run client`
- Or run both concurrently according to your preferred workflow.

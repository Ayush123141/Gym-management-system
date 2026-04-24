# 🦾 GymForce - Premium Gym Management System

![Gym Hero](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop)

GymForce is a state-of-the-art, full-stack Gym Management System built with a premium **Glassmorphism UI**. Designed for multi-location fitness brands, it offers real-time analytics, member CRM, and automated financial tracking.

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based login system with role-based access control.
- 📊 **Dynamic Dashboard**: Real-time revenue charts (Recharts) and priority membership alerts.
- 👥 **Advanced Member CRM**: Comprehensive member database with search, filter, and **Bulk CSV Import**.
- 💳 **Financial Engine**: Automated membership expiry calculation and transaction history tracking.
- 🛡️ **Concurrency Safety**: Optimistic Locking (OCC) to prevent data race conditions between multiple staff.
- 🏢 **Multi-Location Support**: Centralized management for various gym branches.
- 👔 **Trainer Management**: Dedicated section for instructors and coaching staff.
- 🎨 **Premium UI/UX**: Glassmorphism aesthetic, smooth animations, and responsive layouts.

## 🚀 Tech Stack

### Frontend
- **React 19** (TypeScript + TSX)
- **Vite** (Build Tool)
- **Tailwind CSS v4** (Styling)
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)
- **Papaparse** (CSV Processing)

### Backend
- **Node.js & Express**
- **MySQL** (Database)
- **Bcrypt** (Password Hashing)
- **JSON Web Tokens** (Auth)
- **dotenv** (Environment Management)

## 🛠️ Local Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **XAMPP / MySQL Server**
- **npm**

### 2. Database Configuration
1. Open phpMyAdmin and create a database named `gym_management`.
2. Import the provided SQL schema (found in the setup guide or by creating the tables manually).
3. Insert a default admin:
   ```sql
   INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
   ```

### 3. Backend Setup
```bash
cd server
npm install
# Create a .env file based on .env.example
npm run dev
```

### 4. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```

## 📸 Screenshots

| Dashboard | Member CRM | 
|-----------|------------|
| ![Dashboard](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400) | ![CRM](https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400) |

---

## 📄 License
MIT License - Created by **Antigravity AI** for [Ayush123141](https://github.com/Ayush123141)

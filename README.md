# 🚀 Prodify - Product Management Dashboard

A modern, professional product management application built with Next.js, Redux Toolkit, and Tailwind CSS.

![Prodify](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=for-the-badge&logo=redux)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication

- Simple email-based JWT authentication
- Persistent session storage with Redux
- Protected routes with automatic redirect
- Logout functionality

### 📦 Product Management

- **Browse Products** - Paginated product listing with beautiful cards
- **Search** - Real-time search by product name with debouncing
- **Filter** - Filter products by category
- **Create** - Add new products with comprehensive validation
- **Edit** - Update existing products
- **Delete** - Remove products with confirmation modal
- **View Details** - Full product information with image gallery

### 🎨 Modern UI/UX

- **Beautiful Design** - Gradient backgrounds, smooth animations, and modern components
- **Responsive Layout** - Mobile-first design that works on all devices
- **Dark Mode Support** - Automatic dark mode based on system preferences
- **Loading States** - Professional loading spinners
- **Error Handling** - User-friendly error messages with retry options
- **Smooth Animations** - Fade-in, slide-up, and hover effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd prodify
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Login

Enter the email you used on your job application to get a JWT token and start managing products.

## 📝 API Documentation

The app uses the BitechX API:

- **Base URL**: `https://api.bitechx.com`
- **Auth**: JWT token via Bearer authentication
- **Content-Type**: `application/json`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Deploy** - Your app will be live in minutes!

## 🛡️ Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Image Optimization**: Next.js Image

## 📧 Contact

For questions: [connect@bitechx.com](mailto:connect@bitechx.com)

---

**Built with ❤️ for BitechX Job Application**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

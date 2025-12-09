# CityWatch - Public Infrastructure Reporting System

CityWatch is a comprehensive web application designed to empower citizens to report public infrastructure issues (like potholes, broken streetlights, etc.) and enable government staff to track, manage, and resolve them efficiently.

## 🔗 Live Site
https://city-watch-mir.netlify.app/

## 🔐 Admin Credentials
Use these credentials to access the Admin Dashboard and test administrative features:
*   **Email:** `admin_test@example.com`
*   **Password:** `password123`

## ✨ Key Features
*   **📢 Issue Reporting System:** Citizens can easily report infrastructure problems with detailed descriptions and images.
*   **🗺️ Interactive Map:** Browse reported issues on a dynamic map interface (powered by Leaflet) to see problem hotspots.
*   **👥 Role-Based Dashboards:** tailored experiences for three distinct user roles:
    *   **Admin:** Manage users, assign tasks, and oversee system stats.
    *   **Staff:** View and update the status of assigned issues.
    *   **Citizen:** Track personal reports and view public issue feeds.
*   **🔄 Real-time Status Tracking:** Monitor the progress of reports from "Pending" to "In Progress" to "Resolved".
*   **💳 Premium Subscriptions:** Integrated Stripe payment gateway allowing users to upgrade for priority handling and enhanced features.
*   **📊 Data Visualization:** Admin dashboard featuring charts and graphs (Recharts) to visualize reporting trends and resolution rates.
*   **🔒 Secure Authentication:** Robust user authentication system powered by Firebase.
*   **📄 PDF Report Generation:** Export issue details and summaries into professional PDF formats.
*   **📱 Fully Responsive Design:** Modern, mobile-first interface built with Tailwind CSS and DaisyUI.
*   **⚡ Optimized Performance:** Utilizes TanStack Query for efficient data fetching and caching.

## 🛠️ Technology Used
### Frontend
*   **React (Vite):** Fast and modern UI library.
*   **Tailwind CSS & DaisyUI:** Rapid styling and component library.
*   **TanStack Query:** Powerful asynchronous state management.
*   **React Leaflet:** Maps integration.
*   **Framer Motion:** Smooth animations and transitions.
*   **React Hook Form:** Efficient form handling.

### Backend
*   **Node.js & Express:** Scalable server-side architecture.
*   **MongoDB:** NoSQL database for flexible data storage.
*   **Stripe:** Secure payment processing.
*   **Firebase Auth:** Reliable identity management.
*   **JWT:** Secure token-based authentication mechanism.

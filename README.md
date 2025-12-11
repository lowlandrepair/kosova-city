# 🏙️ CityCare - Smart City Issue Reporting Platform

<div align="center">

![CityCare Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=CityCare+Smart+City+Platform)

**Empowering communities to report, track, and resolve city issues in real-time**

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E)](https://supabase.com/)

[🚀 Live Demo] | [📖 Documentation](#documentation) | [🎯 Features](#-key-features)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [User Guide](#-user-guide)
- [Database Schema](#-database-schema)
- [Authentication & Security](#-authentication--security)
- [Internationalization](#-internationalization)
- [Development](#-development)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CityCare** is a next-generation smart city platform designed to bridge the gap between citizens and city administrators. Built specifically for Kosovo, CityCare enables residents to report urban issues (potholes, broken streetlights, trash accumulation) through an intuitive, map-based interface while providing administrators with powerful tools to manage, prioritize, and resolve these issues efficiently.

### 🎯 Problem Statement

Urban areas face challenges in:
- **Communication gaps** between citizens and city management
- **Inefficient issue tracking** and resolution workflows
- **Lack of transparency** in municipal response times
- **Poor citizen engagement** in community improvement

### 💡 Our Solution

CityCare provides:
- **Dual-interface system**: Citizen portal + Admin command center
- **Interactive map-based reporting** with GPS precision
- **AI-powered issue enhancement** for better categorization
- **Real-time tracking** and status updates
- **Gamification** to boost community engagement
- **Multilingual support** (English, Albanian, Spanish, French)

---

## ✨ Key Features

### 🏘️ For Citizens (Community Portal)

#### 📍 **Interactive Map-Based Reporting**
- Click-to-select location on OpenStreetMap
- Kosovo-centered map with automatic geolocation
- Visual confirmation of report location
- Real-time GPS coordinates

#### 🤖 **AI-Powered Enhancements**
- Auto-enhance report descriptions with AI
- Intelligent categorization (Pothole, Lighting, Trash, etc.)
- Priority suggestion based on issue type
- Photo upload with preview

#### 📊 **Community Impact Tracking**
- Personal "Community Impact Score"
- Track your contribution to city improvements
- View total resolved reports
- Gamification elements to encourage participation

#### 👍 **Democratic Upvoting System**
- One vote per user per report
- Highlight community priorities
- Prevent vote manipulation
- Real-time upvote count updates

#### 📱 **Activity Dashboard**
- Track all your submitted reports
- Visual status stepper (Pending → In Progress → Resolved)
- See author information and timestamps
- Filter and search your reports

#### 🎉 **Delightful UX**
- Confetti animation on successful report submission
- Smooth transitions and animations
- Mobile-first responsive design
- Floating Action Button (FAB) for quick reporting

---

### 🎛️ For Administrators (Command Center)

#### 🗺️ **God View Map**
- Live map with all active reports as color-coded pins
- **Red pins** = High priority
- **Yellow pins** = Medium priority
- **Blue pins** = Low priority
- Click pins for quick report details
- Manage button for instant status updates

#### 📋 **Kanban Workflow Board**
- Drag-and-drop ticket management
- Three columns: **Pending Review** → **Dispatched** → **Resolved**
- Automatic status synchronization
- Visual workflow optimization
- Real-time board updates

#### 📈 **Analytics Dashboard**
- Live statistics (pending, in-progress, resolved counts)
- Recent activity feed
- Performance metrics
- Data visualization ready

#### 🌓 **Dark Mode Tactical View**
- Switch to dark theme for command center aesthetic
- Neon blue accents on slate-900 backgrounds
- Reduced eye strain for extended monitoring sessions

#### 🔐 **Role-Based Access Control**
- Secure admin-only access
- RLS (Row-Level Security) policies
- Admin role verification via Supabase

---

### 🌍 Universal Features

- **🌐 Multilingual Support**: English, Albanian (Shqip), Spanish (Español), French (Français)
- **🌓 Theme Toggle**: Dark/Light mode with persistence across sessions
- **👤 Profile Management**: Edit display name, view reports, logout
- **🔒 Secure Authentication**: Email/password + Google OAuth
- **⚡ Real-time Updates**: Live data synchronization with Supabase
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop

---

## 📖 User Guide

### 👥 For Citizens

#### 1️⃣ **Sign Up / Login**
1. Navigate to the landing page
2. Click **"Community Portal"**
3. Choose **"Sign Up"** or **"Login"**
4. Enter email and password (or use Google OAuth)
5. Email confirmation is auto-enabled for development

#### 2️⃣ **Report an Issue**
1. Click the **Floating Action Button (FAB)** or **"Report Issue"** button
2. **Step 1: Select Location**
   - Click anywhere on the map to set the location
   - Coordinates display at the bottom
   - Click **"Confirm Location"**
3. **Step 2: Provide Details**
   - Enter a descriptive title
   - Select category (Pothole, Lighting, Trash, etc.)
   - Choose priority (Low, Medium, High)
   - Write a detailed description
   - (Optional) Upload a photo
   - (Optional) Click **"Auto-Enhance with AI"** to improve description
   - Click **"Submit Report"**
4. **Step 3: Success!**
   - Enjoy confetti animation 🎉
   - View your report in "My Activity"

#### 3️⃣ **View & Upvote Reports**
1. Scroll through the community feed
2. Click the **thumbs-up icon** to upvote reports you care about
3. Each user can upvote a report **only once**
4. Higher upvotes = higher visibility for admins

#### 4️⃣ **Track Your Reports**
1. Navigate to **"My Activity"** tab
2. See all your submitted reports
3. Track status with visual stepper:
   - 📝 **Pending** → ⚙️ **In Progress** → ✅ **Resolved**
4. View timestamps and report details

#### 5️⃣ **Manage Your Profile**
1. Click your avatar in the top-right corner
2. Edit your display name inline
3. View "My Reports" section
4. Switch languages (EN, SQ, ES, FR)
5. Toggle dark/light mode
6. Logout when done

---

### 🛡️ For Administrators

#### 1️⃣ **Access Admin Dashboard**
- Only users with **"admin" role** in the `user_roles` table can access
- Navigate to the landing page
- Click **"Admin Portal"** (only visible to admins)
- Login with admin credentials

#### 2️⃣ **Command Center Overview**
- **Stats Sidebar**: View pending, in-progress, resolved, and total reports
- **God View Map**: See all active reports as color-coded pins
  - Click pins to open popup with report details
  - Click **"Manage"** button for quick actions
- **Recent Activity Feed**: Latest reports submitted by citizens

#### 3️⃣ **Kanban Board Workflow**
1. Navigate to the **"Kanban"** tab
2. Three columns:
   - **Pending Review**: Newly submitted reports
   - **Dispatched**: Issues assigned to teams
   - **Resolved**: Completed issues
3. **Drag & drop** cards between columns to update status
4. Status automatically syncs to database and map
5. Cards show title, category, priority badge, location, and timestamp

#### 4️⃣ **Live Map Monitoring**
1. Navigate to the **"Map"** tab
2. View all reports as pins:
   - 🔴 **Red** = High priority
   - 🟡 **Yellow** = Medium priority
   - 🔵 **Blue** = Low priority
3. Click pins to see report details in popup
4. Use buttons in popup to update status:
   - **Mark In Progress** (Pending → In Progress)
   - **Mark Resolved** (In Progress → Resolved)

#### 5️⃣ **Analytics Insights**
- Navigate to the **"Analytics"** tab
- View comprehensive statistics (coming soon)
- Export reports for city planning

---


by dalmat ademi
and if you want to log in as admin its 
Email:dalmat@gmail.com
Password:adminadmin

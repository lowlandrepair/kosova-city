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

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18.3.1** | UI library with hooks and context |
| **TypeScript** | Type safety and developer experience |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Beautiful, accessible component library |
| **Radix UI** | Unstyled, accessible UI primitives |
| **Framer Motion** | Smooth animations and transitions |
| **Leaflet** | Interactive map rendering |
| **React-Leaflet** | React bindings for Leaflet |
| **Canvas Confetti** | Celebration animations |
| **php** | CType safety and developer experience |

### Backend & Services
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database, auth, RLS |
| **Edge Functions** | Serverless backend logic (ready) |

### State Management & Data
| Technology | Purpose |
|------------|---------|
| **React Context API** | Global state (Auth, Reports, Language, Theme) |
| **TanStack Query** | Server state management |
| **React Hook Form** | Form handling and validation |
| **Zod** | Schema validation |

### Routing & Navigation
| Technology | Purpose |
|------------|---------|
| **React Router v6** | Client-side routing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (or **bun**)
- **Git** for version control
- **Supabase account** (provided via Lovable Cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/citycare.git
   cd citycare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```


4. **Initialize the database**
   
   The database schema is managed via Supabase migrations located in `supabase/migrations/`. If you're using Lovable Cloud, migrations are applied automatically.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
citycare/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminAnalytics.tsx      # Analytics dashboard
│   │   │   ├── AdminKanban.tsx         # Kanban board workflow
│   │   │   ├── AdminMap.tsx            # Live map with pins
│   │   │   └── AdminOverview.tsx       # Command center overview
│   │   ├── citizen/
│   │   │   ├── CitizenActivity.tsx     # User's report history
│   │   │   ├── CitizenHome.tsx         # Community portal home
│   │   │   ├── ReportDetailsStep.tsx   # Report form step 2
│   │   │   ├── ReportFlow.tsx          # Multi-step report flow
│   │   │   ├── ReportLocationStep.tsx  # Map location picker
│   │   │   └── ReportSuccessStep.tsx   # Success confirmation
│   │   ├── ui/
│   │   │   └── [shadcn components]     # Reusable UI primitives
│   │   ├── NavLink.tsx                 # Navigation link component
│   │   ├── ProfileDropdown.tsx         # User profile menu
│   │   └── ProtectedRoute.tsx          # Route guard for auth
│   ├── contexts/
│   │   ├── AuthContext.tsx             # Authentication state
│   │   ├── LanguageContext.tsx         # i18n state
│   │   ├── ReportContext.tsx           # Reports CRUD operations
│   │   └── ThemeContext.tsx            # Dark/light mode state
│   ├── hooks/
│   │   ├── use-mobile.tsx              # Mobile detection hook
│   │   └── use-toast.ts                # Toast notification hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts               # Supabase client setup
│   │       └── types.ts                # Auto-generated DB types
│   ├── lib/
│   │   ├── translations.ts             # i18n translation strings
│   │   └── utils.ts                    # Utility functions
│   ├── pages/
│   │   ├── Admin.tsx                   # Admin dashboard page
│   │   ├── Auth.tsx                    # Login/signup page
│   │   ├── Citizen.tsx                 # Citizen portal page
│   │   ├── Index.tsx                   # Landing/home page
│   │   └── NotFound.tsx                # 404 error page
│   ├── types/
│   │   └── report.ts                   # Report type definitions
│   ├── App.tsx                         # Root app component
│   ├── index.css                       # Global styles + design tokens
│   ├── main.tsx                        # App entry point
│   └── vite-env.d.ts                   # Vite type definitions
├── supabase/
│   ├── config.toml                     # Supabase configuration
│   └── migrations/                     # Database migrations
├── .env                                # Environment variables
├── .gitignore                          # Git ignore rules
├── components.json                     # shadcn/ui config
├── eslint.config.js                    # ESLint configuration
├── index.html                          # HTML entry point
├── package.json                        # Dependencies
├── postcss.config.js                   # PostCSS config
├── tailwind.config.ts                  # Tailwind CSS config
├── tsconfig.json                       # TypeScript config
└── vite.config.ts                      # Vite config
```

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

## 🗄️ Database Schema

### Tables

#### `profiles`
Stores additional user information beyond Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Reference to auth.users |
| `display_name` | text | User's display name |
| `created_at` | timestamp | Account creation time |
| `updated_at` | timestamp | Last profile update |

**RLS Policies:**
- Users can view, insert, and update their own profile
- No DELETE allowed

---

#### `user_roles`
Manages role-based access control.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Reference to auth.users |
| `role` | app_role | Enum: 'admin' or 'user' |
| `created_at` | timestamp | Role assignment time |

**RLS Policies:**
- Users can view their own roles
- Admins can view all roles
- No INSERT, UPDATE, or DELETE via RLS (managed by database functions)

---

#### `reports`
Stores all citizen-submitted issue reports.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Report author |
| `title` | text | Report title |
| `description` | text | Detailed description |
| `category` | text | Issue category |
| `priority` | text | Low, Medium, High |
| `status` | text | Pending, In Progress, Resolved |
| `lat` | double precision | Latitude coordinate |
| `lng` | double precision | Longitude coordinate |
| `upvotes` | integer | Number of upvotes |
| `image_url` | text | Optional photo URL |
| `created_at` | timestamp | Report submission time |
| `updated_at` | timestamp | Last update time |

**RLS Policies:**
- Anyone can view reports (public read)
- Authenticated users can create reports
- Users can update their own reports
- Admins can update and delete any report

---

#### `report_upvotes`
Tracks which users upvoted which reports (prevents duplicate votes).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | User who upvoted |
| `report_id` | uuid | Report being upvoted |
| `created_at` | timestamp | Upvote time |

**Unique Constraint:** `(user_id, report_id)` ensures one vote per user per report.

**RLS Policies:**
- Users can view all upvotes
- Users can insert their own upvotes
- Users can delete their own upvotes
- No UPDATE allowed

---

### Database Functions

#### `has_role(_user_id uuid, _role app_role) → boolean`
Security definer function to check if a user has a specific role. Used in RLS policies to prevent recursive issues.

```sql
SELECT public.has_role(auth.uid(), 'admin'::app_role);
```

#### `upvote_report(report_id uuid) → void`
Handles upvoting logic: inserts into `report_upvotes` and increments `reports.upvotes` counter atomically.

```sql
SELECT public.upvote_report('report-uuid-here');
```

---

## 🔐 Authentication & Security

### Authentication Methods
- **Email/Password**: Traditional signup with email confirmation
- **Google OAuth**: One-click social login (configured in Supabase)

### Security Features

#### Row-Level Security (RLS)
All tables have RLS enabled with fine-grained policies:
- **Profiles**: Users can only access their own data
- **Reports**: Public read, authenticated write, owner/admin update
- **Upvotes**: One per user per report, enforced at DB level
- **Roles**: Read-only for users, managed by secure functions

#### Role-Based Access Control
- Roles stored in separate `user_roles` table (not on user object)
- Admin routes protected with `ProtectedRoute` component
- Server-side validation via `has_role()` function
- Prevents client-side role manipulation

#### Best Practices
- ✅ Passwords hashed by Supabase Auth
- ✅ JWTs for session management
- ✅ Auto-refresh tokens
- ✅ HTTPS enforced in production
- ✅ SQL injection prevention via parameterized queries
- ✅ XSS protection via React's built-in escaping

### Auto-Confirm Email (Development)
For rapid testing, email confirmation is auto-enabled. **Disable in production** via Supabase dashboard → Authentication → Settings → Enable email confirmations.

---

## 🌍 Internationalization

CityCare supports **4 languages**:

| Language | Code | Native Name |
|----------|------|-------------|
| English | `en` | English |
| Albanian | `sq` | Shqip |
| Spanish | `es` | Español |
| French | `fr` | Français |

### How It Works

1. **Language Context**: `LanguageContext.tsx` manages current language state
2. **Translation File**: `src/lib/translations.ts` stores all strings
3. **Usage**: `const { t } = useLanguage(); return <h1>{t('home.title')}</h1>;`
4. **Persistence**: Selected language saved to `localStorage`

### Adding New Languages

1. Open `src/lib/translations.ts`
2. Add new language object:
   ```typescript
   export const translations = {
     en: { /* English strings */ },
     sq: { /* Albanian strings */ },
     es: { /* Spanish strings */ },
     fr: { /* French strings */ },
     de: { // NEW: German
       home: {
         title: "Willkommen bei CityCare"
       }
     }
   };
   ```
3. Update `LanguageContext.tsx` type:
   ```typescript
   type Language = "en" | "sq" | "es" | "fr" | "de";
   ```
4. Add language option to switcher in `ProfileDropdown.tsx`

### Translation Keys Structure

```typescript
{
  home: { title, subtitle, ... },
  auth: { login, signup, ... },
  reports: { categories, priorities, status, ... },
  admin: { dashboard, kanban, ... },
  profile: { edit, logout, ... }
}
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Type-check TypeScript
npm run type-check
```

### Code Style Guidelines

#### Component Structure
```typescript
// 1. Imports
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // 4. Hooks
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    onAction();
    setIsOpen(false);
  };

  // 6. Render
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

#### Design System Usage
❌ **WRONG**: Hardcoded colors
```tsx
<div className="bg-blue-500 text-white">
```

✅ **CORRECT**: Use semantic tokens
```tsx
<div className="bg-primary text-primary-foreground">
```

#### File Naming
- Components: `PascalCase.tsx` (e.g., `ReportFlow.tsx`)
- Utilities: `camelCase.ts` (e.g., `translations.ts`)
- Types: `camelCase.ts` (e.g., `report.ts`)
- Hooks: `use-kebab-case.tsx` (e.g., `use-mobile.tsx`)

### Adding New Features

1. **Plan your feature** (context needed, components, state)
2. **Update database schema** if needed (via Supabase migrations)
3. **Create components** in appropriate folders
4. **Add to routing** in `App.tsx`
5. **Update translations** in `translations.ts`
6. **Test thoroughly** (auth, RLS, responsive design)
7. **Update documentation**

---

## 🚀 Deployment

### Deployment

1. Build and deploy the frontend to your chosen hosting provider (for example, run `npm run build` and publish the `/dist` folder).
2. Apply database migrations and server/edge function updates via Supabase or your backend deployment process.
3. Set the required production environment variables in your hosting environment (see the Environment Variables section above).

### Custom Domain Setup

1. Go to **Project → Settings → Domains**
2. Click **"Connect Domain"**
3. Add your domain (e.g., `citycare.com` or `app.citycare.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

> **Note**: Custom domains require a paid Lovable plan.

### Environment Variables for Production

Ensure these are set in your hosting environment:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Build Optimization

```bash
# Production build with optimizations
npm run build

# Output will be in /dist folder
# Includes:
# - Minified JavaScript
# - CSS optimization
# - Asset compression
# - Tree shaking
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=Landing+Page+Screenshot)
*Hero section with feature highlights and portal selection*

---

### Citizen Portal - Report Flow
![Report Location Selection](https://via.placeholder.com/1200x600/10B981/FFFFFF?text=Map+Location+Selection)
*Interactive map for precise location selection*

![Report Details Form](https://via.placeholder.com/1200x600/F59E0B/FFFFFF?text=Report+Details+Form)
*AI-enhanced report submission form*

---

### Admin Command Center - Overview
![Admin Dashboard](https://via.placeholder.com/1200x600/1F2937/FFFFFF?text=Admin+Dashboard+Overview)
*God view map with live statistics*

---

### Admin Command Center - Kanban Board
![Kanban Workflow](https://via.placeholder.com/1200x600/7C3AED/FFFFFF?text=Kanban+Board+Workflow)
*Drag-and-drop ticket management*

---

### Mobile Responsive Design
![Mobile View](https://via.placeholder.com/400x800/EC4899/FFFFFF?text=Mobile+Responsive+View)
*Mobile-optimized citizen portal*

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Dual interface (Citizen + Admin)
- [x] Map-based reporting
- [x] Basic authentication
- [x] Upvoting system
- [x] Kanban workflow
- [x] Multilingual support
- [x] Dark mode

### Phase 2: Enhanced AI 🚀 (Next)
- [ ] Real AI integration (GPT/Gemini)
- [ ] Automatic issue categorization
- [ ] Priority prediction algorithms
- [ ] Sentiment analysis on reports

### Phase 3: Advanced Features 📈
- [ ] Push notifications (web + mobile)
- [ ] In-app messaging between citizens and admins
- [ ] Comment threads on reports
- [ ] File attachments (PDFs, videos)
- [ ] Advanced analytics dashboard
- [ ] Export reports to CSV/PDF

### Phase 4: Scale & Expansion 🌍
- [ ] Multi-city support
- [ ] Native mobile apps (iOS, Android)
- [ ] Integration with city management systems
- [ ] Public API for third-party integrations
- [ ] Predictive maintenance algorithms
- [ ] Offline mode with sync

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Bugs
1. Check if the issue already exists in [Issues](https://github.com/yourusername/citycare/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS)

### Suggesting Features
1. Open a new issue with the **"Feature Request"** label
2. Describe the feature and its benefits
3. Provide use cases and mockups if possible

### Pull Request Process
1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following code style guidelines
4. **Test thoroughly** (auth flows, responsive design, RLS policies)
5. **Commit**: `git commit -m "feat: add awesome feature"`
6. **Push**: `git push origin feature/your-feature-name`
7. **Open a Pull Request** with detailed description

### Development Setup for Contributors
```bash
# Fork and clone
git clone https://github.com/yourusername/citycare.git
cd citycare

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your Supabase credentials

# Start development
npm run dev
```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 CityCare Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Credits & Acknowledgments

### Team
- **Project Lead**: [Dalmat ademi]
- **Frontend Development**: [Dalmat ademi]
- **Backend Development**: [Dalmat ademi]
- **UI/UX Design**: [Dalmat ademi]

### Hackathon
Built for **[digitalschool]** - [Date]

### Icons & Assets
- [Lucide Icons](https://lucide.dev/) - Icon set
- [Unsplash](https://unsplash.com/) - Placeholder images

by dalmat ademi
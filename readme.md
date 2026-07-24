# 🍱 Appa Mess Management System

> **A modern, offline-first Progressive Web Application (PWA) designed for school mess inventory, daily meal logging, student budget tracking, and real-time Google Sheets synchronization.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Installable-purple.svg)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-Synced-0F9D58.svg?logo=googlesheets)

---

## 📌 Project Overview

**Appa Mess Management System** is a collaborative project built to manage daily mess indents, track student meal consumption, monitor daily budgets, and generate monthly financial reports.

Originally modeled after Jawahar Navodaya Vidyalaya (JNV) daily mess indents, this application enables mess supervisors and managers to log daily meals and ingredient consumption offline, evaluate arithmetic quantities on the fly (e.g. `35 + 25`), sync data seamlessly to Google Sheets when online, and export complete monthly summaries to Excel spreadsheet format with a single click.

---

## ✨ Key Features

- 🍲 **Daily Meal & Indent Logger**: Log student dining strength, custom daily menus (Breakfast, Recess, Lunch, Snacks, Dinner), and daily ingredient consumption.
- 🧮 **Live Formula Evaluator**: Supports complex arithmetic expressions inside quantity input fields (e.g. typing `35 + 25` auto-evaluates to `60 kg`).
- 📈 **Real-Time Budget Analytics**: Automatically calculates:
  - **Realized Budget** ($\text{Dining Strength} \times \text{Daily Budget per Head}$)
  - **Consumption Cost** ($\sum \text{Quantity} \times \text{Item Price}$)
  - **Net Daily / Monthly Savings** ($\text{Realized Budget} - \text{Consumption Cost}$)
  - **Average Cost per Student per Day**
- 🛒 **Full Inventory Catalog (67 Items)**: Pre-loaded catalog containing 67 standard mess items with bilingual names (English & Hindi), standard measurement units (`kg`, `lit`, `Pkt`, `Nos`), and category filters.
- ☁️ **Google Sheets Cloud Sync (Notion-like)**: Connects to a Google Sheet via a lightweight Google Apps Script Web App API for cross-device synchronization.
- 📲 **Installable Progressive Web App (PWA)**: Download and install directly onto Android, iOS, Windows, or macOS devices. Works 100% offline.
- 📑 **Offline Excel Exports (.xlsx)**: Generates multi-sheet Excel reports (*Summary* + *Itemized Consumption Breakdown*) offline using SheetJS.
- 🔗 **View-Only Shareable Links**: Generate read-only links for responders/viewers to view monthly reports without editing permissions.
- 🎨 **Glassmorphism UI & Dark Mode**: Modern dark/light theme switching with smooth transitions and responsive drawer navigation.

---

## 📁 Repository & Folder Structure

```
Appa_Project/
├── dist/                     # Production build artifacts (service worker, assets)
├── google-script/
│   └── Code.gs               # Google Apps Script code for Google Sheets sync
├── public/                   # Static assets (icons, PWA manifests)
├── src/
│   ├── assets/               # Image assets and graphics
│   ├── components/           # UI Components
│   │   ├── DailyEntry.jsx    # Log meal menus, student strength & daily indents
│   │   ├── Dashboard.jsx     # Financial summary cards, progress bar & quick checker
│   │   ├── Inventory.jsx     # Inventory price list & item CRUD management
│   │   ├── Layout.jsx        # Glassmorphic shell, sidebar nav & theme toggles
│   │   ├── Reports.jsx       # Monthly/Yearly reporting & Excel export
│   │   └── Settings.jsx      # Google Sheets connection setup & JSON backups
│   ├── context/
│   │   └── AppContext.jsx    # Global state management & offline LocalStorage sync
│   ├── styles/               # CSS modules for components
│   │   ├── DailyEntry.css
│   │   ├── Dashboard.css
│   │   ├── Inventory.css
│   │   ├── Layout.css
│   │   ├── Reports.css
│   │   └── Settings.css
│   ├── utils/
│   │   ├── calculations.js   # Expression evaluator & budget aggregator math
│   │   ├── excelExport.js    # Multi-sheet SheetJS spreadsheet exporter
│   │   └── mockData.js       # Pre-loaded 67-item catalog & sample daily log
│   ├── App.css               # Toast notifications & base layout styles
│   ├── App.jsx               # View router & view-only share link handler
│   ├── index.css             # Glassmorphism design tokens & global CSS variables
│   └── main.jsx              # React DOM entry point
├── .gitignore                # Git ignored files & directories
├── index.html                # Main HTML entry point
├── package.json              # Project dependencies & npm scripts
├── readme.md                 # Project documentation
└── vite.config.js            # Vite build configuration & PWA plugin setup
```

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite 5
- **UI & Icons**: Lucide React Icons, Vanilla CSS Glassmorphism
- **State & Storage**: React Context API, Browser `localStorage`, IndexedDB
- **Offline & PWA**: Service Workers (`vite-plugin-pwa`), Web App Manifest
- **Spreadsheets**: SheetJS (`xlsx`)
- **Backend API**: Google Apps Script (`google-script/Code.gs`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

```bash
node -v
npm -v
```

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Janmejay2005/Appa_project.git
   cd Appa_project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 📊 Setting Up Google Sheets Integration

To enable cloud sync across multiple devices (Notion-like sync):

1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. In the top menu, go to **Extensions** $\rightarrow$ **Apps Script**.
3. Clear any existing code and copy-paste the contents of [`google-script/Code.gs`](file:///c:/Users/HP/Desktop/Project/Appa_Project/google-script/Code.gs).
4. Click **Deploy** (top right) $\rightarrow$ **New deployment**.
   - Select type: **Web app**
   - **Execute as**: *Me*
   - **Who has access**: *Anyone*
5. Click **Deploy**, authorize access, copy the generated **Web App URL**, and paste it into **App Settings** within the web app.

---

## 🌐 Deploying to Production (Free Hosting)

### Deploying on Vercel

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `Appa_project` repository.
4. Keep framework preset as **Vite** and click **Deploy**.

---

## 👥 Contributors & Credits

Developed in collaboration by:
- **Janmejay** (Frontend Engineering & Project Architecture)
- **Omkar**
- **Vansh**

---

## 📄 License

This project is licensed under the MIT License - feel free to modify and adapt it for your mess or cafeteria management needs.

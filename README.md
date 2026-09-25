# SmartClearance — Unified Government Clearance & Single Window Gateway

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E.svg)](https://supabase.com/)

A modern, full-lifecycle digital governance platform streamlining statutory approvals, inter-departmental clearances, document validation, and compliance tracking for businesses, industries, and government officers.

---

## 🏛️ Overview

Setting up and operating an industrial or commercial enterprise traditionally requires navigating multiple disjointed government departments (Fire Department, Pollution Control Board, Electricity Distribution, Factories Inspectorate, Municipal Corporation, etc.).

**SmartClearance** solves this by delivering a unified **Single Window Clearance Gateway**:
- **For Applicants & Entrepreneurs:** One common application docket, document reuse across departments, automatic compliance calendars, and transparent tracking against statutory service level agreements (SLAs).
- **For Government Scrutiny Officers:** An integrated scrutiny console to inspect architectural drawings, issue digital stamps/approvals, and raise structured query requisitions with applicant notifications.

---

## ✨ Key Features

### 🏢 Entrepreneur & Applicant Portal
- **Consolidated Dashboard:** Real-time visibility into overall clearance progress, pending inspections, active subsidies, and risk alerts.
- **My Approvals Register:** Step-by-step statutory progress tracking (Fire NOC, Factory License, MSEDCL Power Feeder, Tree Felling Clearance, Air & Water Consent to Operate).
- **Interactive Approval Navigator:** Guided checklist determining exact clearances required based on industry type, investment size, power requirement, and land classification.
- **Unified Document Vault:** Central repository with digital pre-validation and inter-departmental document reuse to eliminate duplicate submissions.
- **AI-Powered OCR & Auto-Extraction:** Extracts key details (registration IDs, validity dates, authorized signatories) and checks document validity automatically.
- **Gov Schemes & Subsidies:** Direct eligibility calculator and application flow for capital subsidies, electricity duty exemptions, and green industry incentives.
- **Common Inspection Platform:** Synchronized joint-inspections across departments to prevent repetitive physical site visits.
- **Statutory Grievance & SLA Escalation:** Automatic deadline monitoring with 1-click legal escalations to the Appellate Authority if departments breach statutory response timeframes.

### 🛡️ Officer & Scrutiny Console (Admin)
- **Unified Inward Register:** Real-time scrutiny pipeline for departmental nodal officers.
- **Digital Stamping & Sanction:** Instant 1-click statutory approval issuing digital sanction certificates.
- **Deficiency Requisition:** Formal query dispatch system allowing officers to request revised engineering plans or clarifications directly.
- **Dossier Inspection Viewer:** High-fidelity document viewer inspecting UIDAI / MCA pre-validated attachments.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons
- **State Management:** React Context API with persistent synchronized storage
- **Backend & Cloud Storage:** Supabase (PostgreSQL database & Storage Buckets)
- **Deployment Ready:** Vercel, Netlify, Cloud Run, Docker

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `bun` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/smart-clearance.git
   cd smart-clearance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials (optional for local mock testing, required for live cloud document storage):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_SUPABASE_STORAGE_BUCKET=documents
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Accounts

You can test both user roles directly from the login gateway:

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Applicant / Business** | `entrepreneur@industry.com` | *(any 4+ chars)* | Full Entrepreneur Dashboard, Clearance Navigator, Subsidies |
| **Statutory Officer** | `officer@singlewindow.gov.in` | *(any 4+ chars)* | Department Scrutiny Console, Digital Approvals & Query Desk |

*(Demo accounts are pre-filled on the login screen for 1-click testing)*

---

## 🗄️ Supabase Storage Setup (2 Minutes)

To enable live file uploads directly to Supabase Storage:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Storage** > Click **New Bucket**.
3. Name the bucket **`documents`** and toggle **Public Bucket** to **ON**.
4. In your project settings, copy your **Project URL** and **anon public key**.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` or Vercel environment variables.

---

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Under **Settings > Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

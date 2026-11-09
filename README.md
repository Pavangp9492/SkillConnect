# SkillConnect – Community Skill-Building Workshop Management System

SkillConnect is a full-stack, responsive web application designed to help village and local community members discover, explore, and register for skill-building workshops. It empowers rural youth, women self-help groups, farmers, and elders with essential skills—ranging from basic computer training and digital literacy to organic agriculture, tailoring, and small business entrepreneurship.

The platform provides a public portal for community participants to register in 1 minute with instant pass generation, and a secure administrator dashboard for organizers to manage workshops, monitor registrations, and track real-time attendance.

---

## 🚀 Live Demo & Key Highlights

- **Palette**: Professional green-and-white theme (#16834A Primary Green, #105C35 Dark Green, #EAF7EF Light Green, #F7FAF8 Clean Background).
- **Zero-Barrier Community UX**: Large touch targets (48px+), clear labels, mobile responsiveness, and simple language suitable for village users.
- **Dual Engine Architecture**: Works seamlessly out of the box with built-in Demo Mode, and automatically switches to live Cloud Supabase PostgreSQL & Auth once credentials are provided in `.env`.
- **Atomic Concurrency Protection**: Race-condition-safe registration function prevents overbooking beyond seat capacity and rejects duplicate registrations with the same email.

---

## 🛠️ Technology Stack

- **Frontend**: React (JavaScript only, no TypeScript)
- **Tooling & Bundling**: Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS with custom community color extensions
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, RPC functions, Supabase Auth)
- **Deployment**: Vercel ready (`vercel.json` SPA rewrites pre-configured)
- **Testing**: Built-in Node test runner (`node --test`)

---

## 📁 Project Structure

```
SkillConnect/
├── public/
│   └── favicon.svg               # Brand community icon
├── src/
│   ├── components/
│   │   ├── DemoBanner.jsx        # Demo mode helper & 1-click test login
│   │   ├── Footer.jsx            # Community links, categories, helpline
│   │   ├── Navbar.jsx            # Responsive navigation & admin shortcuts
│   │   ├── ProtectedRoute.jsx    # Client-side admin auth gatekeeper
│   │   └── WorkshopCard.jsx      # Workshop item card with seat status
│   ├── context/
│   │   ├── AuthContext.jsx       # Supabase Auth & demo admin session state
│   │   └── WorkshopContext.jsx   # Workshop CRUD, registrations & attendance
│   ├── lib/
│   │   └── supabase.js           # Supabase client setup & sample seed data
│   ├── pages/
│   │   ├── AdminDashboard.jsx    # Metric summaries, occupancy & quick tools
│   │   ├── AdminLoginPage.jsx    # Secure admin auth gateway
│   │   ├── HomePage.jsx          # Hero, categories, featured, how it works
│   │   ├── ManageRegistrationsPage.jsx # Search, filter, attendance & CSV export
│   │   ├── ManageWorkshopsPage.jsx     # Add, edit, delete workshops with validation
│   │   ├── NotFoundPage.jsx      # 404 handler
│   │   ├── RegisterPage.jsx      # Participant registration & printable pass
│   │   └── WorkshopsPage.jsx     # Full directory with keyword & category filters
│   ├── App.jsx                   # Route layout and providers
│   ├── index.css                 # Tailwind base directives and theme styles
│   └── main.jsx                  # React application entry point
├── supabase/
│   ├── schema.sql                # Complete PostgreSQL schema, RLS policies & RPC
│   └── seed.sql                  # 6 demonstration workshops and sample registrants
├── test/
│   └── workshopLogic.test.js     # Automated unit tests for validation & capacity
├── .env.example                  # Environment variable reference
├── .env                          # Local environment variables
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind theme configuration
├── postcss.config.js             # PostCSS plugins
├── vercel.json                   # Vercel SPA routing rewrites
└── README.md                     # Documentation and setup guide
```

---

## 💻 1. How to Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed. In your terminal inside the project root folder:

```bash
npm install
```

---

## 🏃 2. How to Run the Project Locally

To start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to the printed local URL (typically `http://localhost:5173`).

To run the automated validation tests:

```bash
npm test
```

To build for production:

```bash
npm run build
```

---

## 🗄️ 3. How to Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"**.
3. Choose an organization, enter a project name (e.g. `skillconnect-db`), and generate a strong database password.
4. Select your preferred region (closest to your users) and click **"Create new project"**.
5. Wait 1–2 minutes for the database to provision.

---

## 📜 4. How to Execute the SQL Schema

1. In your Supabase Project Dashboard, click on **SQL Editor** in the left sidebar (icon with `>_`).
2. Click **"New query"**.
3. Open the file `supabase/schema.sql` from this project, copy the entire contents, and paste it into the Supabase SQL Editor.
4. Click **"Run"** (or press `Ctrl + Enter`).
   - This creates the `profiles`, `workshops`, and `registrations` tables.
   - It sets up Row Level Security (RLS) policies protecting participant privacy.
   - It deploys the atomic `register_for_workshop` SQL function and user signup trigger.
5. (Optional but recommended) Click **"New query"** again, open `supabase/seed.sql`, paste its content, and click **"Run"** to populate the 6 community demonstration workshops.

---

## 🔑 5. How to Configure Environment Variables

1. In your Supabase Project Dashboard, click the gear icon (**Project Settings**) in the bottom left, then navigate to **API**.
2. Find the following two values:
   - **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - **Project API Keys** -> `anon` / `public` (starts with `ey...`)
3. Open or create the `.env` file in the root of your `SkillConnect` folder:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-api-key-here
```

4. Restart your development server (`npm run dev`) so Vite loads the new variables.

> **Note**: If `.env` is empty or contains placeholder text, the app automatically runs in **Demonstration Mode**, allowing you to test every single feature (workshop browsing, registration with pass printing, admin login, workshop CRUD, and attendance marking) using local persistent storage.

---

## 🛡️ 6. How to Create the First Administrator Securely

Because public admin registration is disabled to maintain community security, administrators must be provisioned through Supabase:

### Method A: Via Supabase Dashboard (Recommended)

1. In Supabase, go to **Authentication** -> **Users** -> Click **"Add user"** -> **"Create user"**.
2. Enter the administrator's email (e.g. `admin@skillconnect.org`) and set a secure password.
3. Check the box to auto-confirm user email.
4. Go to **SQL Editor** and run the following command to promote that user to `admin` in the `profiles` table:

```sql
-- Option 1: Use the secure built-in assignment function
SELECT public.assign_admin_role('admin@skillconnect.org');

-- Option 2: Direct SQL update
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@skillconnect.org'
);
```

### Method B: Testing in Demo Mode

If you are evaluating the app locally before connecting to Supabase:
- Navigate to `/admin/login`
- Click the **"1-Click Demo Login"** button, or enter:
  - **Email**: `admin@skillconnect.org`
  - **Password**: `admin123`

---

## ☁️ 7. How to Deploy to Vercel

### Option 1: Via Vercel Web Dashboard (Easiest)

1. Push your project to a GitHub or GitLab repository.
2. Sign in to [https://vercel.com](https://vercel.com).
3. Click **"Add New..."** -> **"Project"**.
4. Import your `SkillConnect` repository.
5. Framework Preset will automatically detect **Vite**.
6. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
7. Click **"Deploy"**.

### Option 2: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the command line prompts.

> The project includes a configured `vercel.json` file which routes all paths (`/workshops`, `/admin`, etc.) to `/index.html` for single-page application (SPA) client-side routing.

---

## 🌐 8. How to Configure Environment Variables in Vercel

If you already deployed your project to Vercel and want to add or update your Supabase credentials:

1. Open your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL (e.g. `https://xyz.supabase.co`)
   - **Environments**: Select Production, Preview, and Development.
4. Add the second variable:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anonymous public key
   - **Environments**: Select Production, Preview, and Development.
5. Click **"Save"**.
6. Go to the **Deployments** tab, click the three dots (`...`) on the latest deployment, and click **"Redeploy"** so the environment variables are injected into the build.

---

## 👥 User Roles & Access Matrix

| Feature | Public Visitor / Participant | Administrator |
| :--- | :---: | :---: |
| Browse & search workshops | ✅ | ✅ |
| Filter workshops by domain / availability | ✅ | ✅ |
| View detailed workshop syllabus & venue | ✅ | ✅ |
| Submit registration & receive digital pass | ✅ | ✅ |
| Access Admin Dashboard & statistics | ❌ | ✅ |
| Create, update & delete workshops | ❌ | ✅ |
| View participant registrations & contact details | ❌ | ✅ |
| Mark participant attendance (Present / Absent) | ❌ | ✅ |
| Export CSV attendance roll-call sheet | ❌ | ✅ |

---

## 🔒 Security Architecture

1. **Row Level Security (RLS)**: Enforced directly on PostgreSQL. Public anonymous users can only insert registrations and view public workshop listings.
2. **Participant Privacy**: Public users cannot query other participants' names, phones, or email addresses.
3. **No Service-Role Key**: Only the anonymous public key (`anon_key`) is used in the frontend. Privileged operations are guarded by `auth.uid()` checks against the `profiles` table.
4. **Overbooking Prevention**: The database function `register_for_workshop` performs row locking on the workshop record, verifies remaining seat count, and enforces email uniqueness atomically.

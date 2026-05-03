# 🚀 LHY Mashrafe — Portfolio Deployment Guide
### (সম্পূর্ণ বাংলায় — শুরু থেকে শেষ পর্যন্ত)

---

## 📋 এই গাইডে কী কী আছে?

| ধাপ | বিষয় |
|-----|-------|
| ১ | প্রজেক্ট স্ট্রাকচার বোঝো |
| ২ | GitHub-এ আপলোড করো |
| ৩ | Netlify-তে Frontend Deploy করো |
| ৪ | Render.com-এ Backend Deploy করো |
| ৫ | Render-এ Database (PostgreSQL) যোগ করো |
| ৬ | Frontend ও Backend একসাথে কানেক্ট করো |
| ৭ | Admin Panel ব্যবহার করো |

---

## 🗂️ ধাপ ১ — প্রজেক্ট স্ট্রাকচার বোঝো

তোমার পুরো প্রজেক্ট এরকম দেখতে:

```
workspace/                          ← মূল ফোল্ডার (এটাই GitHub-এ যাবে)
│
├── artifacts/
│   ├── portfolio/                  ← 🌐 FRONTEND (Netlify-তে যাবে)
│   │   ├── src/                    ← সব React কোড এখানে
│   │   │   ├── pages/              ← Home, Admin পেজ
│   │   │   ├── components/         ← Hero, About, Skills ইত্যাদি
│   │   │   ├── context/            ← AdminContext (localStorage)
│   │   │   ├── data/               ← initialData.ts (ডিফল্ট ডেটা)
│   │   │   └── lib/                ← api.ts, credentials.ts
│   │   ├── public/                 ← favicon, _redirects ফাইল
│   │   ├── netlify.toml            ← Netlify কনফিগ (ছুঁয়ো না)
│   │   ├── .env.example            ← কোন env variable লাগবে দেখো
│   │   └── package.json
│   │
│   └── api-server/                 ← ⚙️ BACKEND (Render.com-তে যাবে)
│       ├── src/
│       │   ├── app.ts              ← Express server + CORS সেটআপ
│       │   ├── index.ts            ← Server শুরু হয় এখান থেকে
│       │   └── routes/             ← API routes
│       ├── .env.example            ← Backend-এর env variables
│       └── package.json
│
├── README.md                       ← এই ফাইল
└── pnpm-workspace.yaml
```

> **মনে রাখো:** `portfolio/` ফোল্ডারটা সম্পূর্ণ static — মানে এটা একাই কাজ করে, কোনো backend ছাড়াই। তোমার সব পোর্টফোলিও ডেটা browser-এর localStorage-এ সেভ হয়।

---

## 📦 ধাপ ২ — GitHub-এ আপলোড করো

### ২.১ — GitHub Account তৈরি করো
1. [github.com](https://github.com) যাও
2. **Sign up** করো (যদি না থাকে)
3. Email verify করো

### ২.২ — নতুন Repository তৈরি করো
1. GitHub-এ লগইন করার পর উপরে ডান দিকে **"+"** বাটনে ক্লিক করো
2. **"New repository"** বেছে নাও
3. নিচের মতো পূরণ করো:
   - **Repository name:** `lhy-mashrafe-portfolio`
   - **Description:** My personal developer portfolio
   - **Public** বেছে নাও (Netlify free plan-এর জন্য দরকার)
   - **"Add a README file"** — এই টিক দিও না (আমাদের নিজেরটা আছে)
4. **"Create repository"** বাটনে ক্লিক করো

### ২.৩ — Replit থেকে GitHub-এ Push করো

Replit-এর বাম দিকে **Git** আইকনে ক্লিক করো, তারপর:

```
1. "Connect to GitHub" বাটনে ক্লিক করো
2. GitHub account authorize করো
3. তোমার নতুন repository বেছে নাও
4. "Push" বাটনে ক্লিক করো
```

অথবা Replit Shell-এ এই কমান্ডগুলো দাও:

```bash
git init
git add .
git commit -m "Initial commit - LHY Portfolio"
git branch -M main
git remote add origin https://github.com/তোমার-username/lhy-mashrafe-portfolio.git
git push -u origin main
```

> ✅ **চেক করো:** GitHub-এ গিয়ে দেখো ফাইলগুলো উঠেছে কিনা।

---

## 🌐 ধাপ ৩ — Netlify-তে Frontend Deploy করো

### ৩.১ — Netlify Account তৈরি করো
1. [netlify.com](https://netlify.com) যাও
2. **"Sign up"** → **"Sign up with GitHub"** — এটা বেছে নাও (সহজ হবে)
3. GitHub account দিয়ে লগইন করো

### ৩.২ — নতুন Site তৈরি করো
1. Netlify Dashboard-এ **"Add new site"** বাটনে ক্লিক করো
2. **"Import an existing project"** বেছে নাও
3. **"Deploy with GitHub"** ক্লিক করো
4. তোমার `lhy-mashrafe-portfolio` repository বেছে নাও

### ৩.৩ — Build Settings পূরণ করো

Netlify স্বয়ংক্রিয়ভাবে `netlify.toml` পড়ে সেটআপ করে নেবে। তবুও একবার চেক করো:

| Setting | Value |
|---------|-------|
| Base directory | `artifacts/portfolio` |
| Build command | `npm install && npx vite build` |
| Publish directory | `dist` |

### ৩.৪ — Environment Variable যোগ করো (ঐচ্ছিক)

যদি তুমি Backend connect করতে চাও, তাহলে:
1. **"Environment variables"** সেকশনে যাও
2. **"Add variable"** ক্লিক করো
3. পূরণ করো:
   - Key: `VITE_API_URL`
   - Value: (এখনো খালি রাখো, পরে Render থেকে URL পেলে দেবে)

### ৩.৫ — Deploy করো
1. **"Deploy site"** বাটনে ক্লিক করো
2. ২-৩ মিনিট অপেক্ষা করো
3. ✅ Deploy হলে তুমি পাবে: `https://random-name.netlify.app`

### ৩.৬ — Custom Domain যোগ করো (ঐচ্ছিক)
1. **Site settings → Domain management → Add custom domain**
2. তোমার domain name দাও (যেমন: `lhymashrafe.com`)
3. Netlify-এর DNS instructions follow করো

---

## ⚙️ ধাপ ৪ — Render.com-এ Backend Deploy করো

> **নোট:** তোমার portfolio এখন backend ছাড়াই কাজ করে। এই ধাপটা শুধু তখন দরকার যখন তুমি real database বা server features যোগ করবে।

### ৪.১ — Render Account তৈরি করো
1. [render.com](https://render.com) যাও
2. **"Get Started for Free"** ক্লিক করো
3. **"Continue with GitHub"** বেছে নাও (সহজ হবে)

### ৪.২ — নতুন Web Service তৈরি করো
1. Dashboard-এ **"New +"** বাটন ক্লিক করো
2. **"Web Service"** বেছে নাও
3. **"Connect a repository"** → তোমার `lhy-mashrafe-portfolio` বেছে নাও

### ৪.৩ — Service Settings পূরণ করো

| Setting | Value |
|---------|-------|
| Name | `lhy-api-server` |
| Root Directory | `artifacts/api-server` |
| Environment | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/index.mjs` |
| Instance Type | Free |

### ৪.৪ — Environment Variables যোগ করো
**"Environment"** সেকশনে নিচের variables যোগ করো:

| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | যেকোনো লম্বা random text (যেমন: `mySecretKey2024@Portfolio!`) |
| `ALLOWED_ORIGIN` | `https://তোমার-সাইট.netlify.app` |
| `DATABASE_URL` | (পরে যোগ করবে — ধাপ ৫-এ) |

### ৪.৫ — Deploy করো
1. **"Create Web Service"** বাটনে ক্লিক করো
2. ৫-১০ মিনিট অপেক্ষা করো
3. ✅ Deploy হলে পাবে: `https://lhy-api-server.onrender.com`

---

## 🗄️ ধাপ ৫ — Render-এ Database (PostgreSQL) যোগ করো

### ৫.১ — নতুন Database তৈরি করো
1. Render Dashboard → **"New +"** → **"PostgreSQL"**
2. পূরণ করো:
   - **Name:** `lhy-portfolio-db`
   - **Region:** Singapore (Asia-তে কাছের)
   - **Plan:** Free
3. **"Create Database"** ক্লিক করো

### ৫.২ — Database URL কপি করো
1. Database তৈরি হলে তার পেজে যাও
2. **"Connections"** সেকশন খোঁজো
3. **"Internal Database URL"** কপি করো
   - এটা দেখতে এরকম: `postgresql://user:password@hostname/dbname`

### ৫.৩ — Backend-এ Database URL যোগ করো
1. তোমার **Web Service** (api-server)-এ যাও
2. **"Environment"** ট্যাবে ক্লিক করো
3. `DATABASE_URL` variable-এ কপি করা URL paste করো
4. **"Save Changes"** ক্লিক করো
5. Render স্বয়ংক্রিয়ভাবে service restart করবে

---

## 🔗 ধাপ ৬ — Frontend ও Backend কানেক্ট করো

### ৬.১ — Netlify-তে Backend URL যোগ করো
1. Netlify Dashboard → তোমার site → **"Site configuration"**
2. **"Environment variables"** → **"Add a variable"**
3. পূরণ করো:
   - Key: `VITE_API_URL`
   - Value: `https://lhy-api-server.onrender.com`
4. **"Save"** ক্লিক করো

### ৬.২ — Netlify Redeploy করো
1. **"Deploys"** ট্যাবে যাও
2. **"Trigger deploy"** → **"Deploy site"** ক্লিক করো
3. ২-৩ মিনিট অপেক্ষা করো

### ৬.৩ — Backend-এ Netlify URL যোগ করো
1. Render → তোমার Web Service → **"Environment"**
2. `ALLOWED_ORIGIN` value আপডেট করো:
   - পুরানো: `https://random-name.netlify.app`
   - নতুন: তোমার actual Netlify URL
3. **"Save Changes"**

✅ এখন Frontend ও Backend একসাথে কাজ করবে!

---

## 🔐 ধাপ ৭ — Admin Panel ব্যবহার করো

তোমার portfolio-তে একটা secret admin panel আছে।

### Admin Panel-এ ঢোকার উপায়:
```
URL: https://তোমার-সাইট.netlify.app/admin-itxlhy
```

### Default Login:
| Field | Value |
|-------|-------|
| Username | `ITXLHY` |
| Password | `ItxLhy2008@#` |

### যদি Password ভুলে যাও:
Master Recovery Key: `ABCXYZ019123098ITXLHY_@#!?`

### Admin Panel-এ যা করতে পারবে:
- ✏️ Profile তথ্য পরিবর্তন করা
- 🖼️ Profile ছবি আপলোড করা
- 📁 Projects যোগ/বাদ দেওয়া
- 💡 Skills আপডেট করা
- 💼 Experience যোগ করা
- 📨 Contact Form-এর Messages দেখা
- 🔑 Username ও Password পরিবর্তন করা

---

## ⌨️ বোনাস — Keyboard Shortcut

| Shortcut | কাজ |
|----------|-----|
| `Ctrl + K` (Windows) বা `⌘ + K` (Mac) | Command Palette খোলো — যেকোনো section-এ লাফ দাও |

---

## ❓ সাধারণ সমস্যা ও সমাধান

### সমস্যা: Netlify deploy হচ্ছে না
**সমাধান:**
1. Netlify Dashboard → Deploys → Build log দেখো
2. Error message খোঁজো
3. Build command ঠিক আছে কিনা চেক করো: `npm install && npx vite build`

### সমস্যা: Admin panel-এ ঢুকতে পারছি না
**সমাধান:**
1. URL ঠিক আছে কিনা দেখো: `/admin-itxlhy` (হাইফেন আছে)
2. Default password চেষ্টা করো: `ItxLhy2008@#`
3. Recovery key ব্যবহার করো: `ABCXYZ019123098ITXLHY_@#!?`
4. Browser-এর localStorage clear করো (settings → clear site data)

### সমস্যা: Render backend "Service Unavailable"
**সমাধান:**
1. Free plan-এ Render service ১৫ মিনিট idle থাকলে ঘুমিয়ে পড়ে
2. প্রথম request-এ ৩০-৬০ সেকেন্ড সময় লাগে জেগে উঠতে
3. এটা normal — paid plan-এ এই সমস্যা থাকে না

### সমস্যা: সাইটে পরিবর্তন দেখা যাচ্ছে না
**সমাধান:**
1. GitHub-এ push হয়েছে কিনা চেক করো
2. Netlify Dashboard-এ latest deploy সফল হয়েছে কিনা দেখো
3. Browser-এ `Ctrl + Shift + R` (hard refresh) দাও

### সমস্যা: Admin-এ ছবি আপলোড কাজ করছে না
**সমাধান:**
1. ছবির size ৫MB-এর কম রাখো
2. Format: JPG, PNG, WebP যেকোনো একটা
3. Browser-এর localStorage limit পূর্ণ হয়ে যেতে পারে — পুরানো ডেটা clear করো

---

## 📁 GitHub-এ কোন ফাইলগুলো যাবে?

সব ফাইলই GitHub-এ যাবে। শুধু এই ফাইলগুলো যাবে না (`.gitignore`-এ থাকে):

```
node_modules/          ← যাবে না (বড়, automatically install হয়)
dist/                  ← যাবে না (build করলে তৈরি হয়)
.env                   ← যাবে না (secret তথ্য থাকে)
```

---

## 🛠️ Tech Stack (কী দিয়ে বানানো)

| অংশ | Technology |
|-----|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D Graphics | Three.js + React Three Fiber |
| Routing | Wouter |
| Data Storage | Browser localStorage |
| Backend | Express.js 5 |
| Database | PostgreSQL + Drizzle ORM |
| Frontend Host | Netlify (Free) |
| Backend Host | Render.com (Free) |
| Database Host | Render.com PostgreSQL (Free) |

---

## 📞 যোগাযোগ

**LHY Mashrafe**
- Portfolio: [তোমার Netlify URL]
- GitHub: [তোমার GitHub profile]
- Admin: `/admin-itxlhy`

---

*এই README বাংলায় লেখা হয়েছে কারণ তুমি নতুন এবং বাংলায় সহজে বুঝতে পারবে। যেকোনো সমস্যায় উপরের troubleshooting সেকশন দেখো।*

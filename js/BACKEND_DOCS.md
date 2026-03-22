# 🎓 Luminaris University — Backend Documentation

> **Runtime:** Node.js + Express.js
> **Database:** MongoDB (local) + Mongoose ODM
> **Auth:** JWT (JSON Web Tokens) + bcryptjs
> **Email:** Nodemailer + Gmail SMTP
> **Port:** 5000
> **DB Name:** luminaris

---

## 🗂️ Complete File Structure
```
luminaris-university/
└── backend/
    ├── server.js                        ← Entry point
    ├── seed.js                          ← Creates admin + sample data
    ├── .env                             ← Environment secrets
    ├── package.json                     ← Dependencies
    ├── node_modules/                    ← Installed packages
    │
    ├── config/
    │   ├── db.js                        ← MongoDB connection
    │   └── nodemailer.js                ← Email transporter + sendEmail()
    │
    ├── models/
    │   ├── User.js                      ← User schema
    │   ├── Application.js               ← Admission application schema
    │   ├── News.js                      ← News article schema
    │   └── Enquiry.js                   ← Contact enquiry schema
    │
    ├── middleware/
    │   ├── auth.js                      ← JWT protection middleware
    │   └── adminOnly.js                 ← Admin role guard middleware
    │
    ├── controllers/
    │   ├── authController.js            ← Auth logic
    │   ├── applicationController.js     ← Application logic
    │   ├── newsController.js            ← News logic
    │   └── contactController.js         ← Contact/enquiry logic
    │
    └── routes/
        ├── auth.js                      ← Auth endpoints
        ├── applications.js              ← Application endpoints
        ├── news.js                      ← News endpoints
        ├── contact.js                   ← Contact endpoints
        └── admin.js                     ← Admin dashboard endpoints
```

---

## ⚙️ Environment Variables (.env)

| Variable | Value | Purpose |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/luminaris` | MongoDB connection string |
| `JWT_SECRET` | `luminaris_super_secret_jwt_key_2025` | JWT signing secret |
| `JWT_EXPIRE` | `7d` | Token expiry duration |
| `EMAIL_USER` | `spiritx98@gmail.com` | Gmail sender address |
| `EMAIL_PASS` | `(app password)` | Gmail app password (16 chars, no spaces) |
| `EMAIL_FROM` | `Luminaris University <email>` | Email display name |
| `CLIENT_URL` | `http://127.0.0.1:5500` | Frontend URL for CORS |

> ⚠️ Never commit `.env` to git. Add it to `.gitignore`

---

## 📦 Installed Packages

| Package | Version | Purpose |
|---|---|---|
| `express` | latest | Web framework |
| `mongoose` | latest | MongoDB ODM |
| `dotenv` | latest | Environment variables |
| `bcryptjs` | latest | Password hashing |
| `jsonwebtoken` | latest | JWT auth tokens |
| `nodemailer` | latest | Email sending |
| `multer` | latest | File uploads (future use) |
| `cors` | latest | Cross-origin requests |
| `express-validator` | latest | Input validation |

Install command:
```
npm install express mongoose dotenv bcryptjs jsonwebtoken nodemailer multer cors express-validator
```

---

## 🗄️ Database Models

### User Model — `models/User.js`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, max 50 chars |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, min 6 chars, hashed, hidden from queries |
| `role` | String | enum: `student` / `admin`, default: `student` |
| `avatar` | String | Profile image URL |
| `phone` | String | Optional |
| `country` | String | Optional |
| `isActive` | Boolean | Default: true, used to deactivate accounts |
| `lastLogin` | Date | Updated on each login |
| `createdAt` | Date | Auto timestamp |
| `updatedAt` | Date | Auto timestamp |

**Methods:**
```
matchPassword(enteredPassword) → bcrypt.compare → Boolean
getSignedJWT()                 → jwt.sign → token string
```

**Pre-save hook:**
```
Hashes password with bcrypt (salt rounds: 10)
Only runs when password field is modified
```

---

### Application Model — `models/Application.js`

| Field | Type | Notes |
|---|---|---|
| `firstName` | String | Required |
| `lastName` | String | Required |
| `email` | String | Required |
| `phone` | String | Required |
| `dateOfBirth` | Date | Optional |
| `nationality` | String | Optional |
| `address` | String | Optional |
| `faculty` | String | Required, enum of 8 faculties |
| `program` | String | Required |
| `level` | String | Required: undergraduate/postgraduate/phd |
| `startYear` | String | Default: 2025 |
| `personalStatement` | String | Required, min 10 chars |
| `previousQualification` | String | Optional |
| `englishScore` | String | Optional |
| `status` | String | pending/reviewing/approved/rejected/waitlisted |
| `adminNotes` | String | Notes from admin on decision |
| `reviewedBy` | ObjectId | Ref to User (admin) |
| `reviewedAt` | Date | When reviewed |
| `applicationRef` | String | Auto-generated e.g. LUM-2025-123456 |

**Pre-save hook:**
```
Auto-generates applicationRef: LUM-{year}-{random6digits}
Only generates if not already set
```

---

### News Model — `models/News.js`

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required, max 200 chars |
| `slug` | String | Auto-generated from title, unique |
| `category` | String | Research/Campus/Awards/Events/Academic/Sports/International |
| `excerpt` | String | Required, max 300 chars |
| `body` | String | Required, full article HTML/text |
| `image` | String | Image URL, defaults to Unsplash placeholder |
| `author` | ObjectId | Ref to User |
| `authorName` | String | Display name |
| `tags` | [String] | Array of tag strings |
| `isPublished` | Boolean | Default: true |
| `views` | Number | Incremented on each article fetch |
| `publishedAt` | Date | Default: now |

**Pre-save hook:**
```
Auto-generates slug from title:
  lowercase → remove special chars → replace spaces with - → append timestamp
```

---

### Enquiry Model — `models/Enquiry.js`

| Field | Type | Notes |
|---|---|---|
| `firstName` | String | Required |
| `lastName` | String | Required |
| `email` | String | Required |
| `phone` | String | Optional |
| `department` | String | Admissions/Academic/Student Services/Research/Finance/Press/Other |
| `subject` | String | Required, max 200 chars |
| `message` | String | Required, min 10 chars |
| `isRead` | Boolean | Default: false |
| `isReplied` | Boolean | Default: false |
| `repliedAt` | Date | When replied |
| `repliedBy` | ObjectId | Ref to User (admin) |
| `priority` | String | low/medium/high, default: medium |

---

## 🔐 Middleware

### `middleware/auth.js` — JWT Protection
```
1. Reads Authorization header: "Bearer <token>"
2. Returns 401 if no token
3. Verifies token with JWT_SECRET
4. Finds user by decoded id
5. Returns 401 if user not found or deactivated
6. Attaches user to req.user
7. Calls next()
```

### `middleware/adminOnly.js` — Admin Guard
```
1. Checks req.user exists
2. Checks req.user.role === 'admin'
3. Returns 403 if not admin
4. Calls next() if admin
```

**Usage pattern:**
```js
router.get('/protected',   protect, getMe);
router.get('/admin-only',  protect, adminOnly, getStats);
```

---

## 🎮 Controllers

### `authController.js`

| Function | Method | Route | Access |
|---|---|---|---|
| `register` | POST | `/api/auth/register` | Public |
| `login` | POST | `/api/auth/login` | Public |
| `getMe` | GET | `/api/auth/me` | Protected |
| `updateProfile` | PUT | `/api/auth/me` | Protected |
| `changePassword` | PUT | `/api/auth/password` | Protected |

**register() flow:**
```
1. Check if email already exists
2. Create user (password auto-hashed by pre-save hook)
3. Send welcome email via nodemailer
4. Return JWT token + user object
```

**login() flow:**
```
1. Validate email + password provided
2. Find user with password field (select: false bypass)
3. bcrypt.compare entered password vs hash
4. Update lastLogin timestamp
5. Return JWT token + user object
```

---

### `applicationController.js`

| Function | Method | Route | Access |
|---|---|---|---|
| `submitApplication` | POST | `/api/applications` | Public |
| `getApplications` | GET | `/api/applications` | Admin |
| `getApplication` | GET | `/api/applications/:id` | Admin |
| `updateApplication` | PATCH | `/api/applications/:id` | Admin |
| `deleteApplication` | DELETE | `/api/applications/:id` | Admin |

**submitApplication() flow:**
```
1. Check for duplicate (same email + program + level)
2. Create application (ref auto-generated)
3. Send confirmation email to applicant with summary
4. Send notification email to admin
5. Return success + applicationRef
```

**updateApplication() flow:**
```
1. Update status + adminNotes + reviewedBy + reviewedAt
2. Send status update email to applicant
   → approved:   green congratulations email
   → rejected:   empathetic rejection email
   → reviewing:  update email
   → waitlisted: waitlist email
3. Return updated application
```

**Query filters supported:**
```
?status=pending
?faculty=Sciences & Engineering
?level=undergraduate
?search=john (searches name, email, program, ref)
?page=1&limit=20
```

---

### `newsController.js`

| Function | Method | Route | Access |
|---|---|---|---|
| `getAllNews` | GET | `/api/news` | Public |
| `getNewsArticle` | GET | `/api/news/:slug` | Public |
| `createNews` | POST | `/api/news` | Admin |
| `updateNews` | PUT | `/api/news/:id` | Admin |
| `deleteNews` | DELETE | `/api/news/:id` | Admin |

**getAllNews() filters:**
```
?category=Research
?search=cancer
?page=1&limit=9
Returns: articles without body field (lightweight)
```

**getNewsArticle():**
```
Finds by slug (SEO-friendly URL)
Increments views counter
Returns full article with body
```

---

### `contactController.js`

| Function | Method | Route | Access |
|---|---|---|---|
| `submitEnquiry` | POST | `/api/contact` | Public |
| `getEnquiries` | GET | `/api/contact` | Admin |
| `markAsRead` | PATCH | `/api/contact/:id/read` | Admin |
| `deleteEnquiry` | DELETE | `/api/contact/:id` | Admin |

**submitEnquiry() flow:**
```
1. Validate required fields
2. Save enquiry to MongoDB
3. Send notification email to admin (styled HTML)
4. Send confirmation email to user (styled HTML)
5. Return success message
```

---

## 🔌 API Routes Reference

### Auth Routes — `/api/auth`
```
POST   /api/auth/register    → Register new student account
POST   /api/auth/login       → Login → returns JWT token
GET    /api/auth/me          → Get logged in user (🔒 protected)
PUT    /api/auth/me          → Update profile (🔒 protected)
PUT    /api/auth/password    → Change password (🔒 protected)
```

### Application Routes — `/api/applications`
```
POST   /api/applications         → Submit application (public)
GET    /api/applications         → Get all applications (🔒 admin)
GET    /api/applications/:id     → Get one application (🔒 admin)
PATCH  /api/applications/:id     → Update status (🔒 admin)
DELETE /api/applications/:id     → Delete application (🔒 admin)
```

### News Routes — `/api/news`
```
GET    /api/news             → Get all published articles (public)
GET    /api/news/:slug       → Get one article by slug (public)
POST   /api/news             → Create article (🔒 admin)
PUT    /api/news/:id         → Update article (🔒 admin)
DELETE /api/news/:id         → Delete article (🔒 admin)
```

### Contact Routes — `/api/contact`
```
POST   /api/contact              → Submit enquiry (public)
GET    /api/contact              → Get all enquiries (🔒 admin)
PATCH  /api/contact/:id/read     → Mark as read (🔒 admin)
DELETE /api/contact/:id          → Delete enquiry (🔒 admin)
```

### Admin Routes — `/api/admin`
```
GET    /api/admin/stats          → Dashboard statistics (🔒 admin)
GET    /api/admin/users          → Get all students (🔒 admin)
PATCH  /api/admin/users/:id/toggle → Activate/deactivate user (🔒 admin)
```

---

## 📊 Admin Stats Response
```json
{
  "success": true,
  "data": {
    "applications": {
      "total": 0,
      "pending": 0,
      "approved": 0,
      "rejected": 0,
      "reviewing": 0
    },
    "enquiries": {
      "total": 2,
      "unread": 2
    },
    "news": {
      "total": 3
    },
    "users": {
      "total": 0
    },
    "charts": {
      "byFaculty": [],
      "byLevel": []
    },
    "recent": {
      "applications": [],
      "enquiries": []
    }
  }
}
```

---

## 📧 Email Templates

All emails are styled HTML with:
- Navy `#0b1628` background
- Gold `#c9a84c` headings and accents
- Responsive single-column layout

| Trigger | Recipients | Content |
|---|---|---|
| User registers | New user | Welcome email with login link |
| Contact form submitted | Admin + User | Enquiry details + confirmation |
| Application submitted | Applicant + Admin | Application summary + reference number |
| Application status updated | Applicant | Status change with admin notes |

---

## 🌱 Seed Script — `seed.js`

Run once to populate database:
```
node seed.js
```

Creates:
```
Admin User:
  Email:    admin@luminaris.edu
  Password: Admin2025!
  Role:     admin

News Articles (3):
  - Luminaris Team Develops Breakthrough Cancer Detection AI
  - New Innovation Hub Opens — A $200M Investment in Our Future
  - Luminaris Ranked Number One in Student Satisfaction
```

---

## 🚀 Running the Server

**Development:**
```
node server.js
```

**Development with auto-restart:**
```
npx nodemon server.js
```

**Expected output:**
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

**Health check:**
```
GET http://localhost:5000
→ { "success": true, "message": "🎓 Luminaris University API is running" }
```

---

## 🔗 Frontend ↔ Backend Connection

### Contact Form (`js/pages/contact.js`)
```
POST http://localhost:5000/api/contact
Body: { firstName, lastName, email, phone, department, subject, message }
→ Saves to enquiries collection
→ Sends 2 emails (admin + user confirmation)
```

### Admissions Quick Enquiry (`js/pages/admissions.js`)
```
POST http://localhost:5000/api/contact
Body: { firstName, lastName, email, department, subject, message }
→ Saves as enquiry with department: Admissions
```

### News Section (`js/pages/home.js`)
```
GET http://localhost:5000/api/news?limit=3
→ Fetches 3 latest articles
→ Replaces static HTML cards with real data
```

---

## 🗃️ MongoDB Collections Summary

| Collection | Documents | Description |
|---|---|---|
| `users` | 1+ | Admin + student accounts |
| `news` | 3+ | Published news articles |
| `enquiries` | 2+ | Contact form submissions |
| `applications` | 0+ | Admission applications |

---

## 🔜 Next Steps

| Feature | Status |
|---|---|
| Frontend forms connected | ✅ Done |
| Admin Dashboard UI | 🔜 Next |
| Student Portal | 🔜 Future |
| File uploads (CV, transcripts) | 🔜 Future |
| Deploy to Render.com | 🔜 Future |

---

*Last updated: 2025 — Luminaris University Backend v1.0*
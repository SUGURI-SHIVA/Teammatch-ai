# TeamMatch AI

AI-powered platform for forming better project teams among students. Connects project creators with the right teammates and helps students discover matching projects.

## Prerequisites

- Node.js 18+ (download from https://nodejs.org)
- PostgreSQL (download from https://www.postgresql.org/download/ or use Docker)

## Quick Setup

### 1. Install Root Dependencies
```bash
cd "shiva f"
npm install
```

### 2. Setup PostgreSQL

Create a database called `teammatch_ai`:
```sql
CREATE DATABASE teammatch_ai;
```

Update `backend/.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/teammatch_ai?schema=public"
```

### 3. Setup Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
```

### 5. Run the Application

From the root directory:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The frontend runs on http://localhost:5173 and the backend on http://localhost:3001.

## Demo Accounts

After seeding, you can login with any of these accounts (password: `password123`):

| Email | Name | Role |
|-------|------|------|
| alice@college.edu | Alice Johnson | Both (Creator + Student) |
| bob@college.edu | Bob Smith | Student |
| carol@college.edu | Carol Davis | Student |
| dave@college.edu | Dave Wilson | Student |
| eve@college.edu | Eve Martinez | Student |
| frank@college.edu | Frank Brown | Both |
| grace@college.edu | Grace Lee | Student |
| henry@college.edu | Henry Taylor | Student |

## Features

### Two-Way Matching
- **Project → Student**: Create a project, specify requirements, AI recommends best students
- **Student → Project**: Build profile, discover matching projects, request to join

### AI Matching Engine
- Skill matching with alias recognition (React = ReactJS = React.js)
- Interest matching
- Role compatibility
- Experience level matching
- Availability overlap
- Weighted scoring: Skills 40%, Interests 20%, Roles 15%, Experience 10%, Availability 10%, Learning 5%

### Team Formation
- Team skill coverage analysis
- Missing skills detection
- Duplicate skill identification
- Optimized for complementary skills

### Invitation & Request System
- Project creators invite students
- Students request to join projects
- Accept/Decline for both directions
- No automatic team creation

### Notifications
- Project invitations
- Join requests
- Acceptance/rejection notifications
- Real-time unread count

### Search & Filters
- Search projects by name/description
- Filter by domain, skill, role, experience
- Search students by name/skill
- Filter students by skill, role

## Project Structure

```
shiva f/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── src/
│   │   ├── index.ts             # Express server
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication
│   │   │   ├── profile.ts       # Student profiles
│   │   │   ├── project.ts       # Projects CRUD
│   │   │   ├── match.ts         # Matching API
│   │   │   ├── discovery.ts     # Recommendations
│   │   │   ├── invitation.ts    # Invitations
│   │   │   ├── joinRequest.ts   # Join requests
│   │   │   └── notification.ts  # Notifications
│   │   ├── services/
│   │   │   └── matchingEngine.ts # AI matching logic
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT auth
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   └── utils/
│   │       └── seed.ts          # Database seeder
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Landing page
│   │   │   ├── Login.tsx        # Login
│   │   │   ├── Register.tsx     # Registration
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── StudentProfile.tsx  # Profile editor
│   │   │   ├── CreateProject.tsx   # Project creation
│   │   │   ├── DiscoverProjects.tsx # Student discovers projects
│   │   │   ├── FindTeammates.tsx   # Creator finds students
│   │   │   ├── ProjectDetail.tsx   # Project view
│   │   │   ├── Invitations.tsx     # View invitations
│   │   │   ├── JoinRequests.tsx    # View join requests
│   │   │   └── Notifications.tsx   # Notifications
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Navigation
│   │   │   └── UI.tsx           # Reusable UI components
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Auth state
│   │   ├── utils/
│   │   │   └── api.ts           # API client
│   │   ├── App.tsx              # Router setup
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── package.json                  # Root scripts
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Profile
- `GET /api/profile` - Get my profile
- `POST /api/profile` - Create/update profile
- `GET /api/profile/all` - All profiles
- `GET /api/profile/:userId` - User profile

### Projects
- `GET /api/projects` - List open projects
- `GET /api/projects/my` - My projects
- `GET /api/projects/member` - Projects I'm in
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Project detail

### Matching
- `GET /api/match/student-project/:studentId/:projectId` - Match score
- `GET /api/recommendations/projects` - Projects for student
- `GET /api/recommendations/students/:projectId` - Students for project
- `GET /api/recommendations/team-coverage/:projectId` - Team analysis

### Invitations
- `GET /api/invitations/received` - Received invitations
- `GET /api/invitations/sent` - Sent invitations
- `POST /api/invitations` - Send invitation
- `PUT /api/invitations/:id/accept` - Accept
- `PUT /api/invitations/:id/decline` - Decline

### Join Requests
- `GET /api/join-requests/my` - My requests
- `GET /api/join-requests/project/:projectId` - Requests for project
- `POST /api/join-requests` - Send request
- `PUT /api/join-requests/:id/accept` - Accept
- `PUT /api/join-requests/:id/reject` - Reject

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Unread count
- `PUT /api/notifications/read-all` - Mark all read

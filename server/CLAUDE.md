# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# TIMO Server

Express 기반 백엔드 API 서버

## Tech Stack

- **Express** 5.0.0-alpha.2
- **Sequelize** 6.3.5 (MySQL ORM)
- **mysql2** 2.2.5
- **Passport.js** 0.4.1 (Google OAuth, JWT)
- **lib**: `jsonwebtoken`, `morgan`, `cors`
- **dev**: `nodemon`

## Commands

```bash
npm run dev        # Development (nodemon ./bin/www)
npm start          # Production (node ./bin/www)
```

## Directory Structure

```
server/
├── app.js                 # Express app setup, middleware
├── bin/
│   └── www                # Server entry point
│
├── routes/                # API route handlers
│   ├── index.js           # Main router (/api/*)
│   ├── auth.js            # /auth - Google OAuth, JWT
│   ├── user.js            # /user - Profile, bookmarks, spikes
│   ├── timetable.js       # /timetable - CRUD
│   ├── search.js          # /search - Course search
│   ├── share.js           # /share - Public timetable view
│   └── review.js          # /review - 강의평 CRUD, Like
│
├── controllers/           # Business Logic
│   ├── user.js
│   ├── timetable.js
│   ├── search.js
│   ├── share.js
│   └── review.js          # Course review logic
│
├── models/                # Sequelize Models
│   ├── index.js           # DB Connection & Association
│   ├── user.js
│   ├── lecture.js
│   ├── timetable.js
│   ├── course_review.js       # 강의평 Model
│   ├── course_review_like.js  # 강의평 좋아요 Model
│   ├── user_lecture_relation.js          # Bookmarks
│   ├── user_lecture_gleaning_relation.js # Spikes (이삭줍기)
│   └── timetable_lecture_relation.js
│
├── middlewares/
│   ├── auth.js            # JWT Validation
│   └── error.js           # Error Handling
│
├── lib/
│   └── passport.js        # Google & JWT Strategies
│
└── utils/
    ├── constants.js
    └── query_helper.js    # Search Query Builder
```

## Core Files

### app.js & bin/www
- **Entry**: `bin/www` sets up the HTTP server.
- **App**: `app.js` configures Middleware (CORS, Morgan, Passport) and mounts routes at `/api`.

### Authentication
- **Strategies** (`lib/passport.js`):
  - `google-oauth20`: Handles Login. Creates User/Timetable if new.
  - `jwt`: Protects API routes. Extracts token from `Authorization: Bearer <token>`.
- **Middleware** (`middlewares/auth.js`): `isValidJwtToken` ensures `req.user` is populated.

## API Routes

All routes prefixed with `/api`.

### Auth (`/auth`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/google` | Start Google OAuth |
| GET | `/google/callback` | OAuth callback -> Redirects with token |
| GET | `/` | Verify JWT token |

### User (`/user`) - Protected
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get User Info + Timetables + Bookmarks + Spikes |
| POST | `/feedback` | Submit Feedback |
| GET | `/bookmark` | Get Bookmarks |
| POST | `/bookmark/:lectureId` | Add Bookmark |
| DELETE | `/bookmark/:lectureId` | Remove Bookmark |
| POST | `/spike/:lectureId` | Add Spike (이삭줍기) |
| DELETE | `/spike/:lectureId` | Remove Spike |

### Timetable (`/timetable`) - Protected
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create Timetable |
| GET | `/:timetableId` | Get Timetable with lectures |
| PUT | `/` | Update Timetable Title |
| DELETE | `/:timetableId` | Delete Timetable |
| POST | `/lecture/:timetableId/:lectureId` | Add Lecture |
| DELETE | `/lecture/:timetableId/:lectureId` | Remove Lecture |

### Review (`/review`) - Protected
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create Review |
| GET | `/course` | Get Reviews & Stats for a Course |
| GET | `/my` | Get My Reviews |
| PUT | `/:reviewId` | Update Review |
| DELETE | `/:reviewId` | Delete Review |
| POST | `/:reviewId/like` | Toggle Like |
| GET | `/courses` | Search courses with reviews |

### Search & Share
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/search` | Yes | Search Courses (Paginated) |
| GET | `/share/:id` | No | View Shared Timetable (Public) |

## Database Schema

### ERD Overview
- **User** 1:N **Timetable**
- **User** M:N **Lecture** (Bookmarks, Spikes)
- **User** 1:N **CourseReview**
- **Timetable** M:N **Lecture**

### Key Models

#### Lecture
- Core course data: `code`, `name`, `professor`, `period`, `roomNo`, `credit`.
- Crawled data is static for the semester.

#### CourseReview
- Stores reviews for `courseName` + `professor` (grouping sections).
- **Fields**: `rating` (1-5), `grading`, `difficulty`, `exams`, `assignments`, `teamProjects`, `comment`, `likeCount`.

#### CourseReviewLike
- Tracks User likes on Reviews to prevent duplicates (Unique: `reviewId` + `userId`).

## Environment Variables (.env)

```bash
DB_HOST=localhost
DB_NAME=timo
DB_USER=root
DB_PW=password

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
GOOGLE_REDIRECT_URL=http://localhost:8080/timetable

JWT_SECRET=secretkey
PAGE_LIMIT=10
```

## Important Implementation Details

### Sequelize Model Auto-loading
`models/index.js` automatically loads all models:
```javascript
// Each model file must export init() and optionally associate()
module.exports = {
  init: (sequelize) => {
    return User.init({ /* schema */ }, { sequelize });
  },
  associate: (models) => {
    User.hasMany(models.Timetable);
    User.belongsToMany(models.Lecture, { through: models.UserLectureRelation });
  }
};
```

### Authentication Flow
1. **Login**: `/auth/google` → Google OAuth → Callback creates/finds user → Issues JWT → Redirects to client with `?token=<jwt>`
2. **Protected Routes**: Middleware `isValidJwtToken` (from `middlewares/auth.js`) validates JWT and populates `req.user`
3. **Strategies**: Defined in `lib/passport.js`
   - `google-oauth20`: Handles OAuth login
   - `jwt`: Validates bearer tokens from `Authorization` header

### Database Connection
Sequelize instance created in `models/index.js` using environment variables. Connection pooling configured:
```javascript
pool: {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}
```

### CORS Configuration
Configured in `app.js` to allow requests from:
- `https://timo.handong.site`
- `https://timo-six.vercel.app`
- `http://localhost:8080` (development)

### Error Handling
Centralized error middleware in `middlewares/error.js`. Controllers can throw errors which are caught and formatted consistently.

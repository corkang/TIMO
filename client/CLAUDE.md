# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# TIMO Client (College Timetable Web)

React 기반 프론트엔드 애플리케이션

## Tech Stack

- **React** 17.0.2
- **Material-UI** v4.11.2 (`@material-ui/core`, icons, lab)
- **React Router DOM** v5.2.0
- **Axios** (HTTP client with interceptors)
- **Sass** (SCSS)
- **react-cookie**, **react-if**
- **jose** (JWT handling)
- **html2canvas** (Image export)

## Commands

```bash
npm start          # Dev server (default CRA port 3000)
npm run dev        # Dev server on port 8080
npm run build      # Production build (outputs to build/)
npm test           # Run Jest tests (interactive watch mode)
npm test -- --coverage  # Run tests with coverage report
```

## Directory Structure

```
src/
├── App.js                 # Main entry, Routing, AuthLayout
├── index.js               # React DOM render
├── theme.js               # Material-UI theme configuration
├── base.scss              # Global styles
│
├── pages/                 # Page Components
│   ├── TimeTablePage.js   # Main timetable & search view
│   ├── LoginPage.js       # Google OAuth login
│   ├── IssacPage.js       # 이삭 줍기 (Spike) feature
│   ├── CartPage.js        # Shopping cart
│   ├── CourseGuidePage.js # Course guide
│   ├── ReviewPage.js      # Course reviews (강의평)
│   ├── SharePage.js       # Public shared timetable view
│   └── NotFoundPage.js
│
├── components/            # Reusable UI Components
│   ├── Header.js
│   ├── Footer.js
│   ├── Modal.js
│   ├── Snackbar.js
│   ├── Tabs.js
│   ├── SearchSection/     # Search & List UI
│   │   ├── index.js
│   │   ├── SearchBar.js
│   │   └── LectureCard.js
│   ├── TimetableSection/  # Timetable Grid UI
│   │   ├── index.js
│   │   ├── LectureGrid.js
│   │   └── TimetableButtonGroup.js
│   ├── ReviewSection/     # Review specific components
│   └── SearchReviewModal.js # Modal for lecture details & reviews
│
├── hooks/                 # Custom Hooks (Logic & State)
│   ├── useAuth.js         # Auth status check
│   ├── useUser.js         # User data management (Reducer)
│   ├── useSearch.js       # Search state management (Reducer)
│   ├── useModal.js        # Modal control
│   ├── useSnackbar.js     # Snackbar control
│   ├── useNotificationModal.js
│   └── useReview.js       # Review feature state
│
├── models/                # API Service Layer (Static methods)
│   ├── User.js
│   ├── Timetable.js
│   ├── Lecture.js
│   ├── Review.js
│   └── SpikeLecture.js
│
├── lib/
│   └── axios.js           # Axios instance factory (singleton w/ token)
│
├── utils/
│   ├── helper.js          # Logic helpers (isIn, isPeriodDup)
│   ├── storage.js         # localStorage wrapper
│   └── share.js           # Share link generation
│
└── commons/
    └── constants.js       # Global Constants (Actions, Configs)
```

## Core Files & Utilities

### Data Fetching
- **`lib/axios.js`**: Returns an Axios instance with the current `Bearer` token.
- **`models/*.js`**: Classes with static methods for API calls.
  ```javascript
  import { User } from './models';
  await User.bookmarkLecture(id);
  ```

### State Management
- **Custom Hooks**: Major features have dedicated hooks (`useUser`, `useSearch`, `useReview`) using `useReducer`.
- **Constants**: Action types used in reducers are defined in `commons/constants.js` (`USER_ACTIONS`, etc.).

### Authentication
- **Flow**: Google OAuth -> Server -> Callback URL with Token -> Client (`useTokenHandler` in `App.js`).
- **Token**: Stored in `localStorage` via `utils/storage.js`.

## Code Conventions

### Style
- **Functional Components** only.
- **Styles**: `makeStyles` (Material-UI v4).
  ```javascript
  const useStyles = makeStyles((theme) => ({ root: { ... } }));
  const classes = useStyles();
  ```
- **Naming**:
  - Components/Files: `PascalCase` (e.g., `TimeTablePage.js`)
  - Hooks: `camelCase` with `use` prefix (e.g., `useAuth.js`)
  - constants: `UPPER_SNAKE_CASE` (e.g., `STORAGE_KEY`)

### Routing (`App.js`)
| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/` | Redirect | - | Redirects to `/timetable` or `/login` |
| `/login` | LoginPage | No | Login page |
| `/timetable` | TimeTablePage | Yes | Main app view |
| `/issac` | IssacPage | Yes | Spike (이삭 줍기) feature |
| `/cart` | CartPage | Yes | Archive/Cart |
| `/courseguide`| CourseGuidePage | Yes | Course information |
| `/review` | ReviewPage | Yes | Course reviews |
| `/share/:id` | SharePage | No | Publicly shared timetable |

## Environment Variables
Defined in `.env` (or `.env.local`):

```bash
REACT_APP_SERVER_URL="http://localhost:3000/api"
REACT_APP_GOOGLE_SIGNIN_URL="http://localhost:3000/api/auth/google"
REACT_APP_JWT_SECRET="secret"
REACT_APP_DOMAIN_URL="http://localhost:8080"
```

## Important Implementation Details

### Representative Timetable Pattern
- **Index 0** is the "Representative Timetable" used by Issac, Cart, and Review pages
- Frontend implements "Set as Representative" by swapping array indices via `USER_ACTIONS.SWAP_TIMETABLE`
- **Not persisted to backend** - order resets on refresh

### State Management Pattern
Custom hooks use reducer pattern with action constants:
```javascript
// commons/constants.js defines actions
export const USER_ACTIONS = {
  UPDATE_USER: 'UPDATE_USER',
  BOOKMARK_LECTURE: 'BOOKMARK_LECTURE',
  // ...
};

// hooks/useUser.js implements reducer
function userReducer(user, { type, payload }) {
  switch (type) {
    case USER_ACTIONS.UPDATE_USER: // ...
  }
}
```

### Authentication Token Handling
- Token arrives as URL query param `?token=<jwt>` from OAuth callback
- `useTokenHandler` hook in `App.js` extracts token, saves to localStorage, and reloads page
- Subsequent API calls use token via `lib/axios.js` which creates instance with `Authorization: Bearer <token>` header

### API Layer Pattern
Model classes in `models/` have static methods that call API endpoints:
```javascript
import { User } from './models';
const { data } = await User.bookmarkLecture(lectureId);
```

All models use the axios instance from `lib/axios.js` which automatically includes auth token.


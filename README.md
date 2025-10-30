# Blog Frontend - Muskan Senior Care Platform

A modern, responsive blog frontend built with React, Redux Toolkit, and Tailwind CSS for the Muskan Senior Care platform.

## Features

### User Features
- **Authentication**: Login, Register, Forgot Password
- **Post Management**: Create, Read, Update, Delete posts
- **Interactions**: Like, Bookmark, Comment on posts
- **Profile Management**: Update profile and change password
- **Bookmarks**: Save and view bookmarked posts
- **Responsive Design**: Works on all devices with a modern black sidebar layout

### Admin Features
- **Dashboard**: View statistics and recent activity
- **User Management**: View and manage all users
- **Category Management**: Create, update, and delete categories
- **Tag Management**: Create, update, and delete tags

## Tech Stack

- **React 19**: UI library
- **Redux Toolkit**: State management with async thunks
- **React Router**: Routing
- **Axios**: HTTP client with interceptors
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **React Hot Toast**: Notifications

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running on `http://localhost:5500`

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── store/               # Redux store and slices
│   ├── authSlice.js     # Authentication state
│   ├── postSlice.js     # Posts state
│   ├── commentSlice.js  # Comments state
│   ├── categorySlice.js # Categories state
│   ├── tagSlice.js      # Tags state
│   ├── adminSlice.js    # Admin state
│   └── index.js         # Store configuration
├── pages/               # Page components
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── HomePage.jsx     # Home feed
│   ├── CreatePost.jsx   # Create post form
│   ├── SinglePostView.jsx # Single post view
│   ├── Profile.jsx      # User profile
│   ├── Bookmarks.jsx    # Saved posts
│   └── admin/           # Admin pages
├── Layout/              # Layout components
│   └── BlogLayout.jsx   # Main layout with sidebar
├── utils/               # Utility functions
│   └── axiosInstance.js # Axios configuration
└── App.jsx              # Main app component
```

## Key Features Implementation

### Redux Slices
Each slice uses `createAsyncThunk` for async operations:
- **Auth**: Login, register, profile management
- **Posts**: CRUD operations, like, bookmark
- **Comments**: Add and fetch comments
- **Categories/Tags**: Admin management
- **Admin**: User and content management

### Axios Instance
Configured with:
- Base URL: `http://localhost:5500/api/v1`
- Cookie credentials support
- Request/response interceptors

### Black Sidebar Layout
- Fixed sidebar with navigation
- Mobile responsive with hamburger menu
- User profile section
- Admin-only navigation for admin users

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## API Endpoints

The frontend connects to:
- `/api/v1/user/*`: User authentication and management
- `/api/v1/post/*`: Post operations
- `/api/v1/comment/*`: Comment operations
- `/api/v1/category/*`: Category operations
- `/api/v1/tag/*`: Tag operations
- `/api/v1/admin/*`: Admin operations

## State Management

State is managed using Redux Toolkit with the following structure:
- `auth`: User authentication state, profile, bookmarks
- `posts`: Posts list, current post, related posts
- `comments`: Comments for posts
- `categories`: Categories list
- `tags`: Tags list
- `admin`: Admin data (users, comments)

## Authentication Flow

1. User registers/logs in
2. Backend sends JWT token via HTTP-only cookie
3. Frontend stores user data in Redux
4. Protected routes check authentication
5. Axios automatically sends cookies with requests

## Styling

Uses Tailwind CSS with:
- Black and white color scheme
- Responsive grid layouts
- Modern card-based design
- Smooth transitions and hover effects

## Environment Variables

Make sure your backend server is configured with:
- `FRONTEND_URL1`: Frontend URL for CORS
- Database connection strings
- JWT secret

## Future Enhancements

- Search functionality
- Filter posts by category/tag
- Edit post functionality
- Email verification
- Password reset via email
- Social sharing
- Rich text editor for posts

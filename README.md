# Assignment 03 Frontend

Frontend application for the student grades management system.

[Link to the backend repo](https://github.com/school-kivi/assignment_03_backend)

## Features

- **Firebase Authentication**: Secure user login and registration
- **Role-Based UI**: Different views for admin and student users
- **Student Management**: Admin can view, create, edit, and delete student profiles
- **Course Management**: Browse and filter courses by year
- **Grade Management**: Admin can register grades, students can view their grades
- **CSV Import**: Bulk import student data from CSV files
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern UI Components**: Built with shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Custom Hooks**: Reusable React hooks for data fetching

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Firebase project with Authentication enabled
- Backend API running (see [backend repo](https://github.com/school-kivi/assignment_03_backend))

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/school-kivi/assignment_03_frontend.git
   cd assignment_03_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Get your Firebase config from Project Settings → General → Your apps

## Configuration

Create a `.env` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important**:

- All Firebase variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- Never commit `.env` to version control

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Default Credentials

For testing, you can use these credentials (if set up in your Firebase):

**Admin Account**:

- Email: `admin@kivi.se`
- Password: `admin123`

**Student Account**:

- Email: `student@kivi.se`
- Password: `student123`

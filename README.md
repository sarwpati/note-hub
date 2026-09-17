# NoteHub

A modern notes application built with a React frontend and an Express + MongoDB backend. It allows users to create, organize, search, pin, archive, and manage personal notes with authentication and profile settings.

## Overview

NoteHub is designed for individuals and teams who want a lightweight, clean, and fast way to store and manage notes. The application includes:

- User registration and login
- Secure authentication with JWT
- Personal notes stored in MongoDB
- Note creation, editing, deletion, and search
- Pin and archive functionality
- User profile and password management
- Responsive dashboard interface for desktop, tablet, and mobile

## What You Can Do With It

- Create notes with titles, descriptions, tags, colors, and pinned state
- Search notes by keyword
- View all notes or filter pinned items
- Archive notes instead of deleting them permanently
- Restore archived notes when needed
- Manage account details and update passwords
- Use the application as a personal digital workspace for daily notes and reminders

## Key Features

### Authentication
- Register a new account
- Log in securely
- Log out safely
- Fetch current authenticated user details
- Update profile information and password

### Notes Management
- Add a new note
- Edit an existing note
- Delete a note
- Pin important notes to the top
- Archive notes for later access
- Search and filter notes by keyword and status

### User Experience
- Responsive UI for mobile and desktop
- Clean dashboard layout
- Sidebar navigation and action-driven flow
- Professional note cards with color-coded organization

## Architecture

The application follows a modular full-stack architecture with a clear separation between frontend and backend.

### Frontend
- React + Vite
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Responsive UI and dashboard flow

### Backend
- Node.js + Express
- MongoDB + Mongoose ODM
- JWT authentication
- Zod validation for request schemas
- Helmet, CORS, and cookie parsing for security and API support

### Application Flow
1. User logs in or registers through the frontend.
2. Frontend sends requests to the backend API.
3. Backend validates the request and uses MongoDB to store or fetch data.
4. JWT tokens are issued and stored via cookies.
5. The frontend uses the authenticated session to render user-specific notes and settings.

## Project Structure

```text
notes-website/
├── client/                 # React frontend
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── README.md
└── package-lock.json      # optional if generated locally
```

## Technologies Used

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Zod
- bcryptjs

## Prerequisites

Before running the project, make sure you have the following installed on your local machine:

- Node.js 18 or later
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Git (optional, but recommended)

## Local Setup Guide

Follow these steps to run the project on your local machine.

### 1. Clone the Project

```bash
git clone <repository-url>
cd notes-website
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a local environment file in the server folder using the example file:

```bash
cd server
copy .env.example .env
```

Then update the values in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/notes-app
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create a frontend environment file:

```bash
cd ../client
copy .env.example .env
```

Then update `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

> Note: Keep these values private and do not commit them to public repositories.

### 4. Start MongoDB

If you are using a local MongoDB installation, make sure MongoDB is running before starting the app.

Example local connection:

```bash
mongodb://127.0.0.1:27017/notes-app
```

If you are using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

### 5. Run the Backend

From the server folder:

```bash
cd server
npm run dev
```

This starts the API server on:

```text
http://localhost:5000
```

### 6. Run the Frontend

Open a new terminal and run:

```bash
cd client
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

### 7. Access the Application

Open your browser and visit:

```text
http://localhost:5173
```

You can now register a new account, log in, and begin creating notes.

## Running Tests

The backend includes automated tests for core API behavior.

From the server folder:

```bash
npm test
```

## Production Build

To create a production build for the frontend:

```bash
cd client
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Security Notes

- Never commit `.env` files
- Use strong JWT secrets
- Keep MongoDB credentials private
- Use HTTPS in production deployments
- Restrict CORS origins in production if needed

## Recommended Deployment Ideas

This project can be deployed in several ways:

- Frontend on Vercel or Netlify
- Backend on Render, Railway, or a VPS
- MongoDB on MongoDB Atlas or a managed database provider
- Reverse proxy or domain setup in production

## License

This project is licensed under the MIT License.

## Project Summary

NoteHub is a practical, full-stack notes application that combines a clean user interface, secure authentication, and reliable data storage. It is suitable for personal note-taking, lightweight daily planning, and simple knowledge capture in a modern web app environment.

---

If you want, I can also add:
- a screenshot section,
- a deployment guide for Render/Vercel,
- a troubleshooting section,
- or a shorter version of this README for GitHub profile/project showcase.

# Stuweek — Student Week

**Plan less. Learn better. Stay consistent.**

Stuweek is a student productivity workspace designed to help students organize their studies, manage tasks, track focus sessions and improve their learning routine — all in one place.

🎥 **Project Demo:** [Watch Stuweek on YouTube](https://youtu.be/PUFEcQ60JEI)

## 🚀 MVP Features

- **User Authentication:** Register and log in securely using JWT and bcrypt.
- **Personal Dashboard:** View your study activity and productivity.
- **Study Planner:** Add, complete and delete study tasks.
- **Focus Timer:** Track focus sessions and study time.
- **Notes Library:** Create and manage personal study notes.
- **Quiz Practice:** Practice sample questions and check your scores.
- **Flashcards:** Revise topics using interactive flashcards.
- **My Profile:** Access your personal account information.

## 🛠️ Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Authentication | JWT, bcrypt |
| API Communication | Axios |

## 📸 Screenshots

Screenshots of the working application will be added here.

<!-- Add actual screenshots inside the screenshots folder -->

## 💻 Run Stuweek Locally

### Prerequisites
- Node.js 20 or later
- npm
- VS Code (recommended)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/jha-shankar0712/Stuweek.git
   ```

2. Open the project folder:

   ```bash
   cd Stuweek
   ```

3. Install dependencies:

   ```bash
   npm run install:all
   ```

4. Start the frontend and backend:

   ```bash
   npm run dev
   ```

5. Open the frontend in your browser:

   `http://localhost:5173`

The backend API runs at:

`http://localhost:5000`

The SQLite database is created automatically inside `server/data/`.

## 📁 Project Structure

```text
Stuweek/
├── client/       # React frontend
├── server/       # Express backend and API
├── README.md
├── package.json
└── .gitignore
```

## 🎯 Current Development Status

Stuweek is currently being developed as a hackathon MVP.

The current version provides a working foundation for student productivity, including authentication, planning, focus tracking, notes, quizzes and flashcards.

### Future Improvements

- AI-powered study plan generation
- AI-generated question papers
- Social learning features
- Live study rooms
- Advanced productivity analytics

These are planned improvements, not features currently claimed as implemented.

## ⚠️ Current Limitations

- The focus timer works inside the Stuweek application.
- It does not block or force-close other desktop or mobile applications.
- Social networking, live video rooms and AI-generated question papers are not yet implemented.

## 👨‍💻 Project

**Stuweek — Student Week**

A student-focused productivity project built to make studying more organized, manageable and consistent.

**GitHub:** https://github.com/jha-shankar0712/Stuweek

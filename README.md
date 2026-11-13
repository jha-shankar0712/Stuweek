# 🌿 Stuweek – Plan Less. Learn Better. Stay Consistent.

**Stuweek** is a student productivity and study management platform designed to help students organize their academic life, manage daily tasks, track study sessions, and improve learning consistency.

It brings essential study tools together in one simple and user-friendly platform.

## 🌐 Live Website

🚀 **Try Stuweek:**  
https://stuweek-731w8xw8u-jha-shankar0712.vercel.app/

🎥 **Project Demo Video:**  
https://youtu.be/PUFEcQ60JEI

💻 **GitHub Repository:**  
https://github.com/jha-shankar0712/Stuweek

## ✨ Key Features

- **User Authentication:** Create an account and securely log in.
- **Personalized Dashboard:** View your study activity and productivity statistics.
- **Study Planner:** Organize study tasks and manage your learning schedule.
- **Focus Timer:** Track focused study sessions and improve consistency.
- **Notes Library:** Create and manage study notes.
- **Quiz Practice:** Test your knowledge through interactive quizzes.
- **Flashcards:** Practice and revise important concepts.
- **User Profile:** Manage your personal account information.
- **Responsive Interface:** Access the platform on mobile phones, tablets, and desktops.

## 🛠️ Technology Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- SQLite
- Better-SQLite3

**Deployment**
- Vercel – Frontend Hosting
- Render – Backend Hosting
- GitHub – Source Code Management

## 🏗️ Project Structure

```text
Stuweek/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── data/
│   └── package.json
│
└── README.md
```

## ⚙️ Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/jha-shankar0712/Stuweek.git
cd Stuweek
```

### 2. Start the Backend

```bash
cd server
npm install
```

Configure the backend environment variables:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_private_random_secret
```

Start the backend:

```bash
npm start
```

### 3. Start the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the client folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🎯 Project Objective

The main objective of Stuweek is to make student life more organized and productive by combining study planning, task management, focus tracking, and revision tools in one platform.

Instead of switching between multiple applications, students can manage their daily learning activities from a single workspace.

## 🚀 Deployment

- Frontend: Vercel
- Backend: Render
- Repository: GitHub

**Live Application:**  
https://stuweek-731w8xw8u-jha-shankar0712.vercel.app/

## 🔮 Future Improvements

- Enhanced study analytics and progress reports.
- Personalized learning recommendations.
- Improved mobile experience.
- More quiz categories and revision tools.
- Additional productivity features.

## 👨‍💻 Development

Stuweek is a full-stack student productivity project developed as a practical application of frontend development, backend development, API integration, database management, and deployment.

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub!

---

**Stuweek – Plan Less. Learn Better. Stay Consistent.**

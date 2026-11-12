# Stuweek — Student Week

A student productivity workspace built with React, Vite, Express and SQLite. The interface uses a premium matte-black and crimson-red visual system with layered cards, subtle depth and no blue dashboard styling.

## MVP features
- Account registration and login (JWT + bcrypt)
- Personal dashboard and profile
- Study planner with add, complete and delete tasks
- Focus timer with session tracking
- Personal notes library
- Quiz practice (sample questions + score)
- Flashcards with flip interaction

## Requirements
- Node.js 20+ and npm
- Windows, macOS or Linux

## Run locally
1. Extract the ZIP.
2. Open the `Stuweek` folder in VS Code.
3. Open a terminal in this folder and run:
   ```bash
   npm run install:all
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

The API runs on `http://localhost:5000`. SQLite database is created automatically at `server/data/stuweek.db`.

## Demo account
Create your own account from the Register screen. No pre-filled password is included.

## Important scope notes
This is a working MVP foundation. Social networking, live video rooms, AI-generated question papers and operating-system-level app blocking are not implemented. The focus timer works inside the Stuweek page; it cannot force-close or block other desktop/mobile apps from a normal website.

## Project structure
- `client/` — React user interface
- `server/` — Express API, authentication and SQLite data
- `server/data/` — created automatically for the database

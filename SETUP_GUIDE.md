# Project Setup & Database Seeding Guide

Follow these steps to set up the **AI Law Assistant** project, install dependencies, and populate the database with legal information.

## Prerequisites

1.  **Node.js**: Ensure Node.js (v18 or higher) is installed.
2.  **MongoDB**: Ensure MongoDB is installed and running locally on port `27017`.

## Step 1: Backend Setup

1.  Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install backend dependencies:
    ```bash
    npm install
    ```

3.  **Seed the Database**:
    We have included a dataset of IPC and IT Act sections. Run the following command to populate your local MongoDB:
    ```bash
    npm run seed
    ```
    *Output should say: `Data Imported Successfully!`*

4.  Start the Backend Server:
    ```bash
    npm run dev
    ```
    *Output should say: `Server running on port 5000` and `MongoDB Connected...`*

## Step 2: Frontend Setup

1.  Open a **new terminal** and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install frontend dependencies:
    ```bash
    npm install
    ```

3.  Start the Frontend Development Server:
    ```bash
    npm run dev
    ```
    *The terminal will show a local URL, typically `http://localhost:5173`. Open this in your browser.*

## Troubleshooting

-   **"Missing script: dev"**: Ensure you are in the correct directory (`backend` or `frontend`) before running `npm run dev`. The root folder does not have a run script.
-   **Database Connection Error**: Ensure MongoDB service is running. You can check this in your Task Manager (Windows) or Activity Monitor (Mac).
-   **API Errors**: If the frontend says "Network Error", ensure the backend server is running on port 5000.

## Project Structure (Quick Reference)

-   `backend/src/data/laws.json`: Contains the legal data used for seeding. You can add more sections here.
-   `backend/src/scripts/seedDatabase.js`: The script that reads the JSON and inserts it into MongoDB.
-   `frontend/vite.config.ts`: Configured to proxy API requests to `http://localhost:5000`.

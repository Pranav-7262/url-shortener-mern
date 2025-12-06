# 🔗 URL Shortener MERN Stack Application

A sleek, fast, and modern URL shortener built using the MERN (MongoDB, Express, React, Node.js) stack. This application allows users to shorten long URLs, generate a corresponding QR code, and easily copy the resulting short link.

## 🚀 Live Demo

You can view the live, deployed application here:

**[https://frontend-us7s.onrender.com/](https://frontend-us7s.onrender.com/)**

---

## ✨ Features

* **URL Shortening:** Convert any long URL into a compact, shareable link.
* **QR Code Generation:** Automatically generates a scannable QR code for the short link.
* **One-Click Copy:** Easily copy the short URL and download the QR code image.
* **Persistent Storage:** Links are stored in a MongoDB database, ensuring persistence.
* **Redirect Service:** The backend handles the redirection from the short code to the original long URL.
* **Modern UI:** Built with **React**, styled using **Tailwind CSS** and **DaisyUI** for a clean and responsive user experience.

---

## 🛠️ Technology Stack

This project leverages the power of the MERN stack for a full-stack solution:

### Frontend
* **React:** Frontend library for building the user interface.
* **Tailwind CSS:** Utility-first CSS framework for rapid styling.
* **DaisyUI:** Tailwind CSS component library for modern, ready-made UI components.
* **Axios:** HTTP client for making API requests.
* **`qrcode.react`:** Library for generating the QR code component.

### Backend & Database
* **Node.js & Express.js:** The server environment and web framework.
* **MongoDB & Mongoose:** NoSQL database for storing URL records and an ODM for schema modeling.
* **`shortid` or `nanoid`:** Used for generating unique, short identifiers for the URLs.
* **CORS:** Configured to allow cross-origin requests between the React frontend and the Express backend.

---

## 💻 Local Installation and Setup

Follow these steps to get a local copy of the project running on your machine.

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas Account (or local MongoDB installation)

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd url-shortener-mern/backend # (or wherever your backend code is located)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the **backend** directory and add your MongoDB Atlas connection string and server port:
    ```env
    PORT=3000
    MONGO_URI="mongodb+srv://<user>:<password>@<cluster-name>/url-shortener?retryWrites=true&w=majority"
    # IMPORTANT: Update the CORS origin to match your frontend URL in server code before deployment.
    ```
4.  **Run the backend server:**
    ```bash
    npm start
    # or
    nodemon server.js
    ```
    The server will run on `http://localhost:3000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend # (or wherever your frontend code is located)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the React development server:**
    ```bash
    npm run dev
    # or
    npm start
    ```
    The client application will typically open at `http://localhost:5173` or `http://localhost:3000` (depending on your setup).

---

## 🗺️ API Endpoints

The backend exposes the following primary endpoints:

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/shorten` | Creates a new short URL and stores it in the database. | `{ "longUrl": "https://example.com/very-long-path" }` |
| **`GET`** | `/:shortCode` | Redirects the user to the original long URL. | None |

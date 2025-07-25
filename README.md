📘 README.md

# 📝 Task Manager API

A secure and well-structured REST API for task management, built with Express.js and PostgreSQL. It supports full authentication using access and refresh tokens, and provides protected routes for managing personal tasks.

---

## 🔧 Tech Stack

- **Node.js** + **Express.js** – Backend server
- **PostgreSQL** – Relational database
- **pg** – PostgreSQL client for Node.js
- **express-validator** – Request validation and sanitization
- **cookie-parser** – Handle cookies for refresh tokens
- **jsonwebtoken** – Authentication using access and refresh tokens
- **bcryptjs** – Secure password hashing
- **morgan** – HTTP request logger
- **winston** – Advanced logging and error tracking

---

## 🚀 Features

- ✅ User Registration and Login
- 🔒 Secure Authentication using JWT (access + refresh tokens)
- 🧠 Password hashing with bcrypt
- 📦 Create, Read, Update, Delete (CRUD) operations for Tasks
- 🧹 Input validation with express-validator
- 🍪 Cookie-based refresh token handling
- 📊 Request and error logging with Morgan and Winston
- 🧱 Modular and scalable folder structure
- 🐘 PostgreSQL integration using raw SQL or queries via `pg`

---

## 📁 Folder Structure

project-root/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── utils/
├── validators/
├── .env
├── app.js
└── package.json

---

## 🔐 Authentication Flow

1. **Login/Register**: On success, API returns an **access token** and sets a **refresh token** in a cookie.
2. **Access Protected Routes**: User sends access token in headers.
3. **Refresh Token**: When access token expires, user can get a new one using the refresh token from the cookie.
4. **Logout**: API clears the refresh token cookie.

---

## 🛠️ Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api
Install dependencies

bash
Copy
Edit
npm install
Create a .env file

env
Copy
Edit
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
Run migrations or create tables manually

Start the server

bash
Copy
Edit
npm run dev
🧪 API Endpoints
👤 Auth
POST /api/auth/register

POST /api/auth/login

GET /api/auth/refresh

POST /api/auth/logout

✅ Tasks (Protected)
GET /api/tasks

POST /api/tasks/create

GET /api/tasks

put /api/tasks/update/:id

DELETE /api/tasks/delete/:id

📋 Logging
Morgan logs HTTP requests to the console

Winston logs errors and important events to log files in /logs

✨ Future Enhancements
Add task categories or priorities

Pagination and filtering

Rate limiting and API key support

Swagger or Postman documentation

🧑‍💻 Author
Made with love by Michael G

📜 License
This project is licensed under the MIT License.

yaml
Copy
Edit

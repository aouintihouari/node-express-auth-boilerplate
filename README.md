# 🛡️ Node.js Production-Ready Auth Boilerplate

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)

A robust, secure, and scalable **Authentication API** starter kit built with Node.js, Express, and Mongoose.
Designed with **Clean Architecture** principles and industry best practices in mind.

## 🚀 Features

### 🔒 Security First

- **HttpOnly Cookies**: JWTs are sent via secure, HttpOnly cookies to prevent XSS attacks.
- **Helmet**: Sets various HTTP headers to secure the app.
- **Rate Limiting**: Prevents brute-force attacks on API endpoints.
- **Data Sanitization**: Against NoSQL query injection (express-mongo-sanitize) and XSS (xss-clean).
- **Parameter Pollution**: Prevents parameter pollution with HPP.

### 🏗️ Architecture & Code Quality

- **MVC Structure**: Clear separation of concerns (Models, Views/Routes, Controllers).
- **Zod Validation**: Strict schema validation for incoming data (declarative & safe).
- **Global Error Handling**: Centralized error controller handling Operational vs Programming errors.
- **Async/Await**: Modern syntax with custom `catchAsync` wrapper (no try-catch hell).

### 🛠️ Functionalities

- **Full Auth Cycle**: Signup, Login, Logout (clearing cookies).
- **Email Features**: Welcome emails, Password Reset tokens, Email Verification.
- **User Management**: Update profile, "Soft" delete account, Upload profile picture.
- **Image Processing**: Image upload handling with Multer, resizing with Sharp, and storage on Cloudinary.

## 📂 Project Structure

```text
├── config/         # Database configuration
├── controllers/    # Route controllers (request handling logic)
├── middlewares/    # Express middlewares (Protect, etc.)
├── models/         # Mongoose models (Data layer)
├── routes/         # API Routes definitions
├── utils/          # Utility classes (AppError, Email, Cloudinary)
├── app.js          # Express App setup (Middlewares)
└── server.js       # Server entry point
```

## 🛠️ Getting Started

### 1. Clone the repository

```
git clone [https://github.com/YOUR_USERNAME/your-repo-name.git](https://github.com/YOUR_USERNAME/your-repo-name.git)
cd your-repo-name
```

### 2. Install dependencies

```
npm install
```

### 3. Set environment variables

```bash
NODE_ENV=development
PORT=5000

# Database
DB_URI=mongodb+srv://<YOUR_MONGO_URI>

# JWT
JWT_SECRET=your-super-secret-long-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email (Nodemailer / Mailtrap / SendGrid)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASSWORD=your_password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the application

```bash
# Development mode (with Morgan logging)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

| Method     | Endpoint                            | Protected | Description                      |
| :--------- | :---------------------------------- | :-------: | :------------------------------- |
| **POST**   | `/api/v1/auth/signup`               |    ❌     | Register a new user              |
| **POST**   | `/api/v1/auth/login`                |    ❌     | Login user (Set HttpOnly Cookie) |
| **POST**   | `/api/v1/auth/logout`               |    ❌     | Logout user (Clear Cookie)       |
| **GET**    | `/api/v1/auth/verify/:token`        |    ❌     | Verify email address             |
| **POST**   | `/api/v1/auth/forgotPassword`       |    ❌     | Send password reset email        |
| **PATCH**  | `/api/v1/auth/resetPassword/:token` |    ❌     | Reset password                   |
| **GET**    | `/api/v1/auth/me`                   |    🔐     | Get current user info            |
| **PATCH**  | `/api/v1/auth/updateMyPassword`     |    🔐     | Update password                  |
| **PATCH**  | `/api/v1/users/updateMe`            |    🔐     | Update profile (Name, Photo)     |
| **DELETE** | `/api/v1/users/deleteMe`            |    🔐     | Soft delete account              |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is MIT licensed.

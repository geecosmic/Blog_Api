# Blog REST API (Node.js + Express + MongoDB)

## Project Overview
This project is a simple Blog REST API built to demonstrate backend skills such as authentication, authorization, database relationships, and clean API design.

The API supports user registration/login using JWT, post creation with ownership rules, public and private visibility of posts, filtering, pagination, and soft deletion.

---

## Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JavaScript (ES Modules)

---

## Setup Instructions (Run Locally)

### 1. Install dependencies
```bash
npm install
```

### 2. Create environment variables
Create a `.env` file in the project root.

### 3. Start the server
```bash
npm run dev
```

Server will start on:
```
http://localhost:PORT
```

---

## Required Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_HOST>/blogapi?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

- **MONGO_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for signing JWTs
- **PORT**: Server port

---

## API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Posts
- POST `/api/posts` (Authenticated)
- GET `/api/posts` (Public – published only)
- GET `/api/posts/:slug` (Public – published only)
- PUT `/api/posts/:id` (Author only)
- DELETE `/api/posts/:id` (Author only, soft delete)

---

## Sample API Requests & Responses

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"George","email":"george@mail.com","password":"password123"}'
```

Response:
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "George",
    "email": "george@mail.com"
  }
}
```

---

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"george@mail.com","password":"password123"}'
```

---

### Create Post (Authenticated)
```bash
curl -X POST http://localhost:5000/api/posts -H "Authorization: Bearer JWT_TOKEN" -H "Content-Type: application/json" -d '{"title":"My First Blog","content":"Content here","status":"draft"}'
```

---

### Get Public Posts
```bash
curl http://localhost:5000/api/posts?page=1&limit=10
```

---

### Search Posts (Title OR Content)
```bash
curl http://localhost:5000/api/posts?search=jwt
```

---

### View Drafts (Authenticated)
```bash
curl http://localhost:5000/api/posts?status=draft -H "Authorization: Bearer JWT_TOKEN"
```

---

### Update Post (Author only)
```bash
curl -X PUT http://localhost:5000/api/posts/POST_ID -H "Authorization: Bearer JWT_TOKEN" -H "Content-Type: application/json" -d '{"status":"published"}'
```

---

### Delete Post (Soft Delete)
```bash
curl -X DELETE http://localhost:5000/api/posts/POST_ID -H "Authorization: Bearer JWT_TOKEN"
```

---

## Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

## License
ISC

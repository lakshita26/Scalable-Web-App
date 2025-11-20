# Scalable Web App with Authentication & Dashboard

A modern, full-stack web application built with SvelteKit frontend and FastAPI backend featuring secure authentication, JWT tokens, and task management.

## Features

- **Secure Authentication**: JWT-based login/signup with bcrypt password hashing
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Task Management**: Full CRUD operations on tasks with real-time updates
- **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- **Profile Management**: Users can view and update their profiles
- **Search & Filter**: Find tasks quickly with search functionality
- **Modern Stack**: FastAPI backend + SvelteKit frontend

## Project Structure

\`\`\`
.
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main application and routes
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # JWT authentication logic
│   ├── config.py           # Configuration settings
│   ├── database.py         # Database connection
│   └── requirements.txt    # Python dependencies
├── src/                    # SvelteKit frontend
│   ├── routes/            # Page routes
│   ├── lib/               # Reusable components and utilities
│   └── app.css            # Global styles
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- MySQL 5.7+

### Backend Setup

1. Navigate to backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Create virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. Create `.env` file:
   \`\`\`
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/webapp_db
   SECRET_KEY=your-super-secret-key-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   \`\`\`

5. Create database and run migrations:
   \`\`\`sql
   CREATE DATABASE webapp_db;
   \`\`\`

6. Start backend server:
   \`\`\`bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`

### Frontend Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open browser to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/login` - Login with email and password
- `GET /api/health` - Health check

### User Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

## Authentication Flow

1. User signs up with email, username, and password
2. Password is hashed using bcrypt
3. User receives JWT token on login
4. Token is stored in localStorage
5. Token is sent in Authorization header for protected routes
6. Backend validates token using JWT decode

## Security Practices

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- CORS enabled for frontend domain
- Password validation (minimum 6 characters)
- Protected API endpoints require valid token
- Unique email and username constraints

## Scalability Considerations

### Frontend Scaling
- Component-based architecture for reusability
- Store-based state management
- API client abstraction for easy backend switching
- Lazy loading for large task lists

### Backend Scaling
- Stateless JWT authentication (horizontal scaling)
- Database connection pooling
- RESTful API design
- Dependency injection for testability
- Modular code structure

### Production Recommendations
- Use environment variables for sensitive data
- Implement rate limiting on API endpoints
- Add database indexes on frequently queried fields
- Use caching (Redis) for user sessions
- Implement request logging and monitoring
- Use reverse proxy (Nginx) for load balancing
- Deploy frontend to CDN (Vercel, Netlify)
- Deploy backend to cloud (AWS, GCP, Heroku)

## Deployment

See `DEPLOYMENT.md` for comprehensive deployment guide with Docker, CI/CD, and scaling strategies.

## License

MIT

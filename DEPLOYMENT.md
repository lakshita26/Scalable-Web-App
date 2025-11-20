# Deployment Guide

## Production Scaling Strategy

### Phase 1: Single Server Deployment
- Deploy both frontend and backend on single server
- Use Nginx as reverse proxy
- MySQL database on same or separate server

### Phase 2: Horizontal Scaling (Backend)
- Deploy multiple backend instances behind load balancer
- Use stateless JWT auth (no sessions to sync)
- Database connection pooling
- Redis for caching

### Phase 3: Advanced Architecture
- Frontend CDN distribution (Vercel, Cloudflare)
- Backend API Gateway with rate limiting
- Database read replicas
- Message queue for async tasks (Celery, RabbitMQ)
- Monitoring and logging (Prometheus, ELK)

## Docker Deployment

### Backend Dockerfile
\`\`\`dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### Frontend Dockerfile
\`\`\`dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Environment Variables for Production

Backend:
- `DATABASE_URL`: Managed database URL (RDS, Cloud SQL)
- `SECRET_KEY`: Strong random key (min 32 chars)
- `ALGORITHM`: HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 60
- `CORS_ORIGINS`: Frontend domain

Frontend:
- `VITE_API_BASE_URL`: Production API URL

## Database Optimization for Scale

1. Add indexes on frequently queried fields
2. Partition large tables
3. Archive old data regularly
4. Monitor slow queries
5. Use connection pooling

## Monitoring & Logging

- Application logs: Centralized logging (ELK Stack, Datadog)
- Performance monitoring: APM tools (New Relic, Sentry)
- Database monitoring: Query performance insights
- Frontend monitoring: Error tracking, analytics

## CI/CD Pipeline

GitHub Actions example:
\`\`\`yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker images
        run: docker build . -t app:latest
      - name: Deploy to production
        run: docker push app:latest
\`\`\`

## Security Checklist

- [ ] SSL/TLS certificates (HTTPS)
- [ ] CORS configured for frontend domain only
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection headers
- [ ] CSRF tokens if needed
- [ ] Database backups automated
- [ ] Secrets management (AWS Secrets Manager, HashiCorp Vault)
- [ ] Regular security audits
- [ ] API key rotation policy

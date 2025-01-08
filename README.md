# Realm-of-Strategos

## Overview
Realm-of-Strategos is a backend microservices-based system for managing real-time multiplayer game sessions. It includes user authentication, player matchmaking, and game session management.

### Architecture
The project uses:
- **Auth-Service**: Handles user registration, login, and authentication.
- **Matchmaking-Service**: Matches players based on skill levels and manages game session assignments.
- **Game-Session-Service**: Manages game session lifecycle.

### Technologies
- **Backend**: Node.js, TypeScript
- **Databases**: Redis
- **Messaging**: RabbitMQ
- **Documentation**: Swagger
- **Testing**: Jest
- **Logging**: Winston
- **Orchestration**: Docker Compose

---

## How to Run Locally
1. **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd Realm-of-Strategos
    ```

2. **Set up Environment Variables**:
   Update `.env` files for each service.

3. **Start Services**:
   Run Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. **View Swagger Docs**:
   Each service provides its own Swagger documentation:
   - Auth-Service: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   - Matchmaking-Service: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)
   - Game-Session-Service: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## Testing
Run all tests:
```bash
npm test
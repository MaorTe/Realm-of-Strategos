# Game-Session-Service

## Overview
The Game-Session-Service handles the lifecycle of game sessions, including creation, retrieval, updating, and deletion of sessions.

### Features
- Manage game session lifecycle
- Consume RabbitMQ messages for game session creation
- Integration with Matchmaking-Service for session assignments

### API Documentation
Swagger documentation is available at:
[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### How to Run
1. **Install Dependencies**:
    ```bash
    npm install
    ```
2. **Start the Service**:
    ```bash
    npm start
    ```

### Testing
Run Jest unit and integration tests:
```bash
npm test
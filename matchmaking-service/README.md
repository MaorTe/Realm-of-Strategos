# Matchmaking-Service

## Overview
The Matchmaking-Service manages player matchmaking and game session assignments. It leverages skill-based prioritization for creating balanced matches.

### Features
- Match players based on skill levels
- Publish matched sessions to RabbitMQ
- Integrate with Game-Session-Service for session creation

### API Documentation
Swagger documentation is available at:
[http://localhost:3002/api-docs](http://localhost:3002/api-docs)

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
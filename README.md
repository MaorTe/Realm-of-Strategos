# Realm of Strategos - Game Backend Microservices

## Project Overview
**Realm of Strategos** is a backend architecture for a strategy-based game that demonstrates high-scale, real-time microservices communication. This project consists of two primary microservices:
- **Auth-Service**: Manages user authentication and authorization.
- **Game-Session-Service**: Handles game session management, including creation and retrieval of session data.

The project is containerized using Docker and Docker Compose, making it straightforward to deploy and scale. It’s developed with TypeScript, Node.js, and Express.

## Prerequisites
To run **Realm of Strategos**, ensure the following installations:
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Directory Structure
The project structure is as follows:
```plaintext
Realm-of-Strategos/
├── auth-service/          # Auth microservice
├── game-session-service/  # Game session microservice
├── common/                # Shared code and middleware
└── docker-compose.yml     # Docker Compose for orchestration

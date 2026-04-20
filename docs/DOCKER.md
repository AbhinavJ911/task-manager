# Docker & Containerization

## What is Docker?
Docker is an open platform that packages applications and their dependencies into standardized units called "containers." A container ensures that your software runs exactly the same way regardless of the environment (e.g., your laptop, a staging server, or AWS).

In this repository, we utilize Docker to decouple the **Frontend (React)** and **Backend (Node.js/Express)** microservices.

## How it Works Locally
We use `docker-compose.yml` to orchestrate multiple containers together natively.

1. **Backend Container (`Dockerfile.backend`)**: Built using a lightweight Node image. It exposes port `5000`.
2. **Frontend Container (`Dockerfile.frontend`)**: Built via a multi-stage build. First, it compiles the Vite React app, and then uses a lightweight `nginx:alpine` image to serve the compiled static files.
3. **Nginx Load Balancer**: A reverse proxy that routes traffic to backend and frontend respectively.

## How to Run

1. Make sure Docker Desktop is installed and running.
2. Open your terminal at the root of the project `d:\Task-Manager`.
3. Run the following command:
   ```bash
   docker compose up --build -d
   ```
4. Stop the containers when you're done:
   ```bash
   docker compose down
   ```

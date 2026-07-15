# User Portal - 3-Tier Containerized Application

This is a 3-tier user registration web application consisting of a frontend UI, a backend API, and a MongoDB database, all containerized using Docker and managed via Docker Compose.

## Project Overview
* **Frontend:** A web interface built with HTML, CSS, and JavaScript, hosted inside an optimized Nginx web server container.
* **Backend:** A Node.js Express API server that processes user requests and logs activities.
* **Database:** A MongoDB instance that securely stores and persists user information.

---

## Docker Hub Image Links
The application images are built using optimized, multi-stage Dockerfiles and are hosted publicly on Docker Hub:
* **Frontend Image:** `sidpram/user-dashboard-frontend:latest`
* **Backend Image:** `sidpram/user-dashboard-backend:latest`

---

## Setup Instructions

### 1. Configure the Environment
Ensure you have a file named `.env` in the root directory of the project with the following configuration:
```ini
FRONTEND_PORT=8080
BACKEND_PORT=3000
MONGO_PORT=27017
MONGO_URI=mongodb://mongodb:27017/user_dashboard

```
### 2. Start the Application
Run the following single command from the root directory to automatically pull the images from Docker Hub, configure the network links, set up database volumes, and start the entire ecosystem in the background:

Bash
docker compose up -d

### 3. Verify and Access
Frontend Portal: Open your browser and go to http://localhost:8080 to interact with the dashboard.

Backend API Check: Visit http://localhost:3000/api/users to view raw backend records.

Check Running Containers: Run docker compose ps to verify that all three services are up and running cleanly.
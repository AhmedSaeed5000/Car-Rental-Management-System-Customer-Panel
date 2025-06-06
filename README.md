# CRMS Customer Panel

## Overview

The CRMS Customer Panel is a web-based application designed for managing car rental services. It provides a seamless interface for customers to browse, book, and manage car rentals. The system is built with a React frontend and an Express backend, and it integrates with MongoDB for data storage.

## Features

- **Frontend**: Built with React, featuring a modern and responsive UI.
- **Backend**: Powered by Express.js, providing robust APIs for the application.
- **Database**: MongoDB is used for efficient and scalable data storage.
- **Authentication**: Secure user authentication and authorization.
- **Booking Management**: Comprehensive booking and payment handling.

## Containerization

This project is fully containerized using Docker:

- **Backend**: The Express app is containerized with a `Dockerfile` located in the `express-app/` directory.
- **Frontend**: The React app is containerized with a `Dockerfile` located in the `react-app/` directory.
- **MongoDB**: MongoDB is deployed as a containerized service.

## Deployment

The project is deployed using Kubernetes on Minikube. The deployment process includes:

1. Building Docker images for the backend and frontend.
2. Pushing the images to Docker Hub.
3. Deploying the services to Minikube using Kubernetes manifests.

### Deployment Steps

1. **Build Docker Images**:
   ```bash
   docker build --no-cache -t elitron/car-rental-backend ./express-app
   docker build --no-cache -t elitron/car-rental-frontend ./react-app
   ```
2. **Push Images to Docker Hub**:
   ```bash
   docker push elitron/car-rental-backend
   docker push elitron/car-rental-frontend
   ```
3. **Deploy to Kubernetes**:
   ```bash
   kubectl apply -f mongo-deployment.yaml -n car-rental
   kubectl apply -f mongo-service.yaml -n car-rental
   kubectl apply -f express-app/deployment.yaml -n car-rental
   kubectl apply -f express-app/service.yaml -n car-rental
   kubectl apply -f react-app/deployment.yaml -n car-rental
   kubectl apply -f react-app/service.yaml -n car-rental
   ```

## Project Structure

```
CRMS-Customer-Panel/
├── express-app/       # Backend application
├── react-app/         # Frontend application
├── mongo-deployment.yaml  # MongoDB deployment manifest
├── mongo-service.yaml     # MongoDB service manifest
├── docker-compose.yaml    # Docker Compose file for local development
└── .github/workflows/     # CI/CD workflows
```

## Getting Started

### Prerequisites

- Docker
- Kubernetes (Minikube)
- Node.js and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/CRMS-Customer-Panel.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CRMS-Customer-Panel
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd express-app && npm install
   cd ../react-app && npm install
   ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

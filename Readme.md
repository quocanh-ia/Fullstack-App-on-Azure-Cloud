# 🚀 Fullstack App on Azure Cloud – Week 1

This repository contains the fullstack application **API + Web** for **Week 1** of the *Fullstack App on Azure Cloud* project.

The objective of **Step 1** is to build a **production-ready backend API**, containerize it using Docker, store the image in **Azure Container Registry (ACR)**, and deploy it successfully to **Azure Kubernetes Service (AKS)**.

This step establishes the backend foundation for the upcoming steps, including Ingress configuration, frontend deployment, authentication, and HTTPS setup.

---

## ✅ Step 1 – Simple Repository with Azure Container Registry and API Deployment

### 🔹 API Implementation
- Built a simple REST API using **Node.js + Express + TypeScript**
- Implemented a health check endpoint (`/health`) for service monitoring
- Configured TypeScript compiler and development workflow using `ts-node-dev`
- Application listens on `process.env.PORT` (default `3000`) for cloud compatibility

### 🔹 Dockerization
- Created a **multi-stage Dockerfile** to optimize image size
- Used `pnpm` with `corepack` for dependency management
- Compiled TypeScript in the build stage and installed production-only dependencies in the runtime stage
- Verified the container runs correctly in a local Docker environment

### 🔹 Azure Container Registry (ACR)
- Created an Azure Container Registry to store Docker images
- Built, tagged, and pushed the API image to ACR successfully

**Image details:**
- Registry: `mindxintern02acr01.azurecr.io`
- Repository: `api`
- Tag: `1.0.0`

### 🔹 Deployment to Azure Kubernetes Service (AKS)
- Provisioned an AKS cluster and configured local `kubectl` access
- Granted AKS permission to pull images from ACR by assigning the **AcrPull** role
- Deployed the API using Kubernetes manifests with:
  - Container image: `mindxintern02acr01.azurecr.io/api:1.0.0`
  - Container port: `3000`
  - Liveness and readiness probes on `/health`
  - Temporary service exposure via `LoadBalancer` for deployment verification. This exposure was used only for initial verification and later replaced by ingress-based routing.
- Verified that the pod successfully pulled the image from ACR and reached the `Running (1/1)` state

### 🔹 Verification
- API deployment and health check verified successfully
- Health check endpoint `/health` returns `200 OK`
- Application logs confirm stable startup and runtime behavior

---
## ✅ Step 2 – Deploy Application to Azure Kubernetes Service (AKS)

### 🔹 AKS & ACR Integration
- Verified AKS cluster connectivity and node readiness
- Validated AKS permission to pull images from Azure Container Registry (ACR) using managed identity
- Confirmed container image can be pulled securely without using admin credentials

### 🔹 Kubernetes Manifests
- Created Kubernetes manifests to manage the backend workload
- Deployment configuration includes:
  - Container image: `mindxintern02acr01.azurecr.io/api:1.0.0`
  - Container port: `3000`
  - Resource requests and limits (CPU and memory)
  - Liveness and readiness probes using `/health`
- Service configuration:
  - Type: `ClusterIP`
  - Internal-only access within the cluster

### 🔹 Deployment to AKS
- Applied Deployment and Service manifests to the `week1` namespace
- Verified successful rollout of the Deployment
- Confirmed Service does not expose any external IP

### 🔹 Internal Verification
- Verified internal access using Kubernetes port-forwarding
- Requests forwarded from the local machine successfully reached the backend service:
  - `/` returned `Hello MindX`
  - `/health` returned `{ "status": "ok" }`

This confirms that the backend API is running correctly inside AKS as an internal service and is ready to be exposed through an Ingress controller in the next step.

---

## ✅ Step 3 – Setup Ingress Controller for API Access

### Objective
- Deploy NGINX Ingress Controller on AKS
- Expose backend API via ingress-based routing instead of port-forward
- Prepare routing foundation for frontend integration (Step 4)

---

### Ingress Controller Setup
- Installed NGINX Ingress Controller using Helm
- Deployed in namespace `ingress-nginx`
- Ingress controller service type: LoadBalancer
- Azure provisioned an External IP for the ingress controller

---

### API Ingress Configuration
- Created Ingress resource in namespace `week1`
- Routing rule:
  - `/api/*` → `api` service (ClusterIP)
- Enabled regex and rewrite:
  - `/api/health` → `/health`
- Ingress class: `nginx`

---

### Internal Verification
- Ingress controller pod running successfully
- Ingress resource synced correctly
- API reachable inside cluster:
  - `/api/health` returned `{ "status": "ok" }`
- Traffic flow verified:
  ingress → service → api pod

---

### External Access Limitation
- External access via Azure LoadBalancer IP or nip.io domain was not reachable
- Requests timed out due to Azure Network Security Group (NSG) restrictions
- Modifying NSG inbound rules requires higher-level permissions, not available in this environment

---

### Cloudflare Tunnel Workaround
- Used Cloudflare Quick Tunnel to expose ingress controller externally
- Tunnel target:
  ingress-nginx-controller.ingress-nginx.svc.cluster.local:80
- API returned HTTP 200 OK
- https://suited-nominated-characteristic-cams.trycloudflare.com/api/health

---

### Step 3 Conclusion
- Ingress controller and API ingress configured correctly
- Routing works as expected inside the cluster
- External API access successfully verified using Cloudflare Tunnel workaround

---

## ✅ Step 4 – Setup and Deploy React Web App to AKS

### Objective
- Deploy frontend web application to AKS
- Expose both Web and API through a unified ingress entry point
- Enable fullstack communication via path-based routing

---

### Web Application Deployment
- Built frontend using React + TypeScript
- Frontend calls backend using relative path `/api/health`
- Web image built and pushed to Azure Container Registry:
  - Repository: `web`
  - Tag: `1.0.0`

---

### Kubernetes Manifests
- Deployment:
  - Container port: 8080
  - Liveness & readiness probes at `/`
- Service:
  - Type: ClusterIP
  - Port mapping: 80 → 8080

---

### Ingress Configuration
- Reused NGINX ingress controller from Step 3
- Updated ingress rules:
  - `/api/*` → api service
  - `/*` → web service
- Enabled regex and rewrite rules
- Hostless ingress configuration to support Cloudflare Tunnel domain

---

### Internal Verification
- Root path `/` returned frontend HTML
- `/api/health` returned `{ "status": "ok" }`
- Frontend and backend communicate correctly via ingress

---

### External Access via Cloudflare Tunnel
- Continued using Cloudflare Tunnel from Step 3
- Web UI loads successfully
- API responds with HTTP 200 OK
- https://endif-harmony-architect-shown.trycloudflare.com

---

### Step 4 Conclusion
- Frontend deployment completed successfully
- Ingress routing for web and API works correctly
- Fullstack application accessible externally via Cloudflare Tunnel workaround

---

## ✅ Step 5 – Implement Authentication (Registration & Login)

### Objective
- Implement token-based authentication for the backend API
- Allow users to register and log in
- Protect selected API endpoints using JWT authentication
- Verify authentication flow through the existing Kubernetes Ingress setup

---

### Authentication Design
- Authentication is implemented using JSON Web Tokens (JWT)
- Users authenticate via username and password
- After successful login, the API issues a signed JWT
- Protected endpoints require a valid Authorization header in the format:
  Authorization: Bearer <JWT_TOKEN>

This step builds directly on the API, ingress, and routing foundation completed in Steps 1–4.

---

### API Implementation

#### User Registration
- Endpoint: POST /api/auth/register
- Request body example:
  {
    "username": "test",
    "password": "123456"
  }

- Passwords are hashed using bcrypt
- User data is stored in-memory for demonstration purposes
- Successful registration returns a confirmation message

---

#### User Login
- Endpoint: POST /api/auth/login
- Request body example:
  {
    "username": "test",
    "password": "123456"
  }

- Credentials are validated against registered users
- On success, the API returns a JWT access token

---

#### Protected Endpoint
- Endpoint: GET /api/me
- Required header:
  Authorization: Bearer <JWT_TOKEN>

- Returns decoded user information from the JWT

---

### Verification
The authentication flow was verified using PowerShell via the Kubernetes Ingress endpoint.

- Register user via POST /api/auth/register
- Login via POST /api/auth/login and receive JWT access token
- Access protected endpoint GET /api/me with Authorization header

The /api/me endpoint successfully returns user information, confirming:
- JWT is correctly issued and validated
- Authentication middleware works as expected
- Authentication functions correctly through the Kubernetes Ingress

---

### Conclusion
Step 5 is successfully completed.  
The backend API now supports secure user registration, login, and protected endpoints using JWT authentication, fully integrated with the existing AKS and Ingress setup.

---

## ✅ Step 6 – Setup HTTPS Domain and SSL Certificate

### 🎯 Objective
- Verify the complete authentication flow end-to-end
- Ensure backend authentication works correctly through Kubernetes ingress
- Validate that the web frontend can interact with protected API endpoints
- Confirm that the system meets Week 1 Acceptance Criteria

---

### 🔁 Authentication Flow Overview
The following end-to-end flow was implemented and verified:

1. User registers and logs in via the application (verified via web UI and API testing).
2. User logs in and receives a JWT access token
3. The access token is stored in the frontend state
4. The token is attached to API requests via `Authorization: Bearer <token>`
5. Protected endpoint `/api/me` validates the token and returns user information

This confirms that authentication works correctly across:
- Web frontend (React)
- Backend API (Express + JWT)
- Kubernetes ingress routing

---

### 🧪 Web-based Verification

The web application provides a simple UI to test the authentication flow:

- **Register**: Creates a new user
- **Login**: Authenticates user and returns a JWT token
- **Access Token display**: Shows the issued JWT
- **Call /me**: Calls the protected endpoint using the token

Successful response from `/api/me` returns decoded user information:

```json
{
  "user": {
    "sub": "<user-id>",
    "username": "test",
    "iat": 1768471714,
    "exp": 1768475314
  }
}
```
### Conclusion

Step 6 confirms that the full authentication flow works correctly end-to-end,
from the web frontend through Kubernetes ingress to the backend API.

All authentication-related Acceptance Criteria for Week 1 have been satisfied.

---

## 🧱 Tech Stack
- Node.js 20 (Alpine – Docker base image)
- Express.js
- TypeScript
- pnpm (local development)
- Docker
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS)
- Kubernetes (Deployment, Service, Ingress)
- Cloudflare Tunnel (HTTPS workaround)

---
## 📁 Project Structure
.
├─ cert-manager/
│  └─ cluster-issuer.yaml
│
├─ week1/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ middleware/
│  │  │  │  └─ auth.ts
│  │  │  └─ routes/
│  │  │     └─ auth.ts
│  │  ├─ k8s/
│  │  │  ├─ 10-api-deploy.yaml
│  │  │  ├─ 20-api-svc.yaml
│  │  │  └─ 30-api-ingress.yaml
│  │  ├─ Dockerfile
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  └─ tsconfig.json
│  │
│  └─ web/
│     ├─ src/
│     │  └─ App.tsx
│     ├─ k8s/
│     │  ├─ 10-web-deploy.yaml
│     │  ├─ 20-web-svc.yaml
│     │  └─ 30-app-ingress.yaml
│     └─ Dockerfile
│
└─ README.md
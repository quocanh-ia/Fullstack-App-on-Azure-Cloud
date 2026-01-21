# 🚀 Fullstack App on Azure Cloud – Week 1

This repository contains the fullstack application **API + Web** for **Week 1** of the *Fullstack App on Azure Cloud* project.

The objective of **Step 1** is to build a **production-ready backend API**, containerize it using Docker, store the image in **Azure Container Registry (ACR)**, and deploy it successfully to **Azure Kubernetes Service (AKS)**.

This step establishes the backend foundation for the upcoming steps, including Ingress configuration, frontend deployment, authentication, and HTTPS setup.

---

### Acceptance Criteria Verification

## The back-end API is deployed and accessible via public HTTPS endpoint.

- Backend API is deployed on Azure Kubernetes Service (AKS).
- External HTTPS access is provided via Cloudflare Tunnel.
- Health check endpoint:
  https://suited-nominated-characteristic-cams.trycloudflare.com/health
- Expected response:
  { "status": "ok" }

---

## The front-end React web app is deployed and accessible via a public HTTPS domain.

- Front-end React application is deployed on AKS.
- External HTTPS access is provided via Cloudflare Tunnel.
- Web application URL:
  https://endif-harmony-architect-shown.trycloudflare.com

---

## HTTPS is enforced for all endpoints (front-end and back-end).

- All public access is served via HTTPS.
- TLS termination is handled by Cloudflare.
- This approach is used as a network workaround because:
  - External inbound traffic to the Azure LoadBalancer IP is blocked by NSG / network policy.
  - Updating network policies requires higher-level permissions and cannot be done in the current environment.
- Using Cloudflare Tunnel for HTTPS was suggested by the mentor as a fast and acceptable solution.

---

## Authentication is implemented using a custom JWT-based mechanism

- A custom authentication mechanism (Register / Login / JWT) is implemented.
- The solution covers the full authentication lifecycle:
  - User authentication
  - JWT access token issuance
  - Token validation on protected endpoints

---

## Users can log in and log out via the front-end using JWT-based authentication

- Front-end provides login and logout functionality.
- Users can log in, receive a JWT token, and log out by clearing authentication state.

---

## After login, authenticated users can access protected routes/pages on the front-end.

- Front-end implements protected routes.
- Pages requiring authentication cannot be accessed without a valid token.
- After login, authenticated users can access protected pages normally.

---

## The back-end API validates and authorizes requests using JWT access tokens

- Backend validates JWT access tokens on protected endpoints.
- Requests without valid tokens are rejected (401 Unauthorized).
- Token validation and authorization logic is fully implemented.
- The back-end strictly validates and authorizes requests using JWT access tokens.

---

## All services are running on Azure Cloud infrastructure.

- Azure Kubernetes Service (AKS) for orchestration.
- Azure Container Registry (ACR) for container images.
- NGINX Ingress Controller inside AKS.
- Cloudflare Tunnel for external exposure.

---

## Deployment scripts/configs are committed and pushed to the repository pipeline for testing.

- Dockerfiles for API and Web are committed.
- Kubernetes manifests are committed.
- Image versions deployed:
  - API: mindxintern02acr01.azurecr.io/api:1.1.0
  - Web: mindxintern02acr01.azurecr.io/web:1.0.1
- Deployment is fully reproducible using the provided configuration.

---

## Documentation is provided for setup, deployment, and authentication flow.

- README.md:
  - Acceptance Criteria verification
  - Public access URLs
  - Authentication explanation
- Deployment guide (step-by-step):
  Deployment_Guide.docx
- Authentication flow is explained conceptually in this README.

---

# Notes for Reviewer:
- External access via Cloudflare Tunnel is used as a workaround due to inbound network restrictions.
- Custom authentication (JWT) is used as a replacement for OpenID and was confirmed as acceptable by the mentor.

# Note on TLS / HTTPS handling:

- Although cert-manager configuration files are present in the repository,
cert-manager is NOT used in the final deployment flow.
- Due to inbound network restrictions (NSG / network policy) on the Azure LoadBalancer,
HTTPS is terminated at Cloudflare using Cloudflare Tunnel.

---

### 🧱 Tech Stack
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

### 📁 Project Structure

```text
.
├── cert-manager/
│   └── cluster-issuer.yaml
├── week1/
│   ├── api/ 
│   │   ├── src/
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts
│   │   │   ├── routes/
│   │   │   │   └── auth.ts
│   │   │   └── index.ts
│   │   ├── k8s/
│   │   │   ├── 10-api-deploy.yaml
│   │   │   ├── 20-api-svc.yaml
│   │   │   └── 30-api-ingress.yaml
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   └── tsconfig.json
│   └── web/  
│       ├── src/
│       │   ├── pages/
│       │   │   ├── AppPage.tsx
│       │   │   └── LoginPage.tsx
│       │   ├── auth.ts
│       │   ├── ProtectedRoute.tsx
│       │   ├── vite-env.d.ts
│       │   ├── main.tsx
│       │   └── App.tsx
│       ├── k8s/
│       │   ├── 10-web-deploy.yaml
│       │   ├── 20-web-svc.yaml
│       │   └── 30-app-ingress.yaml
│       ├── nginx.conf
│       ├── Dockerfile
│       └── tsconfig.app.json
├── Readme.md
└── Deployment_Guide.docx

```
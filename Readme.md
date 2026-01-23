# 🚀 Fullstack App on Azure Cloud

This repository contains a **fullstack application (API + Web)** built as part of the *Fullstack App on Azure Cloud* program.

The project is delivered incrementally across multiple weeks:
- **Week 1** focuses on core deployment, networking, authentication, and HTTPS access.
- **Week 2** focuses on observability, monitoring, alerting, and analytics.

All services are deployed on **Azure Cloud infrastructure**, with Kubernetes as the orchestration platform.

---

## 🧱 Tech Stack (Overall)

- Node.js 20 (Alpine – Docker base image)
- Express.js
- TypeScript
- pnpm (local development)
- Docker
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS)
- Kubernetes (Deployment, Service, Ingress)
- NGINX Ingress Controller
- Cloudflare Tunnel (HTTPS workaround)
- Azure Application Insights
- Azure Monitor
- Google Analytics (GA4)

---

# 📅 Week 1 – Core Deployment & Authentication

## 🎯 Objectives

This repository contains the fullstack application **API + Web** for **Week 1** of the *Fullstack App on Azure Cloud* project.

The objective of **Step 1** is to build a **production-ready backend API**, containerize it using Docker, store the image in **Azure Container Registry (ACR)**, and deploy it successfully to **Azure Kubernetes Service (AKS)**.

This step establishes the backend foundation for the upcoming steps, including Ingress configuration, frontend deployment, authentication, and HTTPS setup.

---

## Acceptance Criteria Verification (Week 1)

### The back-end API is deployed and accessible via public HTTPS endpoint.

- Backend API is deployed on Azure Kubernetes Service (AKS).
- External HTTPS access is provided via Cloudflare Tunnel.
- Health check endpoint:
  https://suited-nominated-characteristic-cams.trycloudflare.com/health
- Expected response:
  { "status": "ok" }

---

### The front-end React web app is deployed and accessible via a public HTTPS domain.

- Front-end React application is deployed on AKS.
- External HTTPS access is provided via Cloudflare Tunnel.
- Web application URL:
  https://endif-harmony-architect-shown.trycloudflare.com

---

### HTTPS is enforced for all endpoints (front-end and back-end).

- All public access is served via HTTPS.
- TLS termination is handled by Cloudflare.
- This approach is used as a network workaround because:
  - External inbound traffic to the Azure LoadBalancer IP is blocked by NSG / network policy.
  - Updating network policies requires higher-level permissions and cannot be done in the current environment.
- Using Cloudflare Tunnel for HTTPS was suggested by the mentor as a fast and acceptable solution.

---

### Authentication is implemented using a custom JWT-based mechanism

- A custom authentication mechanism (Register / Login / JWT) is implemented.
- The solution covers the full authentication lifecycle:
  - User authentication
  - JWT access token issuance
  - Token validation on protected endpoints

---

### Users can log in and log out via the front-end using JWT-based authentication

- Front-end provides login and logout functionality.
- Users can log in, receive a JWT token, and log out by clearing authentication state.

---

### After login, authenticated users can access protected routes/pages on the front-end.

- Front-end implements protected routes.
- Pages requiring authentication cannot be accessed without a valid token.
- After login, authenticated users can access protected pages normally.

---

### The back-end API validates and authorizes requests using JWT access tokens

- Backend validates JWT access tokens on protected endpoints.
- Requests without valid tokens are rejected (401 Unauthorized).
- Token validation and authorization logic is fully implemented.
- The back-end strictly validates and authorizes requests using JWT access tokens.

---

### All services are running on Azure Cloud infrastructure.

- Azure Kubernetes Service (AKS) for orchestration.
- Azure Container Registry (ACR) for container images.
- NGINX Ingress Controller inside AKS.
- Cloudflare Tunnel for external exposure.

---

### Deployment scripts/configs are committed and pushed to the repository pipeline for testing.

- Dockerfiles for API and Web are committed.
- Kubernetes manifests are committed.
- Image versions deployed:
  - API: mindxintern02acr01.azurecr.io/api:1.1.2
  - Web: mindxintern02acr01.azurecr.io/web:1.3.0
- Deployment is fully reproducible using the provided configuration.

---

### Documentation is provided for setup, deployment, and authentication flow.

- README.md:
  - Acceptance Criteria verification
  - Public access URLs
  - Authentication explanation
- Deployment guide (step-by-step):
  Deployment_Guide.docx
- Authentication flow is explained conceptually in this README.

---

## Notes for Reviewer:
- External access via Cloudflare Tunnel is used as a workaround due to inbound network restrictions.
- Custom authentication (JWT) is used as a replacement for OpenID and was confirmed as acceptable by the mentor.

# Note on TLS / HTTPS handling:

- Although cert-manager configuration files are present in the repository,
cert-manager is NOT used in the final deployment flow.
- Due to inbound network restrictions (NSG / network policy) on the Azure LoadBalancer,
HTTPS is terminated at Cloudflare using Cloudflare Tunnel.

---

# 📅 Week 2 – Observability & Monitoring

## 🎯 Objectives

This document describes **Week 2** of the *Fullstack App on Azure Cloud* project.  
Week 2 focuses on **observability and monitoring**, including logging, metrics, alerting, and analytics.  
No new application features are introduced in this week.

---

## Note on Secret Configuration:
The Application Insights connection string is injected from Kubernetes secret `appinsights-secret`:
```bash
kubectl create secret generic appinsights-secret \
  --from-literal=connection-string="" \
  -n week1
```
This secret was created during initial setup. See `week1/api/k8s/10-api-deploy.yaml` for env configuration.

---

## Acceptance Criteria Verification(Week 2)

### Azure App Insights is integrated with the back-end API and optionally front-end app

- Azure Application Insights is integrated with the **backend API only**
- Frontend does NOT have Application Insights in this implementation
- Rationale: Backend App Insights tracks production metrics (server-side), 
  while frontend uses Google Analytics for product metrics (client-side)
  
- Application Insights resource: `mindx-intern-02-api-insights`
- Telemetry collected (backend only):
  - Requests
  - Failures  
  - Response time
  - Availability signals

---

### Application logs, errors, and performance metrics are visible in Azure App Insights

- Application request logs are available in **Log Analytics**
- Health check endpoint is exposed:
  - `GET /health` → returns **200 OK**

**Verification**
- Azure Portal → Application Insights → Logs
- `requests` table contains recent entries
- Status code **200** is returned from `/health`

---

### Alerts are setup and tested on Azure

- Metric alert rule is created:
  - Name: `week2-api-failed-requests-alert`
  - Condition: `requests/failed > 0`
- Action group:
  - Name: `week2-alert-group`
  - Notification: Email
- Alert test executed successfully

**Verification**
- Azure Portal → Monitor → Alerts
- Alert rule status: Enabled
- Test alert email received from Azure Monitor

---

### Google Analytics is integrated with the front-end app

- Google Analytics **GA4** is integrated with the frontend application
- Measurement ID is configured in the frontend build
- Frontend URL is connected to GA4 data stream

**Verification**
- Google Analytics → Admin → Data Streams
- Web data stream shows the frontend URL
- Data stream status is active

---

### Key product metrics (e.g., page views, user sessions, events) are tracked in Google Analytics.

- Page views and events are successfully sent to Google Analytics
- Tracking is verified using browser DevTools

**Verification**
- Open frontend application in browser
- Open DevTools (F12) → Network tab
- Filter requests with `collect`
- Confirm requests are sent to `google-analytics.com`
- Google Analytics → Realtime Overview shows active users or events

---

### Documentation is provided for how to access and interpret both production and product metrics

- README documents:
  - Application Insights integration
  - Log and alert verification steps
  - Google Analytics integration and validation
  - Deployment and configuration overview

**Verification**
- README contains clear steps for verifying each acceptance criterion

---

### All configuration and integration scripts are committed and pushed to the repository pipeline for testing

- All configuration and integration changes are committed to GitHub
- Repository includes:
  - Application Insights setup
  - Alert rule and action group configuration
  - Google Analytics integration in frontend
  - Updated README for Week 2

**Verification**
- GitHub repository contains Week 2 changes
- README is updated and version-controlled

---

## 📦 Deployment & Configuration Overview (Week2)

- Backend:
  - Azure Application Insights enabled
  - Health endpoint `/health` exposed
- Monitoring:
  - Azure Monitor metric alert for failed requests
  - Email notification via Action Group
- Frontend:
  - Google Analytics GA4 integrated
  - Page views and events tracked
- Documentation:
  - Verification steps clearly documented in this README

---

# 📁 Project Structure

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
│       │   ├── ui/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   └── Layout.tsx
│       │   ├── auth.ts
│       │   ├── ProtectedRoute.tsx
│       │   ├── vite-env.d.ts
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   └── styles.css
│       ├── k8s/
│       │   ├── 10-web-deploy.yaml
│       │   ├── 20-web-svc.yaml
│       │   └── 30-app-ingress.yaml
│       ├── nginx.conf
│       ├── Dockerfile
│       ├── tsconfig.app.json
├── Readme.md
└── Deployment_Guide.docx

```

# 🎨 Airgap Frontend

The Airgap Frontend is a modern web interface built with **React + TailwindCSS** for managing and creating offline builds.

## Features
- **Create a new offline build** by selecting:
  - **npm** packages (with version selection)
  - **pip** packages (with version selection)
  - **apt** packages (with version selection)
- **Version listing** via a `Versions` button for each package (manual selection only — no keyboard autocomplete)
- **Package validation** via a `Validate` button
- **Job status board** with clear status indicators:  
  - `QUEUED` – waiting  
  - `RUNNING` – processing  
  - `SUCCEEDED` – ready to download  
  - `FAILED` – error occurred
- **Artifact download** when jobs are complete

> **Note:**  
> The backend has a partially implemented autocomplete feature, but it is currently disabled in the frontend.  
> Suggestions and help to integrate it are encouraged.

## Requirements
- Node.js ≥ 18
- Backend running on `http://localhost:4000`

## Getting Started
```bash
cd airgap-frontend
npm install
npm run dev

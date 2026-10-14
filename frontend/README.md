# SAILING Frontend

React + TypeScript + Vite frontend for the SAILING maritime jobs platform.

## Run locally

Requirements: Node.js compatible with the versions specified in `package.json`, npm, and the Spring Boot backend.

```bash
npm ci
npm run dev
```

Vite runs the frontend on its development server and proxies requests beginning with `/api` to `http://localhost:8080`. Start the backend separately.

## Available screens

- Home
- Login and member registration (personal, company, store)
- Jobs, talents, companies, stores, and community
- Personal, company, and store profile pages
- Chat screen

## Data and API policy

Screens request data from the backend instead of embedding sample job posts, companies, talents, comments, or chat messages. When a page's API does not exist yet, the page displays a loading, empty, or error state rather than pretending that sample data was returned. See `../INTEGRATION_STATUS.md` for the backend API gaps identified in the current source.

## Commands

```bash
npm run build
npm run lint
```

The full build must be run after dependencies are installed.

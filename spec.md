# Project Spec: My Day - Priority Terminal

## Architecture

- **Frontend**: HTML5, Vanilla JavaScript, CSS (styled with TailwindCSS via CDN)
- **Backend / Services**: 
  - Google Firebase Authentication (Email/Password + Google Login)
  - Vercel Database (Postgres serverless for CRUD task management)
- **Deployment Platform**: Responsive Web / Capacitor for native Android & iOS wrapper containers.

## Data Contracts

### State / Component Contracts

```ts
interface User {
  email: string;
}

interface Task {
  id: string;
  title: string;
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
  completed: boolean;
  time?: string; // Optional deadline
}

interface AppState {
  user: User | null;
  tasks: Task[];
  streak: number;
}
```

## Decisions

### Decision Log

* **Decision**: Next.js/Vite with Capacitor integration.
  * **Reason**: Enables 100% UI fidelity across web, Android, and iOS, allowing direct connection to Vercel Database and Firebase Auth SDKs.
* **Decision**: Eisenhower Matrix Task Quadrants.
  * **Reason**: Optimal prioritizing layout for quick execution, matching high-intensity trading flow.

## Done

* [x] Initialize Git repository
* [x] Add standard `.gitignore`
* [x] Configure local developer Git identity
* [x] Set up Google Stitch MCP connection
* [x] Create high-fidelity "Priority Terminal" web UI prototype
* [x] Implement mock Firebase Auth gate & login bypass
* [x] Implement mock Vercel DB sync latency simulation
* [x] Push progress to remote GitHub repository

## Todo

* [ ] Integrate live Google Firebase Auth SDK
* [ ] Integrate live Vercel Postgres DB API
* [ ] Set up Capacitor mobile platforms
* [ ] Deploy Android application package (APK)
* [ ] Deploy iOS application package

## Current State

Currently working on: Awaiting user review of the UI mockups.

Last completed: Updated UI prototype with Firebase Auth and Vercel DB state.

Next step: Integrate real SDK configurations once UI is approved.

Known blockers: None.

## Verification

Commands:
- Open local web server to verify UI rendering.

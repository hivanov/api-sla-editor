# SLA Editor Application

## Description

This project provides a Vue.js application designed for creating, updating, and modifying YAML-based Service Level Agreement (SLA) documents. It ensures that all SLA documents adhere to a strict schema (`src/spec/spec.json`), preventing inconsistencies and ensuring data integrity. The application bridges the gap between engineering specifications, support policies, and legal requirements by providing a structured and validated approach to SLA management.

## Features

*   **GUI-based Editing:** Comprehensive interface for managing all parts of an SLA document, including:
    *   **Context & Metrics:** Define SLA identity and technical metrics.
    *   **Service Plans:** Create and manage multiple tiers (e.g., Basic, Enterprise).
    *   **Quotas & Pricing:** Set usage limits and associated costs.
    *   **Support & Maintenance:** Define support hours, holiday schedules, and maintenance windows.
    *   **Legal & Compliance:** Manage service credits, exclusions, and lifecycle policies.
*   **Source Code Editing:** Edit SLA documents directly in YAML format using a powerful Ace Editor with syntax highlighting and auto-completion.
*   **Real-time Validation:** Validates SLA documents against a defined JSON schema (`src/spec/spec.json`) in real-time, providing immediate feedback on errors and ensuring compliance with SLA4OAI extensions.
*   **Responsive Design:** Fully responsive layout that adapts to different screen sizes, ensuring a consistent experience across desktop and mobile devices.
*   **Pre-defined Examples:** Includes example SLA documents for common scenarios, such as:
    *   Support hours (e.g., Mon-Fri, 9-17h German time)
    *   Availability metrics (e.g., equivalent to 1 week of downtime)
    *   Performance metrics (e.g., support up to 100 concurrent connections for all APIs)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (version 20.x or later recommended, as specified in `package.json`)
*   npm (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sla/editor
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To build the application for production to the `dist` directory:

```bash
npm run build
```

You can then preview the built application locally:

```bash
npm run preview
```

## Testing

The project uses Vitest for unit/component tests and Playwright for integration tests.

### Running Unit/Component Tests (Vitest)

To run all Vitest tests once in a non-interactive mode:

```bash
npm exec vitest -- --run
```

### Running Integration Tests (Playwright)

To run Playwright integration tests:

```bash
npx playwright test
```

**Note:** Playwright tests are configured to run with a default viewport of `1280x720` (as defined in `playwright-integration.config.ts`) to ensure consistent testing of the desktop layout.
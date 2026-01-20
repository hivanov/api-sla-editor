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

To run all Vitest tests once:

```bash
npm run test:unit
```

### Running Integration Tests (Playwright)

To run all Playwright integration tests:

```bash
npm run test:integration
```

### Running All Tests

To run both unit and integration tests:

```bash
npm test
```

**Note:** Playwright tests are configured to run with a default viewport of `1280x720` (as defined in `playwright-integration.config.ts`) to ensure consistent testing of the desktop layout.

## Lessons Learned

*Always update this section with lessons learned after every finished task.*

### Component & State Management
*   **Component Extraction:** When refactoring complex logic into reusable components (e.g., `ServiceLevelObjectivesEditor`), ensure all reactive state management and event emitters are fully ported.
*   **Dependency Injection in Tests:** When using Vue's `provide/inject` pattern, Vitest `mount` calls must include `global: { provide: { ... } }`.
*   **Datalist Searchability:** Using `<datalist>` with a text input is an effective way to provide "search-as-you-type" functionality without external libraries.

### Testing (Vitest & Playwright)
*   **Playwright Selector Robustness:** Use specific parent classes or unique attributes (e.g., `.guarantees-editor-component select`, `.metric-selector`) to avoid "strict mode violations" in the UI.
*   **Integration Test Visibility:** Ensure tests explicitly navigate to the correct tab (e.g., "Source") before asserting against DOM content like Ace Editor values.
*   **Playwright Hook Timeouts:** Default timeouts are often insufficient for long-running operations like Docker container startup. Use explicit timeouts in hooks (e.g., `300_000ms`).
*   **Mock Service Readiness:** `Wait.forListeningPorts()` is more reliable than `Wait.forLogMessage()` for determining service readiness in testcontainers.
*   **Editor "Raw Mode" Interaction:** Tests must explicitly toggle the "Raw PromQL" switch before interacting with underlying textareas if the GUI is the default.
*   **Validation-Driven Test Design:** Implementing new validation rules (e.g., unused metrics) requires updating all integration tests to ensure they generate valid, complete documents.

### Monitoring & Generators
*   **GCP Monitoring (Terraform):** Traverse all possible locations (Direct guarantees, Plan SLOs, Support SLOs) when generating system-wide configurations like Alert Policies.
*   **Terraform Syntax (Escaping):** Complex monitoring filters require nested quote escaping. Simplifying generator logic (e.g., reducing excessive backslashes) improves both readability and testability.
*   **Protocol Consistency:** Ensure application logic and generators agree on URI formats (e.g., `mailto://` vs `mailto:`).
*   **Custom Resource Generation:** Heuristics (like checking for `custom.googleapis.com`) can help decide when to generate supporting resources like `google_monitoring_metric_descriptor`.

### PromQL & Parsers

*   **Strict Grammar Compliance:** Adhere to official grammar specifications (e.g., Prometheus's `generated_parser.y`) to ensure ecosystem compatibility.

*   **Safe Parser Visitors:** ANTLR-generated visitors must be robust against partial/malformed input to prevent crashes during real-time parsing.

*   **Strict Metric Definition:** PromQL expressions must only reference metrics explicitly defined in the `metrics` section of the SLA.

*   **Standard-First Design:** Prioritize official standard adherence over lenient custom extensions.

*   **Cross-Reference Validation:** Use custom JavaScript validation for logical consistency between sections (e.g., ensuring all defined metrics are used), as structural schema validation (AJV) is insufficient for these checks.

*   **Recursive Specification Traversal:** Use recursive traversal functions to accurately capture all possible metric reference points, including nested objects and DSL identifiers.



### UI & Styling

*   **Bootstrap Interactive Components:** Interactive elements (Accordions, Dropdowns) require the Bootstrap JS bundle (`bootstrap.bundle.min.js`), not just CSS.

*   **Responsive Height Management:** Use flexbox and dynamic height calculations for components like Ace Editor to maintain usability across screen sizes.

*   **Reverse Lookups for UX:** Use utility functions to display friendly names instead of cryptic URIs (e.g., for Google Calendar URLs).

*   **Global Utility Exposure for Testing:** Expose internal state-modifying functions to the `window` object to facilitate robust automated testing with Playwright.

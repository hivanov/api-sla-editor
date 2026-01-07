# Purpose

## Summary & Detailed Information
These files represent a significant maturity upgrade over standard API documentation. They bridge the gap between Engineering (what the API does), Support (how we help), and Legal (what happens if we fail).

A. The JSON Schema (sla-schema.json)
This file acts as the Governor. It ensures that any SLA file created by your team follows strict rules.

Purpose: To prevent "lazy" documentation (e.g., entering "Mon-Fri" as a string instead of structured data).

Key Validations:

URI Strictness: Prevents putting a phone number in a web field.

ISO 8601 Durations: Enforces PT1H (Standard) instead of "1 hour" (Ambiguous).

Holiday Logic: Ensures that if you select type: region, you must provide a regionCode.

B. The YAML Specification (sla.yaml)
This file is the Contract. It is designed to be parsed by two audiences:

Humans (Documentation): Tools like ReDoc or SwaggerUI can display the "Support Policy" and "Service Credits" as readable tables.

Machines (Monitoring):

SLA Monitors: Can read guarantees to alert if uptime drops below 99.95%.

Support Bots: Can parse holidaySchedule and hoursAvailable to automatically reply "We are currently closed for German Unity Day" without human intervention.

Billing Systems: Can parse x-service-credits to automatically calculate refunds based on uptime reports.

C. Standards Alignment Table
To help you sell this to stakeholders, here is the lineage of every block in the schema:

|Block|Standard / Attribute|Rationale|
|Support Hours|Schema.org (OpeningHoursSpecification)|The web standard for business hours. Handles timezones and split shifts natively.|
|Holidays|ISO 3166 (Region Codes)|Allows dynamic holiday calculation (e.g., Easter) via standard libraries instead of hardcoding dates.|
|Durations|ISO 8601 (P1D, PT1H)|Universally parsable time format. Removes ambiguity between "m" (minute) and "M" (month).|
|Maintenance|RFC 5545 (iCalendar / RRULE)|The same standard used by Outlook/Google Calendar. Allows recurring windows (e.g., "Every 2nd Sunday") to be machine-calculated.|
|Credits|WS-Agreement|Derived from the grid computing standard for defining penalties and compensation.|
|Lifecycle|TMF623|TeleManagement Forum standard for SLA lifecycle (Active, Suspended, Terminated).|

## What we need
A Vue.js application, which creates, updates and modifies YAML SLA documents according to the schema (defined in schema/schema.json), similar to (example/example.yaml).

It should also provide pre-defined examples, such as:
- Support: Mon through Fri from 9 to 17h German time,
- availability: Equivalent to 1 week of downtime (use the uptime calculator in https://uptime.is/)
- metrics: support up to 100 concurrent connections for all APIs,

It should provide an easy editor for adding, removing and modifying document parts using both a GUI and by writing them by hand (view/edit source). 

It should also provide validation of SLA documents based on the provided schema.

---

## Recent Findings and Project Setup Notes

### Test Execution

*   **Vitest:** To run Vitest tests in a non-interactive mode (without waiting for file changes), use the command:
    ```bash
    npm exec vitest -- --run
    ```
*   **Playwright Integration Tests:** To run Playwright integration tests, use the command:
    ```bash
    npx playwright test
    ```
    Note that `playwright-integration.config.ts` has been configured with a default `viewport: { width: 1280, height: 720 }` to ensure tests run with a consistent desktop layout.

### Responsive Design Implementation

The application has been updated to be more responsive. Key changes include:

*   **`src/App.vue`:**
    *   Updated Bootstrap column classes in the main content area from `col-8` to `col-12 col-md-8` and in the sidebar from `col-4` to `col-12 col-md-4`. This ensures vertical stacking on smaller screens and a two-column layout on medium and larger screens.
    *   The `aceEditor` now uses a responsive height via the `ace-editor-container` class, defined in `App.vue`'s style block, with a `min-height` and a dynamic `height` calculation, adjusting for smaller screens.
    *   The `#app` CSS in `App.vue` has been updated to use flexbox for full viewport height management.

### CSS Consolidation

*   `src/assets/base.css` has been merged into `src/assets/main.css` to reduce HTTP requests and simplify CSS management. The `@import './base.css'` line was removed from `main.css`, and the content of `base.css` was prepended to `main.css`. `src/assets/base.css` was subsequently deleted.
*   Conflicting `#app` styles (e.g., `max-width`, `margin`, `padding`, `grid-template-columns`) were removed from `src/assets/main.css` as they were being superseded by Bootstrap's flexbox grid in `App.vue`.

### Playwright Test Fix

*   The Playwright integration test `tests/integration/main-flow.spec.ts` had a failing test (`should show validation errors`) due to an outdated locator. The selector was changed from `.col-4 .card .card-body .alert-danger` to `.col-md-4 .card .card-body .alert-danger` to correctly target the validation error message in the responsive layout, which now uses `col-md-4` on the configured desktop viewport.
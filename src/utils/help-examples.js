export const helpItems = [
  {
    title: "Why this tool?",
    brief: "Empowering teams through clear service contracts.",
    detail: "This editor simplifies the creation of Service Level Agreements, shifting them from complex monitoring tools to comprehensive frameworks that protect service providers and inform consumers. It allows teams to define sustainable operational conditions while providing transparent guarantees.",
    example: "Using the tool to define a clear support window (e.g., Mon-Fri 09:00-17:00) to manage expectations and ensure team sustainability.",
    interpretation: "The tool is a strategic asset for resource advocacy and trust-building between service providers and consumers.",
  },
  {
    title: "Plan vs. Agreement",
    brief: "Templates vs. Specific Contracts.",
    detail: "A 'Plan' is a template or a product offering (e.g., 'Gold Tier', 'Free Tier') that applies to anyone who subscribes to it. An 'Agreement' is a specific instance of a plan tailored for a specific customer, often containing specific overrides or custom terms. In this tool, you primarily define 'Plans' which serve as the catalog of service levels you offer.",
    example: "<strong>Plan:</strong> 'Standard Hosting' (Available to all).<br><strong>Agreement:</strong> 'Standard Hosting for Acme Corp' (Signed on 2023-01-01).",
    interpretation: "Use Plans to define your general offerings. Use Agreements when you need to represent a legally binding contract with a specific entity.",
    links: [{ text: "WS-Agreement Specification", url: "https://en.wikipedia.org/wiki/WS-Agreement" }]
  },
  {
    title: "Custom Currencies",
    brief: "Define non-monetary units for quotas and pricing.",
    detail: "Not all costs are monetary. You might want to charge users in 'API Credits', 'CPU Tokens', or limit them by 'Requests'. Custom currencies allow you to define these abstract units and potentially map them to real-world currencies (e.g., 1 Token = $0.05). This abstracts the technical accounting from the financial accounting.",
    example: "Code: <code>AI_TOKENS</code>, Name: 'AI Generation Tokens'.",
    interpretation: "Allows you to say 'This service costs 5 AI Tokens' instead of '$0.25', giving you flexibility to change the exchange rate later without rewriting all plans.",
  },
  {
    title: "Metrics",
    brief: "Measurable properties of the service.",
    detail: "Metrics are the fundamental building blocks of an SLA. They define *what* you are measuring. Good metrics should be based on business capabilities (e.g., 'Orders Processed', 'Successful Logins') rather than just low-level technical stats (e.g., 'CPU Load'), although both are supported. They are used in Quotas, Guarantees, and Pricing.",
    example: "<strong>Metric:</strong> <code>http_requests</code><br><strong>Type:</strong> Counter<br><strong>Description:</strong> Number of HTTP requests received.",
    interpretation: "Defines the vocabulary your SLA will speak. You cannot set a limit on 'requests' if you haven't defined what a 'request' is.",
    links: [{ text: "Google SRE Book - Service Level Indicators", url: "https://sre.google/sre-book/service-level-objectives/" }]
  },
  {
    title: "Plans",
    brief: "Bundles of service levels and limits.",
    detail: "A Plan groups together Availability, Pricing, Quotas, and Policies. It represents a distinct tier of service. You might have multiple plans like 'Free', 'Pro', and 'Enterprise' within the same SLA document.",
    example: "<strong>Plan Name:</strong> <code>Pro_Tier</code>",
    interpretation: "The container for all the specific rules and promises made to a subset of users.",
  },
  {
    title: "Availability & Uptime Calculator",
    brief: "Uptime promises and downtime definitions.",
    detail: "Defines the expected uptime of the service (e.g., 99.9%). It must also define what 'downtime' actually means (e.g., 'Error rate > 5%').\n\nThe editor includes a **built-in uptime calculator** that translates percentages into real-world time (e.g., '99.9% = 43m 49s downtime/month'). It also allows defining availability via PromQL expressions.",
    promql: "up == 1",
    example: "<strong>Percentage:</strong> 99.95%<br><strong>Definition:</strong> <code>up == 1</code>",
    interpretation: "Commitment that the service will be usable 99.95% of the time, allowing for roughly 21 minutes of downtime per month.",
    links: [{ text: "Uptime Calculator", url: "https://uptime.is/" }]
  },
  {
    title: "Pricing",
    brief: "Cost models for the service.",
    detail: "Defines how users are charged. Can be flat fees (subscription), usage-based (pay-per-request), or tiered. You can link pricing to specific metrics defined earlier.",
    example: "<strong>Cost:</strong> 10 USD per Month<br><strong>Overage:</strong> 0.001 USD per <code>request</code>.",
    interpretation: "Users pay $10/mo fixed, plus extra if they exceed included usage.",
  },
  {
    title: "Quotas",
    brief: "Usage limits.",
    detail: "Hard or soft limits on how much a user can consume. Quotas are defined as **PromQL** expressions that represent the limit condition.",
    promql: "rate(http_requests_total[1m]) < 100",
    example: "<strong>Limit:</strong> <code>rate(http_requests_total[1m]) < 100</code>",
    interpretation: "User is limited to 100 requests per minute.",
  },
  {
    title: "Guarantees",
    brief: "Hard commitments with penalties.",
    detail: "Specific thresholds that, if breached, result in a penalty (Service Credit) for the provider. In this editor, guarantees are defined using **PromQL** expressions that evaluate to a boolean (violation condition) or a value to be compared.",
    promql: "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[1h])) < 0.5",
    example: "<strong>Measurement:</strong> <code>histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[1h])) < 0.5</code>",
    interpretation: "Guaranteed that 99% of requests are faster than 500ms over 1 hour. If not, compensation applies.",
  },
  {
    title: "Transformers & Generators",
    brief: "Generate platform-specific monitoring configs.",
    detail: "The SLA Editor transforms your abstract guarantees into concrete configuration files for major monitoring platforms. This ensures your technical implementation matches your legal promises.\n\n### 1. GCP Terraform Generator\n*   **Functionality:** Generates `google_monitoring_alert_policy`, `google_monitoring_metric_descriptor`, and `google_monitoring_notification_channel` resources.\n*   **Coverage:** \n    *   **Simple Metrics:** Maps directly to `condition_threshold` (Stackdriver).\n    *   **Complex Queries:** Detects PromQL (e.g., `rate(...)`) and generates `condition_prometheus_query_language` for GCP Managed Prometheus.\n    *   **Notifications:** Converts email/SMS contact points into Notification Channels.\n*   **Requirements:** A valid **GCP Project ID**.\n\n### 2. Azure Bicep Generator\n*   **Functionality:** Generates `Microsoft.Insights/metricalerts`, `Microsoft.AlertsManagement/prometheusRuleGroups`, and `Microsoft.Insights/actionGroups`.\n*   **Coverage:**\n    *   **Simple Metrics:** Maps to standard Metric Alerts.\n    *   **Complex Queries:** Maps to Prometheus Rule Groups (for Azure Monitor Managed Prometheus).\n    *   **Notifications:** Converts email/SMS contact points into Action Groups.\n*   **Requirements:** An **Azure Resource ID** (scope) and **Location** (e.g., `eastus`).\n\n### 3. Grafana Dashboard Generator\n*   **Functionality:** Generates a complete Dashboard (`.json`) and Alert Rules (`.yaml`).\n*   **Coverage:**\n    *   **Visuals:** Creates Stat panels for current status and TimeSeries panels for trends.\n    *   **Alerts:** Generates Prometheus-compatible alert rules in YAML format.\n    *   **Availability:** Automatically calculates availability panels based on uptime targets.\n*   **Requirements:** The **Datasource UID** of your Prometheus instance in Grafana.",
    example: "Click the **Generators** button in the toolbar to access these tools. Paste the output directly into your `main.tf`, `main.bicep`, or Grafana Import dialog.",
    interpretation: "Automates the 'boring' part of setting up SLA monitoring and reduces human error.",
  },
  {
    title: "PromQL & Advanced Monitoring",
    brief: "First-class support for Prometheus queries.",
    detail: "For modern cloud environments, the editor supports PromQL (Prometheus Query Language). You can define measurements using PromQL, which the editor will validate for syntax errors. When generating Grafana or Terraform, these queries are used to create the actual monitoring logic.",
    promql: "avg_over_time(up[5m]) > 0.99",
    example: "Measurement: <code>avg_over_time(up[5m]) > 0.99</code>",
    interpretation: "Allows for precise, technical definitions of what constitutes a breach or success.",
  },
  {
    title: "SLOs (Service Level Objectives)",
    brief: "Internal goals, softer than guarantees.",
    detail: "Target levels for reliability or performance that the team aims for. Unlike Guarantees, missing an SLO doesn't necessarily trigger a refund, but it triggers internal alerts or slowing down releases. You can define SLOs at the Plan level using **PromQL** expressions.",
    promql: "sum(rate(http_request_errors[5m])) / sum(rate(http_requests[5m])) < 0.001",
    example: "<strong>Objective:</strong> <code>sum(rate(http_request_errors[5m])) / sum(rate(http_requests[5m])) < 0.001</code>",
    interpretation: "We aim for an error rate of less than 0.1% over any 5-minute window. If we miss this, we pause feature work.",
  },
  {
    title: "Markdown Support",
    brief: "Rich text for descriptions.",
    detail: "Several fields, including the Context description and Metric descriptions, support Markdown. This allows you to include links, lists, and formatting directly in your SLA document to make it more readable for humans.",
    example: "Using <code>**bold**</code> for emphasis or <code>[link](url)</code> for documentation.",
    interpretation: "Ensures the 'human-readable' part of the SLA is actually high quality.",
  },
  {
    title: "Support Policies",
    brief: "When and how help is available.",
    detail: "Support policies define the human aspect of your service commitment. They consist of three main components:\n\n1. **Hours Available:** Defines when support staff is active. Uses the Schema.org OpeningHoursSpecification. Properties include 'dayOfWeek' (list of days), 'opens' (start time, e.g., 09:00), and 'closes' (end time, e.g., 17:00). You can also link a 'Holiday Schedule' (e.g., German Public Holidays) which will automatically exclude those days from support availability.\n2. **Contact Points:** The channels through which users can reach support. Each point has a 'Type' (Email, Phone, Web, Slack, etc.) and a 'Value' (the actual address or URL). You can specify which language is supported at each point.\n3. **Response Times:** The promised speed of support based on the severity of the issue. You define a 'Severity' (Critical, High, Medium, Low) and a 'Target' duration (e.g., PT1H for 1 hour). PT follows ISO 8601 format.",
    example: "<strong>Hours:</strong> Mon-Fri 09:00-17:00 (Berlin Time).<br><strong>Contact:</strong> email: support@example.com.<br><strong>Response:</strong> Critical issues within 1 hour.",
    interpretation: "If a user emails at 10 AM on a Tuesday, they should expect a reply for a critical bug by 11 AM. If they email on a Sunday, the timer starts at 9 AM on Monday.",
    links: [
      { text: "Schema.org OpeningHours", url: "https://schema.org/OpeningHoursSpecification" },
      { text: "ISO 8601 Durations", url: "https://en.wikipedia.org/wiki/ISO_8601#Durations" }
    ]
  },
  {
    title: "Service Credits",
    brief: "Compensation for failures.",
    detail: "The actual currency or percentage returned to the user when a Guarantee is breached.",
    example: "<strong>Amount:</strong> 100% of monthly fee.",
    interpretation: "The refund mechanism.",
  },
  {
    title: "Maintenance Policies",
    brief: "Scheduled downtime rules.",
    detail: "Defines the rules for planned service interruptions. Key properties include:\n\n1. **Counts as Downtime:** A boolean flag. If 'false', any downtime during a maintenance window is ignored when calculating availability for SLA guarantees.\n2. **Maintenance Window:** When the work happens. Usually defined by an RRULE (Recurrence Rule), which allows for complex patterns like 'Every second Sunday of the month at 2 AM'. It also includes a 'duration' (how long the window lasts).\n3. **Notice Period:** How far in advance the provider must notify the user before starting maintenance (e.g., P7D for 7 days notice).\n4. **Blackout Periods:** Specific times (like 'Black Friday' or 'End of Quarter') where no maintenance is allowed to ensure maximum stability.",
    example: "<strong>Window:</strong> FREQ=MONTHLY;BYDAY=1SU (First Sunday).<br><strong>Notice:</strong> P14D (14 days).<br><strong>Counts as Downtime:</strong> False.",
    interpretation: "The provider can take the service down for 2 hours on the first Sunday of every month without it hurting their 99.9% uptime promise, provided they told the user about it 2 weeks ago.",
    links: [
      { text: "iCalendar RRULE Tool", url: "https://jakubroztocil.github.io/rrule/" },
      { text: "RFC 5545 Maintenance Standard", url: "https://www.rfc-editor.org/rfc/rfc5545" }
    ]
  },
  {
    title: "Exclusions",
    brief: "What doesn't count as failure.",
    detail: "Specific scenarios where the SLA does not apply. These can be text descriptions (e.g., 'Force Majeure') or **PromQL** conditions (e.g., maintenance windows) that, when true, exempt the provider from SLA breaches.",
    promql: "maintenance_mode == 1",
    example: "<strong>Condition:</strong> <code>maintenance_mode == 1</code>",
    interpretation: "SLA does not apply when the system is explicitly in maintenance mode.",
  },
  {
    title: "Force Majeure",
    brief: "Uncontrollable events.",
    detail: "Clause excusing the provider from liability during major catastrophes (war, natural disasters, internet backbone failures).",
    example: "Events beyond reasonable control including earthquakes or government action.",
    interpretation: "We can't promise uptime if a meteor hits the data center.",
  }
];
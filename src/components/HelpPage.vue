<template>
  <div class="container-xxl py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h2 class="mb-4">SLA Editor Help</h2>
        <p class="text-muted mb-4">Detailed guide to all functionalities and concepts within the SLA Editor.</p>

        <div class="accordion shadow-sm" id="helpAccordion">
          
          <!-- Template for Help Items -->
          <div class="accordion-item" v-for="(item, index) in helpItems" :key="index">
            <h2 class="accordion-header" :id="'heading' + index">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" aria-expanded="false" :aria-controls="'collapse' + index">
                <span class="fw-bold me-2">{{ item.title }}</span> <span class="text-muted small">- {{ item.brief }}</span>
              </button>
            </h2>
            <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#helpAccordion">
              <div class="accordion-body">
                <div class="mb-3">
                  <h5 class="h6 fw-bold text-primary">Detailed Explanation</h5>
                  <p>{{ item.detail }}</p>
                </div>
                
                <div class="mb-3" v-if="item.example">
                  <h5 class="h6 fw-bold text-success">Example & Interpretation</h5>
                  <div class="card bg-light border-0">
                    <div class="card-body">
                      <p class="mb-2" v-html="item.example"></p>
                      <div class="small text-muted border-top pt-2 mt-2 fst-italic">
                        <strong>Interpretation:</strong> {{ item.interpretation }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="item.links && item.links.length">
                  <h5 class="h6 fw-bold text-info">Additional Information</h5>
                  <ul class="list-unstyled">
                    <li v-for="(link, lIndex) in item.links" :key="lIndex">
                      <a :href="link.url" target="_blank" class="text-decoration-none">
                        <i class="bi bi-box-arrow-up-right small me-1"></i> {{ link.text }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="text-center mt-5">
          <button class="btn btn-primary" @click="$emit('close')">Back to Editor</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpPage',
  emits: ['close'],
  data() {
    return {
      helpItems: [
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
          title: "Availability",
          brief: "Uptime promises and downtime definitions.",
          detail: "Defines the expected uptime of the service (e.g., 99.9%). It must also define what 'downtime' actually means (e.g., 'Error rate > 5%'). The tool allows defining this via reliability tiers or specific uptime percentages.",
          example: "<strong>Percentage:</strong> 99.95%<br><strong>Definition:</strong> Service returns 5xx errors for > 1 minute.",
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
          detail: "Hard or soft limits on how much a user can consume. This protects the service from abuse and enforces tier differentiation.",
          example: "<strong>Metric:</strong> <code>disk_storage</code><br><strong>Limit:</strong> 10 GB<br><strong>Period:</strong> Monthly",
          interpretation: "User cannot store more than 10GB of data.",
        },
        {
          title: "Guarantees",
          brief: "Hard commitments with penalties.",
          detail: "Specific thresholds that, if breached, result in a penalty (Service Credit) for the provider. These are legally binding in a contract context.",
          example: "<strong>Target:</strong> 99.9% Uptime<br><strong>Penalty:</strong> 10% refund if < 99.9%, 50% if < 99.0%.",
          interpretation: "If we fail to meet this standard, we owe you money/credits.",
        },
        {
          title: "SLOs (Service Level Objectives)",
          brief: "Internal goals, softer than guarantees.",
          detail: "Target levels for reliability or performance that the team aims for. Unlike Guarantees, missing an SLO doesn't necessarily trigger a refund, but it triggers internal alerts or slowing down releases.",
          example: "<strong>Objective:</strong> 99.9% of requests < 200ms.",
          interpretation: "We try our best to be this fast. If we aren't, we stop adding features until we fix it.",
        },
        {
          title: "Support Policies",
          brief: "When and how help is available.",
          detail: "Defines the hours of operation for support (e.g., 'Mon-Fri 9-5') and response time guarantees (e.g., 'Critical issues answered within 1 hour').",
          example: "<strong>Availability:</strong> Business Hours (Mon-Fri, 09:00-17:00)<br><strong>Response Time:</strong> 4 hours for High Severity.",
          interpretation: "Don't expect an answer on Sunday unless you have the Enterprise plan.",
          links: [{ text: "Schema.org OpeningHours", url: "https://schema.org/OpeningHoursSpecification" }]
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
          detail: "Defines when planned maintenance can occur without counting as 'downtime' against the SLA. Usually defined using recurrence rules (RRULE).",
          example: "<strong>Window:</strong> Every Sunday at 02:00 UTC for 1 hour.",
          interpretation: "If the site is down during this specific hour for updates, it doesn't violate the 99.9% guarantee.",
          links: [{ text: "iCalendar RRULE", url: "https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html" }]
        },
        {
          title: "Exclusions",
          brief: "What doesn't count as failure.",
          detail: "Specific scenarios where the SLA does not apply, such as user error, alpha features, or scheduled maintenance.",
          example: "<strong>Exclusion:</strong> Issues caused by user's custom code.",
          interpretation: "If you break it with your own bad code, we aren't responsible.",
        },
        {
          title: "Force Majeure",
          brief: "Uncontrollable events.",
          detail: "Clause excusing the provider from liability during major catastrophes (war, natural disasters, internet backbone failures).",
          example: "Events beyond reasonable control including earthquakes or government action.",
          interpretation: "We can't promise uptime if a meteor hits the data center.",
        }
      ]
    }
  }
}
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
}
</style>

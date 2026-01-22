<template>
  <div class="container-xxl py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h2 class="mb-4">SLA Editor Tutorial</h2>

        <section class="mb-5">
          <div class="card border-info">
            <div class="card-header bg-info text-white">
              <h3 class="h5 mb-0">Motivation: Why this tool exists</h3>
            </div>
            <div class="card-body">
              <p>
                In modern service-oriented architectures, exposing reliable APIs is essential for scalability. However, service providers often hesitate to commit to performance guarantees due to the perceived complexity and risk of managing strict contracts.
              </p>
              <p>
                This tool is designed to <strong>demystify the SLA contract</strong>. By providing a clear, visual way to design agreements, it empowers teams to:
              </p>
              <div class="row">
                <div class="col-md-4">
                  <div class="fw-bold text-info">Define Boundaries</div>
                  <p class="small">Establish clear distinctions between what is supported and what is not, protecting the team from unreasonable expectations.</p>
                </div>
                <div class="col-md-4">
                  <div class="fw-bold text-info">Justify Resources</div>
                  <p class="small">Use formal agreements to demonstrate the need for additional infrastructure or personnel when service requirements grow.</p>
                </div>
                <div class="col-md-4">
                  <div class="fw-bold text-info">Standardize Quality</div>
                  <p class="small">Adopt and modify validated contract templates to ensure consistency across a diverse portfolio of services.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <div class="card">
            <div class="card-header bg-white">
              <h3 class="h5 mb-0">The Philosophy of Modern SLAs</h3>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h4 class="h6 fw-bold">From Monitoring to Mutual Agreement</h4>
                <p>
                  SLAs are often viewed solely as monitoring instruments. This tool reframes them as <strong>transparent agreements</strong>. By stating operational conditions upfront (e.g., support hours, maintenance windows), providers can ensure service sustainability while meeting consumer needs.
                </p>
              </div>

              <div class="mb-4">
                <h4 class="h6 fw-bold">Value-Driven Metrics</h4>
                <p>
                  While technical indicators like latency are vital, we emphasize <strong>business-aligned metrics</strong>. Defining what truly matters to the service consumer leads to more meaningful contracts than generic technical specifications.
                </p>
              </div>

              <div>
                <h4 class="h6 fw-bold">Operational Accountability</h4>
                <p>
                  Designing an SLA forces a critical evaluation of capacity. 
                  Calculating the cost of various reliability levels (using tools like <a href="https://uptime.is/" target="_blank">uptime.is</a>) helps align technical capabilities with stakeholder expectations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <div class="card">
            <div class="card-header bg-white">
              <h3 class="h5 mb-0">Purpose of this Tool</h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item px-0">
                  <h5 class="h6 fw-bold">Standardization</h5>
                  <p class="mb-0">
                    To build SLA contracts in a standard, computer-readable language (YAML/JSON). 
                    This ensures that the contracts are not just PDF documents buried in a drawer but living configurations 
                    that can be parsed by monitoring tools, billing systems, and support bots.
                  </p>
                </li>
                <li class="list-group-item px-0">
                  <h5 class="h6 fw-bold">Visual Creation</h5>
                  <p class="mb-0">
                    To enable the creation of complex SLA contracts visually using simple controls. 
                    Users don't need to memorize the schema or syntax; the GUI guides them through defining metrics, plans, and policies.
                  </p>
                </li>
                <li class="list-group-item px-0">
                  <h5 class="h6 fw-bold">Replication and Templates</h5>
                  <p class="mb-0">
                    To allow for easy replication and carry-over of contracts. 
                    You can load existing examples or templates and modify them to suit new services, ensuring consistency across an organization's service portfolio.
                  </p>
                </li>
                <li class="list-group-item px-0">
                  <h5 class="h6 fw-bold">Human-Readable Visualization</h5>
                  <p class="mb-0">
                    To visualize the content of the SLA policy as simple, natural text. 
                    The "Description" tab automatically generates a human-readable summary of the technical configuration, bridging the gap between developers and business stakeholders.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <div class="card border-primary">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">Step-by-Step Example: Pet Store API</h3>
            </div>
            <div class="card-body">
              <p>Let's walk through creating a standard SLA for a fictional <strong>Pet Store API</strong>.</p>
              
              <div class="accordion" id="tutorialSteps">
                <!-- Step 1 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#step1">
                      1. Define the Context
                    </button>
                  </h2>
                  <div id="step1" class="accordion-collapse collapse show" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      Give your SLA an identity. Set the ID to <code>petstore-api-v2</code>. This ID will be used by systems to identify which contract applies to which service.
                    </div>
                  </div>
                </div>

                <!-- Step 2 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step2">
                      2. Define Key Metrics
                    </button>
                  </h2>
                  <div id="step2" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      Define the metrics that provide value to your service. In our Pet Store:
                      <ul>
                        <li><code>request_latency</code> (Number, ms): The time between request receipt and response.</li>
                        <li><code>api_availability</code> (Percentage, %): Successful requests vs total requests.</li>
                        <li><code>order_processing_time</code> (Number, s): Time from order creation to "Ready for Pickup".</li>
                        <li><code>monthly_requests</code> (Integer): Total requests consumed by the client.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Step 3 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step3">
                      3. Create Plans (Quotas & Guarantees)
                    </button>
                  </h2>
                  <div id="step3" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      <p>Synchronize your metrics with specific commitments in your plans:</p>
                      
                      <h6><strong>Free Tier (Community)</strong></h6>
                      <ul>
                        <li><strong>Availability:</strong> 99.0%</li>
                        <li><strong>Pricing:</strong> 0 USD.</li>
                        <li><strong>Quotas:</strong> <code>monthly_requests</code> limited to 1,000.</li>
                        <li><strong>Guarantees:</strong> <code>request_latency</code> &lt; 2000ms.</li>
                        <li><strong>SLO:</strong> 95% of orders processed within 30s.</li>
                      </ul>

                      <h6><strong>Pro Tier (Business)</strong></h6>
                      <ul>
                        <li><strong>Availability:</strong> 99.95%</li>
                        <li><strong>Pricing:</strong> 99 USD / Month, includes 1M requests.</li>
                        <li><strong>Quotas:</strong> <code>monthly_requests</code> limited to 10,000,000.</li>
                        <li><strong>Guarantees:</strong> <code>request_latency</code> &lt; 200ms (strict commitment).</li>
                        <li><strong>SLO:</strong> 99% of orders processed within 5s.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Step 4 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step4">
                      4. Advanced Policies (Support & Lifecycle)
                    </button>
                  </h2>
                  <div id="step4" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      <p>Professional SLAs require more than just technical numbers:</p>
                      <ul>
                        <li><strong>Support Channels:</strong> Add <code>Email</code> (support@petstore.com) for everyone, and <code>Phone</code> (+1-800-PET-HELP) for Pro users.</li>
                        <li><strong>Support Calendar:</strong> Use a public holiday calendar (e.g., <code>Mali</code> or <code>New Caledonia</code>) to define when support staff are off.</li>
                        <li><strong>Lifecycle:</strong> 
                          <ul>
                            <li><strong>Minimum Term:</strong> 12 Months (P12M).</li>
                            <li><strong>Notice Period:</strong> 30 Days (P30D).</li>
                            <li><strong>Auto-Renewal:</strong> Enabled.</li>
                            <li><strong>Data Retention:</strong> 90 days (P90D) after termination.</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Step 5 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step5">
                      5. Maintenance & Safety Net
                    </button>
                  </h2>
                  <div id="step5" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      <ul>
                        <li><strong>Maintenance:</strong> Link an external iCal (e.g., <code>https://status.cloudprovider.com/maintenance.ics</code>) to sync your provider's downtime with your SLA automatically.</li>
                        <li><strong>Standard Force Majeure:</strong> Ensure you include circumstances beyond reasonable control:
                          <ul>
                            <li>Natural disasters (Earthquakes, Floods).</li>
                            <li>War, Terrorism, or Civil Unrest.</li>
                            <li>Global Internet backbone failures or ISP outages.</li>
                            <li>Government actions or strikes.</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Step 6 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step6">
                      6. Generate Monitoring Infrastructure
                    </button>
                  </h2>
                  <div id="step6" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      <p>The most powerful feature of this tool is turning your document into code:</p>
                      <ul>
                        <li><strong>Terraform:</strong> Go to the <code>Generators -> GCP Terraform</code> tab. Provide your Project ID and click 'Generate' to get a full monitoring setup.</li>
                        <li><strong>Grafana:</strong> Go to the <code>Generators -> Grafana</code> tab. Enter your Prometheus datasource UID to get a ready-to-import Dashboard JSON and Alert Rules.</li>
                        <li><strong>Azure Bicep:</strong> Use the <code>Generators -> Azure Bicep</code> tab to generate Azure Monitor alerts and Action Groups.</li>
                      </ul>
                      <p class="small text-muted"><i class="bi bi-info-circle"></i> Tip: Use <strong>PromQL</strong> measurements in Step 2 to ensure the generators produce precise monitoring queries.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <div class="card bg-light">
            <div class="card-body">
              <h3 class="h5">Tutorial Summary</h3>
              <p>By following these steps, you have achieved a <strong>comprehensive, machine-readable SLA</strong> for the Pet Store API. You have successfully:</p>
              <ul class="mb-4">
                <li>Defined business-aligned metrics that reflect real user value.</li>
                <li>Created tiered offerings (Free vs Pro) with explicit cost and usage boundaries.</li>
                <li>Matched technical Guarantees with operational Quotas.</li>
                <li>Integrated external calendars for real-world support and maintenance tracking.</li>
                <li>Established a clear lifecycle for the contract and its data.</li>
                <li><strong>Generated production-ready monitoring code (Terraform/Bicep/Grafana).</strong></li>
              </ul>
              <div class="alert alert-success">
                <h5 class="h6 fw-bold mb-2">Ready to use?</h5>
                <p>Explore the tabs at the top of the editor:</p>
                <ul>
                  <li><strong>Description:</strong> See a human-readable summary of your SLA (great for non-technical stakeholders).</li>
                  <li><strong>Source:</strong> View or edit the raw YAML/JSON.</li>
                  <li><strong>Generators:</strong> Export your SLA as cloud infrastructure code.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div class="text-center">
          <button class="btn btn-primary" @click="$emit('close')">Back to Editor</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TutorialPage',
  emits: ['close']
}
</script>

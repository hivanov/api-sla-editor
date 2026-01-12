<template>
  <div class="container-xxl py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h2 class="mb-4">SLA Editor Tutorial</h2>

        <section class="mb-5">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h3 class="h5 mb-0">Why do we need SLAs?</h3>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h4 class="h6 fw-bold">Benefits to Users</h4>
                <p>
                  Service Level Agreements (SLAs) provide users with a clear understanding of what to expect from a service. 
                  They define the boundaries of the service, including performance, availability, and support. 
                  This transparency allows users to plan their own operations with certainty, knowing the reliable limits of the dependencies they consume.
                </p>
              </div>

              <div class="mb-4">
                <h4 class="h6 fw-bold">Building Confidence</h4>
                <p>
                  An explicitly defined SLA demonstrates professionalism and maturity. It signals that the service provider has 
                  thought critically about the service's capabilities and is committed to maintaining them. 
                  When a provider creates a contract with penalties (Service Credits) for non-compliance, it puts "skin in the game," 
                  which significantly boosts user trust.
                </p>
              </div>

              <div>
                <h4 class="h6 fw-bold">Capacity and Budget</h4>
                <p>
                  Defining an SLA is not just about promising high availability; it's a balancing act. 
                  It forces the provider to ask: <em>"Do we have the infrastructure, personnel, and budget to actually enforce this?"</em>
                  By calculating the cost of maintaining a certain reliability level (e.g., 99.9% vs 99.99%), organizations can make informed decisions 
                  avoiding over-promising and under-delivering. It aligns technical reality with business expectations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <div class="card shadow-sm">
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
          <div class="card shadow-sm border-primary">
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

              </div>
            </div>
          </div>
        </section>

        <section class="mb-5">
          <div class="card shadow-sm bg-light">
            <div class="card-body">
              <h3 class="h5">Tutorial Summary</h3>
              <p>By following these steps, you have achieved a <strong>comprehensive, machine-readable SLA</strong> for the Pet Store API. You have successfully:</p>
              <ul class="mb-4">
                <li>Defined business-aligned metrics that reflect real user value.</li>
                <li>Created tiered offerings (Free vs Pro) with explicit cost and usage boundaries.</li>
                <li>Matched technical Guarantees with operational Quotas.</li>
                <li>Integrated external calendars for real-world support and maintenance tracking.</li>
                <li>Established a clear lifecycle for the contract and its data.</li>
              </ul>
              <div class="alert alert-success">
                <h5 class="h6 fw-bold mb-2">Ready to use?</h5>
                Go to the <strong>Source</strong> tab at the top of the editor. There you can see the generated YAML. You can copy this content to your project repository, or use it to configure automated monitoring and billing systems.
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

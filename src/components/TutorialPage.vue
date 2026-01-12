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
                      Define what you measure. For a Pet Store, technical metrics are good, but business-aligned metrics are better:
                      <ul>
                        <li><code>order_latency</code> (Number, ms): Time taken to process a pet purchase.</li>
                        <li><code>inventory_accuracy</code> (Percentage): How often the displayed stock matches physical reality.</li>
                        <li><code>api_availability</code> (Percentage): Overall uptime of the Pet Store endpoints.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Step 3 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step3">
                      3. Create Plans (Free vs. Paid)
                    </button>
                  </h2>
                  <div id="step3" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6><strong>Free Tier</strong></h6>
                          <ul>
                            <li><strong>Availability:</strong> 99.0%</li>
                            <li><strong>Pricing:</strong> 0 USD</li>
                            <li><strong>Quota:</strong> Max 100 orders/month.</li>
                            <li><strong>Support:</strong> Email only, 48h response.</li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <h6><strong>Pro Tier</strong></h6>
                          <ul>
                            <li><strong>Availability:</strong> 99.95%</li>
                            <li><strong>Pricing:</strong> 49.99 USD / month</li>
                            <li><strong>Quota:</strong> Unlimited orders.</li>
                            <li><strong>Support:</strong> 24/7 Phone, 1h response.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 4 -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step4">
                      4. Maintenance & Force Majeure
                    </button>
                  </h2>
                  <div id="step4" class="accordion-collapse collapse" data-bs-parent="#tutorialSteps">
                    <div class="accordion-body">
                      <p>Protect your team by defining when the SLA <em>doesn't</em> apply:</p>
                      <ul>
                        <li><strong>Maintenance:</strong> Define a window like <code>FREQ=WEEKLY;BYDAY=SU;BYHOUR=2</code> (Sundays at 2 AM). Set "Counts as Downtime" to False.</li>
                        <li><strong>Force Majeure:</strong> Add a clause for "Uncontrollable events like cloud provider region failure or natural disasters."</li>
                      </ul>
                    </div>
                  </div>
                </div>

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

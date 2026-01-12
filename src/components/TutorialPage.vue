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

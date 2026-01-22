<template>
  <div class="container-xxl py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h2 class="mb-4">SLA Editor Help</h2>
        <p class="text-muted mb-4">Detailed guide to all functionalities and concepts within the SLA Editor.</p>

        <div class="accordion" id="helpAccordion">
          
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
                  <h5 class="h6 fw-bold text-primary border-bottom pb-2">Detailed Explanation</h5>
                  <div v-html="renderMarkdown(item.detail)" class="markdown-body mt-2"></div>
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
import { marked } from 'marked';
import { helpItems } from '../utils/help-examples';

export default {
  name: 'HelpPage',
  emits: ['close'],
  methods: {
    renderMarkdown(text) {
      if (!text) return '';
      return marked(text);
    }
  },
  data() {
    return {
      helpItems
    }
  }
}
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
}

:deep(.markdown-body) {
  font-size: 0.95rem;
  line-height: 1.5;
}

:deep(.markdown-body p) {
  margin-bottom: 1rem;
}

:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.markdown-body li) {
  margin-bottom: 0.25rem;
}

:deep(.markdown-body code) {
  background-color: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  font-size: 85%;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
}
</style>

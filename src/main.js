import './assets/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
const rootComponent = app.mount('#app');

// Expose the root component instance for Playwright tests
window.app = rootComponent;

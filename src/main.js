import './assets/main.css'
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
const rootComponent = app.mount('#app');

// Expose the root component instance for Playwright tests
window.app = rootComponent;

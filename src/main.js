import './assets/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
const rootComponent = app.mount('#app');

// Expose the root component instance for Playwright tests in development or testing environments
if (process.env.NODE_ENV === 'development' || window.Playwright) { 
    window.app = rootComponent;
}

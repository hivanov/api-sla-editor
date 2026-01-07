import { defineConfig } from '@playwright/experimental-ct-vue';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  testDir: './tests/components',
  use: {
    trace: 'on-first-retry',
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
});
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: path.resolve("./src/lib"),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});

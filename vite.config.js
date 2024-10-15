// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/portfolio-app.js',
            formats: ['es']
        },
        rollupOptions: {
            external: /^lit/
        }
    }
});
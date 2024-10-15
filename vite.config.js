// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'three': path.resolve(__dirname, 'node_modules/three')
        }
    },
    build: {
        lib: {
            entry: 'src/portfolio-app.js',
            formats: ['es']
        },
        rollupOptions: {
            external: [/^lit/, /^three/]
        }
    }
});

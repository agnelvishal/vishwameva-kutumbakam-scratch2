import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const input = {};

htmlFiles.forEach(file => {
    input[file.replace('.html', '')] = resolve(__dirname, file);
});

export default defineConfig({
    build: {
        rollupOptions: {
            input
        }
    }
});

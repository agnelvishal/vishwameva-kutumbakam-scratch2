import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import obfuscator from 'vite-plugin-javascript-obfuscator';
import { minify } from 'html-minifier-terser';

const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const input = {};

htmlFiles.forEach(file => {
    input[file.replace('.html', '')] = resolve(__dirname, file);
});

const htmlMinifyPlugin = () => {
    return {
        name: 'html-minify',
        enforce: 'post',
        async generateBundle(options, bundle) {
            for (const [key, asset] of Object.entries(bundle)) {
                if (asset.type === 'asset' && asset.fileName.endsWith('.html')) {
                    asset.source = await minify(asset.source, {
                        collapseWhitespace: true,
                        removeComments: true,
                        removeAttributeQuotes: true,
                        minifyCSS: true,
                        minifyJS: true,
                        removeOptionalTags: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        useShortDoctype: true,
                    });
                }
            }
        }
    };
};

export default defineConfig({
    plugins: [
        obfuscator({
            include: ['**/*.js', '*.js'],
            exclude: [/node_modules/],
            apply: 'build',
            debugger: true,
            options: {
                compact: true,
                simplify: true,
                stringArray: true,
                stringArrayThreshold: 0.1,
                numbersToExpressions: false,
                splitStrings: false,
                controlFlowFlattening: false,
            },
        }),
        htmlMinifyPlugin()
    ],
    build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            }
        },
        rollupOptions: {
            input
        }
    }
});

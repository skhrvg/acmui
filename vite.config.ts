import type { Plugin } from 'vite'
import { rmSync } from 'node:fs'
import { builtinModules } from 'node:module'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import pkg from './package.json'

rmSync('dist-electron', { recursive: true, force: true })

const isDevelopment
  = process.env.NODE_ENV === 'development' || !!process.env.VSCODE_DEBUG
const isProduction = process.env.NODE_ENV === 'production'

const electronBuiltins = [
  'electron',
  ...builtinModules.filter(m => !m.startsWith('_')),
  ...builtinModules.filter(m => !m.startsWith('_')).map(m => `node:${m}`),
]

function electronRendererPlugin(): Plugin {
  return {
    name: 'electron-renderer',
    enforce: 'pre',
    config() {
      return {
        base: './',
        build: {
          rollupOptions: {
            output: { freeze: false },
          },
          commonjsOptions: {
            ignore: electronBuiltins,
          },
        },
        optimizeDeps: {
          exclude: electronBuiltins,
        },
      }
    },
    resolveId(source) {
      if (electronBuiltins.includes(source))
        return { id: source, external: true }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),

    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            console.log(
              /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App',
            )
          }
          else {
            options.startup()
          }
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: Object.keys(
                'dependencies' in pkg ? pkg.dependencies : {},
              ),
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: Object.keys(
                'dependencies' in pkg ? pkg.dependencies : {},
              ),
            },
          },
        },
      },
    ]),

    // Use Node.js API in the Renderer-process
    electronRendererPlugin(),
  ],

  server: process.env.VSCODE_DEBUG
    ? (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
        return {
          host: url.hostname,
          port: +url.port,
        }
      })()
    : undefined,
  clearScreen: false,
})

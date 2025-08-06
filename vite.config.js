import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        react({
            // Optimización: usar SWC para compilación más rápida
            jsxRuntime: 'automatic',
        }),
    ],
    server: {
        // Optimización: configuración del servidor de desarrollo
        hmr: {
            overlay: false // Desactiva overlay de errores para mejor rendimiento
        },
        host: true, // Permite acceso desde red local
        open: false, // No abrir navegador automáticamente
    },
    build: {
        // Optimización: configuración de build
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false, // Desactiva sourcemaps para builds más rápidos
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                }
            }
        }
    },
    css: {
        devSourcemap: false, // Desactiva sourcemaps CSS para mejor rendimiento
    },
    optimizeDeps: {
        // Pre-bundling de dependencias para inicio más rápido
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'sweetalert2'
        ]
    }
})
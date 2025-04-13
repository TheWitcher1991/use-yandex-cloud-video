import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression2'

export default ({ mode }: { mode?: string }) => {
	return defineConfig({
		clearScreen: false,
		plugins: [react(), compression()],
		optimizeDeps: {
			include: ['react', 'react-dom'],
		},
		build: {
			minify: 'esbuild',
			emptyOutDir: true,
			chunkSizeWarningLimit: 500,
			target: 'esnext',
			sourcemap: false,
			reportCompressedSize: false,
			outDir: './build',
			lib: {
				entry: path.resolve(__dirname, 'src/index.ts'),
				name: 'use-yandex-cloud-video',
				fileName: format => `use-yandex-cloud-video.${format}.js`,
			},
		},
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
	})
}

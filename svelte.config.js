import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// const path = process.env.BASE_PATH || '/portfolio';
const path = '/portfolio';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html',
			pages: 'build',
			assets: 'build',
			precompress: false,
			strict: true
		}),
		paths: {
			// The below glitches on first load
			// base: process.argv.includes('dev') ? '' : path
			// base: process.argv.includes('dev') ? '' : '/portfolio'
			base: '/portfolio'
		},
		// prerender: {
		// 	entries: [
		// 		'/about',
		// 		'/contact',
		// 		'/expertise'
		// 	]
		// }
	}
};

export default config;

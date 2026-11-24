// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static site. BASE is the path the app is served under: '/' on its own
// domain, or '/pm-quiz/' as a GitHub Pages project site.
export default defineConfig({
	output: 'static',
	trailingSlash: 'always',
	base: process.env.BASE ?? '/',
	devToolbar: { enabled: false },
	vite: { plugins: [tailwindcss()] },
});

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	clearScreen: false,
	envDir: "../..",
	plugins: [tailwindcss(), reactRouter()],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		port: 41411,
		strictPort: true,
	},
});

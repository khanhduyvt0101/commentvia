import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	clearScreen: false,
	envDir: "../..",
	plugins: [react()],
	server: {
		port: 41410,
		strictPort: true,
	},
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base:
        process.env.NODE_ENV === "production"
            ? "/dangermond-preserve-visualizer/"
            : "/",
    plugins: [react()],
});

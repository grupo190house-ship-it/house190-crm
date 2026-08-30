import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || "/",
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  test: { environment: "jsdom", globals: true },
});

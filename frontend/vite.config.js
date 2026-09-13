import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite dev server runs on 5173 by default.
// The backend's CORS config only allows http://localhost:5173, so we keep it fixed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});

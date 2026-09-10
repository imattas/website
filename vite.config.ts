import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "motion",
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              minSize: 20 * 1024,
            },
          ],
        },
      },
    },
  },
});

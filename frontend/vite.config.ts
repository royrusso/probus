import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    //open: "public/index.html",
    //open: "/index.html",
    port: 8080,
  },
  // resolve: {
  //   alias: {
  //     "~bootstrap": "bootstrap",
  //   },
  // },
});

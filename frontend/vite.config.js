import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Backend target for dev proxy can be overridden with BACKEND_URL env var
  const backendTarget = process.env.BACKEND_URL || "http://localhost:3000";
  const cookieDomainRewrite = process.env.COOKIE_DOMAIN_REWRITE || "localhost";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      cors: true,
      port: 5173,
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite, // rewrites cookie domain for dev convenience
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});

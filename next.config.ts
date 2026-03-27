import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Impede que o site seja carregado dentro de iframes
          // Protege contra ataques de clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // Impede que o navegador "adivinhe" o tipo de arquivo
          // Evita ataques de MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Controla quais informações de origem são enviadas ao navegar
          // Evita vazamento de URL interna para sites externos
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Desativa acesso a hardware sensível do dispositivo
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },

          // Define quais origens podem carregar recursos no site
          // 'unsafe-inline' necessário para Tailwind e Next.js funcionarem
          // Ajuste os domínios conforme você adicionar CDNs ou scripts externos
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdBanner } from "@/components/AdBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SorteLab — Resultados, Estatísticas e Tendências",
    template: "%s | SorteLab",
  },
  description:
    "Confira resultados do jogo do bicho, Mega-Sena, Lotofácil e outras loterias. Veja estatísticas, números mais sorteados, atrasados e tendências do dia.",
  keywords: [
    "resultado do bicho hoje",
    "jogo do bicho resultado",
    "resultado mega sena hoje",
    "resultado lotofacil hoje",
    "números mais sorteados mega sena",
    "números atrasados lotofacil",
    "tendência jogo do bicho",
    "SorteLab",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdBanner position="left" />
        <AdBanner position="right" />
        {children}
      </body>
    </html>
  );
}
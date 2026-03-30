"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";

const links = [
  { href: "/", label: "Início" },
  { href: "/bancas", label: "Bancas" },
  { href: "/grupos-e-dezenas", label: "Grupos & Dezenas" },
  { href: "/resultado-mega-sena", label: "Mega-Sena" },
  { href: "/resultado-lotofacil", label: "Lotofácil" },
  { href: "/estatisticas", label: "Estatísticas" },
  { href: "/palpites", label: "Tendências" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  function abrirInstagram() {
    window.open(
      "https://instagram.com/sorte_lab",
      "_blank",
      "noopener,noreferrer"
    );
  }

  function abrirWhatsApp() {
    window.open(
    `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Quero%20receber%20palpites%20do%20SorteLab`,
    "_blank",
    "noopener,noreferrer"
  );
}

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#040816]/88 backdrop-blur-xl">
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="min-w-0">
            <Link
              href="/"
              className="flex items-center gap-3 transition hover:opacity-95"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(245,196,81,0.18)] bg-[rgba(245,196,81,0.08)] shadow-[0_0_20px_rgba(245,196,81,0.08)]">
                <span className="text-sm font-bold text-[#f5c451]">SL</span>
              </div>

              <div className="min-w-0">
                <span className="block truncate text-xl font-semibold tracking-tight text-white">
                  SorteLab
                </span>
                <span className="block truncate text-xs text-slate-400">
                  Resultados, palpites e tendências
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border border-[rgba(245,196,81,0.22)] bg-[rgba(245,196,81,0.10)] text-[#f5c451] shadow-[0_0_18px_rgba(245,196,81,0.08)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={abrirInstagram}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-[rgba(245,196,81,0.24)] hover:bg-[rgba(245,196,81,0.08)] hover:text-[#f5c451]"
              aria-label="Instagram do SorteLab"
            >
              <InstagramIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={abrirWhatsApp}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.10)] px-4 text-sm font-semibold text-green-400 transition hover:bg-[rgba(34,197,94,0.16)]"
              aria-label="WhatsApp do SorteLab"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Entrar
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuAberto((prev) => !prev)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06] lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            {menuAberto ? "Fechar" : "Menu"}
          </button>
        </div>

        {menuAberto && (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <nav className="grid gap-3">
              {links.map((link) => {
                const active = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuAberto(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "border border-[rgba(245,196,81,0.22)] bg-[rgba(245,196,81,0.10)] text-[#f5c451]"
                        : "border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={abrirInstagram}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-[rgba(245,196,81,0.24)] hover:bg-[rgba(245,196,81,0.08)] hover:text-[#f5c451]"
                aria-label="Instagram do SorteLab"
              >
                <InstagramIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={abrirWhatsApp}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.10)] px-4 text-sm font-semibold text-green-400 transition hover:bg-[rgba(34,197,94,0.16)]"
                aria-label="WhatsApp do SorteLab"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
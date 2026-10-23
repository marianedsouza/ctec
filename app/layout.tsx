import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Federalização da RNDS · SES-MS",
    template: "%s · SES-MS",
  },
  description:
    "Federalização da Rede Nacional de Dados em Saúde em Mato Grosso do Sul — Projeto e Plano de Trabalho da SES-MS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const anoAtual = new Date().getFullYear();

  return (
    <html lang="pt-BR">
      <body>
        <div className="app-shell">
          <SiteHeader />

          <div className="site-main">{children}</div>

          <footer className="site-footer">
            <div className="site-footer__inner">
              <div className="site-footer__brand">
                <span className="site-footer__coat" aria-hidden="true">
                  SES
                </span>
                <span>
                  Wiki SES-MS
                  <br />
                  Secretaria de Estado de Saúde de Mato Grosso do Sul
                </span>
              </div>

              <div className="site-footer__links">
                <Link href="/">Início</Link> · <Link href="/#o-que-e-rnds">RNDS</Link> ·{" "}
                <Link href="/#dominios">Domínios</Link> ·{" "}
                <Link href="/#onde-estamos">Etapas</Link> ·{" "}
                <Link href="/#documentos">Documentos</Link>
              </div>

              <div className="site-footer__meta">
                © {anoAtual} SES-MS — Federalização da RNDS em Mato Grosso do Sul.
                <br />
                Identidade visual provisória, pendente dos ativos oficiais da marca.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

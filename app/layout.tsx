import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Wiki SES-MS",
    template: "%s · Wiki SES-MS",
  },
  description: "Base de conhecimento da Secretaria de Estado de Saúde de Mato Grosso do Sul",
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
                <Link href="/">Início</Link> · <Link href="/categorias">Categorias</Link> ·{" "}
                <Link href="/rnds">RNDS</Link> · <Link href="/busca">Busca</Link>
              </div>

              <div className="site-footer__meta">
                © {anoAtual} SES-MS — base de conhecimento institucional.
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

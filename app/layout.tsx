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
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <div className="app-shell">
          <SiteHeader />

          <div className="site-main">{children}</div>

          <footer className="site-footer">
            <div className="site-footer__inner">
              <div className="site-footer__brand">
                <img src="/logo-superintendencias.png" alt="Superintendências SES-MS" height={45} style={{ width: 'auto' }} />
              </div>

              <div className="site-footer__links">
                <Link href="/">Início</Link> · <Link href="/#projeto">Projeto</Link> ·{" "}
                <Link href="/#rnds">RNDS</Link> · <Link href="/#dominios">Domínios</Link> ·{" "}
                <Link href="/#plano">Plano de Trabalho</Link> ·{" "}
                <Link href="/#equipe">Equipe</Link> ·{" "}
                <Link href="/#documentos">Documentos</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

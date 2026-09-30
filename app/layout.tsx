import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "Wiki SES-MS",
    template: "%s · Wiki SES-MS",
  },
  description:
    "Base de conhecimento da Secretaria de Estado de Saúde de Mato Grosso do Sul",
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
              <span>
                © {anoAtual} Secretaria de Estado de Saúde de Mato Grosso do Sul
                (SES-MS)
              </span>
              <span>
                Wiki SES-MS — base de conhecimento institucional. Identidade
                visual provisória, pendente dos ativos oficiais da marca.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

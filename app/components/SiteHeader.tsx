// Cabeçalho e navegação institucional da landing page.
// Componente de servidor estático: sem sessão, sem banco, sem formulário de
// busca (a landing é conteúdo fixo).

import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          <span className="site-brand__mark" aria-hidden="true">
            SES
          </span>
          <span>
            <span className="site-brand__title">SES-MS</span>
            <span className="site-brand__subtitle">
              Secretaria de Estado de Saúde de Mato Grosso do Sul
            </span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/#o-que-e-rnds">RNDS</Link>
          <Link href="/#dominios">Domínios</Link>
          <Link href="/#onde-estamos">Etapas</Link>
          <Link href="/#documentos">Documentos</Link>
        </nav>
      </div>
    </header>
  );
}

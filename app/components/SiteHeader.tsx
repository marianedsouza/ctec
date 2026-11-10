// Cabeçalho e navegação institucional da landing page.
// Componente de servidor estático: sem sessão, sem banco, sem formulário de
// busca (a landing é conteúdo fixo).

import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          <img src="/6.png" alt="Superintendências SES-MS" height={80} style={{ width: 'auto' }} />
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/#projeto">Projeto</Link>
          <Link href="/#rnds">RNDS</Link>
          <Link href="/#dominios">Domínios</Link>
          <Link href="/#plano">Plano</Link>
          <Link href="/#equipe">Equipe</Link>
          <Link href="/#documentos">Documentos</Link>
        </nav>
      </div>
    </header>
  );
}

// Cabeçalho e navegação institucional compartilhados (Task 10.1 / Requirement 9.1).
//
// Server Component: resolve a sessão no servidor para decidir entre exibir o
// acesso à "Área restrita"/login (usuário anônimo) ou o nome do usuário e o
// botão "Sair" (usuário autenticado). A navegação aponta para todas as rotas
// existentes: Início, Categorias, RNDS e Busca. O formulário de busca é um GET
// puro para /busca, portanto funciona sem JavaScript.

import Link from "next/link";
import { signOut } from "@/auth";
import { obterSessao } from "@/lib/services/auth";

export default async function SiteHeader() {
  const sessao = await obterSessao();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          <span className="site-brand__mark" aria-hidden="true">
            SES
          </span>
          <span>
            <span className="site-brand__title">Wiki SES-MS</span>
            <span className="site-brand__subtitle">
              Secretaria de Estado de Saúde de Mato Grosso do Sul
            </span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/categorias">Categorias</Link>
          <Link href="/rnds">RNDS</Link>
          <Link href="/busca">Busca</Link>

          {sessao ? (
            <>
              <Link href="/editor/rnds" className="site-nav__cta">
                Área restrita
              </Link>
              <span className="site-nav__user" title={sessao.email}>
                {sessao.nome || sessao.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">Sair</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="site-nav__cta">
              Entrar
            </Link>
          )}
        </nav>

        <form className="site-search" action="/busca" method="get" role="search">
          <input
            className="site-search__input"
            id="busca-cabecalho"
            type="search"
            name="q"
            placeholder="Buscar no wiki…"
            aria-label="Buscar páginas no Wiki SES-MS"
          />
          <button className="site-search__button" type="submit">
            Buscar
          </button>
        </form>
      </div>
    </header>
  );
}

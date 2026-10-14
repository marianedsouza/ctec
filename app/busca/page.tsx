// Página pública de busca (SSR) — Task 8.2 / Requirements 7.1, 7.3.
//
// Renderiza no servidor (Req 7.1) os resultados do Serviço de Busca. A
// visibilidade é resolvida no servidor a partir da sessão: usuário anônimo vê
// somente páginas públicas (Req 7.3 / 6.4). Cada resultado exibe título (link
// para a página), trecho destacado e o slug.

import Link from "next/link";
import { obterSessao } from "@/lib/services/auth";
import { buscar, MARCADOR_INICIO, MARCADOR_FIM, type ResultadoBusca } from "@/lib/services/busca";

// A busca depende da sessão/requisição, portanto renderização dinâmica.
export const dynamic = "force-dynamic";

/**
 * Converte o trecho retornado pelo ts_headline (texto puro com marcadores
 * [[ ]]) em nós React, destacando os termos correspondentes com <mark>.
 * Como tratamos o trecho como texto (não HTML), não há risco de XSS.
 */
function renderTrecho(trecho: string): React.ReactNode[] {
  const nos: React.ReactNode[] = [];
  let restante = trecho;
  let chave = 0;

  while (restante.length > 0) {
    const inicio = restante.indexOf(MARCADOR_INICIO);
    if (inicio === -1) {
      nos.push(<span key={chave++}>{restante}</span>);
      break;
    }

    const fim = restante.indexOf(MARCADOR_FIM, inicio + MARCADOR_INICIO.length);
    if (fim === -1) {
      nos.push(<span key={chave++}>{restante}</span>);
      break;
    }

    if (inicio > 0) {
      nos.push(<span key={chave++}>{restante.slice(0, inicio)}</span>);
    }

    const destacado = restante.slice(inicio + MARCADOR_INICIO.length, fim);
    nos.push(<mark key={chave++}>{destacado}</mark>);

    restante = restante.slice(fim + MARCADOR_FIM.length);
  }

  return nos;
}

function ListaResultados({ resultados }: { resultados: ResultadoBusca[] }) {
  if (resultados.length === 0) {
    // Ausência de resultados indicada explicitamente (Req 6.3).
    return (
      <div className="empty-state">
        <p>Nenhum resultado encontrado. Tente outro termo ou verifique a grafia.</p>
      </div>
    );
  }

  return (
    <ul className="result-list">
      {resultados.map((resultado) => (
        <li key={resultado.paginaId} className="result-item">
          <h2>
            <Link href={`/paginas/${resultado.slug}`}>{resultado.titulo}</Link>
          </h2>
          <p className="result-item__snippet">{renderTrecho(resultado.trecho)}</p>
          <span className="result-item__slug">/paginas/{resultado.slug}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const termo = (q ?? "").trim();

  // Sessão resolvida no servidor: define a visibilidade aplicada na busca.
  const sessao = await obterSessao();
  const resultados = termo.length > 0 ? await buscar(termo, sessao) : [];

  return (
    <main>
      <div className="page-header">
        <h1>Busca</h1>
        <p className="page-header__lead">
          Pesquise em todo o conteúdo público do Wiki SES-MS por título e texto das páginas. Os
          termos encontrados aparecem destacados nos resultados.
        </p>
      </div>

      <div className="search-panel">
        <form className="search-form" action="/busca" method="get" role="search">
          <div className="search-form__field">
            <label htmlFor="q">Termo de busca</label>
            <input
              id="q"
              type="search"
              name="q"
              defaultValue={termo}
              placeholder="Ex.: RNDS, federalização, بنظام de_regs"
              aria-label="Termo de busca"
            />
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>
      </div>

      {termo.length > 0 ? (
        <section aria-live="polite">
          <p className="search-summary">
            {resultados.length === 1
              ? "1 resultado encontrado para "
              : `${resultados.length} resultados encontrados para `}
            <strong>{termo}</strong>
          </p>
          <ListaResultados resultados={resultados} />
        </section>
      ) : (
        <div className="empty-state">
          <p>Informe um termo acima para iniciar a busca.</p>
        </div>
      )}
    </main>
  );
}

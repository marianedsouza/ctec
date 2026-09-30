// Página pública de busca (SSR) — Task 8.2 / Requirements 7.1, 7.3.
//
// Renderiza no servidor (Req 7.1) os resultados do Serviço de Busca. A
// visibilidade é resolvida no servidor a partir da sessão: usuário anônimo vê
// somente páginas públicas (Req 7.3 / 6.4). Cada resultado exibe título (link
// para a página), trecho destacado e o slug.

import Link from "next/link";
import { obterSessao } from "@/lib/services/auth";
import {
  buscar,
  MARCADOR_INICIO,
  MARCADOR_FIM,
  type ResultadoBusca,
} from "@/lib/services/busca";

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
    return <p>Nenhum resultado encontrado.</p>;
  }

  return (
    <ul>
      {resultados.map((resultado) => (
        <li key={resultado.paginaId}>
          <h2>
            <Link href={`/paginas/${resultado.slug}`}>{resultado.titulo}</Link>
          </h2>
          <p>{renderTrecho(resultado.trecho)}</p>
          <small>/paginas/{resultado.slug}</small>
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
      <h1>Busca</h1>

      <form action="/busca" method="get" role="search">
        <label htmlFor="q">Buscar no Wiki SES-MS</label>
        <input
          id="q"
          type="search"
          name="q"
          defaultValue={termo}
          placeholder="Digite um termo de busca"
          aria-label="Termo de busca"
        />
        <button type="submit">Buscar</button>
      </form>

      {termo.length > 0 ? (
        <section aria-live="polite">
          <p>
            Resultados para <strong>{termo}</strong>:
          </p>
          <ListaResultados resultados={resultados} />
        </section>
      ) : (
        <p>Informe um termo para iniciar a busca.</p>
      )}
    </main>
  );
}

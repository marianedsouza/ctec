// Serviço de Busca (full-text PostgreSQL) do Wiki SES-MS.
// Implementa a interface ServicoBusca do design.md (Componente 4):
//   - buscar(termo, sessao): retorna páginas correspondentes ranqueadas.
//
// Regras (design.md / Requirements 6.1..6.4, 2.2):
//   - Ranqueia por relevância (ts_rank), ordem decrescente (Req 6.1).
//   - Retorna título, slug e um trecho destacado do conteúdo (Req 6.2).
//   - Termo sem correspondência -> lista vazia (Req 6.3).
//   - Usuário anônimo (sessão nula) ou sem permissão de leitura restrita vê
//     SOMENTE páginas com visibilidade "publico" (Req 6.4 / 2.2 / Property 1).
//
// A regra de visibilidade é aplicada NO SERVIDOR, dentro da própria consulta
// SQL (Requirement 2.4).
//
// Segurança: o termo do usuário é passado SEMPRE como parâmetro vinculado
// (Prisma $queryRaw com template tag / websearch_to_tsquery), nunca
// interpolado em texto — evitando injeção de SQL. O único fragmento SQL
// condicional (filtro de visibilidade) é um literal fixo do próprio código.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { possuiPermissao, type SessaoUsuario } from "@/lib/services/permissoes";

export interface ResultadoBusca {
  paginaId: string;
  titulo: string;
  slug: string;
  trecho: string; // snippet destacado
  rank: number;
}

export interface ServicoBusca {
  buscar(
    termo: string,
    sessao: SessaoUsuario | null
  ): Promise<ResultadoBusca[]>;
}

// Limite de resultados retornados por busca (paginação simples do MVP).
const LIMITE_RESULTADOS = 50;

// Marcadores usados pelo ts_headline para delimitar os termos destacados no
// trecho. Renderizados como texto puro na UI (sem HTML), portanto seguros.
export const MARCADOR_INICIO = "[[";
export const MARCADOR_FIM = "]]";

// Formato de linha retornada pela consulta bruta.
interface LinhaBusca {
  paginaId: string;
  titulo: string;
  slug: string;
  trecho: string;
  rank: number;
}

/**
 * Busca páginas por termo usando full-text search do PostgreSQL.
 *
 * Retorna resultados ordenados por relevância (rank) decrescente, cada um com
 * título, slug e um trecho destacado do conteúdo. Respeita a visibilidade
 * conforme a sessão: anônimo/sem permissão recebe apenas páginas públicas.
 */
export async function buscar(
  termo: string,
  sessao: SessaoUsuario | null
): Promise<ResultadoBusca[]> {
  const termoLimpo = termo.trim();

  // Termo vazio não corresponde a nada: retorna lista vazia (Req 6.3).
  if (termoLimpo.length === 0) {
    return [];
  }

  // Usuário com permissão de leitura restrita enxerga também páginas restritas;
  // caso contrário, restringimos a consulta a páginas públicas (Req 6.4 / 2.2).
  const incluiRestrito = possuiPermissao(sessao, "ler_restrito");
  const filtroVisibilidade = incluiRestrito
    ? Prisma.empty
    : Prisma.sql`AND p."visibilidade" = 'publico'`;

  // Expressão tsvector idêntica à do índice GIN (migração
  // 20250102000000_busca_tsvector) para permitir uso do índice.
  const linhas = await prisma.$queryRaw<LinhaBusca[]>`
    SELECT
      p."id"    AS "paginaId",
      p."titulo" AS "titulo",
      p."slug"  AS "slug",
      ts_headline(
        'portuguese',
        regexp_replace(p."conteudo", '<[^>]*>', ' ', 'g'),
        q,
        ${`StartSel=${MARCADOR_INICIO}, StopSel=${MARCADOR_FIM}, MaxWords=35, MinWords=15, ShortWord=3, MaxFragments=1`}
      ) AS "trecho",
      ts_rank(
        to_tsvector(
          'portuguese',
          coalesce(p."titulo", '') || ' ' || coalesce(p."conteudo", '')
        ),
        q
      ) AS "rank"
    FROM "paginas" p, websearch_to_tsquery('portuguese', ${termoLimpo}) q
    WHERE to_tsvector(
            'portuguese',
            coalesce(p."titulo", '') || ' ' || coalesce(p."conteudo", '')
          ) @@ q
      ${filtroVisibilidade}
    ORDER BY "rank" DESC, p."titulo" ASC
    LIMIT ${LIMITE_RESULTADOS}
  `;

  return linhas.map((linha) => ({
    paginaId: linha.paginaId,
    titulo: linha.titulo,
    slug: linha.slug,
    trecho: linha.trecho,
    // ts_rank retorna float; garantimos number para a interface.
    rank: Number(linha.rank),
  }));
}

// Objeto que materializa a interface ServicoBusca do design.
export const servicoBusca: ServicoBusca = {
  buscar,
};

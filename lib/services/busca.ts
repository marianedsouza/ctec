// Serviço de Busca (full-text MySQL) do Wiki SES-MS.
// Implementa a interface ServicoBusca do design.md (Componente 4):
//   - buscar(termo, sessao): retorna páginas correspondentes ranqueadas.
//
// Regras (design.md / Requirements 6.1..6.4, 2.2):
//   - Ranqueia por relevância (MATCH ... AGAINST), ordem decrescente (Req 6.1).
//   - Retorna título, slug e um trecho destacado do conteúdo (Req 6.2).
//   - Termo sem correspondência -> lista vazia (Req 6.3).
//   - Usuário anônimo (sessão nula) ou sem permissão de leitura restrita vê
//     SOMENTE páginas com visibilidade "publico" (Req 6.4 / 2.2 / Property 1).
//
// A regra de visibilidade é aplicada NO SERVIDOR, dentro da própria consulta
// SQL (Requirement 2.4).
//
// Segurança: o termo do usuário é passado SEMPRE como parâmetro vinculado
// (Prisma $queryRaw com placeholder), nunca interpolado em texto — evitando
// injeção de SQL. O único fragmento SQL condicional (filtro de visibilidade) é
// um literal fixo do próprio código.
//
// Observação: o trecho destacado é montado em JavaScript (o MySQL não possui
// equivalente ao ts_headline do PostgreSQL). Quando o termo é formado apenas
// por palavras curtas (abaixo do innodb_ft_min_token_size, padrão 3) o índice
// FULLTEXT não retorna resultados; nesse caso há um fallback por LIKE.

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
  buscar(termo: string, sessao: SessaoUsuario | null): Promise<ResultadoBusca[]>;
}

// Limite de resultados retornados por busca (paginação simples do MVP).
const LIMITE_RESULTADOS = 50;

// Marcadores usados para delimitar os termos destacados no trecho. Renderizados
// como texto puro na UI (sem HTML), portanto seguros.
export const MARCADOR_INICIO = "[[";
export const MARCADOR_FIM = "]]";

// Tamanho máximo (em palavras) do trecho de contexto exibido.
const PALAVRAS_TRECHO = 35;

// Formato de linha retornada pela consulta bruta do FULLTEXT.
interface LinhaBusca {
  paginaId: string;
  titulo: string;
  slug: string;
  conteudo: string;
  rank: number;
}

/**
 * Remove marcação HTML e normaliza espaços para gerar o texto do trecho.
 */
function textoPlano(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Gera um trecho de contexto do conteúdo, destacando os termos da busca com os
 * marcadores [[ ]]. O trecho é sempre tratado como TEXTO PURO na interface.
 */
function gerarTrecho(conteudoHtml: string, termo: string): string {
  const texto = textoPlano(conteudoHtml);

  if (texto.length === 0) {
    return "";
  }

  const tokens = termo
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  // Localiza a primeira ocorrência de qualquer token (case-insensitive).
  const minusculo = texto.toLowerCase();
  let posicao = -1;
  for (const token of tokens) {
    const encontrada = minusculo.indexOf(token.toLowerCase());
    if (encontrada >= 0 && (posicao === -1 || encontrada < posicao)) {
      posicao = encontrada;
    }
  }

  let trecho: string;

  if (posicao < 0) {
    // Sem correspondência direta: mostra o início do conteúdo, sem destaque.
    trecho = texto.slice(0, 240);
    return trecho + (texto.length > 240 ? "…" : "");
  }

  // Janela de palavras ao redor da primeira ocorrência.
  const palavras = texto.split(/\s+/);
  let contador = 0;
  let palavraMatch = 0;
  for (let i = 0; i < palavras.length; i += 1) {
    const fimPalavra = contador + palavras[i].length;
    if (posicao >= contador && posicao <= fimPalavra) {
      palavraMatch = i;
      break;
    }
    contador = fimPalavra + 1;
  }

  const metade = Math.floor(PALAVRAS_TRECHO / 2);
  const inicioPalavra = Math.max(0, palavraMatch - metade);
  const fimPalavra = Math.min(palavras.length, inicioPalavra + PALAVRAS_TRECHO);

  trecho = palavras.slice(inicioPalavra, fimPalavra).join(" ");
  trecho = (inicioPalavra > 0 ? "…" : "") + trecho + (fimPalavra < palavras.length ? "…" : "");

  if (tokens.length === 0) {
    return trecho;
  }

  const regex = new RegExp(`(${tokens.map(escaparRegex).join("|")})`, "gi");
  return trecho.replace(regex, `${MARCADOR_INICIO}$1${MARCADOR_FIM}`);
}

/**
 * Busca páginas por termo usando full-text search do MySQL.
 *
 * Retorna resultados ordenados por relevância (rank) decrescente, cada um com
 * título, slug e um trecho destacado do conteúdo. Respeita a visibilidade
 * conforme a sessão: anônimo/sem permissão recebe apenas páginas públicas.
 */
export async function buscar(
  termo: string,
  sessao: SessaoUsuario | null,
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
    : Prisma.sql`AND p.visibilidade = 'publico'`;

  // 1) Busca full-text (usa o índice FULLTEXT `paginas_titulo_conteudo_idx`).
  const linhas = await prisma.$queryRaw<LinhaBusca[]>`
    SELECT
      p.id        AS paginaId,
      p.titulo    AS titulo,
      p.slug      AS slug,
      p.conteudo  AS conteudo,
      MATCH(p.titulo, p.conteudo) AGAINST (${termoLimpo} IN NATURAL LANGUAGE MODE) AS rank
    FROM paginas p
    WHERE MATCH(p.titulo, p.conteudo) AGAINST (${termoLimpo} IN NATURAL LANGUAGE MODE)
      ${filtroVisibilidade}
    ORDER BY rank DESC, p.titulo ASC
    LIMIT ${LIMITE_RESULTADOS}
  `;

  if (linhas.length > 0) {
    return linhas.map((linha) => montarResultado(linha, termoLimpo));
  }

  // 2) Fallback para termos curtos (abaixo do tamanho mínimo de token do
  //    FULLTEXT): busca por substring, sem ranking de relevância.
  const padrao = `%${termoLimpo}%`;
  const linhasLike = await prisma.$queryRaw<LinhaBusca[]>`
    SELECT
      p.id        AS paginaId,
      p.titulo    AS titulo,
      p.slug      AS slug,
      p.conteudo  AS conteudo,
      0           AS rank
    FROM paginas p
    WHERE (p.titulo LIKE ${padrao} OR p.conteudo LIKE ${padrao})
      ${filtroVisibilidade}
    ORDER BY p.titulo ASC
    LIMIT ${LIMITE_RESULTADOS}
  `;

  return linhasLike.map((linha) => montarResultado(linha, termoLimpo));
}

function montarResultado(linha: LinhaBusca, termo: string): ResultadoBusca {
  return {
    paginaId: linha.paginaId,
    titulo: linha.titulo,
    slug: linha.slug,
    trecho: gerarTrecho(linha.conteudo, termo),
    rank: Number(linha.rank),
  };
}

// Objeto que materializa a interface ServicoBusca do design.
export const servicoBusca: ServicoBusca = {
  buscar,
};

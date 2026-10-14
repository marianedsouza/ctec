// Serviço de Páginas (conteúdo + versionamento) do Wiki SES-MS.
// Implementa parte da interface ServicoPaginas do design.md (Componente 3):
//   - criar / atualizar / obterPorSlug
//
// Regras (design.md / Requirements 4.1..4.4, 2.1, 2.3):
//   - título não vazio.
//   - slug único (com sugestão de alternativa em caso de duplicidade).
//   - categoriaId deve referenciar categoria existente.
//   - visibilidade armazenada (publico/restrito).
//   - leitura por visibilidade: página restrita só é retornada a sessão
//     autenticada; usuário anônimo recebe null.
//   - o conteúdo HTML é SEMPRE sanitizado antes de persistir e antes de exibir.
//
// Versionamento (Task 7): registramos uma VersaoPagina imutável a cada
// criação/atualização (histórico), listamos o histórico em ordem cronológica
// (listarVersoes) e restauramos versões de forma não destrutiva
// (restaurarVersao) — Requirements 5.1..5.4 / Properties 5, 6, 7.

import type { Prisma, Visibilidade } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { sanitizarHtml } from "@/lib/sanitize";
import { possuiPermissao, type SessaoUsuario } from "@/lib/services/permissoes";

export type { Visibilidade };

export interface Pagina {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string; // markdown/HTML gerado pelo TipTap (sanitizado)
  visibilidade: Visibilidade;
  categoriaId: string;
  autorId: string;
  atualizadoEm: Date;
}

export interface VersaoPagina {
  id: string;
  paginaId: string;
  titulo: string;
  conteudo: string;
  autorId: string;
  criadaEm: Date;
}

// Nota: o `slug` é derivado do título e garantido único pelo serviço, por isso
// não faz parte da entrada de `criar` (ligeira especialização do design, onde
// o slug figura na entidade Pagina).
export interface ServicoPaginas {
  criar(dados: Omit<Pagina, "id" | "slug" | "atualizadoEm">): Promise<Pagina>;
  atualizar(id: string, dados: Partial<Pagina>): Promise<Pagina>;
  obterPorSlug(slug: string, sessao: SessaoUsuario | null): Promise<Pagina | null>;
  listarVersoes(paginaId: string): Promise<VersaoPagina[]>;
  restaurarVersao(paginaId: string, versaoId: string): Promise<Pagina>;
}

// Erro de slug duplicado que carrega uma sugestão de alternativa livre.
// Permite à UI exibir mensagem descritiva e sugerir o novo slug (Req 4.3).
export class SlugDuplicadoError extends Error {
  readonly slugSugerido: string;

  constructor(slug: string, slugSugerido: string) {
    super(`Já existe uma página com o slug "${slug}". Sugestão: "${slugSugerido}".`);
    this.name = "SlugDuplicadoError";
    this.slugSugerido = slugSugerido;
  }
}

/**
 * Retorna um slug livre a partir de um slug base, acrescentando sufixo
 * numérico incremental (-2, -3, ...). `ignorarId` mantém o slug da própria
 * página em atualizações.
 */
async function proximoSlugLivre(slugBase: string, ignorarId?: string): Promise<string> {
  let candidato = slugBase;
  let contador = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existente = await prisma.pagina.findUnique({
      where: { slug: candidato },
      select: { id: true },
    });

    if (!existente || existente.id === ignorarId) {
      return candidato;
    }

    contador += 1;
    candidato = `${slugBase}-${contador}`;
  }
}

/**
 * Deriva o slug base do título (fallback "pagina" quando não há caracteres
 * slugificáveis) e verifica unicidade. Se o slug base estiver ocupado por
 * outra página, lança SlugDuplicadoError com uma sugestão livre (Req 4.3).
 */
async function resolverSlugUnico(titulo: string, ignorarId?: string): Promise<string> {
  const base = slugify(titulo);
  const slugBase = base.length > 0 ? base : "pagina";

  const existente = await prisma.pagina.findUnique({
    where: { slug: slugBase },
    select: { id: true },
  });

  if (existente && existente.id !== ignorarId) {
    const sugerido = await proximoSlugLivre(slugBase, ignorarId);
    throw new SlugDuplicadoError(slugBase, sugerido);
  }

  return slugBase;
}

async function validarCategoriaExiste(categoriaId: string): Promise<void> {
  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
    select: { id: true },
  });
  if (!categoria) {
    throw new Error("A categoria informada não existe.");
  }
}

export async function criar(dados: Omit<Pagina, "id" | "slug" | "atualizadoEm">): Promise<Pagina> {
  const titulo = dados.titulo.trim();
  if (titulo.length === 0) {
    throw new Error("O título da página não pode ser vazio.");
  }

  await validarCategoriaExiste(dados.categoriaId);

  const slug = await resolverSlugUnico(titulo);
  const conteudo = sanitizarHtml(dados.conteudo ?? "");

  // Cria a página e registra a versão inicial na mesma transação.
  const pagina = await prisma.$transaction(async (tx) => {
    const criada = await tx.pagina.create({
      data: {
        titulo,
        slug,
        conteudo,
        visibilidade: dados.visibilidade,
        categoriaId: dados.categoriaId,
        autorId: dados.autorId,
      },
    });

    await tx.versaoPagina.create({
      data: {
        paginaId: criada.id,
        titulo: criada.titulo,
        conteudo: criada.conteudo,
        autorId: criada.autorId,
      },
    });

    return criada;
  });

  return pagina;
}

export async function atualizar(id: string, dados: Partial<Pagina>): Promise<Pagina> {
  const atual = await prisma.pagina.findUnique({ where: { id } });
  if (!atual) {
    throw new Error("Página não encontrada.");
  }

  const data: Prisma.PaginaUpdateInput = {};

  if (dados.titulo !== undefined) {
    const titulo = dados.titulo.trim();
    if (titulo.length === 0) {
      throw new Error("O título da página não pode ser vazio.");
    }
    data.titulo = titulo;
    // Regenera o slug quando o título muda, garantindo unicidade (Req 4.3).
    if (titulo !== atual.titulo) {
      data.slug = await resolverSlugUnico(titulo, id);
    }
  }

  if (dados.conteudo !== undefined) {
    data.conteudo = sanitizarHtml(dados.conteudo);
  }

  if (dados.visibilidade !== undefined) {
    data.visibilidade = dados.visibilidade;
  }

  if (dados.categoriaId !== undefined) {
    await validarCategoriaExiste(dados.categoriaId);
    data.categoria = { connect: { id: dados.categoriaId } };
  }

  const autorVersaoId = dados.autorId ?? atual.autorId;

  // Atualiza a página e registra uma nova versão com o conteúdo salvo.
  const pagina = await prisma.$transaction(async (tx) => {
    const atualizada = await tx.pagina.update({ where: { id }, data });

    await tx.versaoPagina.create({
      data: {
        paginaId: atualizada.id,
        titulo: atualizada.titulo,
        conteudo: atualizada.conteudo,
        autorId: autorVersaoId,
      },
    });

    return atualizada;
  });

  return pagina;
}

export async function obterPorSlug(
  slug: string,
  sessao: SessaoUsuario | null,
): Promise<Pagina | null> {
  const pagina = await prisma.pagina.findUnique({ where: { slug } });
  if (!pagina) {
    return null;
  }

  // Regra de visibilidade aplicada no servidor (Requirements 2.1, 2.3):
  // páginas restritas exigem permissão de leitura restrita. Usuário anônimo
  // (sessão nula) não possui essa permissão e recebe null.
  if (pagina.visibilidade === "restrito" && !possuiPermissao(sessao, "ler_restrito")) {
    return null;
  }

  // Sanitiza também na exibição (defesa em profundidade) — Req 4.5.
  return { ...pagina, conteudo: sanitizarHtml(pagina.conteudo) };
}

/**
 * Lista todas as versões registradas de uma página em ordem cronológica
 * (mais antiga primeiro), conforme Requirement 5.3 e Property 6.
 * As versões são imutáveis: apenas leitura, sem alterar o histórico.
 */
export async function listarVersoes(paginaId: string): Promise<VersaoPagina[]> {
  const versoes = await prisma.versaoPagina.findMany({
    where: { paginaId },
    orderBy: [{ criadaEm: "asc" }, { id: "asc" }],
  });

  return versoes.map((v) => ({
    id: v.id,
    paginaId: v.paginaId,
    titulo: v.titulo,
    conteudo: v.conteudo,
    autorId: v.autorId,
    criadaEm: v.criadaEm,
  }));
}

/**
 * Restaura uma versão histórica de uma página de forma NÃO DESTRUTIVA
 * (Requirement 5.4 / Property 7):
 *   - define o conteúdo/título atuais iguais aos da versão escolhida;
 *   - registra UMA nova VersaoPagina com esse conteúdo restaurado;
 *   - não apaga nem altera nenhuma versão existente.
 *
 * A versão informada deve pertencer à página informada.
 */
export async function restaurarVersao(paginaId: string, versaoId: string): Promise<Pagina> {
  const pagina = await prisma.$transaction(async (tx) => {
    const versao = await tx.versaoPagina.findUnique({
      where: { id: versaoId },
    });

    if (!versao || versao.paginaId !== paginaId) {
      throw new Error("Versão não encontrada para a página informada.");
    }

    // Conteúdo já foi sanitizado quando a versão foi criada; sanitiza de novo
    // por defesa em profundidade (Req 4.5).
    const conteudoRestaurado = sanitizarHtml(versao.conteudo);

    const atualizada = await tx.pagina.update({
      where: { id: paginaId },
      data: {
        titulo: versao.titulo,
        conteudo: conteudoRestaurado,
      },
    });

    // Registra a restauração como uma NOVA versão (histórico preservado).
    await tx.versaoPagina.create({
      data: {
        paginaId: atualizada.id,
        titulo: atualizada.titulo,
        conteudo: atualizada.conteudo,
        autorId: versao.autorId,
      },
    });

    return atualizada;
  });

  return pagina;
}

/**
 * Lista as páginas mais recentes, da mais atualizada para a mais antiga,
 * aplicando a mesma regra de visibilidade de `obterPorSlug` (Requirements 2.1,
 * 2.3): sem permissão de leitura restrita, somente páginas públicas.
 *
 * Usada nas vitrines de conteúdo (ex.: "acervo" da seção RNDS), onde exibimos
 * somente título/slug — o corpo não é retornado.
 */
export async function listarRecentes(
  sessao: SessaoUsuario | null,
  limite = 8,
): Promise<Pick<Pagina, "id" | "titulo" | "slug" | "atualizadoEm">[]> {
  const paginas = await prisma.pagina.findMany({
    where: possuiPermissao(sessao, "ler_restrito") ? {} : { visibilidade: "publico" },
    orderBy: [{ atualizadoEm: "desc" }, { id: "asc" }],
    take: limite,
    select: { id: true, titulo: true, slug: true, atualizadoEm: true },
  });

  return paginas;
}

// Objeto que materializa a interface ServicoPaginas do design.
export const servicoPaginas: ServicoPaginas = {
  criar,
  atualizar,
  obterPorSlug,
  listarVersoes,
  restaurarVersao,
};

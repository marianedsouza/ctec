// Serviço de Categorias (árvore hierárquica) do Wiki SES-MS.
// Implementa a interface ServicoCategorias do design.md (Componente 2):
//   - criar / atualizar / remover
//   - obterArvore(tipo?)   -> navegação hierárquica
//   - obterCaminho(id)     -> breadcrumb (ancestrais + a própria categoria)
//
// Regras de integridade (design.md / Requirements 3.1..3.5):
//   - slug único derivado do nome.
//   - reparentamento não pode gerar ciclo na árvore.

import type { Prisma, TipoCategoria } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type { TipoCategoria };

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  tipo: TipoCategoria;
  categoriaPaiId: string | null;
  ordem: number;
}

export interface NoArvore extends Categoria {
  filhos: NoArvore[];
}

export interface ServicoCategorias {
  criar(dados: Omit<Categoria, "id">): Promise<Categoria>;
  atualizar(id: string, dados: Partial<Categoria>): Promise<Categoria>;
  remover(id: string): Promise<void>;
  obterArvore(tipo?: TipoCategoria): Promise<NoArvore[]>;
  obterCaminho(categoriaId: string): Promise<Categoria[]>;
}

/**
 * Gera um slug único a partir do nome. Caso o slug base já exista,
 * acrescenta um sufixo numérico incremental (-2, -3, ...).
 * `ignorarId` permite manter o slug da própria categoria em atualizações.
 */
async function gerarSlugUnico(nome: string, ignorarId?: string): Promise<string> {
  const base = slugify(nome);
  // Nome sem caracteres slugificáveis: usa um fallback estável.
  const slugBase = base.length > 0 ? base : "categoria";

  let candidato = slugBase;
  let contador = 1;

  // Repete até encontrar um slug livre (excluindo a própria categoria).
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existente = await prisma.categoria.findUnique({
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
 * Retorna true se `possivelAncestralId` é a própria categoria `id` ou um de
 * seus descendentes. Usado para prevenir ciclos no reparentamento: um novo
 * pai não pode ser a própria categoria nem estar em sua subárvore.
 */
async function ehDescendenteOuProprio(id: string, possivelAncestralId: string): Promise<boolean> {
  if (id === possivelAncestralId) {
    return true;
  }

  // Percorre a subárvore de `id` procurando por `possivelAncestralId`.
  let fronteira: string[] = [id];

  while (fronteira.length > 0) {
    const filhos = await prisma.categoria.findMany({
      where: { categoriaPaiId: { in: fronteira } },
      select: { id: true },
    });

    if (filhos.length === 0) {
      return false;
    }

    const idsFilhos = filhos.map((f) => f.id);
    if (idsFilhos.includes(possivelAncestralId)) {
      return true;
    }

    fronteira = idsFilhos;
  }

  return false;
}

export async function criar(dados: Omit<Categoria, "id">): Promise<Categoria> {
  const nome = dados.nome.trim();
  if (nome.length === 0) {
    throw new Error("O nome da categoria não pode ser vazio.");
  }

  // Valida a existência do pai (quando informado).
  if (dados.categoriaPaiId) {
    const pai = await prisma.categoria.findUnique({
      where: { id: dados.categoriaPaiId },
      select: { id: true },
    });
    if (!pai) {
      throw new Error("A categoria pai informada não existe.");
    }
  }

  const slug = await gerarSlugUnico(nome);

  return prisma.categoria.create({
    data: {
      nome,
      slug,
      tipo: dados.tipo,
      categoriaPaiId: dados.categoriaPaiId ?? null,
      ordem: dados.ordem ?? 0,
    },
  });
}

export async function atualizar(id: string, dados: Partial<Categoria>): Promise<Categoria> {
  const atual = await prisma.categoria.findUnique({ where: { id } });
  if (!atual) {
    throw new Error("Categoria não encontrada.");
  }

  const data: Prisma.CategoriaUpdateInput = {};

  // Atualização de nome regenera o slug garantindo unicidade.
  if (dados.nome !== undefined) {
    const nome = dados.nome.trim();
    if (nome.length === 0) {
      throw new Error("O nome da categoria não pode ser vazio.");
    }
    data.nome = nome;
    if (nome !== atual.nome) {
      data.slug = await gerarSlugUnico(nome, id);
    }
  }

  if (dados.tipo !== undefined) {
    data.tipo = dados.tipo;
  }

  if (dados.ordem !== undefined) {
    data.ordem = dados.ordem;
  }

  // Reparentamento: valida existência do pai e ausência de ciclo.
  if (dados.categoriaPaiId !== undefined) {
    const novoPaiId = dados.categoriaPaiId;

    if (novoPaiId === null) {
      data.categoriaPai = { disconnect: true };
    } else {
      if (novoPaiId === id) {
        throw new Error("Reparentamento inválido: uma categoria não pode ser pai de si mesma.");
      }

      const pai = await prisma.categoria.findUnique({
        where: { id: novoPaiId },
        select: { id: true },
      });
      if (!pai) {
        throw new Error("A categoria pai informada não existe.");
      }

      if (await ehDescendenteOuProprio(id, novoPaiId)) {
        throw new Error("Reparentamento inválido: geraria um ciclo na árvore de categorias.");
      }

      data.categoriaPai = { connect: { id: novoPaiId } };
    }
  }

  return prisma.categoria.update({ where: { id }, data });
}

export async function remover(id: string): Promise<void> {
  const existente = await prisma.categoria.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existente) {
    throw new Error("Categoria não encontrada.");
  }

  // onDelete: SetNull nos filhos (schema) promove-os a raízes.
  await prisma.categoria.delete({ where: { id } });
}

export async function obterArvore(tipo?: TipoCategoria): Promise<NoArvore[]> {
  const categorias = await prisma.categoria.findMany({
    where: tipo ? { tipo } : undefined,
    orderBy: [{ ordem: "asc" }, { nome: "asc" }],
  });

  // Indexa por id e prepara os nós com lista de filhos vazia.
  const porId = new Map<string, NoArvore>();
  for (const c of categorias) {
    porId.set(c.id, { ...c, filhos: [] });
  }

  const raizes: NoArvore[] = [];

  for (const no of porId.values()) {
    const pai = no.categoriaPaiId !== null ? porId.get(no.categoriaPaiId) : undefined;

    // Um nó é raiz quando não tem pai ou o pai está fora do conjunto filtrado.
    if (pai) {
      pai.filhos.push(no);
    } else {
      raizes.push(no);
    }
  }

  return raizes;
}

export async function obterCaminho(categoriaId: string): Promise<Categoria[]> {
  const caminho: Categoria[] = [];
  const visitados = new Set<string>();

  let atualId: string | null = categoriaId;

  while (atualId !== null) {
    // Proteção defensiva contra dados inconsistentes que formem ciclo.
    if (visitados.has(atualId)) {
      break;
    }
    visitados.add(atualId);

    const categoria: Categoria | null = await prisma.categoria.findUnique({
      where: { id: atualId },
    });
    if (!categoria) {
      break;
    }

    caminho.unshift(categoria);
    atualId = categoria.categoriaPaiId;
  }

  return caminho;
}

// Objeto que materializa a interface ServicoCategorias do design.
export const servicoCategorias: ServicoCategorias = {
  criar,
  atualizar,
  remover,
  obterArvore,
  obterCaminho,
};

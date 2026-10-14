"use server";

// Server Actions do Serviço de Páginas.
// Aplicam autorização NO SERVIDOR (ação "editar_pagina") antes de delegar às
// mutações do serviço, conforme design.md e Requirements 2.4 / 4.1..4.4.
//
// O conteúdo HTML é sanitizado dentro do serviço (lib/sanitize) tanto ao
// persistir quanto ao exibir (Req 4.5).

import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/services/auth";
import {
  criar,
  atualizar,
  restaurarVersao,
  SlugDuplicadoError,
  type Visibilidade,
} from "@/lib/services/paginas";

// Resultado padronizado das actions para consumo no formulário (client).
export type ResultadoAcaoPagina =
  { ok: true; slug: string } | { ok: false; erro: string; slugSugerido?: string };

interface DadosFormularioPagina {
  titulo: string;
  conteudo: string;
  visibilidade: Visibilidade;
  categoriaId: string;
}

export async function criarPaginaAction(
  dados: DadosFormularioPagina,
): Promise<ResultadoAcaoPagina> {
  const sessao = await exigirPermissao("editar_pagina");

  try {
    const pagina = await criar({
      titulo: dados.titulo,
      conteudo: dados.conteudo,
      visibilidade: dados.visibilidade,
      categoriaId: dados.categoriaId,
      autorId: sessao!.id,
    });

    revalidatePath("/categorias");
    revalidatePath(`/paginas/${pagina.slug}`);
    return { ok: true, slug: pagina.slug };
  } catch (erro) {
    if (erro instanceof SlugDuplicadoError) {
      return { ok: false, erro: erro.message, slugSugerido: erro.slugSugerido };
    }
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao criar a página.",
    };
  }
}

export async function atualizarPaginaAction(
  id: string,
  dados: DadosFormularioPagina,
): Promise<ResultadoAcaoPagina> {
  const sessao = await exigirPermissao("editar_pagina");

  try {
    const pagina = await atualizar(id, {
      titulo: dados.titulo,
      conteudo: dados.conteudo,
      visibilidade: dados.visibilidade,
      categoriaId: dados.categoriaId,
      autorId: sessao!.id,
    });

    revalidatePath("/categorias");
    revalidatePath(`/paginas/${pagina.slug}`);
    return { ok: true, slug: pagina.slug };
  } catch (erro) {
    if (erro instanceof SlugDuplicadoError) {
      return { ok: false, erro: erro.message, slugSugerido: erro.slugSugerido };
    }
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao atualizar a página.",
    };
  }
}

// Restaura uma versão histórica de uma página (não destrutivo).
// Exige permissão de edição NO SERVIDOR (Requirement 2.4 / 5.4).
export async function restaurarVersaoAction(
  paginaId: string,
  versaoId: string,
): Promise<ResultadoAcaoPagina> {
  await exigirPermissao("editar_pagina");

  try {
    const pagina = await restaurarVersao(paginaId, versaoId);

    revalidatePath("/categorias");
    revalidatePath(`/paginas/${pagina.slug}`);
    revalidatePath(`/editor/paginas/${pagina.slug}/versoes`);
    return { ok: true, slug: pagina.slug };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao restaurar a versão.",
    };
  }
}

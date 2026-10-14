"use server";

// Server Actions do Serviço da RNDS (etapas de federalização).
// Aplicam autorização NO SERVIDOR antes de delegar às mutações do serviço,
// conforme design.md e Requirements 2.4 / 8.2, 8.5.
//
// Ação de autorização escolhida: "editar_pagina".
// Justificativa: gerir as etapas da federalização é uma atividade de EDIÇÃO
// DE CONTEÚDO (orientada a dados) da seção RNDS, análoga a editar páginas.
// Na matriz de permissões (lib/services/permissoes.ts), tanto "editar_pagina"
// quanto "gerenciar_categoria" pertencem aos perfis editor e admin; usamos
// "editar_pagina" por descrever melhor a natureza de conteúdo desta operação.

import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/services/auth";
import {
  criarEtapa,
  atualizarEtapa,
  removerEtapa,
  type EtapaFederalizacao,
  type StatusEtapa,
} from "@/lib/services/rnds";

// Resultado padronizado das actions para consumo no cliente.
export type ResultadoAcaoEtapa = { ok: true } | { ok: false; erro: string };

interface DadosEtapa {
  nome: string;
  ordem: number;
  status: StatusEtapa;
  descricao: string;
}

function revalidarSecaoRnds(): void {
  revalidatePath("/rnds");
  revalidatePath("/editor/rnds");
}

export async function criarEtapaAction(dados: DadosEtapa): Promise<ResultadoAcaoEtapa> {
  await exigirPermissao("editar_pagina");

  try {
    const etapa: Omit<EtapaFederalizacao, "id"> = {
      nome: dados.nome,
      ordem: dados.ordem,
      status: dados.status,
      descricao: dados.descricao,
    };
    await criarEtapa(etapa);
    revalidarSecaoRnds();
    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao criar a etapa.",
    };
  }
}

export async function atualizarEtapaAction(
  id: string,
  dados: Partial<DadosEtapa>,
): Promise<ResultadoAcaoEtapa> {
  await exigirPermissao("editar_pagina");

  try {
    await atualizarEtapa(id, dados);
    revalidarSecaoRnds();
    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao atualizar a etapa.",
    };
  }
}

export async function removerEtapaAction(id: string): Promise<ResultadoAcaoEtapa> {
  await exigirPermissao("editar_pagina");

  try {
    await removerEtapa(id);
    revalidarSecaoRnds();
    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao remover a etapa.",
    };
  }
}

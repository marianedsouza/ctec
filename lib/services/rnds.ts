// Serviço da Seção RNDS e Etapas de Federalização do Wiki SES-MS.
// Implementa a interface ServicoRnds do design.md (Componente 5):
//   - listarEtapas()          -> etapas ordenadas de forma crescente por `ordem`
//   - criarEtapa(dados)       -> persiste nome, ordem, status e descrição
//   - atualizarEtapa(id, ...) -> atualização orientada a dados (sem código)
//   - removerEtapa(id)
//
// Regras (design.md / Requirements 8.2..8.5, Property 12):
//   - `nome` não vazio; `descricao` armazenada como texto.
//   - `ordem` é inteiro; a lista exibida é ordenada por `ordem` crescente.
//   - `status` deve ser um dos valores do enum StatusEtapa.
//   - a gestão é orientada a dados: atualizar etapas NÃO exige mudança de código.
//
// IMPORTANTE (domínio): as etapas da federalização da RNDS em MS seguem o
// Plano de Trabalho — V.2 (Estado: Mato Grosso do Sul, 2026). São modeladas
// como dados editáveis (via /editor/rnds) para permitir atualização sem
// alteração de código sempre que o documento oficial mudar.

import type { Prisma, StatusEtapa } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type { StatusEtapa };

export interface EtapaFederalizacao {
  id: string;
  nome: string;
  ordem: number;
  status: StatusEtapa;
  descricao: string;
}

export interface ServicoRnds {
  listarEtapas(): Promise<EtapaFederalizacao[]>;
  criarEtapa(dados: Omit<EtapaFederalizacao, "id">): Promise<EtapaFederalizacao>;
  atualizarEtapa(
    id: string,
    dados: Partial<Omit<EtapaFederalizacao, "id">>,
  ): Promise<EtapaFederalizacao>;
  removerEtapa(id: string): Promise<void>;
}

// Conjunto de status válidos (espelha o enum StatusEtapa do schema).
const STATUS_VALIDOS: ReadonlySet<StatusEtapa> = new Set<StatusEtapa>([
  "nao_iniciada",
  "em_andamento",
  "concluida",
]);

/**
 * Lista as etapas de federalização em ordem CRESCENTE por `ordem`
 * (Requirement 8.3 / Property 12). Em caso de empate no `ordem`, usa o `id`
 * para uma ordenação determinística.
 */
export async function listarEtapas(): Promise<EtapaFederalizacao[]> {
  const etapas = await prisma.etapaFederalizacao.findMany({
    orderBy: [{ ordem: "asc" }, { id: "asc" }],
  });

  return etapas.map((e) => ({
    id: e.id,
    nome: e.nome,
    ordem: e.ordem,
    status: e.status,
    descricao: e.descricao,
  }));
}

/**
 * Cria uma etapa de federalização com nome, ordem, status e descrição
 * (Requirement 8.2). Valida nome não vazio, ordem inteira e status permitido.
 */
export async function criarEtapa(
  dados: Omit<EtapaFederalizacao, "id">,
): Promise<EtapaFederalizacao> {
  const nome = dados.nome.trim();
  if (nome.length === 0) {
    throw new Error("O nome da etapa não pode ser vazio.");
  }

  if (!Number.isInteger(dados.ordem)) {
    throw new Error("A ordem da etapa deve ser um número inteiro.");
  }

  if (!STATUS_VALIDOS.has(dados.status)) {
    throw new Error("O status informado para a etapa é inválido.");
  }

  return prisma.etapaFederalizacao.create({
    data: {
      nome,
      ordem: dados.ordem,
      status: dados.status,
      descricao: dados.descricao ?? "",
    },
  });
}

/**
 * Atualiza uma etapa de forma orientada a dados (Requirement 8.5): qualquer
 * campo (nome, ordem, status, descrição) pode ser alterado sem tocar em código.
 */
export async function atualizarEtapa(
  id: string,
  dados: Partial<Omit<EtapaFederalizacao, "id">>,
): Promise<EtapaFederalizacao> {
  const atual = await prisma.etapaFederalizacao.findUnique({ where: { id } });
  if (!atual) {
    throw new Error("Etapa de federalização não encontrada.");
  }

  const data: Prisma.EtapaFederalizacaoUpdateInput = {};

  if (dados.nome !== undefined) {
    const nome = dados.nome.trim();
    if (nome.length === 0) {
      throw new Error("O nome da etapa não pode ser vazio.");
    }
    data.nome = nome;
  }

  if (dados.ordem !== undefined) {
    if (!Number.isInteger(dados.ordem)) {
      throw new Error("A ordem da etapa deve ser um número inteiro.");
    }
    data.ordem = dados.ordem;
  }

  if (dados.status !== undefined) {
    if (!STATUS_VALIDOS.has(dados.status)) {
      throw new Error("O status informado para a etapa é inválido.");
    }
    data.status = dados.status;
  }

  if (dados.descricao !== undefined) {
    data.descricao = dados.descricao;
  }

  return prisma.etapaFederalizacao.update({ where: { id }, data });
}

export async function removerEtapa(id: string): Promise<void> {
  const existente = await prisma.etapaFederalizacao.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existente) {
    throw new Error("Etapa de federalização não encontrada.");
  }

  await prisma.etapaFederalizacao.delete({ where: { id } });
}

// Objeto que materializa a interface ServicoRnds do design.
export const servicoRnds: ServicoRnds = {
  listarEtapas,
  criarEtapa,
  atualizarEtapa,
  removerEtapa,
};

// Matriz de permissões e tipos de autorização do Wiki SES-MS.
// Define os perfis, as ações do sistema e o mapeamento perfil -> ações.
// Conforme design.md (Componente 1: Serviço de Autenticação e Perfis).

import type { Perfil } from "@prisma/client";

// Sessão do usuário exposta à aplicação (derivada do NextAuth).
export interface SessaoUsuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
}

// Ações que o sistema controla por autorização.
export type Acao =
  | "ler_publico"
  | "ler_restrito"
  | "editar_pagina"
  | "gerenciar_categoria"
  | "gerenciar_usuario";

// Matriz de permissões: para cada perfil, o conjunto de ações permitidas.
// - leitor: lê conteúdo público e restrito.
// - editor: tudo do leitor + edição de páginas e categorias.
// - admin:  tudo do editor + gestão de usuários.
export const MATRIZ_PERMISSOES: Record<Perfil, ReadonlySet<Acao>> = {
  leitor: new Set<Acao>(["ler_publico", "ler_restrito"]),
  editor: new Set<Acao>([
    "ler_publico",
    "ler_restrito",
    "editar_pagina",
    "gerenciar_categoria",
  ]),
  admin: new Set<Acao>([
    "ler_publico",
    "ler_restrito",
    "editar_pagina",
    "gerenciar_categoria",
    "gerenciar_usuario",
  ]),
};

// Ações permitidas a usuários não autenticados (sessão nula).
const ACOES_PUBLICAS: ReadonlySet<Acao> = new Set<Acao>(["ler_publico"]);

/**
 * Verifica se a sessão informada possui permissão para executar a ação.
 *
 * - Sessão nula (usuário anônimo) só pode executar ações públicas.
 * - Caso contrário, consulta a matriz de permissões pelo perfil.
 *
 * A decisão é determinística: uma ação é permitida se, e somente se, o
 * perfil a possui na matriz (Property 8 do design).
 */
export function possuiPermissao(
  sessao: SessaoUsuario | null,
  acao: Acao
): boolean {
  if (!sessao) {
    return ACOES_PUBLICAS.has(acao);
  }

  const acoesDoPerfil = MATRIZ_PERMISSOES[sessao.perfil];
  if (!acoesDoPerfil) {
    return false;
  }

  return acoesDoPerfil.has(acao);
}

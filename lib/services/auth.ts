// Serviço de Autenticação e Perfis (Auth) do Wiki SES-MS.
// Implementa a interface ServicoAuth do design.md (Componente 1):
//   - obterSessao(): resolve a sessão atual no servidor via NextAuth.
//   - possuiPermissao(sessao, acao): autoriza ações conforme a matriz.
//
// Toda verificação de acesso é aplicada NO SERVIDOR (Requirement 2.4).

import { auth } from "@/auth";
import {
  possuiPermissao,
  type Acao,
  type SessaoUsuario,
} from "@/lib/services/permissoes";

export type { Acao, SessaoUsuario };
export { possuiPermissao };

export interface ServicoAuth {
  obterSessao(): Promise<SessaoUsuario | null>;
  possuiPermissao(sessao: SessaoUsuario | null, acao: Acao): boolean;
}

/**
 * Resolve a sessão do usuário autenticado no servidor.
 * Retorna null quando não há sessão (usuário anônimo).
 */
export async function obterSessao(): Promise<SessaoUsuario | null> {
  const sessao = await auth();

  if (!sessao?.user?.id) {
    return null;
  }

  return {
    id: sessao.user.id,
    nome: sessao.user.name ?? "",
    email: sessao.user.email ?? "",
    perfil: sessao.user.perfil,
  };
}

/**
 * Garante que a sessão atual possui permissão para a ação.
 * Lança erro quando o acesso é negado (uso em Server Actions / rotas).
 */
export async function exigirPermissao(acao: Acao): Promise<SessaoUsuario | null> {
  const sessao = await obterSessao();
  if (!possuiPermissao(sessao, acao)) {
    throw new Error(`Acesso negado: perfil sem permissão para "${acao}".`);
  }
  return sessao;
}

// Objeto que materializa a interface ServicoAuth do design.
export const servicoAuth: ServicoAuth = {
  obterSessao,
  possuiPermissao,
};

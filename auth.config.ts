// Configuração base do NextAuth compartilhada entre o servidor (Node) e o
// middleware (edge). NÃO inclui provedores que dependem de módulos Node
// (bcrypt/Prisma), permitindo uso seguro no middleware.
//
// Define a separação entre rotas públicas e restritas no servidor
// (Requirements 2.1, 2.4) através do callback `authorized`.

import type { NextAuthConfig } from "next-auth";

// Prefixos de rota que exigem autenticação (área restrita da equipe SES-MS).
const ROTAS_RESTRITAS = ["/admin", "/editor", "/restrito"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    // Executado pelo middleware para autorizar o acesso à rota solicitada.
    // Usuário anônimo é redirecionado ao login ao tentar acessar rota restrita.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const autenticado = !!auth?.user;

      const rotaRestrita = ROTAS_RESTRITAS.some(
        (prefixo) => pathname === prefixo || pathname.startsWith(`${prefixo}/`)
      );

      if (rotaRestrita) {
        // Permite (true) apenas se autenticado; caso contrário o NextAuth
        // redireciona para a página de login configurada.
        return autenticado;
      }

      // Rotas públicas: sempre acessíveis.
      return true;
    },
  },
} satisfies NextAuthConfig;

export { ROTAS_RESTRITAS };

// Middleware de guarda de rotas do Wiki SES-MS.
// Aplica a separação entre rotas públicas e restritas NO SERVIDOR
// (Requirements 2.1, 2.4), usando a configuração base edge-safe do NextAuth.
// Usuários anônimos que acessam rotas restritas são redirecionados ao login.

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

// Aplica o middleware a todas as rotas, exceto assets estáticos e a própria
// API de autenticação do NextAuth.
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

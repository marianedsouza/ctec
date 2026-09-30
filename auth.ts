// Configuração central do NextAuth (Auth.js) para o Wiki SES-MS.
// Usa provider de credenciais (email + senha) autenticando contra o modelo
// Prisma `Usuario`, cujo campo `senhaHash` armazena APENAS o hash da senha.
// A sessão resultante carrega o perfil do usuário (admin/editor/leitor).
// Conforme design.md (Componente 1: Serviço de Autenticação e Perfis).

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Perfil } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const senha =
          typeof credentials?.senha === "string" ? credentials.senha : "";

        if (!email || !senha) {
          return null;
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email },
        });

        // Credenciais inválidas: usuário inexistente (Requirement 1.2).
        if (!usuario) {
          return null;
        }

        // Compara a senha em texto puro com o hash armazenado (Requirement 1.5).
        const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaConfere) {
          return null;
        }

        // Retorna os dados que comporão a sessão (Requirement 1.1).
        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // Persiste o perfil e o id no token JWT.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.perfil = (user as { perfil: Perfil }).perfil;
      }
      return token;
    },
    // Expõe id e perfil na sessão consumida pela aplicação.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.perfil = token.perfil as Perfil;
      }
      return session;
    },
  },
});

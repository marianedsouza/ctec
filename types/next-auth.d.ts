// Augmentação de tipos do NextAuth para incluir o perfil e o id do usuário
// na sessão e no token JWT do Wiki SES-MS.

import type { Perfil } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      perfil: Perfil;
    } & DefaultSession["user"];
  }

  interface User {
    perfil: Perfil;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    perfil: Perfil;
  }
}

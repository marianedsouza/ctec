// Route handler do NextAuth (Auth.js) para o App Router.
// Reexporta os handlers GET/POST configurados em `auth.ts`.

import { handlers } from "@/auth";

export const { GET, POST } = handlers;

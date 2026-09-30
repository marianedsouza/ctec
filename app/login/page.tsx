// Página de login da área restrita (Task 10.2 — integração de autenticação).
//
// O auth.config.ts redireciona rotas restritas para "/login" quando o usuário
// não está autenticado; esta página torna esse fluxo funcional de ponta a
// ponta. É um Client Component que usa o `signIn` do NextAuth com o provedor de
// credenciais (email + senha) definido em auth.ts.
//
// Requirements 1.1 (sessão em credenciais válidas) e 1.2 (mensagem de erro em
// credenciais inválidas).

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function FormularioLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/editor/rnds";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const resultado = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    setEnviando(false);

    if (!resultado || resultado.error) {
      // Credenciais inválidas (Requirement 1.2).
      setErro("E-mail ou senha inválidos.");
      return;
    }

    // Sessão criada (Requirement 1.1): segue para a rota solicitada.
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      {erro && (
        <p className="form-error" role="alert">
          {erro}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          name="senha"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main>
      <h1>Acesso à área restrita</h1>
      <p>
        Área destinada à equipe da SES-MS. Informe suas credenciais para editar
        conteúdo, categorias e etapas da federalização.
      </p>

      <Suspense fallback={<p>Carregando formulário…</p>}>
        <FormularioLogin />
      </Suspense>
    </main>
  );
}

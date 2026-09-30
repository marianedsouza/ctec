"use client";

// Histórico de versões de uma página (Componente de cliente).
// Lista as versões em ordem cronológica e permite restaurar uma versão
// de forma não destrutiva, chamando a Server Action do Serviço de Páginas.
// Requirements 5.3, 5.4.

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { restaurarVersaoAction } from "@/lib/services/paginas-actions";

interface VersaoResumo {
  id: string;
  titulo: string;
  criadaEm: string; // ISO string (serializável do servidor para o cliente)
  atual: boolean;
}

interface HistoricoVersoesProps {
  paginaId: string;
  versoes: VersaoResumo[];
}

const formatador = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
});

export default function HistoricoVersoes({
  paginaId,
  versoes,
}: HistoricoVersoesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [restaurandoId, setRestaurandoId] = useState<string | null>(null);

  function aoRestaurar(versaoId: string) {
    setErro(null);
    setRestaurandoId(versaoId);

    startTransition(async () => {
      const resultado = await restaurarVersaoAction(paginaId, versaoId);
      setRestaurandoId(null);

      if (resultado.ok) {
        router.refresh();
      } else {
        setErro(resultado.erro);
      }
    });
  }

  if (versoes.length === 0) {
    return <p>Nenhuma versão registrada para esta página.</p>;
  }

  return (
    <div>
      {erro && (
        <p role="alert" style={{ color: "#b00020" }}>
          {erro}
        </p>
      )}

      <ol>
        {versoes.map((versao, indice) => (
          <li key={versao.id} style={{ marginBottom: "0.75rem" }}>
            <div>
              <strong>Versão {indice + 1}</strong>{" "}
              <span>— {versao.titulo}</span>
              {versao.atual && (
                <span style={{ marginLeft: "0.5rem", color: "#0a7d28" }}>
                  (conteúdo atual)
                </span>
              )}
            </div>
            <div style={{ color: "#555", fontSize: "0.9rem" }}>
              {formatador.format(new Date(versao.criadaEm))}
            </div>
            <button
              type="button"
              onClick={() => aoRestaurar(versao.id)}
              disabled={isPending}
            >
              {isPending && restaurandoId === versao.id
                ? "Restaurando..."
                : "Restaurar esta versão"}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

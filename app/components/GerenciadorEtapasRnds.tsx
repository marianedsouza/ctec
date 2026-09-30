"use client";

// Gerenciador de etapas de federalização da RNDS (Componente de cliente).
// Permite criar, atualizar (nome, ordem, status, descrição) e remover etapas
// chamando as Server Actions do Serviço da RNDS. A gestão é orientada a dados:
// nenhuma alteração de código é necessária para manter as etapas (Req 8.5).

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  criarEtapaAction,
  atualizarEtapaAction,
  removerEtapaAction,
} from "@/lib/services/rnds-actions";

type StatusEtapa = "nao_iniciada" | "em_andamento" | "concluida";

interface Etapa {
  id: string;
  nome: string;
  ordem: number;
  status: StatusEtapa;
  descricao: string;
}

interface GerenciadorEtapasRndsProps {
  etapas: Etapa[];
}

const OPCOES_STATUS: { valor: StatusEtapa; rotulo: string }[] = [
  { valor: "nao_iniciada", rotulo: "Não iniciada" },
  { valor: "em_andamento", rotulo: "Em andamento" },
  { valor: "concluida", rotulo: "Concluída" },
];

export default function GerenciadorEtapasRnds({
  etapas,
}: GerenciadorEtapasRndsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  // Estado do formulário de nova etapa.
  const [novoNome, setNovoNome] = useState("");
  const [novaOrdem, setNovaOrdem] = useState<number>(etapas.length);
  const [novoStatus, setNovoStatus] = useState<StatusEtapa>("nao_iniciada");
  const [novaDescricao, setNovaDescricao] = useState("");

  function aoCriar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (novoNome.trim().length === 0) {
      setErro("O nome da etapa não pode ser vazio.");
      return;
    }

    startTransition(async () => {
      const resultado = await criarEtapaAction({
        nome: novoNome,
        ordem: novaOrdem,
        status: novoStatus,
        descricao: novaDescricao,
      });

      if (resultado.ok) {
        setNovoNome("");
        setNovaDescricao("");
        setNovoStatus("nao_iniciada");
        router.refresh();
      } else {
        setErro(resultado.erro);
      }
    });
  }

  function aoAtualizar(id: string, dados: Partial<Omit<Etapa, "id">>) {
    setErro(null);
    startTransition(async () => {
      const resultado = await atualizarEtapaAction(id, dados);
      if (resultado.ok) {
        router.refresh();
      } else {
        setErro(resultado.erro);
      }
    });
  }

  function aoRemover(id: string) {
    setErro(null);
    startTransition(async () => {
      const resultado = await removerEtapaAction(id);
      if (resultado.ok) {
        router.refresh();
      } else {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div>
      {erro && (
        <p role="alert" style={{ color: "#b00020" }}>
          {erro}
        </p>
      )}

      <section aria-labelledby="etapas-existentes">
        <h2 id="etapas-existentes">Etapas cadastradas</h2>
        {etapas.length === 0 ? (
          <p>Nenhuma etapa cadastrada.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {etapas.map((etapa) => (
              <LinhaEtapa
                key={etapa.id}
                etapa={etapa}
                isPending={isPending}
                onAtualizar={aoAtualizar}
                onRemover={aoRemover}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="nova-etapa">
        <h2 id="nova-etapa">Adicionar etapa</h2>
        <form onSubmit={aoCriar}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="novo-nome" style={{ display: "block" }}>
              Nome
            </label>
            <input
              id="novo-nome"
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="nova-ordem" style={{ display: "block" }}>
              Ordem
            </label>
            <input
              id="nova-ordem"
              type="number"
              value={novaOrdem}
              onChange={(e) => setNovaOrdem(Number(e.target.value))}
              step={1}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="novo-status" style={{ display: "block" }}>
              Status
            </label>
            <select
              id="novo-status"
              value={novoStatus}
              onChange={(e) => setNovoStatus(e.target.value as StatusEtapa)}
            >
              {OPCOES_STATUS.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="nova-descricao" style={{ display: "block" }}>
              Descrição
            </label>
            <textarea
              id="nova-descricao"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Adicionar etapa"}
          </button>
        </form>
      </section>
    </div>
  );
}

interface LinhaEtapaProps {
  etapa: Etapa;
  isPending: boolean;
  onAtualizar: (id: string, dados: Partial<Omit<Etapa, "id">>) => void;
  onRemover: (id: string) => void;
}

// Linha editável de uma etapa: permite alterar nome, ordem, status e descrição.
function LinhaEtapa({
  etapa,
  isPending,
  onAtualizar,
  onRemover,
}: LinhaEtapaProps) {
  const [nome, setNome] = useState(etapa.nome);
  const [ordem, setOrdem] = useState<number>(etapa.ordem);
  const [status, setStatus] = useState<StatusEtapa>(etapa.status);
  const [descricao, setDescricao] = useState(etapa.descricao);

  return (
    <li
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "0.75rem",
        marginBottom: "0.75rem",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <label style={{ display: "block" }}>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label style={{ display: "block" }}>Ordem</label>
        <input
          type="number"
          value={ordem}
          onChange={(e) => setOrdem(Number(e.target.value))}
          step={1}
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label style={{ display: "block" }}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusEtapa)}
        >
          {OPCOES_STATUS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label style={{ display: "block" }}>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
        />
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={() => onAtualizar(etapa.id, { nome, ordem, status, descricao })}
      >
        Salvar alterações
      </button>{" "}
      <button
        type="button"
        disabled={isPending}
        onClick={() => onRemover(etapa.id)}
      >
        Remover
      </button>
    </li>
  );
}

// Seção pública da RNDS (SSR).
// Reúne o conteúdo explicativo (Task 9.1 / Requirement 8.1):
//   - "o que é a RNDS"
//   - "o que é a federalização da RNDS"
// e apresenta as etapas estaduais da federalização ("onde estamos") em uma
// linha do tempo ordenada de forma crescente por `ordem`, com o status visível
// (Task 9.2 / Requirements 8.3, 8.4).
//
// IMPORTANTE (domínio): as etapas reais da federalização em MS ainda NÃO estão
// confirmadas. As etapas exibidas são ILUSTRATIVAS (dados de exemplo editáveis)
// e não devem ser interpretadas como o cronograma oficial da SES-MS/DATASUS.

import Link from "next/link";
import type { StatusEtapa } from "@prisma/client";
import { listarEtapas } from "@/lib/services/rnds";
import { obterSessao, possuiPermissao } from "@/lib/services/auth";

export const dynamic = "force-dynamic";

// Rótulos legíveis e cores de status para exibição ("onde estamos").
const ROTULO_STATUS: Record<StatusEtapa, string> = {
  nao_iniciada: "Não iniciada",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

const COR_STATUS: Record<StatusEtapa, string> = {
  nao_iniciada: "#6b7280",
  em_andamento: "#b45309",
  concluida: "#0a7d28",
};

export default async function SecaoRndsPage() {
  const [etapas, sessao] = await Promise.all([listarEtapas(), obterSessao()]);
  const podeEditar = possuiPermissao(sessao, "editar_pagina");

  return (
    <main>
      <h1>RNDS — Rede Nacional de Dados em Saúde</h1>

      <section aria-labelledby="o-que-e-rnds">
        <h2 id="o-que-e-rnds">O que é a RNDS</h2>
        <p>
          A RNDS (Rede Nacional de Dados em Saúde) é a plataforma nacional de
          interoperabilidade de dados em saúde, mantida pelo DATASUS. Ela conecta
          estabelecimentos, sistemas e entes federativos para permitir a troca
          segura de informações clínicas e administrativas ao longo da jornada do
          cidadão no SUS.
        </p>
        <p>
          Tecnicamente, a RNDS adota o padrão de interoperabilidade{" "}
          <abbr title="Health Level 7 Fast Healthcare Interoperability Resources">
            HL7 FHIR
          </abbr>{" "}
          e terminologias clínicas reconhecidas (como LOINC, SNOMED CT e CID),
          o que padroniza o significado dos dados trocados entre diferentes
          sistemas de saúde.
        </p>
      </section>

      <section aria-labelledby="o-que-e-federalizacao">
        <h2 id="o-que-e-federalizacao">O que é a federalização da RNDS</h2>
        <p>
          A federalização da RNDS é o modelo em que o estado opera a sua própria
          instância federada da RNDS, integrada à base nacional. Nesse arranjo, a
          SES-MS ganha autonomia para integrar sistemas locais (municipais e
          estaduais) enquanto mantém sincronização contínua com a base federal.
        </p>
        <p>
          Na prática, a federalização aproxima a governança dos dados do nível
          estadual, facilitando integrações regionais sem abrir mão da
          interoperabilidade nacional garantida pelos padrões da RNDS.
        </p>
      </section>

      <section aria-labelledby="onde-estamos">
        <h2 id="onde-estamos">Etapas da federalização em MS — onde estamos</h2>

        <p role="note" style={{ fontStyle: "italic", color: "#555" }}>
          Aviso: as etapas abaixo são ilustrativas e servem de modelo editável.
          Elas ainda não representam o cronograma oficial da federalização da
          RNDS em Mato Grosso do Sul e devem ser atualizadas a partir do
          documento oficial de adesão da SES-MS/DATASUS.
        </p>

        {podeEditar && (
          <p>
            <Link href="/editor/rnds">Gerenciar etapas (área restrita)</Link>
          </p>
        )}

        {etapas.length === 0 ? (
          <p>Nenhuma etapa cadastrada ainda.</p>
        ) : (
          <ol aria-label="Etapas da federalização em ordem crescente">
            {etapas.map((etapa) => (
              <li key={etapa.id} style={{ marginBottom: "1rem" }}>
                <div>
                  <strong>{etapa.nome}</strong>{" "}
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      color: COR_STATUS[etapa.status],
                      fontSize: "0.9rem",
                    }}
                  >
                    [{ROTULO_STATUS[etapa.status]}]
                  </span>
                </div>
                {etapa.descricao && (
                  <p style={{ margin: "0.25rem 0", color: "#333" }}>
                    {etapa.descricao}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

// Landing page pública da Federalização da RNDS em Mato Grosso do Sul.
// Página 100% estática (sem banco de dados, sem sessão): conteúdo editorial
// fixo baseado no Plano de Trabalho da Federalização da RNDS — V.2
// (Estado: Mato Grosso do Sul, 2026). As etapas exibidas podem ser ajustadas
// diretamente neste arquivo ou, futuramente, tornadas editáveis novamente.

import Link from "next/link";
import {
  IconeDocumento,
  IconeGrafico,
  IconePasta,
  IconePlano,
  IconeRede,
} from "@/app/components/Icones";

export const dynamic = "force-static";

const ETAPAS = [
  {
    ordem: 1,
    nome: "Acesso e extração de dados (Bucket S3)",
    status: "em_andamento" as const,
    rotuloStatus: "Em andamento",
    descricao:
      "Fase de preparação e homologação (2026-2027), seguida da integração e carga histórica (até 2028), com acesso ao bucket S3 de extração de dados da RNDS.",
  },
  {
    ordem: 2,
    nome: "Tratamento dos dados da RNDS",
    status: "nao_iniciada" as const,
    rotuloStatus: "Não iniciada",
    descricao:
      "Padronização, qualidade e segurança dos dados extraídos, preparando-os para a geração de indicadores.",
  },
  {
    ordem: 3,
    nome: "Disseminação e uso dos dados da RNDS",
    status: "nao_iniciada" as const,
    rotuloStatus: "Não iniciada",
    descricao:
      "Ampliação de parcerias e uso estratégico dos dados para gestão e vigilância em saúde em Mato Grosso do Sul.",
  },
];

const DESTAQUES = [
  {
    id: "projeto",
    variante: "azul",
    icone: <IconeDocumento />,
    titulo: "Projeto",
    texto:
      "Entenda o escopo da federalização da RNDS em Mato Grosso do Sul e os conceitos que sustentam o projeto estadual.",
    href: "#projeto-info",
  },
  {
    id: "plano-de-trabalho",
    variante: "verde",
    icone: <IconePlano />,
    titulo: "Plano de Trabalho",
    texto:
      "Acompanhe as ações planejadas e executadas, com o andamento registrado etapa a etapa.",
    href: "#onde-estamos",
  },
  {
    id: "rnds",
    variante: "roxo",
    icone: <IconeGrafico />,
    titulo: "RNDS",
    texto:
      "As vantagens de consumir dados nacionais: interoperabilidade, padrões e visão única da jornada no SUS.",
    href: "#o-que-e-rnds",
  },
  {
    id: "acompanhe-o-projeto",
    variante: "laranja",
    icone: <IconeRede />,
    titulo: "Acompanhe o Projeto",
    texto: "De onde partimos e para onde vamos: a jornada estadual em Mato Grosso do Sul.",
    href: "#onde-estamos",
  },
];

export default function HomePage() {
  return (
    <div className="rnds">
      <section className="rnds-hero">
        <div className="container rnds-hero__content">
          <p className="rnds-hero__eyebrow">SAÚDE DIGITAL · RNDS</p>
          <h1>Federalização da RNDS</h1>
          <p className="rnds-hero__state">Mato Grosso do Sul</p>
          <div className="rnds-hero__line" aria-hidden="true" />
          <p className="rnds-hero__subtitle">
            Uma rede estadual conectada à Rede Nacional de Dados em Saúde, com interoperabilidade,
            segurança e visão única do cidadão em todo o território sul-mato-grossense.
          </p>

          <ul className="rnds-hero__metrics" aria-label="Indicadores do projeto">
            <li>
              <b>{ETAPAS.length}</b>
              <span>
                <strong>Etapas</strong>
                do plano
              </span>
            </li>
            <li>
              <b>2026</b>
              <span>
                <strong>Início</strong>
                da jornada
              </span>
            </li>
            <li>
              <b>2028</b>
              <span>
                <strong>Carga histórica</strong>
                prevista
              </span>
            </li>
            <li className="rnds-hero__metric--last">
              <b>MS</b>
              <span>
                <strong>Instância</strong>
                estadual
              </span>
            </li>
          </ul>
        </div>

        <div className="rnds-hero__visual" aria-hidden="true">
          <div className="rnds-network">
            <span className="rnds-node rnds-node--cloud">☁</span>
            <span className="rnds-node rnds-node--users">◍</span>
            <span className="rnds-node rnds-node--graph">◈</span>
            <span className="rnds-node rnds-node--health">✚</span>
          </div>
        </div>
      </section>

      <main className="container rnds-main">
        <section className="feature-grid" aria-label="Destaques da federalização">
          {DESTAQUES.map((destaque) => (
            <article
              key={destaque.id}
              className={`feature-card feature-card--${destaque.variante}`}
              id={destaque.id}
            >
              <span className="feature-card__icon">{destaque.icone}</span>
              <h2>{destaque.titulo}</h2>
              <p>{destaque.texto}</p>
              <a href={destaque.href}>
                Acessar <b aria-hidden="true">→</b>
              </a>
            </article>
          ))}
        </section>

        <section className="information" id="projeto-info">
          <article id="o-que-e-rnds">
            <small>O QUE É A RNDS</small>
            <h2>Interoperabilidade nacional</h2>
            <p>
              A RNDS (Rede Nacional de Dados em Saúde) é a plataforma nacional de interoperabilidade
              mantida pelo DATASUS. Ela conecta estabelecimentos, sistemas e entes federativos para
              permitir a troca segura de informações clínicas e administrativas ao longo da jornada
              do cidadão no SUS, adotando o padrão HL7 FHIR e terminologias clínicas reconhecidas
              (LOINC, SNOMED CT e CID).
            </p>
          </article>

          <article id="o-que-e-federalizacao">
            <small>FEDERALIZAÇÃO</small>
            <h2>Uma instância estadual</h2>
            <p>
              A federalização é o modelo em que o estado opera a sua própria instância federada da
              RNDS, integrada à base nacional. Na prática, a SES-MS ganha autonomia para integrar
              sistemas locais (municipais e estaduais) mantendo sincronização contínua com a base
              federal.
            </p>
          </article>
        </section>

        <section className="timeline-section" id="onde-estamos">
          <p>ONDE ESTAMOS</p>
          <h2>Etapas da federalização em MS</h2>

          <p className="notice">
            As etapas abaixo seguem o Plano de Trabalho da Federalização da RNDS — V.2 (MS, 2026) e
            serão atualizadas conforme o andamento oficial do projeto.
          </p>

          <ol className="timeline">
            {ETAPAS.map((etapa) => (
              <li className="timeline-item" key={etapa.ordem}>
                <b>Etapa {etapa.ordem}</b>
                <div>
                  <strong className="timeline-item__title">{etapa.nome}</strong>
                  <span className={`status-badge status-badge--${etapa.status}`}>
                    {etapa.rotuloStatus}
                  </span>
                  <p>{etapa.descricao}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="documents" id="documentos">
          <div className="documents__title">
            <span className="documents__icon">
              <IconePasta />
            </span>
            <div>
              <p>PLANO DE TRABALHO</p>
              <h2>Documento oficial</h2>
              <span>
                Plano de Trabalho da Federalização da RNDS — V.2 (Estado: Mato Grosso do Sul, 2026).
              </span>
            </div>
          </div>

          <div className="anexos-grid">
            <article className="anexo-card">
              <h3 className="anexo-card__titulo">
                Plano de Trabalho da Federalização da RNDS — MS (V.2)
              </h3>
              <p className="anexo-card__meta">
                CGIIS · DATASUS · SEIDIGI · MS — edição de 24/07/2026
              </p>
              <p className="anexo-card__desc">
                Documento com o cenário-alvo, a metodologia, os quatro domínios do projeto e as
                etapas estaduais da federalização da RNDS em Mato Grosso do Sul.
              </p>
              <a className="anexo-card__link" href="/rnds_apresentacao_ms.txt" download>
                Baixar resumo do plano
              </a>
            </article>
          </div>
        </section>
      </main>

      <section className="closing">
        <div className="container closing__content">
          <div>
            <h2>Acompanhe a federalização da RNDS em MS</h2>
            <p>
              Conteúdo institucional mantido pela Secretaria de Estado de Saúde de Mato Grosso do
              Sul.
            </p>
          </div>
          <p className="closing__cta">
            <Link className="btn-primary" href="#onde-estamos">
              Ver as etapas
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

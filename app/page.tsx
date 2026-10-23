// Landing page pública da Federalização da RNDS em Mato Grosso do Sul.
// Página 100% estática (sem banco de dados, sem sessão): conteúdo editorial
// fixo baseado no Plano de Trabalho da Federalização da RNDS — V.2
// (Estado: Mato Grosso do Sul, 2026) e na Oficina Online de Apresentação dos
// Planos de Trabalho (agosto/2026). As etapas e os status dos domínios podem
// ser ajustados diretamente neste arquivo.

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

type StatusDominio = "nao_iniciado" | "primeiros_passos" | "em_curso" | "consolidado";

interface ItemDominio {
  nome: string;
  detalhe?: string;
  status?: StatusDominio;
  rotulo?: string;
}

interface Dominio {
  id: string;
  variante: string;
  nome: string;
  objetivo: string;
  itens: ItemDominio[];
}

const DOMINIOS: Dominio[] = [
  {
    id: "institucional",
    variante: "institucional",
    nome: "Domínio Institucional",
    objetivo:
      "Fortalecer a estrutura institucional da Saúde Digital, com área formalizada, instrumentos de governança atualizados, recursos financeiros e equipes qualificadas para apoiar a Federalização da RNDS.",
    itens: [
      {
        nome: "Área, órgão e equipe responsável",
        detalhe: "Definição do Grupo de Trabalho",
        status: "consolidado",
        rotulo: "Consolidado",
      },
      {
        nome: "Políticas, normativos e guias",
        detalhe: "Definir políticas",
        status: "em_curso",
        rotulo: "Em curso",
      },
      {
        nome: "Orçamento",
        detalhe: "Definir orçamento",
        status: "consolidado",
        rotulo: "Consolidado",
      },
      {
        nome: "Relações institucionais",
        detalhe: "Definir relações institucionais",
        status: "primeiros_passos",
        rotulo: "Primeiros passos",
      },
      {
        nome: "Formação e qualificação",
        detalhe: "Definir modelo de qualificação",
        status: "primeiros_passos",
        rotulo: "Primeiros passos",
      },
    ],
  },
  {
    id: "governanca",
    variante: "governanca",
    nome: "Domínio Governança",
    objetivo:
      "Fortalecer a governança da Saúde Digital, alinhando políticas, recursos, equipes e processos aos objetivos estratégicos da SES e à Federalização da RNDS.",
    itens: [
      {
        nome: "Governança do projeto",
        detalhe: "Governança do Projeto de Federalização da RNDS",
        status: "em_curso",
        rotulo: "Em curso",
      },
      {
        nome: "Governança de políticas",
        detalhe: "Governança de políticas estabelecidas",
        status: "em_curso",
        rotulo: "Em curso",
      },
      {
        nome: "Governança de sistemas e dados",
        detalhe: "Sistemas de informações e/ou base de dados",
        status: "consolidado",
        rotulo: "Consolidado",
      },
      {
        nome: "Governança orçamentária",
        status: "consolidado",
        rotulo: "Consolidado",
      },
      {
        nome: "Formação e qualificação",
        status: "nao_iniciado",
        rotulo: "Não iniciado",
      },
    ],
  },
  {
    id: "informacao",
    variante: "informacao",
    nome: "Domínio Informação e Informática",
    objetivo:
      "Fortalecer a infraestrutura tecnológica, conectividade, segurança da informação e gestão dos dados da RNDS, garantindo recursos computacionais adequados, monitoramento contínuo, melhoria dos serviços digitais e competências técnicas que sustentem a Federalização.",
    itens: [
      {
        nome: "Infraestrutura de TI",
        detalhe: "Sustentação e evolução da RNDS MS",
        status: "consolidado",
        rotulo: "Consolidado",
      },
      {
        nome: "Segurança",
        detalhe: "Segurança cibernética e da informação",
        status: "consolidado",
        rotulo: "Consolidado",
      },
      {
        nome: "Informação",
        detalhe: "Tratamento e uso adequado da informação",
        status: "em_curso",
        rotulo: "Em curso",
      },
      {
        nome: "Equipe",
        detalhe: "Definição e qualificação da equipe de sustentação",
        status: "em_curso",
        rotulo: "Em curso",
      },
      {
        nome: "Formação e qualificação",
        detalhe: "Capacitação para sustentação dos serviços da RNDS",
        status: "em_curso",
        rotulo: "Em curso",
      },
    ],
  },
  {
    id: "comunicacao",
    variante: "comunicacao",
    nome: "Domínio Comunicação",
    objetivo:
      "Apoiar a implementação da Federalização dos Dados da RNDS por meio da comunicação institucional, assegurando a divulgação das informações e das principais entregas do projeto nos canais oficiais da SES-MS.",
    itens: [
      {
        nome: "Camada 1 — Direção estratégica",
        detalhe:
          "Consolidar o fluxo institucional de comunicação e promover a divulgação e o uso dos dados pelos públicos estratégicos.",
      },
      {
        nome: "Camada 2 — Estrutura e sustentação",
        detalhe:
          "Priorizar os recursos e canais existentes na SES-MS, com responsabilidades compartilhadas e apoio da Secom quando necessário.",
      },
      {
        nome: "Camada 3 — Execução e rotina",
        detalhe:
          "Priorizar ações viáveis de comunicação, conforme demanda, prioridades e capacidade operacional.",
      },
      {
        nome: "Camada 4 — Monitoramento e continuidade",
        detalhe:
          "Monitorar trimestralmente fluxos, canais e resultados para ajustar prioridades e rotinas.",
      },
    ],
  },
];

const EQUIPE = [
  {
    dominio: "Institucional",
    variante: "institucional",
    titular: "Crhistinne Cavalheiro Maymone Gonçalves",
    suplente: "Márcia Bogena Cereser Tomasi",
  },
  {
    dominio: "Governança",
    variante: "governanca",
    titular: "Edelma Lene Peixoto Tibúrcio",
    suplente: "Alessandro Pinho Salomão",
  },
  {
    dominio: "Informação e Informática",
    variante: "informacao",
    titular: "Marcos Espíndola de Freitas",
    suplente: "Tiago Oliveira Vargas",
  },
  {
    dominio: "Comunicação",
    variante: "comunicacao",
    titular: "Fernanda Cristina Rodrigues",
    suplente: "Kamilla Nunes Ratier Camacho",
  },
];

const DOCUMENTOS = [
  {
    titulo: "Resumo do Plano de Trabalho da Federalização da RNDS — MS",
    meta: "Plano V.2 (24/07/2026) · Oficina de Apresentação (agosto/2026)",
    descricao:
      "Cenário-alvo, metodologia, os quatro domínios com a situação de cada frente, as etapas estaduais, os pontos inovadores e os desafios da federalização em Mato Grosso do Sul.",
    href: "/rnds_apresentacao_ms.txt",
    cta: "Baixar resumo do plano",
  },
  {
    titulo: "Painel de Navegação — Domínio Institucional",
    meta: "Planilha · subdomínios 1.1 a 1.5",
    descricao:
      "Proposta de painel de navegação com a estrutura de atividades do domínio Institucional e a lista de atividades da federalização em MS.",
    href: "/painel-navegacao-institucional-ms.xlsx",
    cta: "Baixar planilha (.xlsx)",
  },
  {
    titulo: "Painel de Navegação — Domínio Governança",
    meta: "Planilha · subdomínios 2.1 a 2.5",
    descricao:
      "Proposta de painel de navegação com a estrutura de atividades do domínio Governança e a lista de atividades da federalização em MS.",
    href: "/painel-navegacao-governanca-ms.xlsx",
    cta: "Baixar planilha (.xlsx)",
  },
  {
    titulo: "Painel de Navegação — Domínio Informação e Informática",
    meta: "Planilha · subdomínios 3.1 a 3.5",
    descricao:
      "Proposta de painel de navegação com a estrutura de atividades do domínio Informação e Informática e a lista de atividades da federalização em MS.",
    href: "/painel-navegacao-informacao-ms.xlsx",
    cta: "Baixar planilha (.xlsx)",
  },
  {
    titulo: "Painel de Navegação — Domínio Comunicação",
    meta: "Planilha · camadas de comunicação e banco de atividades",
    descricao:
      "Proposta de painel de navegação com as camadas de comunicação (direção estratégica, estrutura e sustentação, execução e rotina e continuidade) e o banco de atividades.",
    href: "/painel-navegacao-comunicacao-ms.xlsx",
    cta: "Baixar planilha (.xlsx)",
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
    id: "dominios",
    variante: "laranja",
    icone: <IconeRede />,
    titulo: "Domínios",
    texto:
      "Institucional, governança, informação e informática e comunicação: o andamento de cada frente do plano.",
    href: "#dominios",
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
              <b>{DOMINIOS.length}</b>
              <span>
                <strong>Domínios</strong>
                do projeto
              </span>
            </li>
          </ul>
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

        <section className="timeline-section" id="dominios">
          <p>DOMÍNIOS DO PLANO</p>
          <h2>O andamento de cada frente</h2>

          <p className="notice">
            Situação apresentada na Oficina Online de Apresentação dos Planos de Trabalho
            (agosto/2026). O domínio de Comunicação está organizado em camadas de atuação.
          </p>

          <div className="dominios-grid">
            {DOMINIOS.map((dominio) => (
              <article
                key={dominio.id}
                className={`dominio-card cor-${dominio.variante}`}
                id={`dominio-${dominio.id}`}
              >
                <h3>{dominio.nome}</h3>
                <p className="dominio-card__objetivo">{dominio.objetivo}</p>
                <ul className="dominio-card__itens">
                  {dominio.itens.map((item) => (
                    <li key={item.nome}>
                      <span className="dominio-card__item-nome">
                        <b>{item.nome}</b>
                        {item.detalhe ? <small>{item.detalhe}</small> : null}
                      </span>
                      {item.status ? (
                        <span className={`status-badge status-badge--${item.status}`}>
                          {item.rotulo}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
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

        <section className="timeline-section" id="equipe">
          <p>EQUIPE DE REFERÊNCIA</p>
          <h2>Quem conduz o projeto em MS</h2>

          <p className="notice">
            Titulares e suplentes de cada domínio, conforme a composição apresentada na Oficina
            (agosto/2026).
          </p>

          <div className="equipe-grid">
            {EQUIPE.map((membro) => (
              <article key={membro.dominio} className={`equipe-card cor-${membro.variante}`}>
                <h3>{membro.dominio}</h3>
                <p>
                  <b>Titular</b>
                  <span>{membro.titular}</span>
                </p>
                <p>
                  <b>Suplente</b>
                  <span>{membro.suplente}</span>
                </p>
              </article>
            ))}
          </div>
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
                Plano de Trabalho da Federalização da RNDS — V.2 (MS, 24/07/2026) e Oficina de
                Apresentação dos Planos de Trabalho (agosto/2026).
              </span>
            </div>
          </div>

          <div className="anexos-grid">
            {DOCUMENTOS.map((documento) => (
              <article className="anexo-card" key={documento.href}>
                <h3 className="anexo-card__titulo">{documento.titulo}</h3>
                <p className="anexo-card__meta">{documento.meta}</p>
                <p className="anexo-card__desc">{documento.descricao}</p>
                <a className="anexo-card__link" href={documento.href} download>
                  {documento.cta}
                </a>
              </article>
            ))}
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

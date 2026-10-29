// Landing page pública da Federalização da RNDS em Mato Grosso do Sul.
// Página 100% estática (sem banco de dados, sem sessão): conteúdo editorial
// fixo baseado no Plano de Trabalho da Federalização da RNDS — V.2
// (Estado: Mato Grosso do Sul, 2026), na Oficina Online de Apresentação dos
// Planos de Trabalho (agosto/2026) e em publicações oficiais do Ministério da
// Saúde/Conass. As etapas e os status dos domínios podem ser ajustados
// diretamente neste arquivo.

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
    periodo: "2026–2028",
    status: "em_andamento" as const,
    rotuloStatus: "Em andamento",
    descricao:
      "Fase de preparação e homologação (2026-2027), seguida da integração e carga histórica (até 2028), com acesso ao bucket S3 de extração de dados da RNDS.",
    entregas: [
      "Credenciais e ambiente de acesso ao bucket S3",
      "Homologação técnica e de segurança da extração",
      "Integração e carga histórica dos dados",
    ],
  },
  {
    ordem: 2,
    nome: "Tratamento dos dados da RNDS",
    periodo: "A definir",
    status: "nao_iniciada" as const,
    rotuloStatus: "Não iniciada",
    descricao:
      "Padronização, qualidade e segurança dos dados extraídos, preparando-os para a geração de indicadores.",
    entregas: [
      "Padronização e qualificação dos dados",
      "Conformidade com segurança da informação e LGPD",
      "Preparação da base para indicadores",
    ],
  },
  {
    ordem: 3,
    nome: "Disseminação e uso dos dados da RNDS",
    periodo: "A definir",
    status: "nao_iniciada" as const,
    rotuloStatus: "Não iniciada",
    descricao:
      "Ampliação de parcerias e uso estratégico dos dados para gestão e vigilância em saúde em Mato Grosso do Sul.",
    entregas: [
      "Ampliação de parcerias institucionais",
      "Painéis e indicadores para a gestão",
      "Uso dos dados na vigilância e no planejamento",
    ],
  },
];

const TRAJETORIA = [
  {
    fase: "Etapa piloto",
    periodo: "2024–2025",
    descricao:
      "Oito estados (BA, CE, ES, GO, PE, PI, SC e TO) participaram da cocriação da política nacional de acesso aos dados da RNDS.",
  },
  {
    fase: "Etapa estadual",
    periodo: "2025–2026",
    descricao:
      "Expansão para as 27 unidades da federação, com oficinas dos quatro domínios e elaboração dos planos de trabalho estaduais.",
  },
  {
    fase: "Etapa municipal",
    periodo: "A partir de 2026",
    descricao:
      "Expansão progressiva às capitais, aos municípios estratégicos e, por fim, a todos os municípios brasileiros.",
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

const LEGENDA_STATUS: { status: StatusDominio; rotulo: string }[] = [
  { status: "consolidado", rotulo: "Consolidado" },
  { status: "em_curso", rotulo: "Em curso" },
  { status: "primeiros_passos", rotulo: "Primeiros passos" },
  { status: "nao_iniciado", rotulo: "Não iniciado" },
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
    tag: "Visão geral",
    texto:
      "O escopo da federalização em MS, o que muda para o estado e a base legal que sustenta a iniciativa.",
    cta: "Conhecer o projeto",
    href: "#projeto",
  },
  {
    id: "rnds",
    variante: "roxo",
    icone: <IconeGrafico />,
    titulo: "RNDS",
    tag: "Conceitos",
    texto:
      "O que é a Rede Nacional de Dados em Saúde, como os dados circulam e o que isso muda no cuidado.",
    cta: "Entender a RNDS",
    href: "#rnds",
  },
  {
    id: "dominios",
    variante: "laranja",
    icone: <IconeRede />,
    titulo: "Domínios",
    tag: "Andamento",
    texto:
      "Institucional, governança, informação e informática e comunicação: a situação de cada frente do plano.",
    cta: "Ver os domínios",
    href: "#dominios",
  },
  {
    id: "plano",
    variante: "verde",
    icone: <IconePlano />,
    titulo: "Plano de Trabalho",
    tag: "Execução",
    texto:
      "As etapas planejadas e executadas em MS, com prazos previstos e o andamento registrado etapa a etapa.",
    cta: "Abrir o plano",
    href: "#plano",
  },
];

const BENEFICIOS_RNDS = [
  {
    titulo: "Interoperabilidade",
    texto:
      "Padrão HL7 FHIR e terminologias reconhecidas, como LOINC, SNOMED CT e CID, para que sistemas diferentes troquem informações com segurança.",
  },
  {
    titulo: "Continuidade do cuidado",
    texto:
      "O histórico clínico fica disponível no ponto de atendimento por meio do SUS Digital Profissional, apoiando a decisão dos profissionais.",
  },
  {
    titulo: "Gestão e vigilância",
    texto:
      "Gestores acessam informações agregadas para planejamento, monitoramento e aprimoramento das políticas públicas de saúde.",
  },
  {
    titulo: "Cidadania",
    texto:
      "O cidadão consulta seus próprios registros de saúde no aplicativo Meu SUS Digital, de forma segura e individualizada.",
  },
];

const MUDANCAS_MS = [
  {
    titulo: "Instância federada",
    texto:
      "A SES-MS opera uma instância da RNDS integrada à base nacional, com sincronização contínua e autonomia para integrar sistemas locais.",
  },
  {
    titulo: "Acesso estruturado",
    texto:
      "Acesso contínuo aos dados da RNDS, com extração pelo bucket S3 e carga histórica prevista até 2028.",
  },
  {
    titulo: "Uso qualificado",
    texto:
      "Dados padronizados e seguros para qualificar o planejamento, a vigilância e a tomada de decisão no território sul-mato-grossense.",
  },
];

const NAVEGACAO_INTERNA = [
  { href: "#projeto", rotulo: "Projeto" },
  { href: "#rnds", rotulo: "O que é a RNDS" },
  { href: "#dominios", rotulo: "Domínios" },
  { href: "#plano", rotulo: "Plano de trabalho" },
  { href: "#equipe", rotulo: "Equipe" },
  { href: "#documentos", rotulo: "Documentos" },
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

      <main className="container rnds-main" id="conteudo">
        <nav className="page-index" aria-label="Nesta página">
          <span className="page-index__label">Nesta página</span>
          <ul>
            {NAVEGACAO_INTERNA.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.rotulo}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="feature-grid" aria-label="Pontos de entrada">
          {DESTAQUES.map((destaque) => (
            <Link
              key={destaque.id}
              className={`feature-card feature-card--${destaque.variante}`}
              href={destaque.href}
            >
              <span className="feature-card__top">
                <span className="feature-card__icon">{destaque.icone}</span>
                <span className="feature-card__tag">{destaque.tag}</span>
              </span>
              <h2>{destaque.titulo}</h2>
              <p>{destaque.texto}</p>
              <span className="feature-card__cta">
                {destaque.cta} <b aria-hidden="true">→</b>
              </span>
            </Link>
          ))}
        </section>

        <section className="rnds-section" id="rnds" aria-labelledby="rnds-titulo">
          <header className="section-head">
            <p className="section-eyebrow">A REDE NACIONAL</p>
            <h2 id="rnds-titulo">O que é a RNDS</h2>
            <p className="section-lead">
              A Rede Nacional de Dados em Saúde é a plataforma oficial de interoperabilidade do
              Ministério da Saúde. Ela conecta estabelecimentos, sistemas e entes federativos para
              permitir a troca segura de informações clínicas e administrativas ao longo da jornada
              do cidadão no SUS.
            </p>
          </header>

          <div className="benefit-grid">
            {BENEFICIOS_RNDS.map((beneficio) => (
              <article className="benefit-card" key={beneficio.titulo}>
                <h3>{beneficio.titulo}</h3>
                <p>{beneficio.texto}</p>
              </article>
            ))}
          </div>

          <p className="inline-note">
            <strong>Modelos de informação registrados:</strong> resultados de exames laboratoriais
            (REL), atendimento clínico (RAC), imunobiológicos administrados (RIA) e regulação
            assistencial (RIRA).
          </p>
        </section>

        <section className="rnds-section" id="projeto" aria-labelledby="projeto-titulo">
          <header className="section-head">
            <p className="section-eyebrow">O PROJETO EM MS</p>
            <h2 id="projeto-titulo">Federalização: uma instância estadual integrada à base nacional</h2>
            <p className="section-lead">
              A federalização é o modelo em que o estado opera a sua própria instância da RNDS,
              integrada à base nacional. Na prática, a SES-MS ganha autonomia para integrar sistemas
              locais, municipais e estaduais, mantendo sincronização contínua com a base federal.
            </p>
          </header>

          <div className="pillar-grid">
            {MUDANCAS_MS.map((mudanca) => (
              <article className="pillar-card" key={mudanca.titulo}>
                <h3>{mudanca.titulo}</h3>
                <p>{mudanca.texto}</p>
              </article>
            ))}
          </div>

          <div className="legal-note">
            <h3>Base legal e princípios</h3>
            <p>
              O Decreto nº 12.560/2025 dispõe sobre a RNDS e as Plataformas SUS Digital e orienta a
              federalização dos dados. Entre os princípios estão a interoperabilidade, a segurança
              da informação, a privacidade e confidencialidade conforme a LGPD, a centralidade no
              cidadão, a padronização, a transparência e o uso ético e legal dos dados.
            </p>
          </div>

          <div className="trajectory">
            <h3 className="trajectory__title">Trajetória nacional da federalização</h3>
            <ol className="trajectory__list">
              {TRAJETORIA.map((fase) => (
                <li className="trajectory__item" key={fase.fase}>
                  <span className="trajectory__periodo">{fase.periodo}</span>
                  <div>
                    <strong>{fase.fase}</strong>
                    <p>{fase.descricao}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="trajectory__fonte">
              Fontes: Ministério da Saúde (Seidigi) e Conass, 2026.
            </p>
          </div>
        </section>

        <section className="rnds-section" id="dominios" aria-labelledby="dominios-titulo">
          <header className="section-head">
            <p className="section-eyebrow">DOMÍNIOS DO PLANO</p>
            <h2 id="dominios-titulo">O andamento de cada frente</h2>
            <p className="section-lead">
              A estratégia está organizada em quatro domínios complementares. A situação abaixo foi
              apresentada na Oficina Online de Apresentação dos Planos de Trabalho (agosto/2026).
            </p>
          </header>

          <div className="status-legend" aria-label="Legenda de status">
            <span className="status-legend__label">Legenda</span>
            {LEGENDA_STATUS.map((item) => (
              <span
                className={`status-badge status-badge--${item.status}`}
                key={item.status}
              >
                {item.rotulo}
              </span>
            ))}
          </div>

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
                      ) : (
                        <span className="status-badge status-badge--sem_status">Em definição</span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="inline-note">
            O domínio de Comunicação está organizado em camadas de atuação e o status das camadas
            não foi detalhado na apresentação de agosto/2026.
          </p>
        </section>

        <section className="rnds-section" id="plano" aria-labelledby="plano-titulo">
          <header className="section-head">
            <p className="section-eyebrow">ONDE ESTAMOS</p>
            <h2 id="plano-titulo">Etapas da federalização em MS</h2>
            <p className="section-lead">
              As etapas seguem o Plano de Trabalho da Federalização da RNDS — V.2 (MS, 2026) e serão
              atualizadas conforme o andamento oficial do projeto.
            </p>
          </header>

          <ol className="timeline">
            {ETAPAS.map((etapa) => (
              <li className="timeline-item" key={etapa.ordem}>
                <div className="timeline-item__marker">
                  <b>Etapa {etapa.ordem}</b>
                  <span className="timeline-item__periodo">{etapa.periodo}</span>
                </div>
                <div className="timeline-item__body">
                  <strong className="timeline-item__title">{etapa.nome}</strong>
                  <span className={`status-badge status-badge--${etapa.status}`}>
                    {etapa.rotuloStatus}
                  </span>
                  <p>{etapa.descricao}</p>
                  <ul className="timeline-item__entregas">
                    {etapa.entregas.map((entrega) => (
                      <li key={entrega}>{entrega}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rnds-section" id="equipe" aria-labelledby="equipe-titulo">
          <header className="section-head">
            <p className="section-eyebrow">EQUIPE DE REFERÊNCIA</p>
            <h2 id="equipe-titulo">Quem conduz o projeto em MS</h2>
            <p className="section-lead">
              Titulares e suplentes de cada domínio, conforme a composição apresentada na Oficina
              (agosto/2026).
            </p>
          </header>

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

        <section className="documents" id="documentos" aria-labelledby="documentos-titulo">
          <div className="documents__title">
            <span className="documents__icon">
              <IconePasta />
            </span>
            <div>
              <p>PLANO DE TRABALHO</p>
              <h2 id="documentos-titulo">Documentos oficiais</h2>
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
                  {documento.cta} <span aria-hidden="true">↓</span>
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
            <Link className="btn-primary" href="#plano">
              Ver as etapas
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

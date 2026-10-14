// Seção pública da RNDS (SSR) — layout institucional inspirado na página
// "Federalização RNDS" do wiki de saúde digital.
//
// Estrutura da página:
//   1. Hero com título, linha de destaque ciano e indicadores (métricas das
//      etapas cadastradas).
//   2. Grade de cartões de destaque (Projeto, Plano de Trabalho, RNDS,
//      Acompanhe o Projeto) com variants de cor.
//   3. Acervo: carrossel horizontal com as páginas públicas mais recentes.
//   4. Informações: textos de apoio e contato.
//   5. Linha do tempo "onde estamos" com as etapas da federalização.
//   6. Faixa de encerramento com o caminho para a área restrita.
//
// IMPORTANTE (domínio): as etapas reais da federalização em MS ainda NÃO estão
// confirmadas. As etapas exibidas são ILUSTRATIVAS (dados de exemplo editáveis)
// e não devem ser interpretadas como o cronograma oficial da SES-MS/DATASUS.

import Link from "next/link";
import type { StatusEtapa } from "@prisma/client";
import { listarEtapas } from "@/lib/services/rnds";
import { listarRecentes } from "@/lib/services/paginas";
import { listarAnexos } from "@/lib/services/anexos-rnds";
import { formatarTamanho, tipoArquivo } from "@/lib/utils/anexos";
import { obterSessao, possuiPermissao } from "@/lib/services/auth";
import Carrossel from "@/app/components/Carrossel";
import {
  IconeBusca,
  IconeDocumento,
  IconeEscudo,
  IconeGrafico,
  IconePasta,
  IconePlano,
  IconeRede,
} from "@/app/components/Icones";

export const dynamic = "force-dynamic";

const ROTULO_STATUS: Record<StatusEtapa, string> = {
  nao_iniciada: "Não iniciada",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

function dataCurta(data: Date): string {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function SecaoRndsPage() {
  const [etapas, sessao, anexos] = await Promise.all([
    listarEtapas(),
    obterSessao(),
    listarAnexos(),
  ]);
  const podeEditar = possuiPermissao(sessao, "editar_pagina");
  const recentes = await listarRecentes(sessao, 9);

  const concluidas = etapas.filter((e) => e.status === "concluida").length;
  const emAndamento = etapas.filter((e) => e.status === "em_andamento").length;

  const destaques = [
    {
      id: "projeto",
      variante: "azul",
      icone: <IconeDocumento />,
      titulo: "Projeto",
      texto:
        "Entenda o escopo da federalização da RNDS em Mato Grosso do Sul e os conceitos que sustentam o projeto estadual.",
      href: "#projeto-info",
      rotulo: "Acessar",
    },
    {
      id: "plano-de-trabalho",
      variante: "verde",
      icone: <IconePlano />,
      titulo: "Plano de Trabalho",
      texto:
        "Acompanhe as ações planejadas e executadas, com o andamento registrado etapa a etapa.",
      href: "#onde-estamos",
      rotulo: "Acessar",
    },
    {
      id: "rnds",
      variante: "roxo",
      icone: <IconeGrafico />,
      titulo: "RNDS",
      texto:
        "As vantagens de consumir dados nacionais: interoperabilidade, padrões e visão única da jornada no SUS.",
      href: "#o-que-e-rnds",
      rotulo: "Acessar",
    },
    {
      id: "acompanhe-o-projeto",
      variante: "laranja",
      icone: <IconeRede />,
      titulo: "Acompanhe o Projeto",
      texto: "De onde partimos e para onde vamos: a jornada estadual em Mato Grosso do Sul.",
      href: "#documentos",
      rotulo: "Acessar",
    },
  ];

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
              <b>{etapas.length}</b>
              <span>
                <strong>Etapas</strong>
                cadastradas
              </span>
            </li>
            <li>
              <b>{concluidas}</b>
              <span>
                <strong>Concluídas</strong>
                no cronograma
              </span>
            </li>
            <li>
              <b>{emAndamento}</b>
              <span>
                <strong>Em andamento</strong>
                neste momento
              </span>
            </li>
            <li className="rnds-hero__metric--last">
              <b>{recentes.length}</b>
              <span>
                <strong>Páginas</strong>
                no acervo
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
          {destaques.map((destaque) => (
            <article
              key={destaque.id}
              className={`feature-card feature-card--${destaque.variante}`}
              id={destaque.id}
            >
              <span className="feature-card__icon">{destaque.icone}</span>
              <h2>{destaque.titulo}</h2>
              <p>{destaque.texto}</p>
              <a href={destaque.href}>
                {destaque.rotulo} <b aria-hidden="true">→</b>
              </a>
            </article>
          ))}
        </section>

        <section className="documents" id="documentos">
          <div className="documents__title">
            <span className="documents__icon">
              <IconePasta />
            </span>
            <div>
              <p>ACERVO ESSENCIAL DO PROJETO</p>
              <h2>Documentos e páginas</h2>
              <span>Acesse os conteúdos mais recentes publicados no Wiki SES-MS.</span>
            </div>
          </div>

          {recentes.length === 0 ? (
            <p className="muted">
              Nenhuma página publicada até o momento. <Link href="/categorias">Ver categorias</Link>
              .
            </p>
          ) : (
            <Carrossel rotulo="Páginas recentes do acervo">
              {recentes.map((pagina) => (
                <article className="document-card" key={pagina.id} role="listitem">
                  <strong className="document-card__icon" aria-hidden="true">
                    ▤
                  </strong>
                  <div className="document-card__content">
                    <small>PÁGINA</small>
                    <b>{pagina.titulo}</b>
                    <span>Atualizada em {dataCurta(pagina.atualizadoEm)}</span>
                    <Link
                      className="document-card__link"
                      href={`/paginas/${pagina.slug}`}
                      aria-label={`Abrir ${pagina.titulo}`}
                    >
                      →
                    </Link>
                  </div>
                </article>
              ))}
            </Carrossel>
          )}
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
            Aviso: as etapas abaixo são ilustrativas e servem de modelo editável. Elas ainda não
            representam o cronograma oficial da federalização da RNDS em Mato Grosso do Sul e devem
            ser atualizadas a partir do documento oficial de adesão da SES-MS/DATASUS.
          </p>

          {podeEditar && (
            <p>
              <Link className="btn-secondary" href="/editor/rnds">
                Gerenciar etapas e anexos (área restrita)
              </Link>
            </p>
          )}

          {etapas.length === 0 ? (
            <p className="muted">Nenhuma etapa cadastrada ainda.</p>
          ) : (
            <ol className="timeline">
              {etapas.map((etapa) => (
                <li className="timeline-item" key={etapa.id}>
                  <b>Etapa {etapa.ordem}</b>
                  <div>
                    <strong className="timeline-item__title">{etapa.nome}</strong>
                    <span className={`status-badge status-badge--${etapa.status}`}>
                      {ROTULO_STATUS[etapa.status]}
                    </span>
                    {etapa.descricao && <p>{etapa.descricao}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="documents" id="arquivos-rnds" aria-label="Arquivos da RNDS">
          <div className="documents__title">
            <span className="documents__icon">
              <IconePasta />
            </span>
            <div>
              <p>ARQUIVOS DA SEÇÃO RNDS</p>
              <h2>Documentos para consulta</h2>
              <span>Faça o download dos documentos e arquivos publicados pela SES-MS.</span>
            </div>
          </div>

          {anexos.length === 0 ? (
            <p className="muted">Nenhum arquivo anexado até o momento.</p>
          ) : (
            <div className="anexos-grid">
              {anexos.map((anexo) => (
                <article className="anexo-card" key={anexo.id}>
                  <h3 className="anexo-card__titulo">{anexo.titulo || anexo.nomeOriginal}</h3>
                  <p className="anexo-card__meta">
                    {anexo.nomeOriginal} · {tipoArquivo(anexo.mimeType)} · {formatarTamanho(anexo.tamanho)} ·
                    {" "}{dataCurta(anexo.criadoEm)}
                  </p>
                  {anexo.descricao && <p className="anexo-card__desc">{anexo.descricao}</p>}
                  <a className="anexo-card__link" href={`/api/rnds/anexos/${anexo.id}`} download>
                    Baixar arquivo
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <section className="closing">
        <div className="container closing__content">
          <div>
            <h2>Precisa manter o conteúdo atualizado?</h2>
            <p>A equipe SES-MS mantém o acervo na área restrita do Wiki SES-MS.</p>
          </div>
          <p className="closing__cta">
            <Link className="btn-primary" href="/login">
              Entrar na área restrita
            </Link>
          </p>
        </div>
      </section>

      <section className="quick-links">
        <div className="container quick-links__grid">
          <Link href="/categorias" className="quick-link">
            <span className="quick-link__icon">
              <IconeEscudo />
            </span>
            <b>Categorias</b>
            <span>Áreas de atuação e temas do conhecimento institucional.</span>
          </Link>
          <Link href="/busca" className="quick-link">
            <span className="quick-link__icon">
              <IconeBusca />
            </span>
            <b>Busca</b>
            <span>Pesquise por termos em todo o acervo publicado.</span>
          </Link>
          <Link href="/" className="quick-link">
            <span className="quick-link__icon">
              <IconeGrafico />
            </span>
            <b>Início</b>
            <span>Visão geral do Wiki SES-MS e dos serviços publicados.</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

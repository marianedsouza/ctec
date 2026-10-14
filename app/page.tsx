// Página inicial do Wiki SES-MS (Task 10.1 / Requirement 9.1).
// Mantém a mesma linguagem visual da seção RNDS: hero, cartões de destaque em
// variantes de cor, painel do acervo e faixa de atalhos.

import Link from "next/link";
import { obterSessao } from "@/lib/services/auth";
import { listarRecentes } from "@/lib/services/paginas";
import Carrossel from "@/app/components/Carrossel";
import {
  IconeBusca,
  IconeEscudo,
  IconeGrafico,
  IconePasta,
  IconeRede,
} from "@/app/components/Icones";

export const dynamic = "force-dynamic";

function dataCurta(data: Date): string {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const sessao = await obterSessao();
  const recentes = await listarRecentes(sessao, 6);

  return (
    <div className="rnds">
      <section className="rnds-hero">
        <div className="container rnds-hero__content">
          <p className="rnds-hero__eyebrow">BASE DE CONHECIMENTO</p>
          <h1>Wiki SES-MS</h1>
          <p className="rnds-hero__state">Mato Grosso do Sul</p>
          <div className="rnds-hero__line" aria-hidden="true" />
          <p className="rnds-hero__subtitle">
            Conhecimento institucional da Secretaria de Estado de Saúde, organizado por áreas de
            atuação e temas — com acesso público para a população e área restrita para a equipe.
          </p>

          <ul className="rnds-hero__metrics" aria-label="Atalhos principais">
            <li>
              <span>
                <strong>Federalização da RNDS</strong>o nosso “onde estamos”
              </span>
            </li>
            <li>
              <span>
                <strong>Categorias</strong>
                áreas e temas
              </span>
            </li>
            <li>
              <span>
                <strong>Busca</strong>
                pesquisa no acervo
              </span>
            </li>
            <li className="rnds-hero__metric--last">
              <span>
                <strong>Área restrita</strong>
                edição pela equipe
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
        <section className="feature-grid" aria-label="Áreas principais">
          <article className="feature-card feature-card--azul" id="rnds">
            <span className="feature-card__icon">
              <IconeRede />
            </span>
            <h2>RNDS</h2>
            <p>
              Conteúdo explicativo e as etapas da federalização estadual da Rede Nacional de Dados
              em Saúde.
            </p>
            <Link href="/rnds">
              Acessar <b aria-hidden="true">→</b>
            </Link>
          </article>

          <article className="feature-card feature-card--verde" id="categorias">
            <span className="feature-card__icon">
              <IconeEscudo />
            </span>
            <h2>Categorias</h2>
            <p>Navegue pela árvore de áreas de atuação e temas do conhecimento da SES-MS.</p>
            <Link href="/categorias">
              Acessar <b aria-hidden="true">→</b>
            </Link>
          </article>

          <article className="feature-card feature-card--roxo" id="busca">
            <span className="feature-card__icon">
              <IconeBusca />
            </span>
            <h2>Busca</h2>
            <p>
              Pesquise páginas por termos em todo o portal, com trechos destacados e ranqueamento
              por relevância.
            </p>
            <Link href="/busca">
              Acessar <b aria-hidden="true">→</b>
            </Link>
          </article>

          <article className="feature-card feature-card--laranja" id="area-restrita">
            <span className="feature-card__icon">
              <IconeGrafico />
            </span>
            <h2>Área restrita</h2>
            <p>
              Acesso da equipe SES-MS para editar conteúdo, categorias e as etapas da federalização.
            </p>
            <Link href="/login">
              Acessar <b aria-hidden="true">→</b>
            </Link>
          </article>
        </section>

        <section className="documents" id="documentos">
          <div className="documents__title">
            <span className="documents__icon">
              <IconePasta />
            </span>
            <div>
              <p>ACERVO ESSENCIAL</p>
              <h2>Páginas recentes</h2>
              <span>Conteúdos publicados e atualizados pela equipe SES-MS.</span>
            </div>
          </div>

          {recentes.length === 0 ? (
            <p className="muted">
              Nenhuma página publicada até o momento. <Link href="/busca">Buscar no acervo</Link>.
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

        <section className="information">
          <article>
            <small>SOBRE O WIKI</small>
            <h2>Conhecimento institucional</h2>
            <p>
              O Wiki SES-MS reúne o conteúdo técnico e administrativo da Secretaria de Estado de
              Saúde de Mato Grosso do Sul em um único lugar, com páginas versionadas, categorias
              hierárquicas e busca de texto completo. Páginas marcadas como públicas são visíveis a
              qualquer visitante; as restritas exigem autenticação da equipe.
            </p>
          </article>

          <article>
            <small>FALE CONOSCO</small>
            <h2>Governança e acesso</h2>
            <p>
              A edição de conteúdo é feita pela equipe autorizada da SES-MS, com permissões
              distintas para leitura restrita, edição e administração. O histórico de versões
              permite revisar e restaurar publicações anteriores a qualquer momento.
            </p>
          </article>
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
    </div>
  );
}

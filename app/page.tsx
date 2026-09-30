// Página inicial do Wiki SES-MS (Task 10.1 / Requirement 9.1).
// Destaca a seção RNDS e oferece acesso rápido às áreas principais do portal.

import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero" aria-labelledby="titulo-inicio">
        <h1 id="titulo-inicio">Wiki SES-MS</h1>
        <p>
          Base de conhecimento da Secretaria de Estado de Saúde de Mato Grosso
          do Sul. Navegue pelo conteúdo institucional organizado por áreas de
          atuação e por temas, com acesso público para a população e área
          restrita para a equipe da SES-MS.
        </p>
        <p>
          <Link href="/rnds">
            <strong>Conheça a seção RNDS e o andamento da federalização →</strong>
          </Link>
        </p>
      </section>

      <section aria-labelledby="titulo-destaque-rnds">
        <h2 id="titulo-destaque-rnds">Destaque: RNDS</h2>
        <p>
          A Rede Nacional de Dados em Saúde (RNDS) é a plataforma nacional de
          interoperabilidade de dados em saúde do DATASUS. Nesta seção você
          encontra o que é a RNDS, o que é a federalização da RNDS e as etapas
          estaduais em Mato Grosso do Sul — o nosso &ldquo;onde estamos&rdquo;.
        </p>
      </section>

      <section aria-labelledby="titulo-areas-principais">
        <h2 id="titulo-areas-principais">Áreas principais</h2>
        <div className="card-grid">
          <Link href="/rnds" className="card">
            <h3>RNDS</h3>
            <p>Conteúdo explicativo e etapas da federalização estadual.</p>
          </Link>
          <Link href="/categorias" className="card">
            <h3>Categorias</h3>
            <p>Navegue pela árvore de áreas de atuação e temas.</p>
          </Link>
          <Link href="/busca" className="card">
            <h3>Busca</h3>
            <p>Pesquise páginas por termos em todo o portal.</p>
          </Link>
          <Link href="/login" className="card">
            <h3>Área restrita</h3>
            <p>Acesso da equipe SES-MS para editar conteúdo e etapas.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

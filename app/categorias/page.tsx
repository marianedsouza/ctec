// Página de navegação de categorias (Server Component / SSR).
// Renderiza a árvore por tipo: "área" e "tema". Requirements 3.4, 7.2.

import { obterArvore } from "@/lib/services/categorias";
import ArvoreCategorias from "@/app/components/ArvoreCategorias";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const [areas, temas] = await Promise.all([
    obterArvore("area"),
    obterArvore("tema"),
  ]);

  return (
    <main>
      <h1>Categorias</h1>

      <section aria-labelledby="titulo-areas">
        <h2 id="titulo-areas">Áreas de Atuação</h2>
        <ArvoreCategorias nos={areas} />
      </section>

      <section aria-labelledby="titulo-temas">
        <h2 id="titulo-temas">Temas</h2>
        <ArvoreCategorias nos={temas} />
      </section>
    </main>
  );
}

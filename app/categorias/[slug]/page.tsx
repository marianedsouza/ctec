// Página de uma categoria específica (Server Component / SSR).
// Exibe o breadcrumb (caminho de ancestrais) e a subárvore da categoria.
// Requirements 3.4, 3.5, 7.2.

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  obterArvore,
  obterCaminho,
  type NoArvore,
} from "@/lib/services/categorias";
import ArvoreCategorias from "@/app/components/ArvoreCategorias";
import Breadcrumb from "@/app/components/Breadcrumb";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Localiza um nó pelo id dentro de uma floresta de árvores. */
function encontrarNo(nos: NoArvore[], id: string): NoArvore | null {
  for (const no of nos) {
    if (no.id === id) {
      return no;
    }
    const achado = encontrarNo(no.filhos, id);
    if (achado) {
      return achado;
    }
  }
  return null;
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  const categoria = await prisma.categoria.findUnique({ where: { slug } });
  if (!categoria) {
    notFound();
  }

  const [caminho, arvore] = await Promise.all([
    obterCaminho(categoria.id),
    obterArvore(categoria.tipo),
  ]);

  const no = encontrarNo(arvore, categoria.id);

  return (
    <main>
      <Breadcrumb caminho={caminho} />

      <h1>{categoria.nome}</h1>

      <section aria-label="Subcategorias">
        <h2>Subcategorias</h2>
        {no && no.filhos.length > 0 ? (
          <ArvoreCategorias nos={no.filhos} slugAtivo={categoria.slug} />
        ) : (
          <p>Esta categoria não possui subcategorias.</p>
        )}
      </section>
    </main>
  );
}

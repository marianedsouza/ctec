// Rota restrita: edição de página existente (área /editor).
// Autorização aplicada no servidor via exigirPermissao("editar_pagina").
// Requirements 4.1, 4.4, 2.4.

import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirPermissao, obterSessao } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import { obterPorSlug } from "@/lib/services/paginas";
import FormularioPagina from "@/app/components/FormularioPagina";

export const dynamic = "force-dynamic";

export default async function EditarPaginaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await exigirPermissao("editar_pagina");
  const { slug } = await params;

  const sessao = await obterSessao();
  const pagina = await obterPorSlug(slug, sessao);
  if (!pagina) {
    notFound();
  }

  const categorias = await prisma.categoria.findMany({
    orderBy: [{ tipo: "asc" }, { ordem: "asc" }, { nome: "asc" }],
    select: { id: true, nome: true },
  });

  return (
    <main>
      <h1>Editar página</h1>
      <p>
        <Link href={`/editor/paginas/${pagina.slug}/versoes`}>
          Ver histórico de versões
        </Link>
      </p>
      <FormularioPagina
        categorias={categorias}
        pagina={{
          id: pagina.id,
          titulo: pagina.titulo,
          conteudo: pagina.conteudo,
          visibilidade: pagina.visibilidade,
          categoriaId: pagina.categoriaId,
        }}
      />
    </main>
  );
}

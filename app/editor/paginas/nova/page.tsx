// Rota restrita: criação de nova página (área /editor).
// Autorização aplicada no servidor via exigirPermissao("editar_pagina").
// Requirements 4.1, 4.4, 2.4.

import { exigirPermissao } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import FormularioPagina from "@/app/components/FormularioPagina";

export const dynamic = "force-dynamic";

export default async function NovaPaginaPage() {
  await exigirPermissao("editar_pagina");

  const categorias = await prisma.categoria.findMany({
    orderBy: [{ tipo: "asc" }, { ordem: "asc" }, { nome: "asc" }],
    select: { id: true, nome: true },
  });

  return (
    <main>
      <h1>Nova página</h1>
      <FormularioPagina categorias={categorias} />
    </main>
  );
}

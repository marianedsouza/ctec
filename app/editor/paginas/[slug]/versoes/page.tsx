// Rota restrita: histórico de versões de uma página (área /editor).
// Autorização aplicada no servidor via exigirPermissao("editar_pagina").
// Lista as versões em ordem cronológica e permite restauração não destrutiva.
// Requirements 5.1, 5.2, 5.3, 5.4, 2.4.

import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirPermissao, obterSessao } from "@/lib/services/auth";
import { obterPorSlug, listarVersoes } from "@/lib/services/paginas";
import HistoricoVersoes from "@/app/components/HistoricoVersoes";

export const dynamic = "force-dynamic";

export default async function VersoesPaginaPage({ params }: { params: Promise<{ slug: string }> }) {
  await exigirPermissao("editar_pagina");
  const { slug } = await params;

  const sessao = await obterSessao();
  const pagina = await obterPorSlug(slug, sessao);
  if (!pagina) {
    notFound();
  }

  // Versões em ordem cronológica (mais antiga primeiro). A última registrada
  // reflete o conteúdo atual, pois toda mutação registra uma nova versão.
  const versoes = await listarVersoes(pagina.id);
  const ultimoIndice = versoes.length - 1;

  const versoesResumo = versoes.map((v, indice) => ({
    id: v.id,
    titulo: v.titulo,
    criadaEm: v.criadaEm.toISOString(),
    atual: indice === ultimoIndice,
  }));

  return (
    <main>
      <h1>Histórico de versões</h1>
      <p>
        Página: <strong>{pagina.titulo}</strong>
      </p>
      <p>
        <Link href={`/editor/paginas/${pagina.slug}/editar`}>Voltar para edição</Link>
      </p>

      <HistoricoVersoes paginaId={pagina.id} versoes={versoesResumo} />
    </main>
  );
}

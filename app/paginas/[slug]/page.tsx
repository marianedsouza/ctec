// Exibição de página (SSR). Aplica a regra de visibilidade no servidor e
// exibe o conteúdo já sanitizado pelo Serviço de Páginas (Requirements 2.1,
// 2.3, 4.5). A navegação pública completa/breadcrumb é refinada na Task 8.

import { notFound } from "next/navigation";
import { obterSessao } from "@/lib/services/auth";
import { obterPorSlug } from "@/lib/services/paginas";

export const dynamic = "force-dynamic";

export default async function PaginaView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sessao = await obterSessao();
  const pagina = await obterPorSlug(slug, sessao);

  // Página inexistente OU restrita para usuário sem permissão -> 404.
  if (!pagina) {
    notFound();
  }

  return (
    <main>
      <article className="prose">
        <div className="page-header">
          <h1>{pagina.titulo}</h1>
        </div>
        {/* Conteúdo sanitizado no servidor antes de exibir (Req 4.5). */}
        <div dangerouslySetInnerHTML={{ __html: pagina.conteudo }} />
      </article>
    </main>
  );
}

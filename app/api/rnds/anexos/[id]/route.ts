// Rota de download de anexos da seção RNDS.
// GET /api/rnds/anexos/[id] — retorna o arquivo armazenado em disco com cabeçalhos
// corretos (Content-Type, Content-Disposition). Não depende do caminho original
// enviado pelo usuário: lê a partir do nomeArquivo seguro registrado no banco.

import { NextResponse } from "next/server";
import { obterAnexo, lerConteudoAnexo } from "@/lib/services/anexos-rnds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const anexo = await obterAnexo(id);

  if (!anexo) {
    return NextResponse.json({ erro: "Anexo não encontrado." }, { status: 404 });
  }

  const bytes = await lerConteudoAnexo(anexo);

  // Usamos `attachment` para forçar o download (comportamento desejado para a
  // seção pública de documentos da RNDS). Também podemos mudar para `inline` se
  // o usuário quiser abrir no navegador, mas o requisito é download.
  const filename = anexo.nomeOriginal.replace(/[^\w\-.\s]+/g, "_");
  const headers = new Headers();
  headers.set("Content-Type", anexo.mimeType);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
  );
  headers.set("Cache-Control", "no-store");

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers,
  });
}

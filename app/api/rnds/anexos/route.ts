// Rota de upload de anexos da seção RNDS.
// POST /api/rnds/anexos (multipart/form-data: arquivo, titulo, descricao).
//
// A autorização é aplicada NO SERVIDOR: apenas perfis com "editar_pagina"
// (editor/admin) podem enviar arquivos. O binário é gravado em disco pelo
// Serviço de Anexos e os metadados, no MySQL.

import { NextResponse } from "next/server";
import { obterSessao, possuiPermissao } from "@/lib/services/auth";
import { criarAnexo } from "@/lib/services/anexos-rnds";
import { TAMANHO_MAXIMO_ANEXO, formatarTamanho } from "@/lib/utils/anexos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const sessao = await obterSessao();
  if (!possuiPermissao(sessao, "editar_pagina")) {
    return NextResponse.json(
      { ok: false, erro: "Acesso negado: faça login com um perfil de editor ou admin." },
      { status: 403 },
    );
  }

  try {
    const formData = await request.formData();
    const arquivo = formData.get("arquivo");

    if (!(arquivo instanceof File)) {
      return NextResponse.json({ ok: false, erro: "Nenhum arquivo foi enviado." }, { status: 400 });
    }

    if (arquivo.size > TAMANHO_MAXIMO_ANEXO) {
      return NextResponse.json(
        { ok: false, erro: `O arquivo excede o limite de ${formatarTamanho(TAMANHO_MAXIMO_ANEXO)}.` },
        { status: 413 },
      );
    }

    const bytes = Buffer.from(await arquivo.arrayBuffer());

    const anexo = await criarAnexo({
      titulo: String(formData.get("titulo") ?? ""),
      descricao: String(formData.get("descricao") ?? ""),
      nomeOriginal: arquivo.name || "arquivo",
      mimeType: arquivo.type,
      bytes,
      criadoPorId: sessao?.id ?? null,
    });

    // Revalida as páginas que exibem a lista de anexos.
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/rnds");
    revalidatePath("/editor/rnds");

    return NextResponse.json({ ok: true, id: anexo.id });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Erro ao enviar o arquivo.";
    return NextResponse.json({ ok: false, erro: mensagem }, { status: 400 });
  }
}

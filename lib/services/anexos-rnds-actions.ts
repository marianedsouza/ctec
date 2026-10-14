"use server";

// Server Actions de Anexos da RNDS.
// Aplicam autorização NO SERVIDOR ("editar_pagina") antes de remover o arquivo.
// O envio (upload) também está protegido na rota POST.

import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/services/auth";
import { removerAnexo } from "@/lib/services/anexos-rnds";

// Resultado padronizado das actions para consumo no cliente.
export type ResultadoAcaoAnexo = { ok: true } | { ok: false; erro: string };

function revalidar(): void {
  revalidatePath("/rnds");
  revalidatePath("/editor/rnds");
}

export async function removerAnexoAction(id: string): Promise<ResultadoAcaoAnexo> {
  await exigirPermissao("editar_pagina");

  try {
    await removerAnexo(id);
    revalidar();
    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Erro ao remover o anexo.",
    };
  }
}

// Serviço de Anexos da seção RNDS do Wiki SES-MS.
//
// Guarda os METADADOS no MySQL (tabela `anexos_rnds`) e o BINÁRIO em disco, em
// `data/anexos/rnds` (configurável por ANEXOS_DIR). Os arquivos NÃO ficam sob
// `public/`: são entregues pela rota autenticada/app/api/rnds/anexos/[id], que
// valida o registro antes de ler o disco.
//
// Regras de aceite:
//   - Extensões permitidas por uma whitelist (documentos e imagens comuns).
//   - Tamanho máximo de 25 MB por arquivo.
//   - O nome físico é gerado pelo servidor (nunca usa o nome enviado pelo
//     usuário), evitando path traversal e colisões.

import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  TAMANHO_MAXIMO_ANEXO,
  extensaoDe,
  mimePermitido,
  formatarTamanho,
  tipoArquivo,
} from "@/lib/utils/anexos";

export type { AnexoRnds } from "@prisma/client";
export { TAMANHO_MAXIMO_ANEXO, extensaoDe, mimePermitido, formatarTamanho, tipoArquivo };

export interface AnexoRndsComum {
  id: string;
  titulo: string;
  nomeOriginal: string;
  nomeArquivo: string;
  mimeType: string;
  tamanho: number;
  descricao: string;
  ordem: number;
  criadoPorId: string | null;
  criadoEm: Date;
}

export interface NovosAnexoRnds {
  titulo: string;
  descricao: string;
  nomeOriginal: string;
  mimeType: string;
  bytes: Buffer;
  criadoPorId: string | null;
}

/** Diretório físico onde os binários dos anexos são gravados. */
export function diretorioAnexos(): string {
  return process.env.ANEXOS_DIR ?? path.join(process.cwd(), "data", "anexos", "rnds");
}

/** Caminho absoluto de um arquivo armazenado (nome já gerado pelo servidor). */
export function caminhoFisico(nomeArquivo: string): string {
  // Defesa extra: o nome deve ser um basename simples.
  const seguro = path.basename(nomeArquivo);
  return path.join(diretorioAnexos(), seguro);
}

/** Lista os anexos cadastrados, ordenados por `ordem` e data de criação. */
export async function listarAnexos(): Promise<AnexoRndsComum[]> {
  const rows = await prisma.anexoRnds.findMany({
    orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    titulo: r.titulo,
    nomeOriginal: r.nomeOriginal,
    nomeArquivo: r.nomeArquivo,
    mimeType: r.mimeType,
    tamanho: r.tamanho,
    descricao: r.descricao,
    ordem: r.ordem,
    criadoPorId: r.criadoPorId,
    criadoEm: r.criadoEm,
  }));
}

/** Busca um anexo pelo id (metadados). */
export async function obterAnexo(id: string): Promise<AnexoRndsComum | null> {
  const r = await prisma.anexoRnds.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    titulo: r.titulo,
    nomeOriginal: r.nomeOriginal,
    nomeArquivo: r.nomeArquivo,
    mimeType: r.mimeType,
    tamanho: r.tamanho,
    descricao: r.descricao,
    ordem: r.ordem,
    criadoPorId: r.criadoPorId,
    criadoEm: r.criadoEm,
  };
}

/**
 * Persiste um novo anexo: grava o binário em disco e registra os metadados.
 * Valida extensão e tamanho antes de qualquer escrita.
 */
export async function criarAnexo(dados: NovosAnexoRnds): Promise<AnexoRndsComum> {
  const titulo = dados.titulo.trim() || dados.nomeOriginal;
  const mimeEsperado = mimePermitido(dados.nomeOriginal);

  if (!mimeEsperado) {
    throw new Error(
      "Tipo de arquivo não permitido. Aceitos: PDF, Office (doc/xls/ppt), OpenDocument, CSV, TXT, ZIP e imagens.",
    );
  }

  if (dados.bytes.length === 0) {
    throw new Error("O arquivo enviado está vazio.");
  }

  if (dados.bytes.length > TAMANHO_MAXIMO_ANEXO) {
    throw new Error("O arquivo excede o limite de 25 MB.");
  }

  const ext = extensaoDe(dados.nomeOriginal);
  const nomeArquivo = `${randomUUID()}.${ext}`;

  const dir = diretorioAnexos();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, nomeArquivo), dados.bytes);

  try {
    const proximo = await prisma.anexoRnds.aggregate({ _max: { ordem: true } });
    const ordem = (proximo._max.ordem ?? -1) + 1;

    const criado = await prisma.anexoRnds.create({
      data: {
        titulo,
        nomeOriginal: path.basename(dados.nomeOriginal),
        nomeArquivo,
        mimeType: mimeEsperado,
        tamanho: dados.bytes.length,
        descricao: dados.descricao.trim(),
        ordem,
        criadoPorId: dados.criadoPorId,
      },
    });

    return {
      id: criado.id,
      titulo: criado.titulo,
      nomeOriginal: criado.nomeOriginal,
      nomeArquivo: criado.nomeArquivo,
      mimeType: criado.mimeType,
      tamanho: criado.tamanho,
      descricao: criado.descricao,
      ordem: criado.ordem,
      criadoPorId: criado.criadoPorId,
      criadoEm: criado.criadoEm,
    };
  } catch (erro) {
    // Se o registro falhar, remove o binário recém-gravado.
    await unlink(path.join(dir, nomeArquivo)).catch(() => undefined);
    throw erro;
  }
}

/** Lê o conteúdo binário de um anexo. */
export async function lerConteudoAnexo(anexo: Pick<AnexoRndsComum, "nomeArquivo">): Promise<Buffer> {
  return readFile(caminhoFisico(anexo.nomeArquivo));
}

/** Remove um anexo (registro + binário em disco). */
export async function removerAnexo(id: string): Promise<void> {
  const anexo = await prisma.anexoRnds.findUnique({ where: { id } });

  if (!anexo) {
    throw new Error("Anexo não encontrado.");
  }

  await prisma.anexoRnds.delete({ where: { id } });
  await unlink(caminhoFisico(anexo.nomeArquivo)).catch(() => undefined);
}

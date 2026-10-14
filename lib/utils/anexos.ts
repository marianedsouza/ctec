// Utilitários de anexos seguros para uso em componentes cliente e servidor.
// NÃO contém imports de 'fs', 'path' ou Prisma.

export const TAMANHO_MAXIMO_ANEXO = 25 * 1024 * 1024;

// Extensões aceitas e o mime type canônico associado.
export const EXTENSOES_PERMITIDAS: Readonly<Record<string, string>> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",
  csv: "text/csv",
  txt: "text/plain",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/** Extrai a extensão (minúscula, sem ponto) do nome original. */
export function extensaoDe(nomeOriginal: string): string {
  const idx = nomeOriginal.lastIndexOf(".");
  if (idx < 0) {
    return "";
  }
  return nomeOriginal.slice(idx + 1).toLowerCase();
}

/** Mime type canônico a partir do nome original; null se a extensão não for aceita. */
export function mimePermitido(nomeOriginal: string): string | null {
  const ext = extensaoDe(nomeOriginal);
  return EXTENSOES_PERMITIDAS[ext] ?? null;
}

/** Formata bytes em unidade legível (ex.: 1,2 MB). */
export function formatarTamanho(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} KB`;
  }
  return `${(bytes / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

/** Categoria visual do arquivo a partir do mime type. */
export function tipoArquivo(mimeType: string): "pdf" | "documento" | "planilha" | "imagem" | "arquivo" {
  if (mimeType === "application/pdf") {
    return "pdf";
  }
  if (mimeType.startsWith("image/")) {
    return "imagem";
  }
  if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv")) {
    return "planilha";
  }
  if (mimeType.includes("word") || mimeType.includes("opendocument") || mimeType.startsWith("text/")) {
    return "documento";
  }
  return "arquivo";
}

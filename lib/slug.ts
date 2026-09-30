// Helper compartilhado de geração de slug.
// Mantém a mesma lógica usada em prisma/seed.ts para garantir consistência
// entre o seed inicial e o Serviço de Categorias/Páginas.

/**
 * Gera um slug simples e determinístico a partir de um texto.
 * Remove acentos, troca não-alfanuméricos por hífen e normaliza.
 *
 * Exemplos:
 *   "Áreas de Atuação" -> "areas-de-atuacao"
 *   "O que é a RNDS"   -> "o-que-e-a-rnds"
 */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Sanitização de HTML gerado pelo editor WYSIWYG (TipTap).
//
// Requirement 4.5 / Property 10: todo conteúdo HTML de entrada deve ter sua
// saída sanitizada livre de tags e atributos executáveis (scripts) perigosos.
//
// Biblioteca escolhida: `sanitize-html` (versão exata 2.14.0), fixada no
// package.json. Motivos da escolha:
//   - Ativamente mantida e amplamente adotada.
//   - Funciona no servidor (Node), onde aplicamos a sanitização tanto ao
//     PERSISTIR quanto ao EXIBIR (SSR), sem depender do DOM do navegador.
//   - API declarativa de allow-list (tags/atributos permitidos), que é mais
//     segura por padrão do que uma abordagem de deny-list.

import sanitizeHtmlLib from "sanitize-html";

// Conjunto de tags permitidas: cobre o que o StarterKit do TipTap produz
// (parágrafos, títulos, listas, ênfases, citações, código, links, imagens).
const TAGS_PERMITIDAS: string[] = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "u",
  "blockquote",
  "code",
  "pre",
  "hr",
  "a",
  "img",
  "span",
];

// Atributos permitidos por tag. Deliberadamente NÃO inclui manipuladores de
// evento (onclick, onerror, etc.), que são o vetor principal de XSS.
const ATRIBUTOS_PERMITIDOS: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  span: [],
  code: ["class"],
  pre: ["class"],
};

// Esquemas de URL permitidos. Bloqueia `javascript:` e afins.
const ESQUEMAS_PERMITIDOS = ["http", "https", "mailto"];

const OPCOES: sanitizeHtmlLib.IOptions = {
  allowedTags: TAGS_PERMITIDAS,
  allowedAttributes: ATRIBUTOS_PERMITIDOS,
  allowedSchemes: ESQUEMAS_PERMITIDOS,
  // Impede protocolos relativos ambíguos (ex.: //evil.com).
  allowProtocolRelative: false,
  // Força links externos a serem seguros (evita tabnabbing e vazamento).
  transformTags: {
    a: sanitizeHtmlLib.simpleTransform("a", {
      rel: "noopener noreferrer",
    }),
  },
  // Descarta completamente o conteúdo de tags perigosas.
  disallowedTagsMode: "discard",
};

/**
 * Sanitiza uma string de HTML, removendo tags/atributos executáveis perigosos
 * e mantendo apenas a allow-list de formatação de conteúdo.
 *
 * Deve ser chamada tanto ANTES DE PERSISTIR quanto ANTES DE EXIBIR o conteúdo.
 */
export function sanitizarHtml(html: string): string {
  return sanitizeHtmlLib(html, OPCOES);
}

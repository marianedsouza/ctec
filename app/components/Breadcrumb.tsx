// Componente de breadcrumb (Server Component).
// Exibe o caminho de ancestrais de uma categoria, do topo (raiz) até a
// própria categoria, conforme obterCaminho do Serviço de Categorias.
// Requirements 3.5, 7.2.

import Link from "next/link";
import type { Categoria } from "@/lib/services/categorias";

interface BreadcrumbProps {
  // Caminho ordenado da raiz até a categoria atual (inclusive).
  caminho: Categoria[];
}

export default function Breadcrumb({ caminho }: BreadcrumbProps) {
  if (caminho.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {caminho.map((categoria, indice) => {
          const ultimo = indice === caminho.length - 1;

          return (
            <li key={categoria.id}>
              {ultimo ? (
                <span aria-current="page">{categoria.nome}</span>
              ) : (
                <>
                  <Link href={`/categorias/${categoria.slug}`}>{categoria.nome}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

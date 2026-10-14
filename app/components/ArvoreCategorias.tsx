// Componente de navegação em árvore de categorias (Server Component).
// Renderiza recursivamente os nós da árvore fornecida pelo Serviço de
// Categorias (obterArvore). Cada nó vira um link para sua página de
// categoria pelo slug. Requirements 3.4, 7.2.

import Link from "next/link";
import type { NoArvore } from "@/lib/services/categorias";

interface ArvoreCategoriasProps {
  nos: NoArvore[];
  // Slug da categoria atualmente selecionada (para destaque), opcional.
  slugAtivo?: string;
}

function ItemArvore({ no, slugAtivo }: { no: NoArvore; slugAtivo?: string }) {
  const ativo = no.slug === slugAtivo;

  return (
    <li>
      <Link href={`/categorias/${no.slug}`} aria-current={ativo ? "page" : undefined}>
        {no.nome}
      </Link>
      {no.filhos.length > 0 && (
        <ul>
          {no.filhos.map((filho) => (
            <ItemArvore key={filho.id} no={filho} slugAtivo={slugAtivo} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ArvoreCategorias({ nos, slugAtivo }: ArvoreCategoriasProps) {
  if (nos.length === 0) {
    return <p className="muted">Nenhuma categoria disponível.</p>;
  }

  return (
    <nav className="tree" aria-label="Navegação de categorias">
      <ul>
        {nos.map((no) => (
          <ItemArvore key={no.id} no={no} slugAtivo={slugAtivo} />
        ))}
      </ul>
    </nav>
  );
}

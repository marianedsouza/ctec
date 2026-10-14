"use client";

// Formulário de criação/edição de página (Componente de cliente).
// Usa o editor TipTap para o conteúdo e chama as Server Actions do Serviço de
// Páginas. Exibe mensagens de validação (título vazio, slug duplicado com
// sugestão) — Requirements 4.1, 4.2, 4.3, 4.4, 4.5.

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import EditorTipTap from "@/app/components/EditorTipTap";
import { criarPaginaAction, atualizarPaginaAction } from "@/lib/services/paginas-actions";

type Visibilidade = "publico" | "restrito";

interface OpcaoCategoria {
  id: string;
  nome: string;
}

interface FormularioPaginaProps {
  categorias: OpcaoCategoria[];
  // Presente apenas no modo de edição.
  pagina?: {
    id: string;
    titulo: string;
    conteudo: string;
    visibilidade: Visibilidade;
    categoriaId: string;
  };
}

export default function FormularioPagina({ categorias, pagina }: FormularioPaginaProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [titulo, setTitulo] = useState(pagina?.titulo ?? "");
  const [conteudo, setConteudo] = useState(pagina?.conteudo ?? "");
  const [visibilidade, setVisibilidade] = useState<Visibilidade>(
    pagina?.visibilidade ?? "restrito",
  );
  const [categoriaId, setCategoriaId] = useState(pagina?.categoriaId ?? categorias[0]?.id ?? "");
  const [erro, setErro] = useState<string | null>(null);

  const modoEdicao = Boolean(pagina);

  function aoSubmeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (titulo.trim().length === 0) {
      setErro("O título da página não pode ser vazio.");
      return;
    }
    if (categoriaId.length === 0) {
      setErro("Selecione uma categoria existente.");
      return;
    }

    const dados = { titulo, conteudo, visibilidade, categoriaId };

    startTransition(async () => {
      const resultado = modoEdicao
        ? await atualizarPaginaAction(pagina!.id, dados)
        : await criarPaginaAction(dados);

      if (resultado.ok) {
        router.push(`/paginas/${resultado.slug}`);
        router.refresh();
      } else {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <form onSubmit={aoSubmeter} className="editor-form">
      {erro && (
        <p role="alert" className="form-error">
          {erro}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="fieldset-visibilidade">
        <legend>Visibilidade</legend>
        <label>
          <input
            type="radio"
            name="visibilidade"
            value="restrito"
            checked={visibilidade === "restrito"}
            onChange={() => setVisibilidade("restrito")}
          />
          Restrito (equipe SES-MS)
        </label>
        <label>
          <input
            type="radio"
            name="visibilidade"
            value="publico"
            checked={visibilidade === "publico"}
            onChange={() => setVisibilidade("publico")}
          />
          Público (cidadão)
        </label>
      </fieldset>

      <div className="form-field">
        <label htmlFor="conteudo-editor">Conteúdo</label>
        <EditorTipTap conteudoInicial={conteudo} onChange={setConteudo} />
      </div>

      <button type="submit" className="btn-primary" disabled={isPending}>
        {isPending ? "Salvando..." : modoEdicao ? "Salvar alterações" : "Criar página"}
      </button>
    </form>
  );
}

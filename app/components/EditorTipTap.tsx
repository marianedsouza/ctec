"use client";

// Editor WYSIWYG (TipTap) — Componente de cliente.
// Gera HTML a partir da edição visual do usuário. O HTML é sanitizado no
// servidor (lib/sanitize) antes de persistir e exibir (Requirements 4.1, 4.5).

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface EditorTipTapProps {
  // Conteúdo HTML inicial (edição de página existente).
  conteudoInicial?: string;
  // Chamado a cada alteração com o HTML atual do editor.
  onChange: (html: string) => void;
}

// Barra de ferramentas mínima com as formatações do StarterKit.
function BarraFerramentas({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  if (!editor) {
    return null;
  }

  const botoes: { rotulo: string; ativo: boolean; acao: () => void }[] = [
    {
      rotulo: "Negrito",
      ativo: editor.isActive("bold"),
      acao: () => editor.chain().focus().toggleBold().run(),
    },
    {
      rotulo: "Itálico",
      ativo: editor.isActive("italic"),
      acao: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      rotulo: "Título",
      ativo: editor.isActive("heading", { level: 2 }),
      acao: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      rotulo: "Lista",
      ativo: editor.isActive("bulletList"),
      acao: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      rotulo: "Lista numerada",
      ativo: editor.isActive("orderedList"),
      acao: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      rotulo: "Citação",
      ativo: editor.isActive("blockquote"),
      acao: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      rotulo: "Código",
      ativo: editor.isActive("codeBlock"),
      acao: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Ferramentas de formatação"
      style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginBottom: "0.5rem" }}
    >
      {botoes.map((b) => (
        <button
          key={b.rotulo}
          type="button"
          onClick={b.acao}
          aria-pressed={b.ativo}
          style={{ fontWeight: b.ativo ? 700 : 400 }}
        >
          {b.rotulo}
        </button>
      ))}
    </div>
  );
}

export default function EditorTipTap({
  conteudoInicial = "",
  onChange,
}: EditorTipTapProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: conteudoInicial,
    // Evita divergência de hidratação no App Router (SSR).
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Mantém o conteúdo sincronizado quando o inicial muda (ex.: navegação).
  useEffect(() => {
    if (editor && conteudoInicial && editor.getHTML() !== conteudoInicial) {
      editor.commands.setContent(conteudoInicial);
    }
    // Executa apenas quando o conteúdo inicial ou o editor mudam.
  }, [conteudoInicial, editor]);

  return (
    <div>
      <BarraFerramentas editor={editor} />
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "0.5rem",
          minHeight: "12rem",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

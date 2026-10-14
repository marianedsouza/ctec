"use client";

// Gerenciador de anexos da seção RNDS (Componente de cliente).
// Permite enviar arquivos (multipart/form-data) para /api/rnds/anexos, listar
// os existentes (passados por props) e remover via Server Action. A UI segue o
// espírito minimalista e acessível, alinhada ao visual provisório.

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { removerAnexoAction } from "@/lib/services/anexos-rnds-actions";
import { formatarTamanho, TAMANHO_MAXIMO_ANEXO, tipoArquivo } from "@/lib/utils/anexos";

interface AnexoRnds {
  id: string;
  titulo: string;
  nomeOriginal: string;
  nomeArquivo: string;
  mimeType: string;
  tamanho: number;
  descricao: string;
  ordem: number;
  criadoEm: Date;
}

interface Props {
  anexos: AnexoRnds[];
}

const ROTA_UPLOAD = "/api/rnds/anexos";

export default function GerenciadorAnexosRnds({ anexos }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function aoSelecionar(files: FileList | null) {
    setErro(null);
    setSucesso(null);
    const f = files?.[0] ?? null;
    if (f) {
      if (f.size > TAMANHO_MAXIMO_ANEXO) {
        setErro(`O arquivo excede o limite de ${formatarTamanho(TAMANHO_MAXIMO_ANEXO)}.`);
        return;
      }
      setArquivo(f);
      if (!titulo) {
        setTitulo(f.name);
      }
    }
  }

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!arquivo) {
      setErro("Selecione um arquivo para enviar.");
      return;
    }

    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("arquivo", arquivo);
      fd.append("titulo", titulo || arquivo.name);
      fd.append("descricao", descricao);

      const res = await fetch(ROTA_UPLOAD, { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Erro ao enviar o arquivo.");
        return;
      }

      setSucesso("Arquivo enviado com sucesso.");
      setArquivo(null);
      setTitulo("");
      setDescricao("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar o arquivo.");
    } finally {
      setEnviando(false);
    }
  }

  function aoRemover(id: string) {
    setErro(null);
    setSucesso(null);
    startTransition(async () => {
      const resultado = await removerAnexoAction(id);
      if (resultado.ok) {
        setSucesso("Anexo removido com sucesso.");
        router.refresh();
      } else {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div>
      {erro && (
        <p role="alert" style={{ color: "#b00020" }}>
          {erro}
        </p>
      )}
      {sucesso && <p style={{ color: "#00896d" }}>{sucesso}</p>}

      <section aria-labelledby="anexos-existentes">
        <h2 id="anexos-existentes">Arquivos cadastrados</h2>
        {anexos.length === 0 ? (
          <p>Nenhum arquivo cadastrado para a seção RNDS.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {anexos.map((anexo) => (
              <li
                key={anexo.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                }}
              >
                <strong>{anexo.titulo || anexo.nomeOriginal}</strong>
                <small style={{ color: "#55708a" }}>
                  {anexo.nomeOriginal} · {tipoArquivo(anexo.mimeType)} · {formatarTamanho(anexo.tamanho)} ·{" "}
                  {new Date(anexo.criadoEm).toLocaleDateString("pt-BR")}
                </small>
                {anexo.descricao && <span>{anexo.descricao}</span>}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <a className="btn-secondary" href={`/api/rnds/anexos/${anexo.id}`} download>
                    Baixar
                  </a>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={isPending || enviando}
                    onClick={() => aoRemover(anexo.id)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="novo-anexo">
        <h2 id="novo-anexo">Adicionar arquivo</h2>
        <form onSubmit={aoEnviar}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="arquivo" style={{ display: "block" }}>
              Arquivo
            </label>
            <input
              id="arquivo"
              type="file"
              ref={inputRef}
              onChange={(e) => aoSelecionar(e.target.files)}
              required
            />
            <small style={{ color: "#55708a", display: "block" }}>
              Limite: {formatarTamanho(TAMANHO_MAXIMO_ANEXO)}. Extensões aceitas: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, ODT/ODS/ODP, CSV, TXT, ZIP, PNG/JPG/JPEG/WEBP/GIF.
            </small>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="titulo-anexo" style={{ display: "block" }}>
              Título (opcional)
            </label>
            <input
              id="titulo-anexo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Cronograma da federalização"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="desc-anexo" style={{ display: "block" }}>
              Descrição (opcional)
            </label>
            <textarea
              id="desc-anexo"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" disabled={enviando || isPending}>
            {enviando ? "Enviando..." : "Enviar arquivo"}
          </button>
        </form>
      </section>
    </div>
  );
}

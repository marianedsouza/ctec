"use client";

// Carrossel horizontal de cartões (padrão "acervo" da seção RNDS).
// Rolagem por CSS (scroll-snap) com botões de anterior/próximo e indicador de
// posição. Os botões apenas movem a rolagem do contêiner, portanto funcionam
// também com o contêiner já no fim (o estado dos botões é recalculado no scroll).

import { useCallback, useEffect, useRef, useState } from "react";

interface PropsCarrossel {
  // Rótulo acessível da lista de itens.
  rotulo: string;
  children: React.ReactNode;
}

export default function Carrossel({ rotulo, children }: PropsCarrossel) {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);
  const [indice, setIndice] = useState(0);
  const [total, setTotal] = useState(0);

  const sincronizar = useCallback(() => {
    const trilha = trilhaRef.current;
    if (!trilha) {
      return;
    }

    const card = trilha.firstElementChild as HTMLElement | null;
    const passo = card ? card.getBoundingClientRect().width + 12 : 0;

    setInicio(trilha.scrollLeft <= 2);
    setFim(trilha.scrollLeft + trilha.clientWidth >= trilha.scrollWidth - 2);
    setTotal(Math.max(1, Math.ceil(trilha.scrollWidth / (passo || 1))));
    setIndice(passo > 0 ? Math.round(trilha.scrollLeft / passo) : 0);
  }, []);

  useEffect(() => {
    const trilha = trilhaRef.current;
    if (!trilha) {
      return;
    }

    sincronizar();
    trilha.addEventListener("scroll", sincronizar, { passive: true });
    window.addEventListener("resize", sincronizar);

    return () => {
      trilha.removeEventListener("scroll", sincronizar);
      window.removeEventListener("resize", sincronizar);
    };
  }, [sincronizar]);

  function mover(direcao: 1 | -1) {
    const trilha = trilhaRef.current;
    if (!trilha) {
      return;
    }

    const card = trilha.firstElementChild as HTMLElement | null;
    const passo = card ? card.getBoundingClientRect().width + 12 : trilha.clientWidth;

    trilha.scrollBy({ left: passo * direcao, behavior: "smooth" });
  }

  function irPara(i: number) {
    const trilha = trilhaRef.current;
    if (!trilha) {
      return;
    }

    const card = trilha.firstElementChild as HTMLElement | null;
    const passo = card ? card.getBoundingClientRect().width + 12 : trilha.clientWidth;

    trilha.scrollTo({ left: passo * i, behavior: "smooth" });
  }

  return (
    <div className="carrossel">
      <button
        type="button"
        className="carrossel__btn"
        onClick={() => mover(-1)}
        disabled={inicio}
        aria-label="Anterior"
      >
        ←
      </button>

      <div className="carrossel__trilha" ref={trilhaRef} role="list" aria-label={rotulo}>
        {children}
      </div>

      <button
        type="button"
        className="carrossel__btn"
        onClick={() => mover(1)}
        disabled={fim}
        aria-label="Próximo"
      >
        →
      </button>

      {total > 1 && (
        <div className="carrossel__dots">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === indice ? "carrossel__dot carrossel__dot--ativo" : "carrossel__dot"}
              onClick={() => irPara(i)}
              aria-label={`Ir para o item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

-- Busca full-text (Task 8.1 / Requirements 6.1, 6.2, 6.3, 6.4, 2.2).
--
-- Cria um índice GIN sobre a expressão tsvector (configuração "portuguese")
-- combinando título e conteúdo da página. A MESMA expressão é usada pela
-- consulta do Serviço de Busca (lib/services/busca.ts), de modo que o
-- planejador possa aproveitar este índice para o operador de correspondência
-- (@@) e para o ranqueamento por relevância (ts_rank).
--
-- Observação: o índice indexa o conteúdo bruto (incluindo eventuais marcações
-- HTML geradas pelo editor). A limpeza de HTML é aplicada apenas na geração do
-- trecho destacado (ts_headline), preservando a compatibilidade da expressão
-- indexada com a consulta.

-- CreateIndex
CREATE INDEX "paginas_busca_idx" ON "paginas"
USING GIN (
  to_tsvector(
    'portuguese',
    coalesce("titulo", '') || ' ' || coalesce("conteudo", '')
  )
);

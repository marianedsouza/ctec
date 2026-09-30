# Migrações Prisma — Wiki SES-MS

## Migração inicial (`20250101000000_init`)

Esta migração cria o schema completo do MVP: enums (`Perfil`, `TipoCategoria`,
`Visibilidade`, `StatusEtapa`) e tabelas (`usuarios`, `categorias`, `paginas`,
`versoes_pagina`, `etapas_federalizacao`), incluindo índices e chaves
estrangeiras.

O SQL foi gerado com `prisma migrate diff` (do estado vazio para o
`schema.prisma`), pois **não há um PostgreSQL local em execução** durante o
desenvolvimento. A validação foi feita com:

```bash
npx prisma validate    # schema válido
npx prisma generate     # cliente gerado com sucesso
```

## ⚠️ Ação necessária antes do primeiro uso com banco real

Quando um `DATABASE_URL` apontar para um PostgreSQL real, é **obrigatório**
aplicar a migração uma vez. Escolha uma das opções:

- Produção / CI (aplica migrações já versionadas):
  ```bash
  npx prisma migrate deploy
  ```

- Desenvolvimento (aplica e mantém o histórico em sincronia):
  ```bash
  npx prisma migrate dev
  ```

Depois, popule os dados iniciais com o seed:

```bash
npm run db:seed
```

Enquanto isso não for executado contra um banco real, as tabelas não existirão
fisicamente — o schema e o cliente estão validados, mas nenhuma migração foi
aplicada a um banco.

## Migração de busca full-text (`20250102000000_busca_tsvector`)

Adiciona o índice GIN `paginas_busca_idx` sobre a expressão
`to_tsvector('portuguese', coalesce(titulo,'') || ' ' || coalesce(conteudo,''))`
da tabela `paginas`, dando suporte à busca full-text do `Servico_Busca`
(Task 8.1 / Requirements 6.1, 6.2, 6.4, 2.2).

Esta é uma **migração manual (SQL)**: índices de expressão / GIN full-text não
são representáveis no `schema.prisma`, portanto o SQL foi escrito à mão. A
expressão indexada é idêntica à usada pela consulta em
`lib/services/busca.ts`, permitindo que o planejador utilize o índice tanto no
operador de correspondência (`@@`) quanto no ranqueamento (`ts_rank`).

### Ação necessária com banco real

Como não há PostgreSQL local em execução durante o desenvolvimento, a migração
ainda **não foi aplicada**. Ao apontar `DATABASE_URL` para um PostgreSQL real,
aplique as migrações versionadas:

```bash
npx prisma migrate deploy   # produção / CI
# ou
npx prisma migrate dev      # desenvolvimento
```

Validação feita sem banco:

```bash
npx prisma validate    # schema válido
npx prisma generate    # cliente gerado com sucesso
```

> Observação: como o índice é criado por SQL manual (não refletido no
> `schema.prisma`), o `prisma migrate dev` pode reportar necessidade de manter
> o histórico em sincronia. O índice é aditivo e não altera os modelos.

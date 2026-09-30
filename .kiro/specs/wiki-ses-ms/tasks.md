# Plano de Implementação: Wiki SES-MS

## Overview

A implementação usa Next.js (App Router, TypeScript), PostgreSQL via Prisma, NextAuth e o editor TipTap. As tarefas evoluem incrementalmente: fundação e dados, autenticação, categorias, páginas com editor, versionamento, busca/navegação, seção RNDS e, por fim, identidade visual e integração. Testes de propriedade (fast-check) e unitários aparecem como sub-tarefas opcionais próximas do código que validam.

## Tasks

- [ ] 1. Fundação do projeto
  - [ ] 1.1 Inicializar projeto Next.js (App Router) + TypeScript com lint/format
    - Configurar ESLint, Prettier e scripts de build/dev
    - Definir estrutura de diretórios (app, lib/services, prisma)
    - _Requirements: 9.3_
  - [ ] 1.2 Configurar conexão PostgreSQL + Prisma
    - Instalar Prisma, criar `schema.prisma` inicial e cliente
    - Configurar `DATABASE_URL` via variáveis de ambiente
    - _Requirements: 9.2_

- [ ] 2. Modelo de dados e migrações
  - [ ] 2.1 Definir schema Prisma (Usuario, Categoria, Pagina, VersaoPagina, EtapaFederalizacao)
    - Modelar campos, enums (perfil, tipo, visibilidade, status) e relações
    - Gerar migração inicial
    - _Requirements: 1.3, 3.2, 4.4, 8.4_
  - [ ] 2.2 Criar seed com categorias iniciais (áreas e tema RNDS)
    - Popular árvore inicial incluindo o tema RNDS
    - _Requirements: 3.1, 3.2_
  - [ ]* 2.3 Escrever teste de propriedade para round-trip de slug
    - **Property 2: Round-trip de slug**
    - **Validates: Requirements 3.1, 4.1**

- [ ] 3. Autenticação e perfis (NextAuth)
  - [ ] 3.1 Configurar NextAuth com credenciais e sessão contendo perfil
    - Armazenar senha apenas como hash (bcrypt/argon2)
    - _Requirements: 1.1, 1.2, 1.5_
  - [ ] 3.2 Implementar matriz de permissões e verificação de autorização
    - Implementar `possuiPermissao(sessao, acao)` e guardas de rota
    - Separar rotas públicas de restritas no servidor
    - _Requirements: 1.4, 2.1, 2.3, 2.4_
  - [ ]* 3.3 Escrever teste de propriedade para autorização por perfil
    - **Property 8: Autorização coerente com o perfil**
    - **Validates: Requirements 1.4**
  - [ ]* 3.4 Escrever teste de propriedade para hash de senha
    - **Property 9: Senha nunca persistida em texto claro**
    - **Validates: Requirements 1.5**
  - [ ]* 3.5 Escrever testes unitários de login (credenciais válidas/inválidas)
    - Casos de borda de autenticação
    - _Requirements: 1.1, 1.2_

- [ ] 4. CRUD de categorias hierárquicas
  - [ ] 4.1 Implementar Servico_Categorias (criar, atualizar, remover, obterArvore, obterCaminho)
    - Garantir slug único e prevenir ciclos no reparentamento
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ] 4.2 Implementar UI de navegação em árvore e breadcrumb
    - Renderizar árvore por tipo (área/tema) e caminho de ancestrais
    - _Requirements: 3.4, 3.5, 7.2_
  - [ ]* 4.3 Escrever teste de propriedade para ausência de ciclos
    - **Property 3: Ausência de ciclos na árvore de categorias**
    - **Validates: Requirements 3.3**
  - [ ]* 4.4 Escrever teste de propriedade para reconstrução de árvore/caminho
    - **Property 4: Reconstrução consistente da árvore e do caminho**
    - **Validates: Requirements 3.4, 3.5, 7.2**

- [ ] 5. Checkpoint - Garantir que os testes passam
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. CRUD de páginas com editor WYSIWYG (TipTap)
  - [ ] 6.1 Implementar Servico_Paginas (criar, atualizar, obterPorSlug) com validações
    - Validar título não vazio, slug único e categoria existente
    - Armazenar visibilidade (público/restrito) e aplicar leitura por visibilidade
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 2.1, 2.3_
  - [ ] 6.2 Integrar editor TipTap salvando markdown/HTML com sanitização
    - Sanitizar HTML antes de persistir e exibir
    - _Requirements: 4.1, 4.5_
  - [ ]* 6.3 Escrever teste de propriedade para sanitização de HTML
    - **Property 10: Sanitização de HTML**
    - **Validates: Requirements 4.5**
  - [ ]* 6.4 Escrever testes unitários de validação de página
    - Título vazio e slug duplicado
    - _Requirements: 4.2, 4.3_

- [ ] 7. Versionamento de páginas
  - [ ] 7.1 Registrar nova VersaoPagina a cada atualização e listar histórico
    - Manter versões imutáveis; listar em ordem cronológica
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ] 7.2 Implementar restauração de versão (não destrutiva)
    - Restaurar conteúdo e criar nova versão
    - _Requirements: 5.4_
  - [ ]* 7.3 Escrever teste de propriedade para preservação de histórico
    - **Property 5: Versionamento preserva histórico**
    - **Validates: Requirements 5.1, 5.2**
  - [ ]* 7.4 Escrever teste de propriedade para ordenação do histórico
    - **Property 6: Ordenação cronológica do histórico**
    - **Validates: Requirements 5.3**
  - [ ]* 7.5 Escrever teste de propriedade para restauração não destrutiva
    - **Property 7: Restauração é não destrutiva**
    - **Validates: Requirements 5.4**

- [ ] 8. Busca full-text e navegação pública
  - [ ] 8.1 Configurar índice tsvector e implementar Servico_Busca
    - Ranquear por relevância; retornar título, slug e trecho
    - Filtrar por visibilidade conforme sessão (anônimo vê só público)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 2.2_
  - [ ] 8.2 Implementar página pública com SSR e resultados de busca
    - Renderização no servidor e exibição de trechos/links
    - _Requirements: 7.1, 7.3_
  - [ ]* 8.3 Escrever teste de propriedade para isolamento de conteúdo restrito
    - **Property 1: Isolamento de conteúdo restrito**
    - **Validates: Requirements 2.1, 2.2, 6.4, 7.3**
  - [ ]* 8.4 Escrever teste de propriedade para conteúdo dos resultados de busca
    - **Property 11: Conteúdo completo dos resultados de busca**
    - **Validates: Requirements 6.1, 6.2**
  - [ ]* 8.5 Escrever teste unitário para busca sem resultados
    - _Requirements: 6.3_

- [ ] 9. Seção RNDS e etapas de federalização
  - [ ] 9.1 Criar conteúdo explicativo da RNDS e da federalização
    - Páginas "o que é a RNDS" e "o que é a federalização da RNDS"
    - _Requirements: 8.1_
  - [ ] 9.2 Implementar Servico_RNDS (CRUD de etapas) e exibição ordenada
    - Persistir nome, ordem, status, descrição; exibir por ordem crescente
    - Permitir atualização de etapas orientada a dados (sem código)
    - _Requirements: 8.2, 8.3, 8.4, 8.5_
  - [ ]* 9.3 Escrever teste de propriedade para ordenação das etapas
    - **Property 12: Ordenação das etapas de federalização**
    - **Validates: Requirements 8.3**

- [ ] 10. Integração final, identidade visual e preparação de deploy
  - [ ] 10.1 Aplicar layout e identidade visual SES-MS (público e restrito)
    - _Requirements: 9.1_
  - [ ] 10.2 Conectar componentes, revisar build de produção e variáveis de ambiente
    - Garantir build sem erros de tipo/lint
    - _Requirements: 9.2, 9.3_
  - [ ]* 10.3 Escrever testes de integração end-to-end
    - Publicação de página, busca respeitando visibilidade e navegação com breadcrumb
    - _Requirements: 2.1, 2.2, 6.4, 7.1, 7.2_

- [ ] 11. Checkpoint final - Garantir que os testes passam
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido.
- Cada tarefa referencia requisitos específicos para rastreabilidade.
- Os checkpoints garantem validação incremental.
- Testes de propriedade (fast-check) validam propriedades universais; testes unitários cobrem exemplos e casos de borda.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["2.3", "3.2", "4.1"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5", "4.2", "4.3", "4.4", "6.1"] },
    { "id": 5, "tasks": ["6.2", "6.4", "7.1", "8.1"] },
    { "id": 6, "tasks": ["6.3", "7.2", "8.2", "9.1", "9.2"] },
    { "id": 7, "tasks": ["7.3", "7.4", "7.5", "8.3", "8.4", "8.5", "9.3", "10.1"] },
    { "id": 8, "tasks": ["10.2"] },
    { "id": 9, "tasks": ["10.3"] }
  ]
}
```

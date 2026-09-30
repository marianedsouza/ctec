# Documento de Requisitos: Wiki SES-MS

## Introdução

O Wiki SES-MS é uma base de conhecimento navegável, construída sob medida para a Secretaria de Estado de Saúde de Mato Grosso do Sul (SES-MS), inspirada no portal wiki da saúde do Espírito Santo. O sistema oferece páginas hierárquicas organizadas por "áreas de atuação" e por "temas", busca full-text, acesso público para cidadãos e área restrita para a equipe da SES-MS. O MVP inclui uma seção estruturada sobre a RNDS e as etapas editáveis da federalização estadual. Estes requisitos derivam do documento de design aprovado e usam padrões EARS.

## Glossário

- **Sistema**: a aplicação Wiki SES-MS como um todo.
- **Servico_Auth**: componente responsável por autenticação e autorização por perfil.
- **Servico_Categorias**: componente que gerencia a árvore hierárquica de categorias.
- **Servico_Paginas**: componente que gerencia CRUD e versionamento de páginas.
- **Servico_Busca**: componente de busca full-text.
- **Servico_RNDS**: componente que gerencia conteúdo da RNDS e etapas de federalização.
- **Perfil**: papel do usuário — admin, editor ou leitor.
- **Visibilidade**: classificação de página como pública ou restrita.
- **Categoria**: nó da árvore de organização, do tipo "área" ou "tema".
- **Etapa_Federalizacao**: item editável com nome, ordem, status e descrição.
- **Slug**: identificador textual único derivado do título/nome, usado em URLs.

## Requisitos

### Requisito 1: Autenticação e perfis de usuário

**User Story:** Como membro da equipe da SES-MS, quero autenticar-me e ter um perfil, para acessar recursos conforme minha permissão.

#### Acceptance Criteria

1. WHEN um usuário submete credenciais válidas, THE Servico_Auth SHALL criar uma sessão autenticada contendo o perfil do usuário.
2. IF um usuário submete credenciais inválidas, THEN THE Servico_Auth SHALL rejeitar o acesso e retornar uma mensagem de erro.
3. THE Servico_Auth SHALL associar a cada usuário exatamente um perfil dentre admin, editor e leitor.
4. WHEN um usuário autenticado solicita uma ação, THE Servico_Auth SHALL autorizar a ação somente se o perfil do usuário possuir a permissão correspondente.
5. WHERE a senha de um usuário é armazenada, THE Sistema SHALL persistir apenas o hash da senha.

### Requisito 2: Separação de conteúdo público e restrito

**User Story:** Como gestor da SES-MS, quero separar conteúdo público de conteúdo restrito, para que cidadãos vejam apenas o conteúdo apropriado e a equipe acesse o material interno.

#### Acceptance Criteria

1. IF um usuário não autenticado solicita uma página com visibilidade restrita, THEN THE Servico_Paginas SHALL negar o acesso e redirecionar para a tela de login.
2. WHEN um usuário não autenticado realiza uma busca, THE Servico_Busca SHALL retornar somente páginas com visibilidade pública.
3. WHEN um usuário autenticado com perfil leitor, editor ou admin solicita uma página restrita, THE Servico_Paginas SHALL conceder o acesso à página.
4. THE Sistema SHALL aplicar as regras de visibilidade no servidor.

### Requisito 3: Gestão da árvore de categorias

**User Story:** Como editor, quero organizar o conteúdo em categorias hierárquicas por área e por tema, para que o conhecimento seja navegável.

#### Acceptance Criteria

1. WHEN um editor cria uma categoria com dados válidos, THE Servico_Categorias SHALL persistir a categoria com um slug único.
2. THE Servico_Categorias SHALL classificar cada categoria com o tipo "área" ou "tema".
3. IF uma operação de reparentamento resultaria em ciclo na hierarquia, THEN THE Servico_Categorias SHALL rejeitar a operação com mensagem descritiva.
4. WHEN o Sistema exibe a navegação, THE Servico_Categorias SHALL fornecer a árvore de categorias em estrutura hierárquica.
5. WHEN uma categoria é exibida, THE Servico_Categorias SHALL fornecer o caminho completo de ancestrais para composição do breadcrumb.

### Requisito 4: Criação e edição de páginas com editor visual

**User Story:** Como editor não técnico, quero criar e editar páginas em um editor visual, para publicar conteúdo sem conhecer código.

#### Acceptance Criteria

1. WHEN um editor salva uma página com título não vazio e categoria existente, THE Servico_Paginas SHALL persistir a página com um slug único e conteúdo em markdown/HTML.
2. IF um editor tenta salvar uma página com título vazio, THEN THE Servico_Paginas SHALL rejeitar a operação com mensagem de validação.
3. IF um editor tenta salvar uma página com slug já existente, THEN THE Servico_Paginas SHALL rejeitar a operação e sugerir um slug alternativo.
4. WHEN um editor define a visibilidade de uma página, THE Servico_Paginas SHALL armazenar a visibilidade como pública ou restrita.
5. WHERE o conteúdo é gerado pelo editor WYSIWYG, THE Sistema SHALL sanitizar o HTML antes de persistir e exibir.

### Requisito 5: Versionamento de páginas

**User Story:** Como editor, quero manter histórico de versões das páginas, para acompanhar mudanças e restaurar conteúdo anterior.

#### Acceptance Criteria

1. WHEN uma página é atualizada, THE Servico_Paginas SHALL registrar uma nova versão contendo o conteúdo salvo.
2. THE Servico_Paginas SHALL manter as versões anteriores inalteradas após a criação.
3. WHEN um editor solicita o histórico de uma página, THE Servico_Paginas SHALL listar todas as versões registradas em ordem cronológica.
4. WHEN um editor restaura uma versão anterior, THE Servico_Paginas SHALL definir o conteúdo atual igual ao da versão escolhida e registrar uma nova versão.

### Requisito 6: Busca full-text

**User Story:** Como usuário, quero buscar páginas por termos, para encontrar rapidamente o conteúdo desejado.

#### Acceptance Criteria

1. WHEN um usuário informa um termo de busca, THE Servico_Busca SHALL retornar páginas correspondentes ranqueadas por relevância.
2. WHEN o Servico_Busca retorna resultados, THE Servico_Busca SHALL incluir título, slug e um trecho do conteúdo para cada resultado.
3. IF nenhum resultado corresponde ao termo, THEN THE Servico_Busca SHALL retornar uma lista vazia e indicar ausência de resultados.
4. WHEN a busca é realizada por usuário não autenticado, THE Servico_Busca SHALL restringir os resultados a páginas públicas.

### Requisito 7: Navegação pública e breadcrumb

**User Story:** Como cidadão, quero navegar pelas categorias e páginas públicas com indicação de localização, para me orientar no portal.

#### Acceptance Criteria

1. WHEN um cidadão acessa uma página pública, THE Sistema SHALL renderizar a página no servidor.
2. WHEN uma página pública é exibida, THE Sistema SHALL apresentar um breadcrumb com o caminho de categorias até a página.
3. WHEN um cidadão navega pela árvore, THE Sistema SHALL exibir somente categorias e páginas com conteúdo público acessível.

### Requisito 8: Seção RNDS e etapas de federalização

**User Story:** Como gestor da SES-MS, quero uma seção que explique a RNDS e apresente as etapas editáveis da federalização estadual, para comunicar "onde estamos".

#### Acceptance Criteria

1. THE Servico_RNDS SHALL apresentar conteúdo explicativo sobre "o que é a RNDS" e "o que é a federalização da RNDS".
2. WHEN um editor cria uma etapa de federalização com dados válidos, THE Servico_RNDS SHALL persistir a etapa com nome, ordem, status e descrição.
3. WHEN as etapas de federalização são exibidas, THE Servico_RNDS SHALL apresentá-las ordenadas de forma crescente por ordem.
4. THE Servico_RNDS SHALL classificar o status de cada etapa como "não iniciada", "em andamento" ou "concluída".
5. WHEN um editor atualiza uma etapa, THE Servico_RNDS SHALL persistir as alterações sem exigir modificação de código.

### Requisito 9: Identidade visual e preparação de implantação

**User Story:** Como equipe da SES-MS, quero que o portal tenha a identidade visual institucional e esteja pronto para implantação, para publicá-lo com aparência oficial.

#### Acceptance Criteria

1. THE Sistema SHALL aplicar layout e identidade visual da SES-MS às páginas públicas e restritas.
2. THE Sistema SHALL prover configuração de conexão com PostgreSQL por meio de variáveis de ambiente.
3. WHEN o build de produção é gerado, THE Sistema SHALL compilar sem erros de tipo ou lint.

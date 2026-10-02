# Leaf

**Solve et Coagula**

Leaf é uma biblioteca pessoal e um diário de leitura. Além de organizar livros que já fazem parte da coleção ou da lista de desejos, o projeto registra citações, notas e reflexões sobre o que permaneceu de cada leitura.

A jornada de leitura combina estados familiares — quero ler, lendo e lido — com quatro etapas da *Great Work*: Nigredo, Albedo, Citrinitas e Rubedo. Concluir um livro e assimilá-lo são ações distintas; a reflexão final é opcional.

## Escopo inicial

- Cadastro e edição de livros em um drawer, com múltiplos autores e categorias, dados bibliográficos, capa e estados independentes de posse e leitura.
- Biblioteca, lista de desejos e coleção de citações com busca e filtros.
- Notas e citações por livro, com destaque para citações favoritas.
- Reflexão final, ideias principais, avaliação e histórico da jornada de leitura.
- Leitura pública e escrita restrita ao proprietário da biblioteca.
- Interface responsiva em português e inglês, com português como idioma padrão e temas claro e escuro.

O projeto começa como uma biblioteca pessoal. A possibilidade de cada usuário manter sua própria biblioteca fica para uma evolução futura.

## Tecnologias previstas

| Área | Tecnologia |
| --- | --- |
| Aplicação | Next.js (App Router) e TypeScript |
| Interface | Tailwind CSS e shadcn/ui |
| Internacionalização | next-intl |
| Dados | Prisma e PostgreSQL |
| Banco hospedado | Neon |
| Publicação | Vercel |
| Versionamento | Git e GitHub |

A aplicação usará os recursos de servidor do Next.js para leitura e escrita de dados, sem um backend separado. O banco armazenará dados estruturados e referências às capas, não os arquivos das imagens.

## Direção visual

Leaf busca uma experiência minimalista, acolhedora e contemporânea, com os livros em destaque. A identidade usa verdes profundos, superfícies claras e quentes, detalhes em bege e dourado, **Cormorant Garamond** nos momentos editoriais e **Inter** na interface. Os arquivos de logo para cada tema e uma ilustração adicional já foram fornecidos para a implementação.

## Desenvolvimento local

Requer Node.js 22.12 ou superior e Docker Compose. O PostgreSQL local roda no Docker; a aplicação roda no computador:

```bash
npm install
docker compose up -d
cp .env.example .env
npm run db:deploy
npm run dev
```

O banco local usa a porta `5433` somente em `127.0.0.1` e guarda os dados em um volume Docker. As URLs de `DATABASE_URL` e `DIRECT_URL` no `.env.example` apontam exclusivamente para esse banco. Preencha `AUTH_SECRET` (`openssl rand -base64 32`) e `LEAF_OWNER_PASSWORD` (senha com pelo menos 16 caracteres) no `.env` para habilitar o acesso do proprietário. Para parar o banco, use `docker compose down`; os dados permanecem no volume.

Abra `http://localhost:3000` para a versão em português ou `http://localhost:3000/en` para a versão em inglês. A interface acompanha a preferência de tema do sistema e permite selecionar tema claro ou escuro.

Para validar o código:

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

## Banco de dados e acesso privado

O esquema Prisma e a migração inicial estão em `prisma/`. O `.env` local é ignorado pelo Git e deve conter somente a conexão com o PostgreSQL do Compose. Sem os segredos de acesso, a página pública permanece disponível e o login fica desativado.

Em Production na Vercel, configure as mesmas **chaves** de ambiente com valores próprios de produção: `DATABASE_URL` com a conexão pooled do Neon, `DIRECT_URL` com a conexão direta do Neon, `AUTH_SECRET`, `AUTH_TRUST_HOST=true` e `LEAF_OWNER_PASSWORD`. Não copie URLs do Neon para o `.env` de desenvolvimento. Execute `npm run db:deploy` para produção separadamente, em um ambiente que tenha `DIRECT_URL` do Neon; o comando mostrado em desenvolvimento aplica a migração apenas ao PostgreSQL local.

Os arquivos de código do Prisma Client são gerados automaticamente após `npm install`.

## Autores e categorias

O campo de autores sugere até dez nomes já cadastrados conforme a busca. Selecione um ou mais autores, ou escreva um nome novo para criá-lo ao salvar o livro.

Um livro pode ter várias categorias. No formulário, procure uma categoria existente ou escreva um nome novo e salve o livro; Enter ou `+` permitem adicionar mais categorias antes de salvar. As sugestões mostram até dez opções correspondentes à busca.

Use **Gerenciar categorias**, na seção de classificação do drawer, para renomear ou excluir uma categoria. Excluir uma categoria remove suas associações com os livros e mantém os livros. Nos filtros da biblioteca, selecionar várias categorias mostra livros com pelo menos uma delas.

## Estado do projeto

A aplicação inclui cadastro de livros, citações e notas, biblioteca pesquisável, lista de desejos, leituras agrupadas e visão geral da Great Work. Ao terminar um livro, o proprietário pode registrar avaliação, reflexão e ideias principais, ou assimilá-lo sem escrever nada. A etapa é derivada do estado da leitura: concluir leva a Citrinitas e assimilar leva a Rubedo. A leitura é pública; todas as alterações exigem acesso do proprietário.

Faltam aplicar a migração no Neon, testar os fluxos com dados persistidos e configurar a publicação na Vercel.

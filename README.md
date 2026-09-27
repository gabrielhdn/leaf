# Leaf

**Solve et Coagula**

Leaf é uma biblioteca pessoal e um diário de leitura. Além de organizar livros que já fazem parte da coleção ou da lista de desejos, o projeto registra citações, notas e reflexões sobre o que permaneceu de cada leitura.

A jornada de leitura combina estados familiares — quero ler, lendo e lido — com quatro etapas da *Great Work*: Nigredo, Albedo, Citrinitas e Rubedo. Concluir um livro e assimilá-lo são ações distintas; a reflexão final é opcional.

## Escopo inicial

- Cadastro de livros com múltiplos autores, dados bibliográficos, capa e estados independentes de posse e leitura.
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

Requer Node.js 22.12 ou superior. Para executar a interface:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` para a versão em português ou `http://localhost:3000/en` para a versão em inglês. A interface acompanha a preferência de tema do sistema e permite selecionar tema claro ou escuro.

Para validar o código:

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

## Banco de dados e acesso privado

O esquema Prisma e a migração inicial estão em `prisma/`. Até que um projeto Neon seja configurado, a página pública funciona sem banco; o cadastro e a leitura de dados reais ainda não foram implementados.

Copie `.env.example` para `.env` e configure:

- `DATABASE_URL`: conexão com pool do Neon para a aplicação;
- `DIRECT_URL`: conexão direta do Neon para migrações;
- `AUTH_SECRET`: segredo aleatório para as sessões do Auth.js (`openssl rand -base64 32`);
- `AUTH_TRUST_HOST=true`: permite ao Auth.js usar o host da aplicação;
- `LEAF_OWNER_PASSWORD`: senha única e forte, com pelo menos 16 caracteres, para liberar a escrita.

Os valores são segredos: mantenha o arquivo `.env` fora do Git e configure as mesmas variáveis na Vercel quando fizer a implantação. Sem os segredos de acesso, a página pública permanece disponível e o login fica desativado.

Depois de criar o banco Neon, aplique a migração com `npm run db:deploy`. A aplicação usa a conexão com pool para consultas e a conexão direta para as migrações. Os arquivos de código do Prisma Client são gerados automaticamente após `npm install`.

## Estado do projeto

A base visual, o esquema de dados e o acesso privado estão preparados. O cadastro de livros, a conexão ao banco Neon e a implantação serão concluídos nos próximos blocos.

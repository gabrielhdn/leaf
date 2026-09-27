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

Requer Node.js 20.9 ou superior. Para executar a interface:

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
```

## Estado do projeto

A base visual e técnica está pronta. O cadastro de livros, o banco de dados, a autenticação e a implantação serão adicionados nos próximos blocos.

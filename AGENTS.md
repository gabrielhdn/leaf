# Leaf

Leaf is a personal library and reading journal built with Next.js.

## Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL (Neon)
- next-intl

## General development

Before making changes:

1. Inspect the existing implementation.
2. Follow conventions already established in the repository.
3. Reuse existing components and utilities when appropriate.
4. Avoid introducing a new pattern when an equivalent one already exists.

Prefer the simplest solution that satisfies the requested behavior.

Do not:
- implement functionality that was not requested;
- perform unrelated refactors;
- introduce speculative abstractions for hypothetical future requirements.

## TypeScript

- Use TypeScript for all application code.
- Avoid `any`.
- Prefer explicit and meaningful domain types when data structures are non-trivial.
- Do not silence TypeScript errors solely to make validation pass.

## React and Next.js

- Prefer Server Components unless client-side behavior requires `"use client"`.
- Keep Client Components as small as practical.
- Avoid unnecessary client-side state and effects.
- Prefer Next.js capabilities over custom alternatives when appropriate.

## Internationalization

- The application supports Portuguese (`pt`) and English (`en`).
- Use `next-intl` for all user-facing application text.
- Do not hardcode translatable user-facing strings in components.
- Keep translation keys organized by feature/domain.
- Provide translations for both supported locales when adding or changing UI.
- Navigation must preserve the active locale whenever applicable.
- Do not introduce a second internationalization library.

## Content localization

Internationalization applies to the application interface, not user-created content.

Book titles, descriptions, quotes, notes, reflections, key ideas, and other
user-entered content must be preserved exactly as entered and must not be
automatically translated.

Do not create language-specific fields or localized variants for user-created
content unless explicitly requested.

## UI

- Follow the visual direction defined in the product specification.
- Support both light and dark themes.
- Use shadcn/ui primitives whenever appropriate.
- Prefer reusable components over duplicated UI.
- Keep the interface minimal, modern, warm, and comfortable.
- Preserve responsive behavior on desktop and mobile.
- Never use underlines on clickable elements. Prefer subtle color or opacity changes on hover and preserve visible keyboard focus.
- Follow the typography, color palette, and theme tokens defined in the product specification.
- Use existing design tokens instead of duplicating raw visual values.
- Do not introduce new reusable colors, typography, spacing, radii, or shadows without a clear need.

## Components

Create components when the UI is reused, represents a meaningful interface
concept, contains meaningful behavior, or extraction substantially improves
readability.

Do not create components for every small visual element.

Prefer composition over large components with many configuration props.

## Database and domain

- Use Prisma for database access.
- PostgreSQL is hosted on Neon.
- Keep domain and business rules outside presentation components.
- Validate mutations on the server.
- Do not store image binaries in PostgreSQL.
- Schema changes must include the appropriate Prisma migration.

## Dependencies

- Do not add dependencies without a concrete need.
- Check whether Next.js, React, Tailwind, shadcn/ui, or existing dependencies
  already provide the required functionality.
- Prefer widely adopted and actively maintained packages.

## Validation

Before considering a coding task complete, run the relevant validation commands
available in the repository.

At minimum, when applicable:

- lint;
- type checking;
- production build;
- relevant automated tests.

Fix errors introduced by the implementation.

Do not disable ESLint or TypeScript rules merely to make validation pass.

If an existing unrelated error prevents validation, report it clearly instead
of modifying unrelated code.

## Git

- Do not create commits automatically.
- Only commit when explicitly requested.
- Use Conventional Commits.
- Write commit messages in English.
- Keep commits small, atomic, and focused.
- Do not mix unrelated responsibilities in the same commit.
- Never amend, rebase, reset, force-push, or rewrite history unless explicitly requested.

## Working style

- For larger tasks, inspect and plan before editing.
- Prefer small, understandable changes over broad rewrites.
- Preserve working code unless the requested task requires changing it.
- Do not silently expand the scope of a task.

When completing a task, briefly report:
- what changed;
- important implementation decisions;
- validation performed;
- relevant limitations or follow-up work.

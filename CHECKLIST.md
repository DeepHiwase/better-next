# NEXT.js

## CHECKLIST

- [x] use bun - `bun create next-app@latest`
  - select `No, customize settings` - TypeScript, ESLint, React Compiler, Tailwind CSS, `src/**/*`, App Router ✅
  - import alias ❌ - > default - `@/*`
  - `bun dev` test - `http://localhost:3000`
  - `git log --all --graph`

- [x] clean up code
  - remove files from `public/*`
  - clear globals.css exclude @tailwind, README.md with title, page.tsx - `Hello next!` with tw height/font/color - `text-3xl font-bold underline text-teal-500`
  - lookup delete .next if not working
  - test

- [x] install shadcn `https://ui.shadcn.com/docs/installation/next`
  - base color - `Zinc`
  - install components - `bunx --bun shadcn@latest add button` - button, label, input, sonner or install all with `--all`
  - test - add button with `Click me!`

- [x] create remote repo - GitHub - check orgs - default me
  - `git push`

---

- [x] install better-auth - `https://www.better-auth.com/docs/installation`
  - create `.env` - set up env vars - also add NEXT_PUBLIC_API_URL - to access API on client comps - prefix with NEXT_PUBLIC to use in client comp - `.env.example` - `!.env.example` in `.gitignore`
  - create `lib/auth.ts`
  - setup `postgres` database with `neon.tech` or docker-compose.yml - `docker compose up -d`
  - install `prisma` - `bun add prisma --save-dev` - IMP: `bun --bun run prisma [command]`
  - init prisma `npx prisma init` or `bunx --bun prisma init` - cleanup - default output = "../src/generated/prisma" - then add `DATABASE_URL` in .env - `prisma db pull` to introspect db and generate auto schemas models if any found in db
  - define schemas in schema.prisma and run `prisma migrate dev` to apply schema
  - create **Post** Model - for test - atleast push one model in db
  - push database changes `bunx --bun prisma db push` or `npx prisma db push` - check db to see applied schema/tables/columns - it only only apply changes of schema to db - `"prisma:studio": "bunx --bun prisma studio"`
  - as if db push cmd not generate auto generate folder - run manually `bunx --bun prisma generate` to generate prisma client - add `/src/generated` ✅ or `/src/generated/prisma` to `.gitignore`
  - adjust **scripts** in `pkg.json` - run prisma generate before dev and build cmd
    - `"dev": "bunx --bun prisma generate && next dev",` - keep dev server sync with prisma schema as long as schema don't change
    - `"build": "bunx --bun prisma generate && next build",`

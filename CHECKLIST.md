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

  - create single prisma client in `lib/prisma.ts` - [Comprehensive Guide to Using Prisma ORM with Next.js](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help) - the file name can be `lib/db.ts` also to make agnostic but for now use primsa.ts which export generated instance to whole project
  - add adapter to connect prisma instance to pg - `bun add @prisma/adapter-pg` also add `bun add @prisma/client` before running better-auth cli
  - setup prisma adapter with better-auth - this db setup done first so that better-auth cli can gererate models according to setup used
  - generate auth tables `npx @better-auth/cli generate` - add --output to not affect original schema.prisma file after generating we can copy it into main schema.prisma and deleted output specified file - `bunx @better-auth/cli generate --output=auth.schema.prisma`
  - make tweaks to `schema.prisma` - put createdAt & updatedAt at top under id in models, seperate relations, add @unique infront of columns instead of @@unique([columnName]) at last and change model names @@map to plural names 💎
  - quick walkthrough the models:
    - `User`
    - `Session`
    - `Account`
    - `Verification`
    - `Post` - attach to user 1:n relation - its custom table not come with better-auth
  - push db changes `bunx --bun prisma db push`
  - configure the authentication methods to use - built-in support for email/password, social sign-on providers
  - create Mount Handlers in `app/api/auth/[...all]/routes.ts`
  - adjust `eslint.config.mjs` to ignore `src/generated/**/*` - put it in globalIgnores(["src/generated/**/*"])
  - create client instance in `lib/auth-client.ts` - use NEXT_PUBLIC_API_URL - this instance is use to interact in react to handle all auth function - either use `authClient` then access functionality with dot or export directly function instances from this file to export specific -> `export const {} = authClient;` - add what to export in {}

- [x] Enable Email & Password Authentication - already done ✅
  - Create Sign Up Page PT1
    - Create Form `components/register-form.tsx` - put it in `app/auth/register/page.tsx`
    - Log Form Values - test
  - Setup Sonner - put Toaster component in layout.tsx from `@/components/ui/sonner.tsx`
  - Create Sign Up Page PT2
    - Add Form Validation
      - minPasswordLength: 6, in auth.ts // by default, better-auth - use 8 as minPasswordLength
    - Destructure SignUp Function
    - Showcase `onError`
  - OPTIONS - **minPasswordLength** - already done ✅
  - Create Sign Up PT3
    - Sign Up _default automatically signs in the user_ - better-auth signin auto since email verification is off, so when signup - session created and cookie stored on account register - cookie max age - default `7d`
  - Show Session on Profile Page
  - Show Data in Neon Dashboard
  - Sign Out User
    - Destructure SignOut Function
    - Show Removed Cookies
  - Create Sign In Page PT1
    - Create Form `components/login-form.tsx`
    - Log Form Values - test
    - Destructure SignIn Function
  - Show Unauthorized on Profile Page
  - Create Sign In Page PT2
    - Showcase `onError`
    - Sign In User

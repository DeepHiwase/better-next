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
- IMP Auth done

=================================================

- [x] For user convinences or nice to look at 👇 - to change the way generate ID of table and hash password before store in db
  - `return-button.tsx` 💎 - add it to all pages needed, auth-pages, profile
  - Showcase `onRequest` and `onResponse` - pending state, disable submit btn, `onSuccess` - redirect using router to `/profile` for _both_ signIn and signUp as better-auth signIn auto by default - show toast.success onSuccess then redirect
  - Add Convienence Links for Auth Pages - don't have an acc / already have an acc
  - Showcase Full Cycle Again - test
  - OPTIONS - **autoSignIn** - disable as it is enabled by default
    - showcase - test
  - OPTIONS - **advanced.database.generateId** - `https://www.better-auth.com/docs/concepts/database#id-generation` - to use uuid - disable better-auth option which uses default - Web crypto.getRandomValues()
    - Table IDs (change `schema.prisma` and push) - stop dev - make changes to prisma models `@default(uuid())` - push to db and truncate db with cascade one
      - `"prisma:push": "bunx --bun prisma db push",`
        `"prisma:generate": "bunx --bun prisma generate"`
    - Showcase - test
    - Truncate Tables
  - OPTIONS - **emailAndPassword.password** - better-auth uses scrypt to hash passwords - `https://www.better-auth.com/docs/reference/security` - to customized it to use own hashing version
    - Create User
    - Argon2 `bun add @node-rs/argon2` - faster performance - cross platform support - small pkg size
    - Add to `next.config.ts` - to tell server about external pkg - `serverExternalPackages: ["@node-rs/argon2"],`
    - Create Utilities `lib/argon2.ts` - config accorgin to lucia-auth - `https://v3.lucia-auth.com/tutorials/username-and-password/nextjs-app`
    - Add to `lib/auth.ts`
    - Showcase
    - Truncate Tables
  - Create User

=================

- [x] SERVER ACTIONS - since client side auth is convinent and better approach - now try to integrate same with server side with server components - validate and auth at server - now make both signin and signup implement with server actions, whole manually and then less manually by using direct feature given by better-auth - nextCookies plugin --- this will be same for Express Application
- Sign Up User via SERVER ACTIONS
  - Create Action
  - Log Form Values
  - Sign Up user on server
- Sign In User via SERVER ACTIONS PT1 **HERE HERE HERE**
  - Create Action
  - Log Form Values
  - Sign In User on Server - catch - when wroking with server actions in nextjs, you have set manually set cookies. - work with cookies api to set cookies. without this you only get login but not set cookie in browser as not passed in res - so set cookie in res
  - Showcase - No Cookies
  - Manually Set Cookies
  - Showcase - Cookies
- Get Additional Session Properties
- PLUGINS - **nextCookies()** 💎 do all manually setup auto
- use headers() from `next/headers` also to pass userAgent even if use plugin nextCookies()

=======================================================

- [x] Get the session on Client
  - Create Get Started Button
  - Destructure useSession
  - showcase
- OPTIONS - **session.expiresIn**
  - change to 15 seconds
  - showcase
  - Change to 30 days
- Middleware - `proxy.ts` in `src` - `src/proxy.ts` ✅ to work - use `auth.api.getSession` since its server side - for now using proxy to only check session
  - check for existence of a session cookie
  - showcase on auth routes
  - THIS IS NOT SECURE! - This is the `recommended approach` to optimistically **redirect users** - recommend handling auth checks in each page/route
  - config matcher from next.js in proxy.ts - `https://nextjs.org/docs/app/api-reference/file-conventions/proxy#negative-matching`
- Error Handling - use better auth typing to access robust error info - `auth.$ERROR_CODES`
- Hooks - to do some task `before` and `after` endpoint or auth logic - `https://www.better-auth.com/docs/concepts/hooks`
  - Validate Email - `https://www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction` validate email before signup logic hook
  - Transform Name

===================================================

- [ ] Roles (Custom Method)
  - Prisma
    - Add UserRole Enum - put them **under models** that use them or in a seperate location if use in multiple location
    - Push changes `bunx --bun prisma db push`
  - User
    - Show field is added because of `@default`
    - Truncate Tables
    - Create new User
  - Profile PT1
    - Show role is not typed in `session.user` - as you have to add it manually with better-auth even if added in prisma model
  - OPTIONS - **user.additionalFields**
    - showcase `input` option - need to pass `input: false` to make not cumpolsion to pass role when signup with better-auth
  - Profile PT2
    - show role is now typed and added to `session.user`
  - ISSUE: Client session has no Context of the role
    - Cute circle on `get-started-button.tsx`
    - InferAdditionalFields plugin on Client - as we don't have role on authClient since we need authClient instance to inference of additional field added to auth 💎

============

- Admin Panel
  - Create Page / Link
  - Manually change role
  - Update middleware
  - Guard `/admin/dashboard`
  - List users with prisma query
  - Delete user with prisma query
- Database hooks

============

- Roles (Admin Plugin) from better auth `https://www.better-auth.com/docs/plugins/admin` - more like Authorization plugin - tells what are allowed to do
  - generate auth tables `bunx @better-auth/cli generate --output=roles.schema.prisma` - this to run as we add admin plugin which add more things in schema tables to work with them - things added more - `https://www.better-auth.com/docs/plugins/admin#schema`
  - compare & contrast (look at Schema section)
  - Push changes `bunx --bun prisma db push` - as we add more fields to models
  - Create Permissions (No Posts) - `https://www.better-auth.com/docs/plugins/admin#create-roles` - `lib/permissions.ts`
  - Add to `lib/auth.ts` and `lib/auth-client.ts` - use `ac` & `roles` from `permissions.ts` and pass it to admin plugin
  - List Users with Admin Plugin - by using instead of prisma, use better-auth api `listUsers` - its a `admin functionality`
  - EXERCISE: Delete user with Admin Plugin - nothing wrong with using prisma query but for exercise we are using better-auth admin features to do some prisma query stuff
  - Change Permissions (With Posts)
- Create Dropdown to change role for Admins

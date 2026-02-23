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

- [ ] prettier - `https://github.com/tailwindlabs/prettier-plugin-tailwindcss`
  - `npm install -D prettier prettier-plugin-tailwindcss`
  - add to `.prettierrc` config file in plugins - it must be add as last plugin after all plugins in prettier 👲
  - add `.prettierignore` with node_modules, dist, build, .git, .gitignore, .next if nextjs and some other to ignore by prettier

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

- [x] Roles (Custom Method)
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

=======================================

- [x] Oauth - Google & GitHub
  - Create Buttons
  - Google Oauth - `https://www.better-auth.com/docs/authentication/google`
    - before this you have to setup oauth consent screen - where you have to give details of all contacts of project - this is where you can setup branding also (optional)
    - create new project > credentials > create oauth client id
      - authorized js origin - `http://localhost:3000` - in prod will actual domain
      - authorized redirect url - `http://localhost:3000/api/auth/callback/google` from better-auth docs
  - GitHub Oauth - `https://www.better-auth.com/docs/authentication/github`
    - Homepage Url - `http://localhost:3000`
    - Authorization callback URL - `http://localhost:3000/api/auth/callback/github`

  - if register with with mail used in google/github account and then sign in with google/github, user image will be null, this lead to three account with same user - as better-auth by default enable `account linking`
  - Account Linking - make account linking false - now if try let say signIn with github then google then at google signin - it will redirect to error url `http://localhost:3000/auth/login/error?error=account_not_linked` 404 as same credentials of signin found as its a single user
  - Error Handling - create page to handle the above redirect 404 page - customized it by adding one `src/app/auth/login/error/page.tsx`
    - `/auth/login/error`

======

- [ ] Discord Oauth

========================================

- [x] Email Verification
  - Nodemailer
    - Create Template
      - `bun add nodemailer` & `bun add -D @types/nodemailer`
      - `lib/nodemailer.ts` - `https://nodemailer.com/smtp/oauth2` & `https://nodemailer.com/smtp/customauth`
      - create transporter func and use env `&` where app password is used not gmail password, to get app password, first setup 2-step verification i.e. 2 factor authentication for that user email through which emails are going to send, then set app password `https://myaccount.google.com/apppasswords` - create app name and it shows password one time so copy it
      - done nodemailer setup - check all credentials
    - create `actions/send-email.action.ts` - to create a async server generic function to send emails
  - Verify Email
    - `emailAndPassword.requireEmailVerification` - make it true to enable
    - `emailVerification` - configure auth to send email with defined custome `send-email.action.ts` 💎
    - handle Error / Expired `/auth/verify` - like when wrong token or expired token or any - it should show a page with Login Error and have form to verify email again 💎 - when invalid token - catches on home page - but you don't want to catch on home page - add custom url `/auth/verify` - now if error, it gets redirect to `http://localhost:3000/auth/verify?error=invalid_token` where you catch param and show according to error or `http://localhost:3000/auth/verify?error=token_expired`
    - destructure `sendVerificationEmail` from better-auth to do it simply like `emailVerification` from better-auth
    <!-- If email is not correct format like its a @example.com this will get send to nodemailer user email 💎 helpful for debugging -->
    - handle login page not verified - by adding more verbose error message in signin action/form
  - Create Post signup page
    showcase

  - Forgot password - logic starts from login-form, setup auth `sendResetPassword` then only export `requestPasswordReset` from auth-client
    - Page / Form / Success
  - Reset password
    - Page / Form / Success
    - showcase

===========================================================

- [x] Show the image of user
- Update User - this exported from auth-client - `updateUser` - use to update user values 💎
  - change name / image
  - update hook
  - updating password
- Custom Sessions - customizing session obj we get to only allow specific fields to get when access session - to do use plugin name `customSession`
  - type inference for plugins workaround - as we need to defined options type as role from admin plugin is not getting infered by customSession plugin. to work it we need to defined by lifting it up and then spread all accross where it needed - admin and customeSession plugins, to defined we use type from better-auth `type BetterAuthOptions` from better-auth
    - create obj satisfies `BetterAuthOptions` then spread it to better-auth auth instance - then add plugin and spread options.plugins and then add `customSession` plugin with passing second option as options defined as `BetterAuthOptions`
    - now we have to make auth-client instance also to infer typing for customeSession - use `customSessionClient` plugin from `better-auth/client/plugins` and type `auth` to infer
    - now can add or remove in typing of session to access only specific part of session
- PLUGINS - **Magic Link** - signin without password - it send email when signin with email - click email btn- you will be authenticated💎 - `https://www.better-auth.com/docs/plugins/magic-link`
  - add to client instance - this will add it to `signIn` instance come from better auth client instance
  - create UI
  - adjust hooks - before hook we put is only on `/sign-up/email` so it only work on signup - we want to work normalizeName function on `/sign-in/magic-link` and also when update user `/update-user`
- Cookie cache - `https://www.better-auth.com/docs/guides/optimizing-for-performance`

===============================================================

- [ ] rate limit
  - basic ratelimit by better-auth - `https://www.better-auth.com/docs/reference/options#ratelimit` - `rateLimit` option in auth instance steup - no bot protection
  - storage default `memory`, but nextjs is serverless so we need to use `database` which generate a model schema by migrating with better-auth cli - `bunx @better-auth/cli generate --output=rateLimit.schema.prisma` - then copy rateLimit with config by you and put in `schema.prisma` file and push to db - but there is better way - Arcjet
  - Setup ArcJet - create team, free tier upto 2 teammates - create new site - name `Better-auth` - choose `nextjs` - `https://docs.arcjet.com/get-started?f=next-js`
    - features can include
      - Bot detection. Rate limiting. Email validation. Attack protection. Data redaction. - any feature can be add on any http method - go through docs
    - `bun add @arcjet/next @arcjet/inspect` - here inspect for checking snooping stuff - all need to configure
      - `bun add @arcjet/ip` for ip related stuff
    - modify `app/api/auth/[...all]/routes.ts` - GET and POST handles to include arcjet first to modify response and early return according to request obj💎
      - create instance of arcjet which include api key `ARCJET_KEY`, on which basis to check - charasteristics `userIdOrIp` - check userId or Ip of user, rules -> shield mode "LIVE" so to run in without reporting in dev mode
      - define botSettings, restrictiveRateLimitSettings <this are more restrictive settings>, laxRateLimitSettings <this are less restrictive settings>, emailSettings so to use this settings in different scenerios
    - create `checkArcjet` async function to check passed `request` object get in POST handler - return decision object with rules appled on it are validated and protect request obj and throw error into decision obj which can be check in POST handler and return response according to it.
      - add routes to check like `/auth/sign-up` where get POST request
    - 👲 as better-auth also read the body of request obj at the same time and you can't have two things reading same req object - so clone req obj for better-auth to read after arcjet used - so clone req obj for arcjet with request.clone() method 🚨🚨 and passed to POST handler to be used by better-auth to read
    - more to write here TODO: complete this, also there is a log of bug at the time of signup - check for it

=====

## Best Practices Steps with Agents

- [ ] 1. Scafold a new project with shadcn create new project - which add guard rails to which design system to use for ai
  - select custom style if want and run next.js cli command given after selecting component lib, style, base color, theme, icon lib, font, radius, menu color, menu accent, etc. scafolds nextjs, tailwindcss and shadcn.
- [ ] 2. add md files for specific models -> gives a long term memory <- reads at the start of every session
  - claude - CLAUDE.md - to generate by claude itself, run `init` cmd in its interface, lookk for project scafolded earlier and generate md file - put it in next app - put only text `agents.md` in it
  - important to add
    - Do, Don't, Tech Stack, Commands/Scripts, Boundaries, Project Structure, Key/Imp Files, Code Examples, PR Guidelines, PR Checklist, When Stuck what to do, Extended Documentation referencing to .agents/.claude folder
  - gemini & gpt - AGENTS.md - so all config in this file only.
- [ ] 3. add skills for framework knowledge
  - skills are - reusableknowledge packs - install with simple command - get skills from `https://skills.sh/`
  - to add skills to project - select which skills to add -
    - `vercel-react-best-practices` - it gives cmd `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices` - run in terminal
      - select antigravity and claude code and all other imp are selected by default
      - select Project to install to specificly for project
      - select symlink - to install all models agents file in single source or truth - then proceed for installation
        - creates folders of `.agents/skills` and for claude as we selected before - same config but in diff folder `.claude/skills`
    - `vercel-composition-patterns`
    - `next-best-practices`
  - to update skills - `npx skills update`
- [ ] 4. Plan before you execute - make sure agent have everything needed to build in plan mode - ex in PROMPT.md for plan mode
  - add docs reference
  - `ask me questions before start building` sentence in prompt.
- [ ] 5. Checkpoint with Git
  - commit after every successful step
  - if something breaks - `git restore` to restore to previous commited code

==================================

- [ ] session management
  - parse userAgent data from session with better approach - using lib `ua-parser-js` 💎 - `bun add ua-parser-js`

  - even after revoke session that is open in other tab or device, it will still be logged in for `1m` as session is cached by default 💎

==================================

- [ ] Delete User Account
  - to enable the deletion of account, you have to set enable this feature in auth instance.
    - **user.deleteUser.enabled** - to true and send email of deletion initiation to actually delete user by user itself `sendDeleteAccountVerification` in user.deleteUser field which takes async function like other to send email.

==================================

- [ ] Two Factor Auth - `https://www.better-auth.com/docs/plugins/2fa`
  - use better-auth plugin `twoFactor()` and also give name to app in `appName` as it will be use as an issuer
  - run generate cli cmd from better auth to get schema for it to add it to original `schema.prisma` file which then push to db as changes to models `bunx @better-auth/cli generate --output=twoFA.schema.prisma` <- this must run after adding plugin to see changes in schema - add one field in user `twoFactorEnabled` and a new model - `bunx --bun prisma db push`
  - IMP 🚨🚨 to put `twoFactorEnabled: user.twoFactorEnabled,` in user in customSession as to get typing, i need to debug just to find out that i didn't enable this.

  - `bun add zod`
  - create form with react-hook-form with zod resolver as validation with zod
    - create schema with zod obj for form `twoFactorAuthSchema` - then infer type named `TwoFactorAuthForm` from `twoFactorAuthSchema` with `z.infer<>`
    - `bun install react-hook-form` & `bun i @hookform/resolvers`
    - `bunx --bun shadcn@latest add field`
    - `bunx --bun shadcn@latest add @wds/loading-swap`
    - `bun i react-qr-code`
    - `bunx --bun shadcn@latest add tabs`

    - ⚠️ If you too long time to enter 2fa code after login to app in 2fa page, it will give error as their is set timeout to enter code, so if you get error then again login and enter authentication code as early as possible

    - as backup codes are one-time use only so if use one of given then it will not be use again when login and 2fa with backupcode tab
    - 2fa authentication tab is use with codes from mobile authenticator app

=====================================

- [ ] Passkey - `https://www.better-auth.com/docs/plugins/passkey`
  - add passkey plugins to both auth and auth-client instance - `bun add @better-auth/passkey`
  - `bunx @better-auth/cli generate --output=passkey.schema.prisma` - modify tables - `bunx --bun prisma db push` - then generate
  - `bunx --bun shadcn@latest add dialog`

  - TODO: detail it

=====================================

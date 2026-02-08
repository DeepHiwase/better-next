# NEXT.js

---

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

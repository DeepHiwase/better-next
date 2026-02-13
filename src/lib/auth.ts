import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // by default, better-auth - use 8 as minPasswordLength
    autoSignIn: false, // it will be auto disable also when add email verification logic // by default its enabled
    password: {
      // custom hashing password logic to hash password with pkg @node-rs/argon2 to hash with argon2 algo
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  advanced: {
    database: {
      generateId: false, // disable default better-auth id generation - here can add custom logic to generate or change prisma model ✅
    },
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 15 -> 15 seconds, for 30 days -> 30 * 24 * 60 * 60 as its in seconds
  },
});

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { getValidDomains, normalizeName } from "@/lib/utils";
import { UserRole } from "@/generated/prisma/enums";
import { ac, roles } from "@/lib/permissions";

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
  plugins: [
    nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
  ],
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 15 -> 15 seconds, for 30 days -> 30 * 24 * 60 * 60 as its in seconds
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        const VALID_DOMAINS = getValidDomains();
        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid domain, Please use a valid email.",
          });
        }

        const name = normalizeName(ctx.body.name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>, // you will get role in session
        input: false, // this will tell better auth that when signup this field is not necessary, if not pass - our build will fail due to ts error
      },
    },
  },
  databaseHooks: {
    // same as hooks, before & after run but run before and after database queries
    user: {
      create: {
        // run this before running query of creating user to set admin role if its email is in env
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }

          return { data: user };
        },
      },
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID), // or as string
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: String(process.env.GITHUB_CLIENT_ID), // or as string
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";

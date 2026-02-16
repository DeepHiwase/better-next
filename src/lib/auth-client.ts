import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";

import type { auth } from "@/lib/auth"; // to use auth instance as type
import { ac, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })], // ao `admin` also have type inference
});

export const {
  signUp,
  signOut,
  signIn,
  useSession,
  admin,
  sendVerificationEmail, // from betterauth to handle logic of sending verification email
  requestPasswordReset, // forgetPassword 💀
  resetPassword,
  updateUser,
} = authClient;

import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  adminClient,
  customSessionClient,
  magicLinkClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

import { auth } from "@/lib/auth"; // to use auth instance as type
import { ac, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles }), // ao `admin` also have type inference
    customSessionClient<typeof auth>(), // now we also infer customClient typing in auth-client instance
    magicLinkClient(),
    // passing all of thses plugins to auth-client also is to get these functionality on client side also using auth-client other than built in given
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }), // add it to client so to redirect for verify 2nd factor
    passkeyClient(), // passkey client also comes from '@better-auth/passkey/' - 'client' module `@better-auth/passkey/client`
  ],
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

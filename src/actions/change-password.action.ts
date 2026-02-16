"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function ChangePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword"));
  if (!currentPassword) return { error: "Please enter your current password" };

  const newPassword = String(formData.get("newPassword"));
  if (!newPassword) return { error: "Please enter your new password" };

  try {
    await auth.api.changePassword({
      headers: await headers(), // since we going to use server side api of better-auth, we need to pass headers so betterauth can get who is the person doing this as it don't have access to session 💎
      body: {
        currentPassword,
        newPassword,
      },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: "Internal Server Error" };
  }
}

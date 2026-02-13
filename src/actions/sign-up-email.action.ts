"use server";

import { APIError } from "better-auth/api";

import { auth, ErrorCode } from "@/lib/auth"; // this meant to be run on server not on client

export async function signUpEmailAction(formData: FormData) {
  const name = String(formData.get("name"));
  if (!name) return { error: "Please enter your name" };

  const email = String(formData.get("email"));
  if (!email) return { error: "Please enter your email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Please enter your password" };

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof /* Error */ APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return { error: "Oops! Something went wrong. Please try again!" };
        default:
          return { error: err.message };
      }
    }

    return { error: "Internal Server Error" };
  }
}

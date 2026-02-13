"use server";

import { /*cookies,*/ headers } from "next/headers";
// import { parseSetCookieHeader } from "better-auth/cookies";

import { auth } from "@/lib/auth";

export async function signInEmailAction(formData: FormData) {
  const email = String(formData.get("email"));
  if (!email) return { error: "Please enter your email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Please enter your password" };

  try {
    /*const res =*/ await auth.api.signInEmail({
      headers: await headers(), // so to get the userAgent info also
      body: {
        email,
        password,
      },
      // asResponse: true, // 💎 to get res
    });

    // console.log(res);

    // ============= remove all below if use better-auth plugin `nextCookies()`
    // const setCookieHeaders = res.headers.get("set-cookie");
    // console.log(setCookieHeaders);
    // if (setCookieHeaders) {
    //   const cookie = parseSetCookieHeader(setCookieHeaders); // prevent more manually to do some ops to set cookie - thanks to better-auth this function also
    //   console.log(cookie);
    //   const cookieStore = await cookies();
    //   console.log(cookieStore);

    //   const [key, cookieAttributes] = [...cookie.entries()][0];
    //   console.log([key, cookieAttributes]);
    //   const value = cookieAttributes.value;
    //   console.log(value);
    //   const maxAge = cookieAttributes["max-age"];
    //   console.log(maxAge);
    //   const path = cookieAttributes.path;
    //   console.log(path);
    //   const httpOnly = cookieAttributes.httponly;
    //   console.log(httpOnly);
    //   const sameSite = cookieAttributes.samesite;
    //   console.log(sameSite);

    //   cookieStore.set(key, decodeURIComponent(value), {
    //     // 💎 decodeURIComponent to work
    //     maxAge,
    //     path,
    //     httpOnly,
    //     sameSite,
    //   });
    // }
    // =============

    return { error: null };
  } catch (err) {
    if (err instanceof Error) {
      return { error: "Oops! Something went wrong while logging in" };
    }

    return { error: "Internal Server Error" };
  }
}

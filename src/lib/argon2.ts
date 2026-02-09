import { hash, verify, type Options } from "@node-rs/argon2";

const opts: Options = {
  memoryCost: 19456, // https://v3.lucia-auth.com/tutorials/username-and-password/nextjs-app according to lucia auth
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function hashPassword(password: string) {
  const result = await hash(password, opts);
  return result;
}

export async function verifyPassword(data: { password: string; hash: string }) {
  const { password, hash } = data;

  const result = await verify(hash, password, opts);
  return result;
}

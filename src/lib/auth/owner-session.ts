import "server-only";
import { auth } from "@/auth";

export function isOwnerAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_SECRET.length >= 32 &&
      process.env.LEAF_OWNER_PASSWORD &&
      process.env.LEAF_OWNER_PASSWORD.length >= 16,
  );
}

export async function isOwner(): Promise<boolean> {
  if (!isOwnerAuthConfigured()) return false;

  const session = await auth();
  return session?.user?.id === "owner";
}

export async function requireOwner(): Promise<void> {
  if (!(await isOwner())) {
    throw new Error("Owner access required");
  }
}

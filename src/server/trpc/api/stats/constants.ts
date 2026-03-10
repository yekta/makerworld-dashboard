import { env } from "@/lib/env";

export const usernames = env.NEXT_PUBLIC_USERNAMES.split(",").map((username) =>
  username.trim(),
);
if (usernames.length === 0) {
  throw new Error(
    "No usernames provided in NEXT_PUBLIC_USERNAMES env variable",
  );
}
export const defaultUsername = usernames[0];

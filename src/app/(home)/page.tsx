import { defaultUsername } from "@/server/trpc/api/stats/constants";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(`/${defaultUsername}`);
}

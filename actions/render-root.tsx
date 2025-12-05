"use server";

import { ChatUI } from "@/components/chatui";

export async function renderRoot() {
  return <ChatUI />;
}

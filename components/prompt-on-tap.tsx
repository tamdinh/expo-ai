"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback } from "react";
import { TouchableOpacityProps } from "react-native";
import TouchableBounce from "./ui/TouchableBounce";

// Helper to get API URL
function getApiUrl() {
  if (typeof window !== "undefined") {
    // Web: use relative URL
    return "/api/chat";
  }
  // Native: use localhost or your server URL
  const host = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8081";
  return `${host}/api/chat`;
}

export function PromptOnTap({
  prompt,
  onPress,
  ...props
}: { prompt: string | [string, string] } & TouchableOpacityProps) {
  const onPressPrompt = usePromptOnPress(prompt);
  return (
    <TouchableBounce
      {...props}
      sensory
      onPress={async (e) => {
        onPress?.(e);
        onPressPrompt();
      }}
    />
  );
}

function usePromptOnPress(prompt: string | [string, string]) {
  const { append } = useChat({
    api: getApiUrl(),
  });

  return useCallback(async () => {
    const [displayPrompt, detailedPrompt] = Array.isArray(prompt)
      ? prompt
      : [prompt, prompt];
    // Use append to send the message
    await append({
      role: "user",
      content: detailedPrompt,
    });
  }, [append, prompt]);
}

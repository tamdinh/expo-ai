"use client";

import { useChat } from "@ai-sdk/react";
import React from "react";
import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack } from "expo-router";
import { ChatToolbarInner } from "./chat-toolbar";
import { KeyboardFriendlyScrollView } from "./keyboard-friendly-scrollview";
import { HeaderButton } from "./ui/Header";
import { IconSymbol } from "./ui/IconSymbol";

import * as AC from "@bacons/apple-colors";

import { nanoid } from "@/util/nanoid";
import { tw } from "@/util/tw";
import { AnimatedLogo } from "./animated-logo";
import { ChatContainer } from "./chat-container";
import MarkdownText from "./markdown-text";
import { UserMessage } from "./user-message";
import { ToolInvocation } from "./tool-invocation";

const HEADER_HEIGHT = 0;

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

function MessagesScrollView({ messages }: { messages: ReturnType<typeof useChat>["messages"] }) {
  const { top } = useSafeAreaInsets();
  const textInputHeight = 8 + 36;

  return (
    <>
      <KeyboardFriendlyScrollView
        style={[{ flex: 1 }, tw`md:w-[768px] max-w-[768px] md:mx-auto`]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top + HEADER_HEIGHT + 24,
          paddingBottom: textInputHeight,
          gap: 16,
          flex: messages.length ? undefined : 1,
        }}
      >
        {messages.map((message) => (
          <View key={message.id}>
            {message.role === "user" ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <>
                {message.content && (
                  <MarkdownText done={message.finishReason !== null}>
                    {message.content}
                  </MarkdownText>
                )}
                {message.toolInvocations?.map((toolInvocation, index) => (
                  <ToolInvocation
                    key={`${toolInvocation.toolCallId}-${index}`}
                    toolInvocation={toolInvocation}
                  />
                ))}
              </>
            )}
          </View>
        ))}
      </KeyboardFriendlyScrollView>
      {messages.length === 0 && <AnimatedLogo />}
    </>
  );
}

export function ChatUI() {
  // Use a single useChat instance for the entire chat
  const chat = useChat({
    api: getApiUrl(),
  });

  const { messages, setMessages, input, setInput, handleSubmit, isLoading } = chat;

  return (
    <ChatContainer>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              {!!messages.length && (
                <HeaderButton
                  pressOpacity={0.7}
                  style={[
                    process.env.EXPO_OS === "web"
                      ? {
                          paddingHorizontal: 16,
                          alignItems: "center",
                          display: "flex",
                        }
                      : {
                          // Offset on the side so the margins line up. Unclear how to handle when this is used in headerLeft.
                          // We should automatically detect it somehow.
                          marginRight: -8,
                        },
                  ]}
                  onPress={() => {
                    setMessages([]);
                  }}
                >
                  <IconSymbol name="square.and.pencil" color={AC.label} />
                </HeaderButton>
              )}
            </>
          ),
        }}
      />

      <MessagesScrollView messages={messages} />

      <ChatToolbar
        messages={messages}
        setMessages={setMessages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </ChatContainer>
  );
}

function ChatToolbar({
  messages,
  setMessages,
  input,
  setInput,
  handleSubmit,
  isLoading,
}: {
  messages: ReturnType<typeof useChat>["messages"];
  setMessages: ReturnType<typeof useChat>["setMessages"];
  input?: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
}) {
  return (
    <ChatToolbarInner
      messages={messages}
      setMessages={setMessages}
      input={input}
      setInput={setInput}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}

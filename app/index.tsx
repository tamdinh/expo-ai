/// <reference types="react/canary" />

import { renderRoot } from "@/actions/render-root";
import { AnimatedLogo } from "@/components/animated-logo";
import { ChatContainer } from "@/components/chat-container";
import { ChatToolbarInner } from "@/components/chat-toolbar";
import React from "react";

export { ErrorBoundary } from "expo-router";

export default function Index() {
  return <React.Suspense fallback={<Loading />}>{renderRoot()}</React.Suspense>;
}

function Loading() {
  return (
    <ChatContainer
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedLogo />
      <ChatToolbarInner
        disabled
        messages={[]}
        setMessages={() => {}}
        input=""
        setInput={() => {}}
        handleSubmit={() => {}}
      />
    </ChatContainer>
  );
}

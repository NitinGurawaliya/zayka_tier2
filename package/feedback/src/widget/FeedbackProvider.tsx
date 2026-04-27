"use client";

import { createContext, useContext } from "react";
import type { FeedbackClient, FeedbackWidgetProps } from "../types/public";

interface FeedbackContextValue {
  client: FeedbackClient;
  mode: NonNullable<FeedbackWidgetProps["mode"]>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({
  client,
  mode,
  children,
}: {
  client: FeedbackClient;
  mode: NonNullable<FeedbackWidgetProps["mode"]>;
  children: unknown;
}) {
  return (
    <FeedbackContext.Provider value={{ client, mode }}>
      {children as React.ReactNode}
    </FeedbackContext.Provider>
  );
}

export function useFeedbackContext() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedbackContext must be used within FeedbackProvider.");
  }
  return context;
}

"use client";

import { useMemo } from "react";
import { createFeedbackClient } from "../api/createFeedbackClient";
import FeedbackFlow from "../components/FeedbackFlow";
import type { FeedbackWidgetProps } from "../types/public";
import { FeedbackProvider } from "./FeedbackProvider";

export function FeedbackWidget({
  restaurantId,
  client,
  restaurant = null,
  mode = "embedded",
  onSubmitted,
  onCompleted,
  onError,
  apiBaseUrl,
}: FeedbackWidgetProps) {
  const resolvedClient = useMemo(() => {
    if (client) {
      return client;
    }

    if (apiBaseUrl) {
      return createFeedbackClient({ baseUrl: apiBaseUrl });
    }

    throw new Error(
      "FeedbackWidget requires either `client` or `apiBaseUrl`."
    );
  }, [apiBaseUrl, client]);

  return (
    <FeedbackProvider client={resolvedClient} mode={mode}>
      <FeedbackFlow
        restaurantId={restaurantId}
        restaurant={restaurant}
        onSubmitted={onSubmitted}
        onCompleted={onCompleted}
        onError={onError}
      />
    </FeedbackProvider>
  );
}

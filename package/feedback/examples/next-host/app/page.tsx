"use client";

import { FeedbackWidget, createFeedbackClient } from "@nitin201/feedback-flow";
import "@nitin201/feedback-flow/styles.css";

const client = createFeedbackClient({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
});

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <FeedbackWidget
        restaurantId="demo-restaurant-id"
        mode="embedded"
        client={client}
      />
    </main>
  );
}

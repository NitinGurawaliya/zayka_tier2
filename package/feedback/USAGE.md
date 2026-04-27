# Usage Guide

This guide provides practical integration patterns for `@nitin201/feedback-flow`.

## Install

```bash
npm install @nitin201/feedback-flow
```

## Required backend endpoints

Your backend should expose:

- `GET /restaurant/details/:id`
- `POST /feedback/:restaurantId`
- `PATCH /feedback/:feedbackId`

## Minimal usage (fastest setup)

Use `apiBaseUrl` directly without creating a custom client.

```tsx
"use client";

import { FeedbackWidget } from "@nitin201/feedback-flow";
import "@nitin201/feedback-flow/styles.css";

export default function FeedbackSection() {
  return (
    <FeedbackWidget
      restaurantId="123"
      apiBaseUrl={process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}
      mode="fullPage"
    />
  );
}
```

## Usage with explicit client

Use this when you want control over HTTP behavior.

```tsx
"use client";

import { FeedbackWidget, createFeedbackClient } from "@nitin201/feedback-flow";
import "@nitin201/feedback-flow/styles.css";

const client = createFeedbackClient({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
});

export default function FeedbackSection() {
  return (
    <FeedbackWidget
      restaurantId="123"
      client={client}
      mode="embedded"
      onError={(error) => console.error("Feedback error:", error)}
    />
  );
}
```

## Next.js route by restaurant id (recommended)

### Server page: fetch details by `id`

```tsx
import { Suspense } from "react";
import type { RestaurantDetails } from "@nitin201/feedback-flow";
import FeedbackRouteClient from "./FeedbackRouteClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<FeedbackRouteClient restaurantId="demo" restaurant={null} />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: PageProps) {
  const { id } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  let restaurant: RestaurantDetails | null = null;

  if (backendUrl) {
    const response = await fetch(`${backendUrl}/restaurant/details/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      restaurant = {
        id,
        name: data?.info?.restaurantName,
        logo: data?.info?.logo,
        location: data?.info?.location,
        googlePlacedId: data?.info?.googlePlacedId ?? null,
      };
    }
  }

  return <FeedbackRouteClient restaurantId={id} restaurant={restaurant} />;
}
```

### Client component: render widget

```tsx
"use client";

import { FeedbackWidget, type RestaurantDetails } from "@nitin201/feedback-flow";
import "@nitin201/feedback-flow/styles.css";

export default function FeedbackRouteClient({
  restaurantId,
  restaurant,
}: {
  restaurantId: string;
  restaurant: RestaurantDetails | null;
}) {
  return (
    <FeedbackWidget
      restaurantId={restaurantId}
      restaurant={restaurant}
      apiBaseUrl={process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}
      mode="fullPage"
    />
  );
}
```

## Important props

- `restaurantId` (required): id used for submit API.
- `restaurant` (optional): pass `name/logo/location/googlePlacedId` for better UI.
- `client` (optional): prebuilt API client.
- `apiBaseUrl` (optional): simple alternative to `client`.
- `mode`: `"fullPage"` or `"embedded"`.
- `onSubmitted`, `onCompleted`, `onError`: lifecycle hooks.

## Troubleshooting

- **Shows “Restaurant” instead of name**
  - Ensure you pass `restaurant` with `name/logo/location`.
  - Verify `GET /restaurant/details/:id` returns expected payload.

- **No API call visible on submit**
  - Confirm `restaurantId` is valid and flow reached submit step.
  - Confirm `NEXT_PUBLIC_BACKEND_URL` is set in target app.

- **Network Error**
  - Check backend URL, CORS, and endpoint availability.

- **Rating images fail to load**
  - Package has emoji fallback; flow still works.

## Publish flow (package maintainer)

```bash
npm run build
npm run typecheck
npm pack
npm publish --access public
```

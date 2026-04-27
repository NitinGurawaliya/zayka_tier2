# @nitin201/feedback-flow

Reusable feedback submission widget for restaurant menu and feedback pages.

## Install

```bash
npm install @nitin201/feedback-flow
```

## Usage

```tsx
import { FeedbackWidget, createFeedbackClient } from "@nitin201/feedback-flow";
import "@nitin201/feedback-flow/styles.css";

const client = createFeedbackClient({
  baseUrl: "https://api.example.com",
});

export default function Page() {
  return (
    <FeedbackWidget
      restaurantId="123"
      client={client}
      mode="embedded"
    />
  );
}
```

## Publish

```bash
npm run build
npm run typecheck
npm pack
npm publish --access public
```

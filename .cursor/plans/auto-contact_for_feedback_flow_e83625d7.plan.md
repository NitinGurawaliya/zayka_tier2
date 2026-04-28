---
name: Auto-contact for feedback flow
overview: "Enhance @nitin201/feedback-flow so registered customers (identified by user_token cookie) don’t have to enter mobile number again: the widget will fetch customer mobile and auto-complete feedback contact step. Unregistered users keep the existing phone prompt."
todos:
  - id: align-endpoint-path
    content: Confirm the correct URL path for customer endpoint relative to apiBaseUrl (e.g. /api/user/me vs /user/me) and standardize in feedback client.
    status: pending
  - id: add-client-method
    content: Extend feedback-flow public types and client to support fetching current customer mobile using credentials.
    status: pending
  - id: auto-complete-negative
    content: Update ThankYouStep negative bottom sheet to auto-update feedback with fetched mobile when available; fallback to phone input when not.
    status: pending
  - id: cookie-support
    content: Ensure package http client sends cookies (axios withCredentials) so user_token is included cross-origin.
    status: pending
  - id: publish
    content: Bump package version, build/typecheck, npm pack verification, then publish.
    status: pending
isProject: false
---

## Goal
When a customer submits feedback from the menu flow, if they are already registered (have `user_token`), the feedback flow should **not ask for mobile**. Instead it should fetch the customer’s mobile using the token and mark the feedback as complete.

## Current behavior (what we saw)
- Menu registration sets cookie `user_token` in `[app/api/user/route.ts](c:\Users\USER\Desktop\projects\dineinn_tier2\app\api\user\route.ts)`.
- Customer info endpoint `[app/api/user/me/route.ts](c:\Users\USER\Desktop\projects\dineinn_tier2\app\api\user\me\route.ts)` returns `{ customer: { name, mobile } }` using `user_token`.
- Feedback submission in backend is `POST /feedback/:restaurantId` implemented as `[app/api/feedback/[id]/route.ts](c:\Users\USER\Desktop\projects\dineinn_tier2\app\api\feedback\[id]\route.ts)` (creates feedback and returns `feedbackId`).
- Feedback completion/contact is `PATCH /feedback/:feedbackId` in the same route, which currently accepts `{ customerContact, status: "COMPLETE" }`.
- In `@nitin201/feedback-flow`, the phone prompt lives in `ThankYouStep` (negative flow) and calls `client.updateFeedback(feedbackId, { customerContact, status: "COMPLETE" })`.

## Design (package-first)
### A) Add a small optional “customer identity” capability to the package client
Update `createFeedbackClient` in the package to support fetching the current customer:
- Add a new optional method on the `FeedbackClient` public type: `getCurrentCustomer?: () => Promise<{ mobile?: string | null } | null>`
- Implement it using the same baseUrl:
  - `GET {baseUrl}/user/me` (or `{baseUrl}/api/user/me` depending on your backend; we’ll align with your actual deployment path)
  - Must send cookies (see section C).

### B) Update the negative ThankYou step to auto-complete when user_token exists
In package `ThankYouStep` negative flow:
- On sheet open for negative feedback, attempt:
  - If `feedbackId` exists and `client.getCurrentCustomer` exists:
    - call `getCurrentCustomer()`
    - if response has `mobile`, immediately call `client.updateFeedback(feedbackId, { customerContact: mobile, status: "COMPLETE" })`
    - show a simple success message: “Done — owner will reach out shortly” and auto-close sheet after ~2s
- If `getCurrentCustomer` returns null/empty mobile (not registered), fall back to the existing phone input UI.

This achieves:
- Registered user: no phone entry.
- Unregistered user: same UX as today.

### C) Ensure requests include cookies (critical)
Right now the package’s default axios client does not guarantee cookies are included across origins.
Update the package HTTP layer (`defaultHttpClient` used by `createFeedbackClient`) to set:
- `withCredentials: true`

Also ensure your backend CORS allows credentials (your `middleware.ts` already sets `Access-Control-Allow-Credentials: true` and echoes `Origin`).

### D) (Optional improvement) also attach `customerId` in backend later
Your Prisma schema already supports `Feedback.customerId`.
Later, you can enhance `[app/api/feedback/[id]/route.ts](c:\Users\USER\Desktop\projects\dineinn_tier2\app\api\feedback\[id]\route.ts)` to decode `user_token` and set `customerId` at feedback creation time. This is not required for the package-first approach, but it improves analytics and joins.

## Files likely to change
- Package:
  - `package/feedback/src/types/public.ts` (extend `FeedbackClient` types)
  - `package/feedback/src/api/defaultHttpClient.ts` (set `withCredentials: true`)
  - `package/feedback/src/api/createFeedbackClient.ts` (add `getCurrentCustomer`)
  - `package/feedback/src/components/ThankYouStep.tsx` (auto-complete negative contact)
- App (only if needed to align endpoint path):
  - confirm whether customer endpoint is `/api/user/me` or `/user/me` from the same base URL the widget uses.

## Test plan
- On subdomain menu page, register a customer (sets `user_token`).
- Submit negative feedback.
  - Expected: no phone input shown; sheet quickly shows “Done — owner will reach out shortly” and closes.
  - Verify in DB: `Feedback.customerContact` is set.
- Clear cookies / unregistered user.
  - Expected: existing phone prompt appears; entering phone completes feedback.

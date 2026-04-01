# DineInn Tier2 — Backend Refactoring Guide (Step-by-step)

यह गाइड आपके Next.js App Router backend (`app/api/**`) को **सही, maintainable और secure** बनाने के लिए है। यह “step-by-step” क्रम में लिखा है ताकि आप हर बदलाव के बाद app चलाकर verify कर सकें।

> Scope: `app/`, `app/api/`, `app/lib/`, `lib/`, `prisma/`  
> मुख्य समस्याएँ: cookie semantics mismatch, plaintext passwords, duplicated patterns, noisy logging, unused deps.

---

## 0) Safety Setup (Before You Start)

- `git status` clean रखें।
- एक नई branch बनाएं (recommended): `refactor/backend-hardening`
- हर step के बाद:
  - app run: `npm run dev`
  - basic flows check:
    - signup → onboarding → dashboard
    - dashboard sections open (menu/edit-profile/analytics/gallery)
    - public menu via `/menu/[subdomain]`

---

## 1) Define the Identity Model (Fix the core bug first)

### Problem

Owner auth cookies में `userId` cookie `User.id` रखती है, लेकिन कई routes उसे `RestaurantDetail.id` मानकर Prisma queries चलाते हैं। इससे data correctness टूट सकती है।

### Goal

Backend में एक rule तय करें और हर जगह follow करें:

- **Owner cookie `userId` हमेशा `User.id` है**
- **Restaurant ID हमेशा `RestaurantDetail.id` है** और इसे server-side resolve किया जाएगा:
  - `RestaurantDetail` fetched via `where: { userId }`

### Action

1. एक server helper file बनाएं:
  - `app/lib/server/ownerContext.ts`
2. इसमें function लिखें:
  - `requireOwnerContext(req)` जो:
    - `token` cookie verify करे
    - `userId` cookie read करे
    - Prisma से `restaurant = prisma.restaurantDetail.findUnique({ where: { userId } })`
    - return: `{ userId, restaurantId: restaurant.id, restaurant }`

### Files to update later using this context

- `app/api/menu/route.ts`
- `app/api/menu/category/route.ts`
- `app/api/menu/dishes/[id]/route.ts`
- `app/api/restaurant/details/route.ts`
- `app/api/restaurant/qrcode/generate-qr/route.ts`
- `app/api/restaurant/images/`**
- `app/api/restaurant/announcements/route.ts`
- `app/api/menu/analytics/dish/route.ts`
- `app/api/restaurant/qrcode/analytics/route.ts`
- `app/api/restaurant/reviews/route.ts`
- `app/api/dashboard/route.ts`
- `app/api/user/route.ts` (GET side)

### Verify

- Signup → onboarding (creates restaurant) → dashboard opens successfully.
- Dashboard data uses correct restaurant (not “userId as restaurantId”).

---

## 2) Refactor `authMiddleware` (Make it consistent)

### Problem

`authMiddleware`:

- `decoded.id` को `userId` और `restaurantId` दोनों मान रहा है
- headers mutate करता है लेकिन routes उसे rely नहीं करते
- return shape `{ error: NextResponse }` awkward है

### Goal

Auth should be a clean building block:

- cookie `token` verify
- return decoded `userId`
- restaurant resolution अलग helper में (Step 1)

### Action

1. `app/lib/middleware/authMiddleware.ts` को simplify करें:
  - `verifyOwnerToken(req): { userId: number } | NextResponse`
2. Headers mutation हटाएं (optional but recommended).
3. सभी protected routes में pattern रखें:
  - `const ctx = await requireOwnerContext(req); if (ctx instanceof NextResponse) return ctx;`

### Verify

- Any protected endpoint without cookies returns 401 consistently.

---

## 3) Fix Password Security (Stop plaintext)

### Problem

`signin` plaintext match कर रहा है और `signup` plaintext store कर रहा है। `bcryptjs` dependency मौजूद है लेकिन use नहीं हो रही।

### Goal

- Signup: password hash store
- Signin: password compare hash से

### Action

1. `app/api/auth/signup/route.ts`
  - `bcryptjs.hash(password, 10)`
  - DB में hashed password store
2. `app/api/auth/signin/route.ts`
  - user fetch by email only
  - `bcryptjs.compare(inputPassword, user.password)`
3. Update README claims (optional) और remove misleading text if needed.

### Migration note

Existing users की passwords plaintext होंगी। Options:

- **Option A (fast)**: first login पर अगर stored password plaintext लगे तो migrate (compare direct, then hash+update).
- **Option B (clean)**: one-time script चलाकर migration.

### Verify

- New signup works, signin works, wrong password rejects.

---

## 4) Normalize API Responses + Zod Validation

### Problem

कुछ routes Zod use करते हैं, कुछ नहीं; errors inconsistent हैं।

### Goal

Uniform response shapes:

- Success: `{ data: ... }` या existing simple JSON
- Error: `{ msg: string, error?: any }` + proper HTTP status

### Action

1. हर route में:
  - `const body = await req.json().catch(() => null)`
  - Zod `safeParse`
  - `return NextResponse.json({ msg: "Invalid data", error: parsed.error.format() }, { status: 400 })`
2. Start with high-traffic endpoints:
  - auth (`/api/auth/*`)
  - onboarding
  - menu category/dishes
  - rating/reviews

### Verify

- Frontend still works (it often expects `msg`).

---

## 5) Remove Dead/Unused Imports + Debug Logs

### Problem

Lots of `console.log`/`console.error` in production paths; unused imports exist (example: `REQUEST_URL` in scan-count route).

### Goal

- Cleaner logs
- No unused imports

### Action

1. Remove unused imports in `app/api/`**.
2. Replace logs with:
  - minimal `console.error` only on server errors
  - or gated logging:
    - `if (process.env.NODE_ENV !== "production") console.log(...)`

### Verify

- No lint/type errors; endpoints still work.

---

## 6) Extract “Service Layer” (Code splitting for backend)

यह step आपकी “code splitting” सीख के हिसाब से सबसे useful है।

### Goal

Routes thin रहें; heavy logic reusable services में जाए।

### Suggested structure

- `app/lib/server/`
  - `ownerContext.ts` (Step 1)
  - `restaurantService.ts`
  - `menuService.ts`
  - `galleryService.ts`
  - `announcementService.ts`
  - `analyticsService.ts`

### What to move (examples)

- `app/api/dashboard/route.ts`
  - aggregation logic -> `analyticsService.getDashboardAggregate(restaurantId)`
- `app/api/restaurant/images/*`
  - upload/delete Cloudinary logic -> `galleryService`
- `app/api/restaurant/qrcode/*`
  - QR generate + scan tracking + analytics -> `analyticsService`

### Verify

- Each route remains the same externally (paths/inputs/outputs stable).

---

## 7) Fix Duplicate / Confusing Endpoints (De-risk product)

### Ratings duplication

You have both:

- `POST /api/restaurant/rating` (stars + message) — used by `FeedbackDialog`
- `POST /api/user/review` (rating + message) — used by `RatingDialog` (often commented in UI)

### Goal

Pick one canonical endpoint and deprecate the other.

### Action

- Option 1: Keep `/api/restaurant/rating` as canonical; remove `/api/user/review`.
- Option 2: Keep both but rename/align payloads to one schema.

### Verify

- Public feedback works and merchant reviews dashboard shows it.

---

## 8) Cloudinary Integration Cleanup

### Problem

Cloudinary config duplicated in multiple route files.

### Goal

Single config + helper functions:

- `uploadImageBase64(folder, publicId, base64)`
- `destroyImage(publicId)`

### Action

- Use `app/lib/cloudinaryConfig.ts` everywhere; remove per-route `cloudinary.config(...)` blocks.

---

## 9) Remove Unused Dependencies (Only after code is stable)

Based on current codebase scan:

- `next-auth` appears unused (dependency only)
- `express` unused
- `cors` unused
- `multer` + `multer-storage-cloudinary` unused

### Action

1. Confirm usage with search (no imports).
2. Remove from `package.json`.
3. Reinstall: `npm install`

### Note

`bcryptjs` is currently unused but **should be used** after Step 3 (so don’t remove it; instead start using it).

---

## 10) Optional: Add Minimal Tests (Fast sanity)

If you want fast regression checks:

- Auth check: `/api/auth/check` returns authenticated false without cookie.
- Signup+Signin flows (happy path).
- `scan-count` upsert works (no auth).
- Dish view tracking creates DishView and increments `viewsCount`.

You already have `vitest`; you can add a tiny suite for pure helpers (`analyticsRange`, context resolver).

---

## Recommended Refactor Order (TL;DR)

1. **Owner context resolver (userId → restaurantId)** (fix correctness)
2. **Simplify auth middleware usage**
3. **Password hashing & signin compare**
4. **Normalize validation + responses**
5. **Remove logs + dead imports**
6. **Service layer extraction (code splitting)**
7. **Unify duplicate rating endpoints**
8. **Cloudinary centralization**
9. **Remove unused deps**

---

## Appendix: Key Cookie Names

- Owner auth:
  - `token` (JWT)
  - `userId` (User.id as string)
- Customer capture:
  - `user_token` (JWT for Customer.id)


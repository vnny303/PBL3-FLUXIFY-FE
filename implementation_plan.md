# Refactoring Plan — PBL3-Fluxify Frontend

## Overview

The codebase has grown organically and has several structural issues. This plan organizes refactoring into 5 phases, from highest-impact to lowest-risk, to improve maintainability and scalability without breaking any existing functionality.

---

## Current Pain Points

| Issue | Affected Files | Severity |
|---|---|---|
| Monolithic [AppContext](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#99-100) mixing unrelated concerns | [AppContext.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx) | 🔴 High |
| Giant single-file pages (28–33 KB each) | [ProductDetail.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/ProductDetail.jsx), [Checkout.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Checkout.jsx), [OrderDetails.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/account/OrderDetails.jsx) | 🔴 High |
| Business logic embedded directly in components | [Header.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx), [Shop.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Shop.jsx) | 🟡 Medium |
| No constants/config file — magic strings everywhere | All files | 🟡 Medium |
| Notification state lives in [Header.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx) (wrong layer) | [Header.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx) | 🟡 Medium |
| Tailwind CSS v4 lint warnings unresolved | [Checkout.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Checkout.jsx), [Contact.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Contact.jsx), others | 🟢 Low |
| No subdirectory organization inside `components/` | `components/` | 🟢 Low |

---

## Proposed Changes

---

### Phase 1 — Split AppContext into Domain Contexts

[AppContext.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx) currently manages: cart, auth, modals, search, wishlist, quick-add, and product selection. Splitting into focused contexts makes each one testable and easier to maintain.

#### [MODIFY] [AppContext.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx)
- Keep as a **re-export barrel** — imports and re-exports from all child contexts + a combined [AppProvider](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#6-98).

#### [NEW] `src/contexts/CartContext.jsx`
- State: `cartItems`, `lastAddedItem`, `showCart`, `showAddToCartPopup`
- Functions: [addToCart](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#41-62), [removeFromCart](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#63-67), [updateQuantity](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#68-72)
- Derived: `cartTotal`, `cartCount`

#### [NEW] `src/contexts/AuthContext.jsx`
- State: `isLoggedIn`, `showModal`
- Functions: `setIsLoggedIn`, `setShowModal`

#### [NEW] `src/contexts/WishlistContext.jsx`
- State: `wishlistItems`
- Functions: [toggleWishlist](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#20-30), [isWishlisted](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#31-32)
- Derived: `wishlistCount`

#### [NEW] `src/contexts/SearchContext.jsx`
- State: `searchQuery`
- Functions: `setSearchQuery`

#### [NEW] `src/contexts/UIContext.jsx`
- State: `quickAddProduct`, `selectedProduct`
- Functions: `setQuickAddProduct`, `setSelectedProduct`, [handleQuickAdd](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/contexts/AppContext.jsx#33-40)

---

### Phase 2 — Extract Custom Hooks

Move business logic out of components into `hooks/`.

#### [NEW] `src/hooks/useNotifications.js`
Move notification state, [markAllAsRead](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx#38-41), and [handleNotificationClick](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx#42-49) out of [Header.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx).

#### [NEW] `src/hooks/useShopFilters.js`
Move `priceRange`, `selectedBrands`, `selectedSizes`, `sortBy`, `currentPage`, and `filteredProducts` logic out of [Shop.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Shop.jsx).

#### [MODIFY] [useLogin.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/hooks/useLogin.jsx)
- Minor: normalize to [.js](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/utils/data.js) extension (hooks don't return JSX).

#### [MODIFY] [useSignUp.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/hooks/useSignUp.jsx)
- Same as above.

---

### Phase 3 — Decompose Large Page Components

Break down giant files into smaller logical sub-components.

#### [MODIFY] [ProductDetail.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/ProductDetail.jsx) (32 KB)
Extract into:
- `src/components/product/ProductImageGallery.jsx`
- `src/components/product/ProductInfo.jsx` (price, ratings, variants)
- `src/components/product/ProductActions.jsx` (quantity, add to cart, wishlist)
- `src/components/product/ProductTabs.jsx` (Description, Specs, Reviews)
- `src/components/product/ReviewList.jsx`

#### [MODIFY] [Checkout.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Checkout.jsx) (32 KB)
Extract into:
- `src/components/checkout/CheckoutForm.jsx`
- `src/components/checkout/OrderSummary.jsx`
- `src/components/checkout/PaymentSection.jsx`
- `src/components/checkout/ShippingSection.jsx`

#### [MODIFY] [OrderDetails.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/account/OrderDetails.jsx) (28 KB)
Extract into:
- `src/components/order/OrderStatusTimeline.jsx`
- `src/components/order/OrderItemList.jsx`
- `src/components/order/OrderSummaryCard.jsx`

---

### Phase 4 — Centralize Constants & Configuration

#### [NEW] `src/utils/constants.js`
```js
// Navigation, Sort options, Filter options, Mock data flags, etc.
export const SORT_OPTIONS = ['Newest Arrivals', 'Price: Low to High', ...];
export const ITEMS_PER_PAGE = 12;
export const PRICE_RANGE_MIN = 0;
export const PRICE_RANGE_MAX = 500;
```

#### [MODIFY] [data.js](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/utils/data.js)
- Move notification mock data from [Header.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/layouts/Header.jsx) into [data.js](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/utils/data.js) or a dedicated `src/utils/mockNotifications.js`.

---

### Phase 5 — Housekeeping

#### Fix Tailwind CSS Lint Warnings
Replace deprecated classes in-place:
| Old class | New class | File |
|---|---|---|
| `flex-shrink-0` | `shrink-0` | [Checkout.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Checkout.jsx) (×3) |
| `flex-grow` | `grow` | [Checkout.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Checkout.jsx) (×3), [Contact.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Contact.jsx), [ProductDetail.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/ProductDetail.jsx), [Wishlist.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Wishlist.jsx) |
| `bg-gradient-to-br` | `bg-linear-to-br` | [Checkout.jsx](file:///d:/02_PROJECTS/PBL3-FLUXIFY/PBL3-Fluxify-FE/src/pages/Checkout.jsx) |

#### Reorganize `components/` into subdirectories
```
components/
  cart/         CartDrawer, AddToCartPopup
  product/      (new — from Phase 3)
  checkout/     (new — from Phase 3)
  order/        (new — from Phase 3)
  ui/           Button, Input, Checkbox, PasswordInput, Modal
  account/      Sidebar, AddressModal, ReviewModal
```

---

## Verification Plan

> [!IMPORTANT]
> This is a structural refactoring only. No new features, no logic changes. All tests verify existing behavior is preserved.

### Automated — Dev Server (run after each phase)
```bash
cd d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-FE
npm run dev
```
Verify: no console errors, hot reload works, all pages render.

### Manual Verification Checklist (run after all phases)

| Area | Test |
|---|---|
| Cart | Add item → CartDrawer opens → remove item → count updates |
| Auth | Login → `isLoggedIn` true → Logout → modal gone |
| Search | Type in Header search → Shop grid filters in real-time |
| Wishlist | Click ❤️ on ProductDetail → badge increments in Header |
| Notifications | Click bell → dropdown → "Mark all as read" clears badges |
| Checkout | Complete checkout flow end-to-end |
| Account | Navigate to My Orders, Saved Addresses, Profile Settings, Notifications |

---

## Recommended Execution Order

1. ✅ Phase 5 (Tailwind lint fixes) — lowest risk, immediate wins
2. Phase 4 (Constants) — no behavior change, just centralization
3. Phase 1 (Split contexts) — foundational, other phases depend on this
4. Phase 2 (Custom hooks) — after contexts are stable
5. Phase 3 (Decompose pages) — highest effort, do last

# Checkout & Customer Address Integration Status Report

**Generated Date**: 2026-05-05

## 1. Repository Snapshot
- **Current branch**: Unknown / not verified
- **Latest commit hash**: Unknown / not verified
- **Backend Path**: `d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-BE`
- **Frontend Path**: `d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-FE\apps\storefront`

## 2. Backend Address API State
- **File**: `Controllers/CustomerAddressesController.cs`
- **Route Attributes**: `[Route("api/customers/{customerId}/addresses")]`
- **Auth Attributes**: **NONE**. The controller is completely missing the `[Authorize]` attribute.
- **Endpoints**:
  - `[HttpGet] GetAddresses(Guid customerId)`
  - `[HttpGet("{id}")] GetAddressById(Guid id)`
  - `[HttpPost] CreateAddress(Guid customerId, [FromBody] CreateCustomerAddressDto dto)`
  - `[HttpPut("{id}")] UpdateAddress(Guid customerId, Guid id, [FromBody] UpdateCustomerAddressDto dto)`
  - `[HttpDelete("{id}")] DeleteAddress(Guid customerId, Guid id)`
  - `[HttpPatch("{id}/default")] SetDefault(Guid customerId, Guid id)`
- **Tenant Extraction (`GetTenantId`)**: It attempts to read from `HttpContext.Items["TenantId"]`. If missing, it throws a raw `Exception("TenantId is not available.")`, which directly causes the **500 Internal Server Error** you are seeing.
- **User Validation**: It does not read JWT claims for `userId` and therefore cannot validate if the route's `{customerId}` matches the currently logged-in user.

## 3. Backend Auth Claim State
- **File**: `Controllers/AuthController.cs`
- **`/api/Auth/me` Endpoint**: Requires `[Authorize]`. It correctly extracts the `tenantId` claim using `User.FindFirst("tenantId")?.Value`.
- **JWT Generation**: The token includes `tenantId` as a standard claim during login.
- **Mismatch Found**: While `AuthController` and `CustomerOrdersController` successfully extract `tenantId` from JWT Claims via `User.FindFirst()`, the `CustomerAddressesController` incorrectly attempts to read it from `HttpContext.Items`, which is never populated by any middleware in `Program.cs`.

## 4. Backend Checkout State
- **Controller**: `CustomerOrdersController`
  - Correctly uses `[Authorize(Roles = "customer")]`.
  - Correctly extracts `userId` and `tenantId` via `User.FindFirstValue()`.
- **Route**: `POST /api/customer/orders/checkout`
- **DTO (`CheckoutOrderRequestDto`)**:
  - Requires `Guid AddressId` (No longer a string `Address` text).
  - Requires `string ShippingMethod` ("standard" or "express").
- **Persistence (`OrderService.CheckoutAsync`)**:
  - Fetches Cart and Product SKUs.
  - **Recent Fix**: The code now correctly generates the `Order.Id` (`var newOrderId = Guid.NewGuid();`) *before* iterating over cart items. It successfully assigns `OrderId = newOrderId` to each `OrderItem` before passing the entire object to `_orderRepository.CreateOrderAsync()`. 
  - **Transaction**: The repository uses `_context.SaveChangesAsync()`, which automatically wraps the Order and OrderItems inserts in a single DB transaction.
  - **FK Error**: The previously mentioned `FK_order_items_orders_order_id` is now structurally resolved in the code.

## 5. Backend API Routes Confirmed
| Method | Path | Auth Required | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/Auth/me` | `[Authorize]` | None |
| `GET` | `/api/customers/{customerId}/addresses` | **NONE** (Bug) | None |
| `POST` | `/api/customers/{customerId}/addresses` | **NONE** (Bug) | `CreateCustomerAddressDto` |
| `PUT` | `/api/customers/{customerId}/addresses/{id}`| **NONE** (Bug) | `UpdateCustomerAddressDto` |
| `DELETE`| `/api/customers/{customerId}/addresses/{id}`| **NONE** (Bug) | None |
| `POST` | `/api/customer/orders/checkout` | `[Authorize(Roles = "customer")]` | `CheckoutOrderRequestDto` |

## 6. Frontend Storefront State
- **File**: `apps/storefront/.env`
  - `VITE_API_URL=http://localhost:5119`
  - `VITE_ENABLE_CUSTOMER_ADDRESSES_MOCK=true`
  - `VITE_ENABLE_BANK_TRANSFER_MOCK=true`
  - `VITE_ENABLE_ORDER_CONFIRMATION_FALLBACK=true`
- **Address Service (`addressService.js`)**: Currently serving mock data from `localStorage` because the mock flag is enabled. The mock address ID was recently updated from `"mock-addr-1"` to a valid UUID string (`"11111111-1111-1111-1111-111111111111"`) to prevent ASP.NET Model Binding 400 errors.
- **Order Service (`orderService.js`)**: 
  - Strictly maps the payload to `{ addressId, paymentMethod, orderNote, shippingMethod }`.
  - Removes the `finalAddress` text string from the API payload entirely.
  - Automatically converts `BankTransfer` to `COD` for the API request, then restores it locally for the UI.

## 7. Database Assumptions Needed by Code
Based on the Entity models:
- **`orders.address_id`** → Foreign Key to **`customer_addresses.id`**
- **`order_items.order_id`** → Foreign Key to **`orders.id`**
- **`cart_items.product_sku_id`** → Foreign Key to **`product_skus.id`**

## 8. Current Blockers
### Blocker 1: `CustomerAddressesController` Cannot Read `tenantId`
- **Evidence**: `GetTenantId()` method uses `HttpContext.Items["TenantId"]`.
- **Symptom**: `GET /api/customers/{customerId}/addresses` returns **500 Internal Server Error**.
- **Root Cause**: There is no custom middleware injecting `TenantId` into `HttpContext.Items`. It should be reading from JWT claims.
- **Target**: Backend `CustomerAddressesController.cs`.

### Blocker 2: Address API Security Vulnerability
- **Evidence**: Missing `[Authorize]` attributes in `CustomerAddressesController`.
- **Symptom**: Unauthenticated users could theoretically call the endpoints.
- **Root Cause**: Missing standard `[Authorize]` decorators and claim checks.
- **Target**: Backend `CustomerAddressesController.cs`.

## 9. Recommended Ordered Plan
1. **Fix CustomerAddressesController Auth**: Add `[Authorize(Roles = "customer")]` to the class.
2. **Fix Tenant Extraction**: Replace the `GetTenantId()` method with claim extraction logic (e.g., `User.FindFirstValue("tenantId")`), exactly as done in `CustomerOrdersController`.
3. **Verify API Locally**: Test GET and POST addresses via Swagger/Scalar.
4. **Disable Mock Address**: Change `VITE_ENABLE_CUSTOMER_ADDRESSES_MOCK=false` in the frontend `.env` and restart Vite.
5. **Test Live Checkout**: Perform an end-to-end checkout with a newly created real address to confirm the `address_id` Foreign Key binds successfully.

---

## 10. Appendix: Exact Snippets

### `CustomerAddressesController.GetTenantId()`
```csharp
// d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-BE\Controllers\CustomerAddressesController.cs
private Guid GetTenantId()
{
    if (HttpContext.Items["TenantId"] is Guid tenantId)
        return tenantId;
    throw new Exception("TenantId is not available."); // CAUSES 500 ERROR
}
```

### `CustomerOrdersController` Claim Reading (Correct Approach)
```csharp
// d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-BE\Controllers\CustomerOrdersController.cs
if (!Guid.TryParse(User.FindFirstValue("userId"), out var customerId) ||
    !Guid.TryParse(User.FindFirstValue("tenantId"), out var tenantId))
    return Unauthorized(new { message = "Token không hợp lệ" });
```

### `OrderService.CheckoutAsync` (Recently Fixed)
```csharp
// d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-BE\Services\Implementations\OrderService.cs
var newOrderId = Guid.NewGuid();

foreach (var cartItem in cartItems)
{
    // ...
    orderItems.Add(new Models.OrderItem
    {
        Id = Guid.NewGuid(),
        OrderId = newOrderId, // Explicitly assigned to prevent FK violation
        ProductSkuId = cartItem.ProductSkuId,
        Quantity = cartItem.Quantity,
        UnitPrice = sku.Price
    });
}
```

### Frontend `orderService.checkout` Payload
```javascript
// d:\02_PROJECTS\PBL3-FLUXIFY\PBL3-Fluxify-FE\apps\storefront\src\shared\api\orderService.js
const body = {
    addressId,
    paymentMethod: actualPaymentMethod,
    orderNote: orderNote || null,
    shippingMethod: normalizedShippingMethod
};
```

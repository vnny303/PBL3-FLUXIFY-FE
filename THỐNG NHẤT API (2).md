**API Specification (chuẩn hóa)**  
**Stack**: ASP.NET Core 10 · Entity Framework Core · SQL Server · JWT Bearer  
**Base URL**: `http://localhost:5119` (dev) / `https://api.fluxify.io` (prod)

**[1\. Conventions	4](#conventions)**

[Headers	4](#headers)

[Response thành công (hiện tại — trả thẳng object/array)	4](#response-thành-công-\(hiện-tại-—-trả-thẳng-object/array\))

[Response lỗi	4](#response-lỗi)

[**2\. Auth Rules tổng quát	5**](#auth-rules-tổng-quát)

[JWT Claims	5](#jwt-claims)

[Phân quyền theo vai trò	5](#phân-quyền-theo-vai-trò)

[Pattern kiểm tra owner (dùng trong nhiều controller)	5](#pattern-kiểm-tra-owner-\(dùng-trong-nhiều-controller\))

[**3\. Query Parameters — Pagination / Sort / Filter	6**](#query-parameters-—-pagination-/-sort-/-filter)

[3.1 QueryBase (dùng chung cho tất cả)	6](#querybase-\(dùng-chung-cho-tất-cả\))

[3.2 Query theo từng endpoint	6](#query-theo-từng-endpoint)

[Tenants — GET /api/tenants/me	6](#tenants-—-get-/api/tenants/me)

[Customers — GET /api/tenants/{tenantId}/customers	7](#customers-—-get-/api/tenants/{tenantid}/customers)

[Categories — GET /api/tenants/{tenantId}/categories	7](#categories-—-get-/api/tenants/{tenantid}/categories)

[Products — GET /api/tenants/{tenantId}/products	8](#products-—-get-/api/tenants/{tenantid}/products)

[Orders — GET /api/tenants/{tenantId}/orders	9](#orders-—-get-/api/tenants/{tenantid}/orders)

[3.3 Lưu ý quan trọng về pagination	10](#lưu-ý-quan-trọng-về-pagination)

[**4\. Auth — /api/auth	10**](#auth-—-/api/auth)

[POST /api/auth/merchant/register	10](#post-/api/auth/merchant/register)

[POST /api/auth/merchant/login	12](#post-/api/auth/merchant/login)

[POST /api/auth/customer/register	13](#post-/api/auth/customer/register)

[POST /api/auth/customer/login	14](#post-/api/auth/customer/login)

[GET /api/auth/me	16](#get-/api/auth/me)

[PUT /api/auth/customers/{customerId}	16](#put-/api/auth/customers/{customerid})

[POST /api/auth/logout	18](#post-/api/auth/logout)

[**5\. Tenants — /api/tenants	18**](#tenants-—-/api/tenants)

[GET /api/tenants	19](#get-/api/tenants)

[GET /api/tenants/{id}	19](#get-/api/tenants/{id})

[GET /api/tenants/subdomain/{subdomain}	20](#get-/api/tenants/subdomain/{subdomain})

[POST /api/tenants	20](#post-/api/tenants)

[PUT /api/tenants/{id}	21](#put-/api/tenants/{id})

[DELETE /api/tenants/{id}	23](#delete-/api/tenants/{id})

[**6\. Customers — /api/tenants/{tenantId}/customers	23**](#customers-—-/api/tenants/{tenantid}/customers)

[GET /api/tenants/{tenantId}/customers	23](#get-/api/tenants/{tenantid}/customers)

[GET /api/tenants/{tenantId}/customers/{customerId}	25](#get-/api/tenants/{tenantid}/customers/{customerid})

[GET /api/tenants/{tenantId}/customers/email/{email}	26](#get-/api/tenants/{tenantid}/customers/email/{email})

[GET /api/tenants/{tenantId}/customers/cart/{cartId}	26](#get-/api/tenants/{tenantid}/customers/cart/{cartid})

[DELETE /api/tenants/{tenantId}/customers/{customerId}	27](#delete-/api/tenants/{tenantid}/customers/{customerid})

[**7\. Categories — /api/tenants/{tenantId}/categories	27**](#categories-—-/api/tenants/{tenantid}/categories)

[GET /api/tenants/{tenantId}/categories	27](#get-/api/tenants/{tenantid}/categories)

[GET /api/tenants/{tenantId}/categories/{id} (đề xuất — nên thêm)	28](#get-/api/tenants/{tenantid}/categories/{id}-\(đề-xuất-—-nên-thêm\))

[POST /api/tenants/{tenantId}/categories	29](#post-/api/tenants/{tenantid}/categories)

[PUT /api/tenants/{tenantId}/categories/{id}	30](#put-/api/tenants/{tenantid}/categories/{id})

[DELETE /api/tenants/{tenantId}/categories/{id}	31](#delete-/api/tenants/{tenantid}/categories/{id})

[**8\. Products — /api/tenants/{tenantId}/products	32**](#products-—-/api/tenants/{tenantid}/products)

[Cấu trúc JSON Product	32](#cấu-trúc-json-product)

[GET /api/tenants/{tenantId}/products	33](#get-/api/tenants/{tenantid}/products)

[GET /api/tenants/{tenantId}/products/{id}	34](#get-/api/tenants/{tenantid}/products/{id})

[POST /api/tenants/{tenantId}/products	34](#post-/api/tenants/{tenantid}/products)

[PUT /api/tenants/{tenantId}/products/{id}	37](#put-/api/tenants/{tenantid}/products/{id})

[DELETE /api/tenants/{tenantId}/products/{id}	38](#delete-/api/tenants/{tenantid}/products/{id})

[GET /api/tenants/{tenantId}/products/{id}/skus	38](#get-/api/tenants/{tenantid}/products/{id}/skus)

[POST /api/tenants/{tenantId}/products/{id}/skus	39](#post-/api/tenants/{tenantid}/products/{id}/skus)

[PUT /api/tenants/{tenantId}/products/{id}/skus/{skuId}	40](#put-/api/tenants/{tenantid}/products/{id}/skus/{skuid})

[DELETE /api/tenants/{tenantId}/products/{id}/skus/{skuId}	41](#delete-/api/tenants/{tenantid}/products/{id}/skus/{skuid})

[**9\. Cart — /api/tenants/{tenantId}/customers/{customerId}/cart	42**](#cart-—-/api/cart)

[GET /api/tenants/{tenantId}/customers/{customerId}/cart	42](#get-/api/cart)

[POST /api/tenants/{tenantId}/customers/{customerId}/cart	43](#post-/api/tenants/{tenantid}/customers/{customerid}/cart)

[GET /api/tenants/{tenantId}/customers/{customerId}/cart/items	43](#get-/api/tenants/{tenantid}/customers/{customerid}/cart/items)

[POST /api/tenants/{tenantId}/customers/{customerId}/cart/items	44](#post-/api/cart/items)

[PUT /api/tenants/{tenantId}/customers/{customerId}/cart/items/{id}	46](#put-/api/cart/items/{itemid})

[DELETE /api/tenants/{tenantId}/customers/{customerId}/cart/items/{id}	47](#delete-/api/cart/items/{id})

[DELETE /api/tenants/{tenantId}/customers/{customerId}/cart/items	47](#delete-/api/cart/items)

[**10\. Orders — /api/tenants/{tenantId}/orders	48**](#orders-—-/api/tenants/{tenantid}/orders)

[MERCHANT ORDERS	48](#merchant-orders)

[GET /api/tenants/{tenantId}/orders	48](#get-/api/tenants/{tenantid}/orders)

[GET /api/tenants/{tenantId}/orders/{id}	49](#get-/api/tenants/{tenantid}/orders/{id})

[POST /api/tenants/{tenantId}/orders	50](#post-/api/tenants/{tenantid}/orders)

[PUT /api/tenants/{tenantId}/orders/{id}/status	52](#put-/api/tenants/{tenantid}/orders/{id}/status)

[DELETE /api/tenants/{tenantId}/orders/{id}	53](#delete-/api/tenants/{tenantid}/orders/{id})

[CUSTOMER ORDERS	54](#customer-orders)

[GET /api/tenants/{tenantId}/orders/customers/{customerId}	54](#get-/api/customers/orders)

[GET /api/tenants/{tenantId}/orders/{orderId}/customers/{customerId}	54](#get-/api/customers/orders/{orderid})

[POST /api/tenants/{tenantId}/order/customers/{customerId}/checkout	55](#post-/api/customers/orders/checkout)

[PUT /api/tenants/{tenantId}/orders/{orderId}/customers/{customerId}/cancel (Optional)	57](#put-/api/customers/orders/{orderid}/cancel-\(optional\))

[**11\. Admin — /api/admin ⚠️ Test Only	57**](#admin-—-/api/admin-⚠️-test-only)

[⚠️ QUAN TRỌNG — ĐỌC TRƯỚC KHI DÙNG	57](#⚠️-quan-trọng-—-đọc-trước-khi-dùng)

[GET /api/admin/platformUsers	58](#get-/api/admin/platformusers)

[DELETE /api/admin/platformUsers/{id}	60](#delete-/api/admin/platformusers/{id})

[**12\. Luồng truy cập sản phẩm: Merchant vs Customer	61**](#luồng-truy-cập-sản-phẩm:-merchant-vs-customer)

[Luồng 1: Merchant quản lý sản phẩm	61](#luồng-1:-merchant-quản-lý-sản-phẩm)

[Luồng 2: Customer xem sản phẩm (Storefront)	62](#luồng-2:-customer-xem-sản-phẩm-\(storefront\))

[⚠️ Lưu ý quan trọng về phân quyền hiện tại	63](#⚠️-lưu-ý-quan-trọng-về-phân-quyền-hiện-tại)

[**13\. Error Codes Summary	63**](#error-codes-summary)

1. # **Conventions** {#conventions}

### **Headers** {#headers}

Authorization: Bearer \<jwt\_token\>  
Content-Type: application/json

### **Response thành công (hiện tại — trả thẳng object/array)** {#response-thành-công-(hiện-tại-—-trả-thẳng-object/array)}

Các endpoint hiện tại trả trực tiếp object hoặc array, **không có wrapper**. Ví dụ:

json  
{ "id": "...", "email": "..." }

hoặc

json  
\[{ "id": "..." }, { "id": "..." }\]

### **Response lỗi** {#response-lỗi}

json  
{ "message": "Mô tả lỗi ngắn gọn" }

Hoặc khi có lỗi hệ thống:

json  
{  
  "message": "Lỗi khi thực hiện thao tác",  
  "error": "Exception message",  
  "innerError": "Inner exception message nếu có"  
}

Khi validation fail (ModelState):

json  
{  
  "errors": {  
    "Email": \["Email không hợp lệ"\],  
    "Password": \["Mật khẩu phải có ít nhất 6 ký tự"\]  
  }  
}

---

2. # **Auth Rules tổng quát** {#auth-rules-tổng-quát}

### **JWT Claims** {#jwt-claims}

Sau khi đăng nhập thành công, JWT token chứa các claims:

| Claim | Giá trị | Dùng để |
| ----- | ----- | ----- |
| `userId` | GUID của PlatformUser hoặc Customer | Xác định identity |
| `email` | Email | Thông tin hiển thị |
| `role` | `"merchant"` hoặc `"customer"` | Phân quyền |
| `tenantId` | GUID của Tenant | Biết customer thuộc store nào (không cần đối với merchant) |

### **Phân quyền theo vai trò** {#phân-quyền-theo-vai-trò}

| Role | Là ai | Quyền |
| ----- | ----- | ----- |
| `merchant` | Chủ shop (PlatformUser) | CRUD toàn bộ dữ liệu của tenant mình |
| `customer` | Khách mua hàng | Xem sản phẩm, quản lý giỏ hàng, đặt hàng của chính mình |
| *(no auth)* | Khách vãng lai | Xem thông tin store, danh mục, sản phẩm (public) |

### **Pattern kiểm tra owner (dùng trong nhiều controller)** {#pattern-kiểm-tra-owner-(dùng-trong-nhiều-controller)}

Các endpoint yêu cầu là "tenant owner" đều thực hiện theo pattern:

1\. Lấy userId từ JWT claim "userId"  
2.Gọi \_tenantRepository.IsTenantOwner(tenantId, userId) → false → 403

3. # **Query Parameters — Pagination / Sort / Filter** {#query-parameters-—-pagination-/-sort-/-filter}

Tất cả endpoint GET list đều hỗ trợ query object kế thừa từ `QueryBase`. Các param được đặt tên nhất quán.

1. ## **QueryBase (dùng chung cho tất cả)** {#querybase-(dùng-chung-cho-tất-cả)}

| Param | Kiểu | Default | Mô tả |
| ----- | ----- | ----- | ----- |
| `page` | int | `1` | Trang hiện tại (\>= 1\) |
| `pageSize` | int | `10` | Số item mỗi trang (1–100, tối đa 100\) |
| `sortBy` | string | *(tùy endpoint)* | Tên field để sắp xếp |
| `sortDir` | string | `"asc"` | Hướng sort: `"asc"` hoặc `"desc"` |
| `search` | string | — | Tìm kiếm tổng quát theo nhiều field |

2. ## **Query theo từng endpoint** {#query-theo-từng-endpoint}

### **Tenants — `GET /api/tenants/me`** {#tenants-—-get-/api/tenants/me}

| Param | Kiểu | Mô tả |
| ----- | ----- | ----- |
| `storeName` | string | Lọc theo tên store (contains) |
| `subdomain` | string | Lọc theo subdomain (contains) |
| `isActive` | bool | Lọc theo trạng thái |
| `sortBy` | string | `"storeName"`, `"subdomain"`, `"isActive"`, `"id"` |

**Ví dụ**:

GET /api/tenants/me?page=1\&pageSize=5\&sortBy=storeName\&sortDir=asc\&isActive=true

**Axios**:

javascript  
const res \= await axios.get('/api/tenants/me', {  
  params: { page: 1, pageSize: 5, sortBy: 'storeName', sortDir: 'asc', isActive: true },  
  headers: { Authorization: \`Bearer ${token}\` }  
});  
---

### **Customers — `GET /api/tenants/{tenantId}/customers`** {#customers-—-get-/api/tenants/{tenantid}/customers}

| Param | Kiểu | Mô tả |
| ----- | ----- | ----- |
| `email` | string | Lọc chính xác theo email |
| `isActive` | bool | Lọc theo trạng thái |
| `createdFrom` | datetime | Lọc từ ngày tạo |
| `createdTo` | datetime | Lọc đến ngày tạo |
| `search` | string | Tìm theo email (contains) |
| `sortBy` | string | `"email"`, `"createdAt"` |

**Ví dụ**:

GET /api/tenants/{id}/customers?page=1\&pageSize=20\&email=abc@gmail.com  
GET /api/tenants/{id}/customers?search=gmail\&sortBy=createdAt\&sortDir=desc

**Axios**:

javascript  
const res \= await axios.get(\`/api/tenants/${tenantId}/customers\`, {  
  params: { page: 1, pageSize: 20, search: 'gmail', sortBy: 'createdAt', sortDir: 'desc' },  
  headers: { Authorization: \`Bearer ${token}\` }  
});  
---

### **Categories — `GET /api/tenants/{tenantId}/categories`** {#categories-—-get-/api/tenants/{tenantid}/categories}

| Param | Kiểu | Mô tả |
| ----- | ----- | ----- |
| `name` | string | Lọc theo tên (contains) |
| `description` | string | Lọc theo mô tả (contains) |
| `isActive` | bool | Lọc theo trạng thái |
| `search` | string | Tìm theo `name` hoặc `description` |
| `sortBy` | string | `"name"`, `"description"`, `"isActive"`, `"id"` |

**Ví dụ**:

GET /api/tenants/{id}/categories?isActive=true\&sortBy=name\&sortDir=asc  
GET /api/tenants/{id}/categories?search=áo\&page=1\&pageSize=10

**Axios**:

javascript  
// Lấy categories đang active  
const res \= await axios.get(\`/api/tenants/${tenantId}/categories\`, {  
  params: { isActive: true, sortBy: 'name', sortDir: 'asc' }  
});  
---

### **Products — `GET /api/tenants/{tenantId}/products`** {#products-—-get-/api/tenants/{tenantid}/products}

| Param | Kiểu | Mô tả |
| ----- | ----- | ----- |
| `name` | string | Lọc theo tên sản phẩm (contains) |
| `categoryId` | GUID | **Lọc theo danh mục** |
| `hasAttributes` | bool | `true` \= có attributes, `false` \= không có |
| `search` | string | Tìm theo `name` hoặc `description` |
| `sortBy` | string | `"name"`, `"categoryId"`, `"id"` |

**Ví dụ**:

GET /api/tenants/{id}/products?categoryId=11111111-1111-4111-8111-111111111111  
GET /api/tenants/{id}/products?search=áo\&sortBy=name\&sortDir=asc\&page=1\&pageSize=12  
GET /api/tenants/{id}/products?hasAttributes=true\&categoryId=xxx

**Axios — Lấy products theo category (dùng cho storefront)**:

javascript  
const res \= await axios.get(\`/api/tenants/${tenantId}/products\`, {  
  params: {  
    categoryId: selectedCategoryId,  
    page: 1,  
    pageSize: 12,  
    sortBy: 'name',  
    sortDir: 'asc'  
  }  
});

**Axios — Search sản phẩm**:

javascript  
const res \= await axios.get(\`/api/tenants/${tenantId}/products\`, {  
  params: { search: keyword, page: currentPage, pageSize: 12 }  
});  
---

### **Orders — `GET /api/tenants/{tenantId}/orders`** {#orders-—-get-/api/tenants/{tenantid}/orders}

| Param | Kiểu | Mô tả |
| ----- | ----- | ----- |
| `customerId` | GUID | Lọc theo customer |
| `status` | string | Lọc theo trạng thái đơn (`"Pending"`, `"Confirmed"`, ...) |
| `paymentMethod` | string | Lọc theo phương thức thanh toán |
| `paymentStatus` | string | Lọc theo trạng thái thanh toán |
| `totalFrom` | decimal | Lọc từ tổng tiền |
| `totalTo` | decimal | Lọc đến tổng tiền |
| `createdFrom` | datetime | Lọc từ ngày tạo |
| `createdTo` | datetime | Lọc đến ngày tạo |
| `search` | string | Tìm theo `address`, `status`, GUID của order/customer |
| `sortBy` | string | `"createdAt"`, `"totalAmount"`, `"status"`, `"paymentStatus"`, `"id"` |

**Default sort**: `createdAt desc` (mới nhất trước).

**Ví dụ**:

GET /api/tenants/{id}/orders?status=Pending\&page=1\&pageSize=20  
GET /api/tenants/{id}/orders?createdFrom=2026-04-01\&createdTo=2026-04-30\&sortBy=totalAmount\&sortDir=desc  
GET /api/tenants/{id}/orders?customerId=xxx\&status=Delivered

**Axios**:

javascript  
const res \= await axios.get(\`/api/tenants/${tenantId}/orders\`, {  
  params: {  
    status: 'Pending',  
    page: 1,  
    pageSize: 20,  
    sortBy: 'createdAt',  
    sortDir: 'desc'  
  },  
  headers: { Authorization: \`Bearer ${token}\` }  
});  
---

3. ## **Lưu ý quan trọng về pagination** {#lưu-ý-quan-trọng-về-pagination}

Hiện tại các endpoint **trả mảng trực tiếp** — không có wrapper `{ data, pagination }`. Nếu cần biết tổng số records để render phân trang ở FE, cần bổ sung thêm `total` vào response sau.

javascript  
// Cách xử lý tạm ở FE khi chưa có total:  
// Nếu kết quả trả về \< pageSize → đây là trang cuối  
const isLastPage \= data.length \< pageSize;

4. #  **Auth — `/api/auth`** {#auth-—-/api/auth}

---

### **POST `/api/auth/merchant/register`** {#post-/api/auth/merchant/register}

**Auth**: Không yêu cầu  
**Mô tả**: Đăng ký tài khoản merchant và tạo tenant (cửa hàng) đầu tiên của merchant đồng thời trong một request.  
**Hạn chế:** Nếu merchant muốn tạo thêm một tenant mới thì phải login (/merchant/login) rồi tạo (POST /tenant), chứ không được đăng ký lại tài khoản

**Request Body**:

json  
{  
  "fullName": "Van Ngoc Nhu Y",  
  "email": "vanngocnhuy30032006@gmail.com",  
  "password": "Abc@1234",  
  "storeName": "Van Ngoc Nhu Y Store",  
  "subdomain": "vanngocnhuy30032006"  
}

**Validation** (hiện tại chưa có DataAnnotations, cần bổ sung):

| Field | Rule |
| ----- | ----- |
| `fullName` | Required |
| `email` | Required, format email hợp lệ, unique toàn platform |
| `password` | Required |
| `storeName` | Required |
| `subdomain` | Required, chỉ `[a-z0-9-]`, unique toàn platform |

**Response 200**:

json  
{  
  "message": "Đăng ký thành công\!",  
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  
  "userId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "email": "vanngocnhuy30032006@gmail.com",  
  "role": "merchant",  
  "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
  "subdomain": "vanngocnhuy30032006"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Email đã tồn tại trong hệ thống |
| `400` | Subdomain đã có người dùng |

---

### **POST `/api/auth/merchant/login`** {#post-/api/auth/merchant/login}

**Auth**: Không yêu cầu

**Request Body**:

json  
{  
  "email": "vanngocnhuy30032006@gmail.com",  
  "password": "Abc@1234"  
}

**Validation** (hiện tại chưa có DataAnnotations):

| Field | Rule |
| ----- | ----- |
| `email` | Required |
| `password` | Required |

**Logic**:

1. Tìm PlatformUser có **`email`** khớp VÀ **`role = "merchant"`**, Include luôn **`Tenants`**  
2. Verify password bằng BCrypt  
3. Response trả về array **`tenants`** để frontend biết merchant sở hữu store nào

**Response 200**:

json  
{  
  "message": "Đăng nhập thành công\!",  
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  
  "userId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "email": "vanngocnhuy30032006@gmail.com",  
  "role": "merchant",  
  "tenants": \[  
    {  
      "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
      "subdomain": "vanngocnhuy30032006"  
    },  
    {  
      "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
      "subdomain": "second-store"  
    }  
  \]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Email hoặc mật khẩu không đúng, hoặc không phải merchant |

---

### **POST `/api/auth/customer/register`** {#post-/api/auth/customer/register}

**Auth**: Không yêu cầu  
 **Mô tả**: Customer đăng ký tài khoản trong một store cụ thể (xác định qua subdomain). **Tự động tạo Cart** cho customer sau khi đăng ký thành công.  
**Lý do tạo Cart tự động**: Không hợp lý khi customer đăng ký xong mà không có giỏ hàng — phải gọi thêm API riêng để tạo. Cart nên được tạo cùng lúc với customer.  
**Về `POST /tenants/{tenantId}/customers`**: Endpoint này trong CustomersController ban đầu dùng để tạo customer (kèm auto-create Cart). Nay logic đó được chuyển vào đây. CustomersController chỉ còn phục vụ merchant **xem** thông tin customers (không tạo mới).  
**Về `subdomain` trong request**: `subdomain` được truyền qua **query parameter** (không phải body). Trong C\#, hàm nhận `[FromQuery] string subdomain` — đây là lý do URL phải kèm `?subdomain=xxx`.

**Cách gọi đúng**:

POST api/Auth/customer/register?subdomain=pbl3-shop

**Trong code C\#**:

\[HttpPost("customer/register")\]  
public async Task\<IActionResult\> LoginCustomer(\[FromQuery\] string subdomain, RegisterCustomerRequest request)

**Request Body**:  
json  
{  
  "email": "dieuhoale6406@gmail.com",  
  "password": "Abc@1234",  
}

**Axios**:

javascript

const res \= await axios.post('/api/auth/customer/register', { email, password }, {  
  params: { subdomain: 'pbl3-shop' }  
});

**Validation** (hiện tại chưa có DataAnnotations):

| Field | Rule |
| ----- | ----- |
| `email` | Required |
| `password` | Required |

**Logic**:

* Tìm Tenant theo `subdomain` → không thấy → 400  
* Kiểm tra email đã tồn tại trong tenant chưa → đã có → 400  
* Tạo Customer với `TenantId` tương ứng  
* **Tự động tạo Cart** gắn với customer vừa tạo

**Response 200**:

json  
{  
  "message": "Đăng ký thành công\!",  
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  
  "userId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
  "email": "dieuhoale6406@gmail.com",  
  "role": "customer",  
  "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
  "subdomain": "pbl3-shop"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Store (subdomain) không tồn tại |
| `400` | Email đã được đăng ký trong store này |

---

### **POST `/api/auth/customer/login`** {#post-/api/auth/customer/login}

**Auth**: Không yêu cầu  
 **Mô tả**: Customer đăng nhập vào một store cụ thể.

**Về `subdomain` trong request**: `subdomain` được truyền qua **query parameter** (không phải body). Trong C\#, hàm nhận `[FromQuery] string subdomain` — đây là lý do URL phải kèm `?subdomain=xxx`.

**Cách gọi đúng**:

POST /api/simpleauth/customer/login?subdomain=pbl3-shop

**Trong code C\#**:

\[HttpPost("customer/login")\]  
public async Task\<IActionResult\> LoginCustomer(\[FromQuery\] string subdomain, LoginRequest request)

**URL**: `POST /api/simpleauth/customer/login?subdomain=pbl3-shop`

**Request Body**:

json  
{  
  "email": "dieuhoale6406@gmail.com",  
  "password": "Abc@1234"  
}

**Logic**:

1. Tìm Tenant theo `subdomain` (query param) → không thấy → 400  
2. Tìm Customer có `email` khớp trong tenant đó  
3. Verify password bằng BCrypt

**Response 200**:

json  
{  
  "message": "Đăng nhập thành công\!",  
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  
  "userId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
  "email": "dieuhoale6406@gmail.com",  
  "role": "customer",  
  "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
  "subdomain": "pbl3-shop"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Store (subdomain) không tồn tại |
| `401` | Email hoặc mật khẩu không đúng |

---

### **GET `/api/auth/me`** {#get-/api/auth/me}

**Auth**: `[Authorize]` — Bearer token bắt buộc  
 **Mô tả**: Xem thông tin của user đang đăng nhập, lấy từ JWT claims.

**Response 200**:

json  
{  
  "userId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "email": "vanngocnhuy30032006@gmail.com",  
  "role": "merchant",  
  "tenantId": "2d273f64-2b77-479c-b114-66311d41b573"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ hoặc thiếu |

---

### **PUT `/api/auth/customers/{customerId}`** {#put-/api/auth/customers/{customerid}}

Auth: `[Authorize]`, phải là chính customer đó (role "`customer"`, `userId == customerId`)  
 Mô tả: Customer tự cập nhật thông tin của mình (email, password). Endpoint này nằm ở auth controller vì liên quan đến bản thân user, không phải merchant quản lý.

Lý do tách ra: `PUT /tenants/{tenantId}/customers/{id}` hiện để merchant update là sai logic — customer nên tự update thông tin của mình, không nên để người khác thay đổi.

**Path Params**:

* `tenantId` — GUID của tenant  
* `customerId` — GUID của customer

**Request Body** (partial — chỉ gửi field cần thay đổi):

json  
{  
  "email": "newemail@example.com",  
  "password": "NewPass@123",  
  "isActive": false  
}

**Validation** (có DataAnnotations trong `UpdateCustomerRequestDto`):

| Field | Rule |
| ----- | ----- |
| `email` | Optional, format email hợp lệ nếu có |
| `password` | Optional, không có validation mạnh như create |
| `isActive` | Optional |

**Response 200** — trả CustomerDto đã cập nhật (cấu trúc như GET by ID)

json  
{  
  "message": "Cập nhật thông tin thành công\!",  
  "userId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
  "email": "dieuhoale6406@gmail.com",  
  "role": "customer",  
  "tenantId": "2d273f64-2b77-479c-b114-66311d41b573"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `401` | Token không hợp lệ |
| `404` | Tenant hoặc customer không tồn tại |

---

### **POST** `/api/auth/logout` {#post-/api/auth/logout}

**Auth**: `[Authorize]`  
 **Mô tả**: JWT là stateless — server không lưu token. Endpoint này chỉ là điểm gọi thống nhất cho frontend. **Việc logout thực sự là xóa token ở phía client.**

**Response 200**:

json  
{  
  "caption": "Đăng xuất thành công\!",  
  "message": "Xử lý phần này bên frontend nhé (xóa tokens)"  
}

---

5. # **Tenants — `/api/tenants`** {#tenants-—-/api/tenants}

**Auth mặc định của controller**: `[Authorize]` ở class level — tất cả endpoint trong TenantsController đều yêu cầu JWT.  
---

**GET `/api/tenants/me`**  
**Auth**: `[Authorize(Roles = "merchant")]`  
**Mô tả**: Lấy danh sách tenant thuộc về merchant đang đăng nhập (lấy `ownerId` từ JWT claim `userId`).  
**Query**: Xem [Tenants query params](#tenants-—-get-/api/tenants/me)

**Response 200** — array of slim TenantDto:

json  
\[  
  {  
    "id": "2d273f64-2b77-479c-b114-66311d41b573",  
    "ownerId": "b4a40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
    "subdomain": "vanngocnhuy30032006",  
    "storeName": "Van Ngoc Nhu Y",  
    "isActive": true  
  }  
\]

**Về việc slim down TenantDto**: `TenantDto` đã được/sẽ được xóa các property `Categories`, `Customers`, `Orders`. Những dữ liệu đó có endpoint riêng — không nên nhúng vào TenantDto vì gây over-fetch nặng (1000 customers × full data \= response khổng lồ).

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ hoặc thiếu `userId` claim |

### ---

**~~GET `/api/tenants`**~~ {#get-/api/tenants}

**~~Auth~~**~~: `[Authorize]` — bất kỳ JWT hợp lệ~~  
 ~~**Mô tả**: Lấy tất cả tenants trong hệ thống.~~

~~⚠️ **Cảnh báo bảo mật**: Endpoint này không có kiểm tra role, ai có token đều xem được toàn bộ danh sách store. Chỉ nên dùng cho admin. Cần bổ sung `[Authorize(Roles = "admin")]` hoặc xóa endpoint này.~~

**~~Response 200~~** ~~— trả array của TenantDto (cấu trúc tương tự `/me`).~~

---

### **GET `/api/tenants/{id}`** {#get-/api/tenants/{id}}

**Auth**: `[Authorize(Roles = "merchant")]`  
**Mô tả**: Lấy chi tiết một tenant theo ID thuộc về một merchant đang đăng nhập.

**Path Params**: `id` — GUID của tenant

**Response 200** — TenantDto:

json  
{  
  "id": "2d273f64-2b77-479c-b114-66311d41b573",  
  "ownerId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "subdomain": "vanngocnhuy30032006",  
  "storeName": "Van Ngoc Nhu Y",  
  "isActive": true,  
  "categories": \[\],  
  "customers": \[\],  
  "orders": \[\]

}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `403` | User không phải owner của tenant |
| `404` | Tenant không tồn tại |

---

### **GET `/api/tenants/subdomain/{subdomain}`** {#get-/api/tenants/subdomain/{subdomain}}

**Auth**: `[AllowAnonymous]` để storefront lookup không cần token.  
 **Mô tả**:  Tìm tenant theo subdomain. Frontend storefront dùng endpoint này đầu tiên để lấy `tenantId`.

**Path Params**: `subdomain` — tên subdomain (sẽ được lowercase trước khi query)

**Response 200**:

json  
{  
  "id": "2d273f64-2b77-479c-b114-66311d41b573",  
  "ownerId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "subdomain": "vanngocnhuy30032006",  
  "storeName": "Van Ngoc Nhu Y",  
  "isActive": true,  
  "categories": \[\],  
  "customers": \[\],  
  "orders": \[\]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | Không tìm thấy store với subdomain này |

---

### **POST `/api/tenants`** {#post-/api/tenants}

**Auth**: `[Authorize]` — lấy `ownerId` từ JWT claim `userId`  
 **Mô tả**: Tạo tenant mới. Merchant có thể tạo nhiều tenant.

**Request Body**:

json  
{  
  "subdomain": "my-new-store",  
  "storeName": "My New Store",  
  "isActive": true  
}

**Validation** (có DataAnnotations):

| Field | Rule |
| ----- | ----- |
| `subdomain` | Required, 3-50 chars, chỉ `[a-z0-9-]` |
| `storeName` | Required, 3-100 chars |
| `isActive` | Optional, default `true` |

**Response 201** — Location header: `/api/tenants/{newId}`:

json  
{  
  "id": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "ownerId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "subdomain": "my-new-store",  
  "storeName": "My New Store",  
  "isActive": true  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `401` | Token không hợp lệ hoặc thiếu `userId` claim |
| `409` | Subdomain đã tồn tại |

---

### **PUT `/api/tenants/{id}`** {#put-/api/tenants/{id}}

**Auth**: `[Authorize]`, phải là owner của tenant  
 **Mô tả**: Cập nhật thông tin tenant. Chỉ owner mới được phép.

**Path Params**: `id` — GUID của tenant

**Request Body** (partial — chỉ gửi field muốn thay đổi):

json  
{  
  "subdomain": "new-subdomain",  
  "storeName": "New Store Name",  
  "isActive": false  
}

**Validation**:

| Field | Rule |
| ----- | ----- |
| `subdomain` | Optional, 3-50 chars, `[a-z0-9-]` nếu có |
| `storeName` | Optional, 3-100 chars nếu có |
| `isActive` | Optional |

**Response 200** — trả TenantDto đã cập nhật (cấu trúc giống GET):

json  
{  
  "id": "2d273f64-2b77-479c-b114-66311d41b573",  
  "ownerId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "subdomain": "new-subdomain",  
  "storeName": "New Store Name",  
  "isActive": false  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `401` | Token không hợp lệ |
| `403` | User không phải owner của tenant |
| `404` | Tenant không tồn tại |
| `409` | Subdomain mới đã tồn tại |

---

### **DELETE `/api/tenants/{id}`** {#delete-/api/tenants/{id}}

**Auth**: `[Authorize]`, phải là owner  
 **Mô tả**: Xóa tenant. Cần cẩn thận — cascade xóa categories, products, customers, orders liên quan (tuỳ thuộc vào cascade config trong AppDbContext).

**Path Params**: `id` — GUID của tenant

**Response 204 No Content**

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | Tenant không tồn tại |

---

6. # **Customers — `/api/tenants/{tenantId}/customers`** {#customers-—-/api/tenants/{tenantid}/customers}

**Mục đích**: Controller này **chỉ dành cho merchant** xem và quản lý danh sách customers trong store của mình. Không dùng để customer tự đăng ký (dùng [`POST api/auth/customer/register`](#post-/api/auth/customer/register)). Không dùng để customer tự cập nhật thông tin (dùng [`PUT api/auth/customers/{customerId}`](#put-/api/auth/customers/{customerid})).  
**Query**: Xem [Customers query params](#customers-—-get-/api/tenants/{tenantid}/customers)  
---

### **GET `/api/tenants/{tenantId}/customers`** {#get-/api/tenants/{tenantid}/customers}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Merchant xem danh sách toàn bộ customers của store mình.

**Path Params**: `tenantId` — GUID của tenant

**Response 200** — trả array of CustomerDto:

json  
\[  
  {  
    "id": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "email": "dieuhoale6406@gmail.com",  
    "isActive": true,  
    "createdAt": "2026-03-04T00:45:25",  
    "cart": {  
      "id": "096399d3-0cd8-4654-909a-25d47e8c4433",  
      "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
      "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
      "cartItems": \[\]  
    },  
    "orders": \[  
      {  
        "id": "91111111-1111-4111-8111-111111111111",  
        "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
        "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
        "address": "12 Nguyen Trai, Q1, TP.HCM",  
        "status": "Pending",  
        "paymentMethod": "COD",  
        "paymentStatus": "Pending",  
        "totalAmount": 387000,  
        "createdAt": "2026-03-30T09:15:00",  
        "orderItems": \[\]  
      }  
    \]  
  }  
\]

**Lưu ý**: `passwordHash` không xuất hiện trong response vì CustomerDto không có field này.

**Về `passwordHash`**: Không có trong `CustomerDto` — đây là thiết kế đúng. DTO che đi thông tin nhạy cảm, chỉ trả về những gì merchant cần xem. Không nên thêm `passwordHash` vào DTO.

**Về Cart và Orders trong CustomerDto**: `CustomerDto` hiện tại vẫn có `cart` và `orders`. Merchant xem thông tin customer nên có thể cần biết lịch sử mua hàng — giữ nguyên là hợp lý. Tuy nhiên, nếu danh sách customers lớn thì nên xem xét bỏ ra để tránh over-fetch.

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ hoặc không tìm thấy `userId` claim |
| `403` | User không phải owner của tenant này |
| `404` | Tenant không tồn tại |

---

### **GET** `/api/tenants/{tenantId}/customers/{customerId}` {#get-/api/tenants/{tenantid}/customers/{customerid}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Merchant xem chi tiết một customer.

**Path Params**:

* `tenantId` — GUID của tenant  
* `customerId` — GUID của customer

**Response 200**:

json  
{  
  "id": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "email": "dieuhoale6406@gmail.com",  
  "isActive": true,  
  "createdAt": "2026-03-04T00:45:25",  
  "cart": {  
    "id": "096399d3-0cd8-4654-909a-25d47e8c4433",  
    "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "cartItems": \[\]  
  },  
  "orders": \[   
{  
"id": "91111111-1111-4111-8111-111111111111",  
"tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
"customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
"address": "12 Nguyen Trai, Q1, TP.HCM",  
"status": "Pending",  
"paymentMethod": "COD",  
"paymentStatus": "Pending",  
"totalAmount": 387000,  
"createdAt": "2026-03-30T09:15:00",  
"orderItems": \[\]  
}  
  \]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | Tenant không tồn tại |
| `404` | Customer không tồn tại hoặc không thuộc tenant này |

---

### **~~GET `/api/tenants/{tenantId}/customers/email/{email}`**~~ {#get-/api/tenants/{tenantid}/customers/email/{email}}

**~~Auth~~**~~: `[Authorize]`~~  
 ~~**Mô tả**: Tìm customer theo email trong tenant.~~

**~~Path Params~~**~~:~~

* ~~`tenantId` — GUID của tenant~~  
* ~~`email` — địa chỉ email cần tìm (URL-encode nếu cần)~~

**~~Response 200~~**~~: Tương tự GET by ID~~

**~~Errors~~**~~:~~

| ~~Status~~ | ~~Trường hợp~~ |
| ----- | ----- |
| ~~`401`~~ | ~~Token không hợp lệ~~ |
| ~~`404`~~ | ~~Customer không tồn tại~~ |

---

### **~~GET `/api/tenants/{tenantId}/customers/cart/{cartId}`**~~ {#get-/api/tenants/{tenantid}/customers/cart/{cartid}}

**~~Auth~~**~~: `[Authorize]`~~  
 ~~**Mô tả**: Tìm customer theo cartId.~~

~~⚠️ **Vấn đề hiện tại**: Thiếu owner check. Use case thực tế của endpoint này không rõ ràng — nên cân nhắc bỏ.~~

**~~Path Params~~**~~:~~

* ~~`tenantId` — GUID của tenant~~  
* ~~`cartId` — GUID của cart~~

**~~Response 200~~**~~: Tương tự GET by ID~~

---

### **DELETE `/api/tenants/{tenantId}/customers/{customerId}`** {#delete-/api/tenants/{tenantid}/customers/{customerid}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Xóa customer khỏi store.

**Path Params**:

* `tenantId` — GUID của tenant  
* `customerId` — GUID của customer

**Response 204 No Content**

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | Tenant hoặc customer không tồn tại |

---

7. # **Categories — `/api/tenants/{tenantId}/categories`** {#categories-—-/api/tenants/{tenantid}/categories}

**Auth mặc định**: Controller có `[Authorize]` ở class level (merchant). Các endpoint public dùng `[AllowAnonymous]` để override.  
---

### **GET `/api/tenants/{tenantId}/categories`** {#get-/api/tenants/{tenantid}/categories}

**Auth**: `[AllowAnonymous]` — public, dùng cho cả storefront lẫn merchant dashboard

**Mô tả**: Lấy danh sách categories của store. Response qua `CategoryDto` (không phải anonymous projection).  Danh sách tất cả products của tentant cũng được lấy ở đây.

**Response 200** — array of CategoryDto:

json

\[  
  {  
    "id": "11111111-1111-4111-8111-111111111111",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "name": "Áo thun",  
    "description": "Danh mục áo thun cơ bản",  
    "isActive": true,  
    "products": \[\]  
  },  
  {  
    "id": "22222222-2222-4222-8222-222222222222",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "name": "Hoodie",  
    "description": "Áo hoodie unisex",  
    "isActive": true,  
    "products": \[\]  
  }  
\]

**Về field `products`**: CategoryDto có `products` nhưng khi GET all categories, navigation `Products` chưa được `.Include()` nên sẽ trả về `[]`. Nếu cần products theo category, dùng `GET /products?categoryId=xxx`.

---

### **GET `/api/tenants/{tenantId}/categories/{id}` *(đề xuất — nên thêm)*** {#get-/api/tenants/{tenantid}/categories/{id}-(đề-xuất-—-nên-thêm)}

**Auth**: `[AllowAnonymous]`  
 **Mô tả**: Lấy chi tiết một category.

**Có nên thêm không?** Nên có. Use case thực tế:

* Storefront cần load chi tiết category khi user click vào danh mục  
* Merchant dashboard cần xem chi tiết category khi edit  
* Consistent với RESTful — nếu có GET list thì nên có GET single

**Response 200**:

json  
{  
  "id": "11111111-1111-4111-8111-111111111111",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "name": "Áo thun",  
  "description": "Danh mục áo thun cơ bản",  
  "isActive": true,  
  "products": \[\]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | Category không tồn tại hoặc không thuộc tenant này |

---

### **POST `/api/tenants/{tenantId}/categories`** {#post-/api/tenants/{tenantid}/categories}

**Auth**: `[Authorize]`, phải là tenant owner  
**Mô tả**: Merchant tạo danh mục mới.

**Path Params**: `tenantId` — GUID của tenant

**Request Body**:

json  
{  
  "name": "Quần jean",  
  "description": "Các loại quần jean",  
  "isActive": true  
}

**Validation** (có DataAnnotations trong `CreateCategoryRequestDto`):

| Field | Rule |
| ----- | ----- |
| `name` | Required, 2-100 chars |
| `description` | Optional |
| `isActive` | Optional, default `true` |

**Response 200** — trả CategoryDto:

json  
{  
  "id": "55555555-5555-4555-8555-555555555555",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "name": "Quần jean",  
  "description": "Các loại quần jean",  
  "isActive": true,  
  "products": \[\]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `400` | Lỗi DB hoặc exception |
| `400` | Tên Category đã tồn tại trong tenant |
| `403` | Khôn g phải owner |

---

### **PUT `/api/tenants/{tenantId}/categories/{id}`** {#put-/api/tenants/{tenantid}/categories/{id}}

**Auth**: `[Authorize]`, phải là tenant owner  
**Mô tả**: Cập nhật thông tin danh mục.

**Path Params**:

* `tenantId` — GUID của tenant  
* `id` — GUID của category

**Request Body** (partial):

json  
{  
  "name": "Quần jean cao cấp",  
  "description": "Quần jean chất lượng cao",  
  "isActive": false  
}

**Validation** (có DataAnnotations trong `UpdateCategoryRequestDto`):

| Field | Rule |
| ----- | ----- |
| `name` | Optional, 2-100 chars nếu có |
| `description` | Optional |
| `isActive` | Optional |

**Response 200** — trả CategoryDto đã cập nhật:

json  
{  
  "id": "55555555-5555-4555-8555-555555555555",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "name": "Quần jean cao cấp",  
  "description": "Quần jean chất lượng cao",  
  "isActive": false,  
  "products": \[\]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `404` | Category không tồn tại trong tenant này |

---

### **DELETE `/api/tenants/{tenantId}/categories/{id}`** {#delete-/api/tenants/{tenantid}/categories/{id}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Xóa danh mục. Nếu danh mục có sản phẩm, sẽ bị lỗi FK constraint (OnDelete.Restrict).

**Path Params**:

* `tenantId` — GUID của tenant  
* `id` — GUID của category

**Response 200**:

json  
{ "message": "Xóa thành công\!" }

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Lỗi DB (ví dụ: còn sản phẩm thuộc danh mục này) |
| `403` | Không phải owner |
| `404` | Category không tồn tại |

---

8. # **Products — `/api/tenants/{tenantId}/products`** {#products-—-/api/tenants/{tenantid}/products}

**Auth**: GET public (`[AllowAnonymous]`), write operations cần `[Authorize]` \+ owner check.

### **Cấu trúc JSON Product** {#cấu-trúc-json-product}

json  
{  
  "id": "61111111-1111-4111-8111-111111111111",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "categoryId": "11111111-1111-4111-8111-111111111111",  
  "name": "PBL3 Tee Basic",  
  "description": "Áo thun cotton trơn, thoáng mát",  
  "attributes": "{\\"color\\":\[\\"black\\",\\"white\\"\],\\"size\\":\[\\"S\\",\\"M\\",\\"L\\",\\"XL\\"\]}",  
  "imgUrls": \[  
    "https://cdn.example.com/products/tee-basic-front.jpg",  
    "https://cdn.example.com/products/tee-basic-back.jpg",  
    "https://cdn.example.com/products/tee-basic-detail.jpg"  
  \],  
  "productSkus": \[  
    {  
      "id": "71111111-1111-4111-8111-111111111111",  
      "productId": "61111111-1111-4111-8111-111111111111",  
      "price": 129000,  
      "stock": 50,  
      "attributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
      "imgUrl": "https://cdn.example.com/skus/tee-black-m.jpg"  
    },  
    {  
      "id": "72111111-1111-4211-8211-121111111111",  
      "productId": "61111111-1111-4111-8111-111111111111",  
      "price": 129000,  
      "stock": 46,  
      "attributes": "{\\"color\\":\\"white\\",\\"size\\":\\"S\\"}",  
      "imgUrl": "https://cdn.example.com/skus/tee-white-s.jpg"  
    }  
  \]  
}

**Giải thích** `attributes`:

* `Product.attributes`: định nghĩa nhóm biến thể → `{"color":["black","white"],"size":["S","M","L"]}`  
* `ProductSku.attributes`: tổ hợp cụ thể của SKU → `{"color":"black","size":"M"}`  
* Cả hai đều là **JSON string**, frontend cần parse: `JSON.parse(product.attributes)`

**Giải thích images**:

* `Product.imgUrls`: array các URL ảnh giới thiệu chung sản phẩm (nhiều góc, màu sắc tổng quan, chức năng)  
* `ProductSku.imgUrl`: 1 URL ảnh đại diện cho biến thể cụ thể đó

---

### **GET `/api/tenants/{tenantId}/products`** {#get-/api/tenants/{tenantid}/products}

**Auth**: `[AllowAnonymous]` — public  
 **Mô tả**: Lấy danh sách sản phẩm. Dùng cho cả storefront (customer xem) lẫn merchant dashboard (quản lý).

**Query**: Xem [Products query params](#products-—-get-/api/tenants/{tenantid}/products)

**Path Params**: `tenantId` — GUID tenant

**Response 200** — array of ProductDto:

json  
\[  
  {  
    "id": "61111111-1111-4111-8111-111111111111",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "categoryId": "11111111-1111-4111-8111-111111111111",  
    "name": "PBL3 Tee Basic",  
    "description": "Áo thun cotton trơn",  
    "attributes": "{\\"color\\":\[\\"black\\",\\"white\\"\],\\"size\\":\[\\"S\\",\\"M\\",\\"L\\",\\"XL\\"\]}",  
    "imgUrls": \[  
      "https://cdn.example.com/products/tee-basic-front.jpg",  
      "https://cdn.example.com/products/tee-basic-back.jpg"  
    \],  
    "productSkus": \[  
      {  
        "id": "71111111-1111-4111-8111-111111111111",  
        "productId": "61111111-1111-4111-8111-111111111111",  
        "price": 129000,  
        "stock": 50,  
        "attributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
        "imgUrl": "https://cdn.example.com/skus/tee-black-m.jpg"  
      }  
    \]  
  }  
\]  
---

### **GET `/api/tenants/{tenantId}/products/{id}`** {#get-/api/tenants/{tenantid}/products/{id}}

**Auth**: `[AllowAnonymous]` — public  
 **Mô tả**: Xem chi tiết một sản phẩm.

**Path Params**:

* `tenantId` — GUID tenant  
* `id` — GUID product

**Response 200** — ProductDto (cấu trúc giống một item trong danh sách)

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | Product không tồn tại hoặc không thuộc tenant |

---

### **POST `/api/tenants/{tenantId}/products`** {#post-/api/tenants/{tenantid}/products}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Merchant tạo sản phẩm mới, kèm SKUs và ảnh.

**Request Body**:

json  
{  
  "name": "PBL3 Tee Basic",  
  "description": "Áo thun cotton trơn, thoáng mát",  
  "categoryId": "11111111-1111-4111-8111-111111111111",  
  "attributes": "{\\"color\\":\[\\"black\\",\\"white\\"\],\\"size\\":\[\\"S\\",\\"M\\",\\"L\\",\\"XL\\"\]}",  
  "imgUrls": \[  
    "https://cdn.example.com/products/tee-basic-front.jpg",  
    "https://cdn.example.com/products/tee-basic-back.jpg"  
  \],  
  "skus": \[  
    {  
      "price": 129000,  
      "stock": 50,  
      "attributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
      "imgUrl": "https://cdn.example.com/skus/tee-black-m.jpg"  
    },  
    {  
      "price": 129000,  
      "stock": 46,  
      "attributes": "{\\"color\\":\\"white\\",\\"size\\":\\"S\\"}",  
      "imgUrl": ""  
    }  
  \]  
}

**Validation**:

| Field | Rule |
| ----- | ----- |
| `name` | Required, 2-255 chars |
| `categoryId` | Required, phải tồn tại trong tenant |
| `description` | Optional |
| `attributes` | Optional, JSON string |
| `imgUrls` | Optional, array of URL strings |
| `skus` | Optional, array |
| `skus[].price` | \>= 0 |
| `skus[].stock` | \>= 0 |
| `skus[].attributes` | Optional, JSON string |
| `skus[].imgUrl` | Optional, URL string hoặc `""` |

**Response 200** — ProductDto đầy đủ với các ID đã được tạo:

json  
{  
  "id": "61111111-1111-4111-8111-111111111111",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "categoryId": "11111111-1111-4111-8111-111111111111",  
  "name": "PBL3 Tee Basic",  
  "description": "Áo thun cotton trơn, thoáng mát",  
  "attributes": "{\\"color\\":\[\\"black\\",\\"white\\"\],\\"size\\":\[\\"S\\",\\"M\\",\\"L\\",\\"XL\\"\]}",  
  "imgUrls": \[  
    "https://cdn.example.com/products/tee-basic-front.jpg",  
    "https://cdn.example.com/products/tee-basic-back.jpg"  
  \],  
  "productSkus": \[  
    {  
      "id": "71111111-1111-4111-8111-111111111111",  
      "productId": "61111111-1111-4111-8111-111111111111",  
      "price": 129000,  
      "stock": 50,  
      "attributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
      "imgUrl": "https://cdn.example.com/skus/tee-black-m.jpg"  
    },  
    {  
      "id": "72111111-1111-4211-8211-121111111111",  
      "productId": "61111111-1111-4111-8111-111111111111",  
      "price": 129000,  
      "stock": 46,  
      "attributes": "{\\"color\\":\\"white\\",\\"size\\":\\"S\\"}",  
      "imgUrl": ""  
    }  
  \]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `400` | `categoryId` không tồn tại trong tenant |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |

---

### **PUT `/api/tenants/{tenantId}/products/{id}`** {#put-/api/tenants/{tenantid}/products/{id}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Cập nhật thông tin sản phẩm. Không cập nhật SKUs qua endpoint này (dùng SKU endpoints riêng). Nếu truyền `imgUrls` → thay toàn bộ ảnh cũ. Nếu không truyền `imgUrls` → ảnh cũ giữ nguyên.

**Request Body** (partial):

json  
{  
  "name": "PBL3 Tee Basic v2",  
  "description": "Phiên bản mới cải tiến",  
  "categoryId": "22222222-2222-4222-8222-222222222222",  
  "attributes": "{\\"color\\":\[\\"black\\",\\"white\\",\\"gray\\"\],\\"size\\":\[\\"S\\",\\"M\\",\\"L\\",\\"XL\\"\]}",  
  "imgUrls": \[  
    "https://cdn.example.com/products/tee-v2-front.jpg"  
  \]  
}

**Response 200** — ProductDto đã cập nhật (bao gồm cả SKUs cũ)

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `400` | `categoryId` mới không tồn tại trong tenant |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | Product không tồn tại |

---

### **DELETE `/api/tenants/{tenantId}/products/{id}`** {#delete-/api/tenants/{tenantid}/products/{id}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Xóa sản phẩm. Cascade xóa SKUs và ảnh liên quan.

⚠️ Nếu SKU đang được tham chiếu trong CartItem hoặc OrderItem (OnDelete.Restrict) sẽ báo lỗi.

**Response 200**:

json  
{ "message": "Xóa thành công\!" }

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | SKU đang được tham chiếu (trong cart hoặc order) |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | Product không tồn tại |

---

### **GET `/api/tenants/{tenantId}/products/{id}/skus`** {#get-/api/tenants/{tenantid}/products/{id}/skus}

**Auth**: `[AllowAnonymous]` — public  
 **Mô tả**: Lấy danh sách SKUs của sản phẩm.

**Response 200** — array of ProductSkuDto:

json  
\[  
  {  
    "id": "71111111-1111-4111-8111-111111111111",  
    "productId": "61111111-1111-4111-8111-111111111111",  
    "price": 129000,  
    "stock": 50,  
    "attributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
    "imgUrl": "https://cdn.example.com/skus/tee-black-m.jpg"  
  },  
  {  
    "id": "72111111-1111-4211-8211-121111111111",  
    "productId": "61111111-1111-4111-8111-111111111111",  
    "price": 129000,  
    "stock": 46,  
    "attributes": "{\\"color\\":\\"white\\",\\"size\\":\\"S\\"}",  
    "imgUrl": ""  
  }  
\]

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | Product không tồn tại trong tenant |

---

### **POST `/api/tenants/{tenantId}/products/{id}/skus`** {#post-/api/tenants/{tenantid}/products/{id}/skus}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Thêm SKU mới vào sản phẩm.

**Request Body**:

json  
{  
  "price": 139000,  
  "stock": 30,  
  "attributes": "{\\"color\\":\\"gray\\",\\"size\\":\\"M\\"}",  
  "imgUrl": "https://cdn.example.com/skus/tee-gray-m.jpg"  
}

**Validation**:

| Field | Rule |
| ----- | ----- |
| `price` | \>= 0 |
| `stock` | \>= 0 |
| `attributes` | Optional, JSON string |
| `imgUrl` | Optional, URL string hoặc `""` |

**Response 200** — ProductSkuDto:

json  
{  
  "id": "79999999-9999-4999-8999-999999999999",  
  "productId": "61111111-1111-4111-8111-111111111111",  
  "price": 139000,  
  "stock": 30,  
  "attributes": "{\\"color\\":\\"gray\\",\\"size\\":\\"M\\"}",  
  "imgUrl": "https://cdn.example.com/skus/tee-gray-m.jpg"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | Product không tồn tại trong tenant |

---

### **PUT `/api/tenants/{tenantId}/products/{id}/skus/{skuId}`** {#put-/api/tenants/{tenantid}/products/{id}/skus/{skuid}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Cập nhật thông tin SKU (partial update).

**Request Body**:

json  
{  
  "price": 149000,  
  "stock": 25,  
  "attributes": "{\\"color\\":\\"gray\\",\\"size\\":\\"L\\"}",  
  "imgUrl": "https://cdn.example.com/skus/tee-gray-l.jpg"  
}

**Response 200** — ProductSkuDto đã cập nhật:

json  
{  
  "id": "79999999-9999-4999-8999-999999999999",  
  "productId": "61111111-1111-4111-8111-111111111111",  
  "price": 149000,  
  "stock": 25,  
  "attributes": "{\\"color\\":\\"gray\\",\\"size\\":\\"L\\"}",  
  "imgUrl": "https://cdn.example.com/skus/tee-gray-l.jpg"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | SKU không tồn tại hoặc không thuộc product/tenant |

---

### **DELETE** `/api/tenants/{tenantId}/products/{id}/skus/{skuId}` {#delete-/api/tenants/{tenantid}/products/{id}/skus/{skuid}}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Xóa SKU.

**Response 200**:

json  
{ "message": "Xóa SKU thành công\!" }

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | SKU đang được tham chiếu trong cart hoặc order |
| `401` | Token không hợp lệ |
| `403` | Không phải owner |
| `404` | SKU không tồn tại |

---

9. # **Cart — `/api/cart`** {#cart-—-/api/cart}

**Thiết kế mới**: Gộp `CartsController` và `CartItemsController` thành một controller duy nhất, dùng route `/cart` và `/cart/items`. RESTful hơn, rõ quan hệ cha–con.

**Auth**: Tất cả endpoint cần `[Authorize]`. Customer chỉ được truy cập cart của chính mình (`userId == customerId`). Merchant (owner) cũng có thể xem cart của customers trong store mình.

---

### **GET `/api/cart`** {#get-/api/cart}

**Auth**: `[Authorize]` (customer hoặc merchant owner)  
 **Mô tả**: Xem danh sách items trong giỏ hàng, kèm thông tin sản phẩm và giá. **Đây là endpoint chính để hiển thị giỏ hàng.**

**Response 200** — array of anonymous object với đầy đủ thông tin:

json  
\[  
  {  
    "id": "ci-uuid-1",  
    "productSkuId": "71111111-1111-4111-8111-111111111111",  
    "productId": "61111111-1111-4111-8111-111111111111",  
    "productName": "PBL3 Tee Basic",  
    "productPrice": 129000,  
    "quantity": 2,  
    "subTotal": 258000  
  },  
  {  
    "id": "ci-uuid-2",  
    "productSkuId": "73111111-1111-4311-8311-131111111111",  
    "productId": "62222222-2222-4222-8222-222222222222",  
    "productName": "PBL3 Tee Oversize",  
    "productPrice": 149000,  
    "quantity": 1,  
    "subTotal": 149000  
  }  
\]

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ |
| `403` | Không có quyền truy cập cart này |
| `404` | Customer không thuộc tenant |

---

### **CartItemDto mở rộng *(Đề xuất)***

Để FE có thể hiển thị giỏ hàng mà không cần gọi thêm API, `CartItemDto` cần được mở rộng với thông tin sản phẩm:

**CartItemDto sau khi mở rộng**:

json  
{  
  "id": "ci-uuid-1",  
  "cartId": "096399d3-0cd8-4654-909a-25d47e8c4433",  
  "productSkuId": "71111111-1111-4111-8111-111111111111",  
  "quantity": 2,  
  "productId": "61111111-1111-4111-8111-111111111111",  
  "productName": "PBL3 Tee Basic",  
  "skuAttributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
  "skuImgUrl": "https://cdn.example.com/skus/tee-black-m.jpg",  
  "unitPrice": 129000,  
  "subTotal": 258000  
}

**Cách implement trong `CartItemService.GetCartItemsAsync`**: Include `ProductSku.Product` khi query CartItems, sau đó map thêm các field trên vào DTO.

**OrderItemDto** cũng cần tương tự để hiển thị trong trang chi tiết đơn hàng:

json  
{  
  "id": "oi-uuid-1",  
  "orderId": "91111111-1111-4111-8111-111111111111",  
  "productSkuId": "71111111-1111-4111-8111-111111111111",  
  "productName": "PBL3 Tee Basic",  
  "skuAttributes": "{\\"color\\":\\"black\\",\\"size\\":\\"M\\"}",  
  "skuImgUrl": "https://cdn.example.com/skus/tee-black-m.jpg",  
  "selectedOptions": null,  
  "quantity": 2,  
  "unitPrice": 129000,  
  "subTotal": 258000  
}

---

### **~~POST `/api/tenants/{tenantId}/customers/{customerId}/cart`**~~ {#post-/api/tenants/{tenantid}/customers/{customerid}/cart}

**~~Auth~~**~~: `[Authorize]` (merchant owner)~~  
 ~~**Mô tả**: Tạo cart cho customer (chỉ dùng trong trường hợp đặc biệt — thông thường cart được tạo tự động khi đăng ký).~~

**~~Lưu ý~~**~~: Đây là endpoint fallback. Trong flow bình thường, cart đã được tạo tự động tại `POST api/auth/customer/register`. Chỉ gọi endpoint này nếu cart chưa tồn tại vì lý do ngoại lệ.~~

**~~Response 201~~** ~~— CartDto~~

**~~Errors~~**~~:~~

| ~~Status~~ | ~~Trường hợp~~ |
| ----- | ----- |
| ~~`400`~~ | ~~Customer đã có cart~~ |
| ~~`404`~~ | ~~Customer hoặc Tenant không tồn tại~~ |

---

### **~~GET `/api/tenants/{tenantId}/customers/{customerId}/cart/items`**~~ {#get-/api/tenants/{tenantid}/customers/{customerid}/cart/items}

**~~Auth~~**~~: `[Authorize]` (customer hoặc merchant owner)~~  
 ~~**Mô tả**: Xem danh sách items trong giỏ hàng, kèm thông tin sản phẩm và giá. **Đây là endpoint chính để hiển thị giỏ hàng.**~~

**~~Response 200~~** ~~— array of anonymous object với đầy đủ thông tin:~~

~~json~~  
~~\[~~  
  ~~{~~  
    ~~"id": "ci-uuid-1",~~  
    ~~"productSkuId": "71111111-1111-4111-8111-111111111111",~~  
    ~~"productId": "61111111-1111-4111-8111-111111111111",~~  
    ~~"productName": "PBL3 Tee Basic",~~  
    ~~"productPrice": 129000,~~  
    ~~"quantity": 2,~~  
    ~~"subTotal": 258000~~  
  ~~},~~  
  ~~{~~  
    ~~"id": "ci-uuid-2",~~  
    ~~"productSkuId": "73111111-1111-4311-8311-131111111111",~~  
    ~~"productId": "62222222-2222-4222-8222-222222222222",~~  
    ~~"productName": "PBL3 Tee Oversize",~~  
    ~~"productPrice": 149000,~~  
    ~~"quantity": 1,~~  
    ~~"subTotal": 149000~~  
  ~~}~~  
~~\]~~

**~~Errors~~**~~:~~

| ~~Status~~ | ~~Trường hợp~~ |
| ----- | ----- |
| ~~`401`~~ | ~~Token không hợp lệ~~ |
| ~~`404`~~ | ~~Customer không thuộc tenant~~ |

---

### **POST `/api/cart/items`** {#post-/api/cart/items}

**Auth**: `[Authorize]` (customer)  
 **Mô tả**: Thêm sản phẩm vào giỏ. Nếu SKU đã có → cộng dồn số lượng. Nếu cart chưa tồn tại → tự tạo cart mới.

**Request Body**:

json  
{  
  "productSkuId": "71111111-1111-4111-8111-111111111111",  
  "quantity": 2  
}

**Validation**:

| Field | Rule |
| ----- | ----- |
| `productSkuId` | Required |
| `quantity` | Required, \>= 1 |

**Logic kiểm tra**:

1. Xác nhận customer thuộc tenant  
2. Xác nhận SKU thuộc tenant (via `SKU.Product.TenantId`)  
3. Kiểm tra `SKU.Stock >= quantity`  
4. Nếu SKU đã có trong cart → `existing.Quantity += quantity`, kiểm tra lại stock sau cộng  
5. Nếu chưa có → tạo CartItem mới

**Response 200 — Thêm mới**:

json  
{  
  "id": "ci-uuid-1",  
  "productSkuId": "71111111-1111-4111-8111-111111111111",  
  "quantity": 2,  
  "message": "Đã thêm vào giỏ hàng\!"  
}

**Response 200 — Cộng dồn (đã có SKU)**:

json  
{  
  "id": "ci-uuid-1",  
  "productSkuId": "71111111-1111-4111-8111-111111111111",  
  "quantity": 4,  
  "message": "Đã cập nhật số lượng trong giỏ hàng\!"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `400` | `"SKU chỉ còn 3 trong kho!"` — kèm số tồn kho thực tế |
| `401` | Token không hợp lệ |
| `404` | Customer không thuộc tenant |
| `404` | SKU không tồn tại trong tenant |

---

### **PUT `/api/cart/items/{itemId}`** {#put-/api/cart/items/{itemid}}

**Auth**: `[Authorize]` (customer)  
 **Mô tả**: Cập nhật số lượng của một CartItem.

**Path Params**: `itemId`— GUID của CartItem

**Request Body**:

json

{

  "cartId": "096399d3-0cd8-4654-909a-25d47e8c4433",

  "productSkuId": "71111111-1111-4111-8111-111111111111",

  "quantity": 3

}

**Lưu ý**: `UpdateCartItemRequestDto` hiện yêu cầu cả `cartId` và `productSkuId` — không phải chỉ `quantity`. Nên refactor để chỉ cần `quantity`.

**Validation**:

| Field | Rule |
| ----- | ----- |
| `quantity` | Required, \>= 1 |

**Logic**: Kiểm tra `SKU.Stock >= newQuantity` trước khi update.

**Response 200**:

json  
{  
  "id": "ci-uuid-1",  
  "productSkuId": "71111111-1111-4111-8111-111111111111",  
  "quantity": 3,  
  "message": "Đã cập nhật giỏ hàng\!"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `400` | `"SKU chỉ còn X trong kho!"` |
| `401` | Token không hợp lệ |
| `404` | Customer không thuộc tenant |
| `404` | CartItem không tồn tại hoặc không thuộc customer |

---

### **DELETE `/api/cart/items/{id}`** {#delete-/api/cart/items/{id}}

**Auth**: `[Authorize]` (customer)  
 **Mô tả**: Xóa một item khỏi giỏ hàng.

**Path Params**: `id` — GUID của CartItem

**Response 200**:

json  
{ "message": "Đã xóa sản phẩm khỏi giỏ hàng\!" }

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `401` | Token không hợp lệ |
| `404` | Customer không thuộc tenant |
| `404` | CartItem không tồn tại |

---

### **DELETE `/api/cart/items`** {#delete-/api/cart/items}

**Auth**: `[Authorize]` (customer)  
 **Mô tả**: Xóa **toàn bộ** items trong giỏ hàng (clear cart). Cart vẫn tồn tại, chỉ xóa items.

**Response 200**:

json  
{ "message": "Đã xóa 3 sản phẩm khỏi giỏ hàng\!" }

Số trong message là số items đã xóa thực tế.

---

10. # **Orders — `/api/tenants/{tenantId}/orders`** {#orders-—-/api/tenants/{tenantid}/orders}

Có 2 nhóm endpoint cho Order:

| Nhóm | Route prefix | Ai dùng |
| ----- | ----- | ----- |
| Merchant | `/api/tenants/{tenantId}/orders` | Merchant xem và quản lý tất cả orders của store |
| Customer | `/api/tenants/{tenantId}/customers/{customerId}/orders` | Customer xem lịch sử đơn của mình, checkout |

## **MERCHANT ORDERS** {#merchant-orders}

---

### **GET `/api/tenants/{tenantId}/orders`** {#get-/api/tenants/{tenantid}/orders}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Merchant xem toàn bộ orders của store, sắp xếp theo thời gian mới nhất.

**Query**: Xem [Orders query params](#orders-—-get-/api/tenants/{tenantid}/orders)

**Path Params**: `tenantId` — GUID của tenant

**Response 200** — array of OrderDto:

json  
\[  
  {  
    "id": "91111111-1111-4111-8111-111111111111",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
    "address": "12 Nguyen Trai, Q1, TP.HCM",  
    "status": "Pending",  
    "paymentMethod": "COD",  
    "paymentStatus": "Pending",  
    "totalAmount": 387000,  
    "createdAt": "2026-03-30T09:15:00",  
    "orderItems": \[  
      {  
        "id": "oi-uuid-1",  
        "orderId": "91111111-1111-4111-8111-111111111111",  
        "productSkuId": "71111111-1111-4111-8111-111111111111",  
        "selectedOptions": null,  
        "quantity": 3,  
        "unitPrice": 129000  
      }  
    \]  
  },  
  {  
    "id": "92222222-2222-4222-8222-222222222222",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "customerId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
    "address": "88 Le Loi, Da Nang",  
    "status": "Paid",  
    "paymentMethod": "Bank Transfer",  
    "paymentStatus": "Paid",  
    "totalAmount": 198000,  
    "createdAt": "2026-03-30T10:20:00",  
    "orderItems": \[\]  
  }  
\]

**Lưu ý**: `orderItems` trong GET list được load đầy đủ (có `.Include(o => o.OrderItems)`). Nếu thấy `[]` là do order được seed sẵn mà không có OrderItems trong DB, không phải do query thiếu include.

---

### **GET `/api/tenants/{tenantId}/orders/{id}`** {#get-/api/tenants/{tenantid}/orders/{id}}

**Auth**: `[Authorize]`, phải là tenant owner  
**Mô tả**: Xem chi tiết một order. Response giống một item trong danh sách, kèm thêm thông tin customer nếu cần.

**Path Params**:

* `tenantId` — GUID của tenant  
* `id` — GUID của order

**Response 200** — OrderDto:

json  
{  
  "id": "91111111-1111-4111-8111-111111111111",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
  "address": "12 Nguyen Trai, Q1, TP.HCM",  
  "status": "Pending",  
  "paymentMethod": "COD",  
  "paymentStatus": "Pending",  
  "totalAmount": 387000,  
  "createdAt": "2026-03-30T09:15:00",  
  "orderItems": \[  
    {  
      "id": "oi-uuid-1",  
      "orderId": "91111111-1111-4111-8111-111111111111",  
      "productSkuId": "71111111-1111-4111-8111-111111111111",  
      "selectedOptions": null,  
      "quantity": 3,  
      "unitPrice": 129000  
    }  
  \]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | Order không tồn tại hoặc không thuộc tenant |

---

### **POST `/api/tenants/{tenantId}/orders`** {#post-/api/tenants/{tenantid}/orders}

**Auth**: `[Authorize]`, phải là tenant owner  
**Mô tả**: Merchant tạo order trực tiếp (không qua cart). Dùng khi merchant muốn tạo order thay mặt customer.

**Khác với checkout**: Endpoint này tạo order từ dữ liệu trực tiếp, **không** kiểm tra cart, **không** trừ stock tự động.

**Path Params**: `tenantId` — GUID của tenant

**Request Body** (dùng `CreateOrderRequestDto`):

json  
{  
  "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
  "address": "12 Nguyen Trai, Q1, TP.HCM",  
  "paymentMethod": "COD",  
  "paymentStatus": "Pending",  
  "orderItems": \[  
    {  
      "productSkuId": "71111111-1111-4111-8111-111111111111",  
      "quantity": 3,  
      "unitPrice": 129000  
    },  
    {  
      "productSkuId": "73111111-1111-4311-8311-131111111111",  
      "quantity": 1,  
      "unitPrice": 149000  
    }  
  \]  
}

**Validation** (có DataAnnotations trong `CreateOrderRequestDto`):

| Field | Rule |
| ----- | ----- |
| `customerId` | Optional — nếu có, phải tồn tại trong tenant |
| `address` | Required |
| `paymentMethod` | Optional, default `"COD"` |
| `paymentStatus` | Optional, default `"Pending"` |
| `orderItems` | Required, ít nhất 1 item |
| `orderItems[].productSkuId` | Required |
| `orderItems[].quantity` | Required, \>= 1 |
| `orderItems[].unitPrice` | Required, \>= 0 |

**Logic**: `TotalAmount` được tính tự động: `sum(unitPrice * quantity).`  
 `Status` tự động set `"Pending"`. `CreatedAt` tự động set `DateTime.UtcNow`.

**Response 201**:

json  
{  
  "id": "91111111-1111-4111-8111-111111111111",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
  "address": "12 Nguyen Trai, Q1, TP.HCM",  
  "status": "Pending",  
  "paymentMethod": "COD",  
  "paymentStatus": "Pending",  
  "totalAmount": 536000,  
  "createdAt": "2026-04-10T10:00:00Z",  
  "orderItems": \[  
    {  
      "id": "oi-uuid-1",  
      "orderId": "91111111-1111-4111-8111-111111111111",  
      "productSkuId": "71111111-1111-4111-8111-111111111111",  
      "selectedOptions": null,  
      "quantity": 3,  
      "unitPrice": 129000  
    },  
    {  
      "id": "oi-uuid-2",  
      "orderId": "91111111-1111-4111-8111-111111111111",  
      "productSkuId": "73111111-1111-4311-8311-131111111111",  
      "selectedOptions": null,  
      "quantity": 1,  
      "unitPrice": 149000  
    }  
  \]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `400` | `customerId` không tồn tại trong tenant |

---

### **PUT `/api/tenants/{tenantId}/orders/{id}/status`** {#put-/api/tenants/{tenantid}/orders/{id}/status}

**Auth**: `[Authorize]`, phải là tenant owner  
 **Mô tả**: Cập nhật trạng thái của order.

**Path Params**:

* `tenantId` — GUID của tenant  
* `id` — GUID của order

**Request Body** (dùng `UpdateOrderStatusRequestDto`):

json  
{  
  "status": "Confirmed"  
}

**Validation**:

| Field | Rule |
| ----- | ----- |
| `status` | Required — giá trị tự do (chưa có enum validation trong code) |

**Các giá trị status nên dùng**: `"Pending"` → `"Confirmed"` → `"Shipping"` → `"Delivered"` → `"Cancelled"` (chưa có ràng buộc trong code)

**Response 204 No Content**

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Validation fail |
| `404` | Order không tồn tại trong tenant |

---

### **DELETE `/api/tenants/{tenantId}/orders/{id}`** {#delete-/api/tenants/{tenantid}/orders/{id}}

**Auth**: Không yêu cầu (cần thêm `[Authorize]` \+ owner check)  
 **Mô tả**: Xóa vĩnh viễn order khỏi hệ thống.

⚠️ **Cảnh báo nghiệp vụ**: Xóa order là hành động không thể hoàn tác và sai về mặt nghiệp vụ (mất lịch sử). Nên thay bằng `PUT /status` với `status = "Cancelled"`. Endpoint này chỉ nên dùng cho mục đích test.

**Path Params**:

* `tenantId` — GUID của tenant  
* `id` — GUID của order

**Response 204 No Content**

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | Order không tồn tại |

## **CUSTOMER ORDERS** {#customer-orders}

---

### **GET `/api/customers/orders`** {#get-/api/customers/orders}

**Auth**: `[Authorize]` (customer — `userId == customerId`)  
 **Mô tả**: Customer xem lịch sử đơn hàng của mình trong store.

**Chưa implement** — cần thêm vào OrdersController hoặc tạo controller riêng.

**Response 200** — array of OrderDto, sắp xếp mới nhất trước:

json  
\[  
  {  
    "id": "91111111-1111-4111-8111-111111111111",  
    "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
    "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
    "address": "12 Nguyen Trai, Q1, TP.HCM",  
    "status": "Pending",  
    "paymentMethod": "COD",  
    "paymentStatus": "Pending",  
    "totalAmount": 387000,  
    "createdAt": "2026-03-30T09:15:00",  
    "orderItems": \[  
      {  
        "id": "oi-uuid-1",  
        "orderId": "91111111-1111-4111-8111-111111111111",  
        "productSkuId": "71111111-1111-4111-8111-111111111111",  
        "selectedOptions": null,  
        "quantity": 3,  
        "unitPrice": 129000  
      }  
    \]  
  }  
\]  
---

### **GET `/api/customers/orders/{orderId}`** {#get-/api/customers/orders/{orderid}}

**Auth**: `[Authorize]` (customer — `userId == customerId`)  
 **Mô tả**: Customer xem chi tiết một đơn hàng của mình.

**Chưa implement**.

**Response 200** — OrderDto (cấu trúc như trên)

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `403` | Order không thuộc customer này |
| `404` | Order không tồn tại trong tenant |

---

### **POST `/api/customers/orders/checkout`** {#post-/api/customers/orders/checkout}

**Auth**: `[Authorize]` (customer — `userId == customerId`)  
 **Mô tả**: Customer checkout — tạo order từ toàn bộ items trong giỏ hàng.

**Chưa implement** — đây là endpoint quan trọng nhất chưa có.

**Request Body**:

json  
{  
  "address": "12 Nguyen Trai, Q1, TP.HCM",  
  "paymentMethod": "COD"  
}

**Validation**:

| Field | Rule |
| ----- | ----- |
| `address` | Required |
| `paymentMethod` | Required, nên là `"COD"` hoặc `"BankTransfer"` |

**Logic (cần implement)**:

1. Lấy cart của customer (phải có ít nhất 1 item)  
2. Với mỗi CartItem, load SKU tương ứng  
3. Kiểm tra stock của từng SKU (nếu thiếu → 400, thông báo SKU nào hết hàng)  
4. Tạo Order với `Status = "Pending", TotalAmount = sum(sku.Price * quantity)`  
5. Tạo OrderItems từ CartItems (snapshot `UnitPrice = sku.Price` tại thời điểm checkout)  
6. Trừ stock của từng SKU  
7. Xóa toàn bộ CartItems

**Response 201** — OrderDto:

json  
{  
  "id": "new-order-uuid",  
  "tenantId": "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",  
  "customerId": "50d53159-3d52-4574-9aae-01d8b3a71e06",  
  "address": "12 Nguyen Trai, Q1, TP.HCM",  
  "status": "Pending",  
  "paymentMethod": "COD",  
  "paymentStatus": "Pending",  
  "totalAmount": 407000,  
  "createdAt": "2026-04-10T10:30:00Z",  
  "orderItems": \[  
    {  
      "id": "oi-uuid-new-1",  
      "orderId": "new-order-uuid",  
      "productSkuId": "71111111-1111-4111-8111-111111111111",  
      "selectedOptions": null,  
      "quantity": 2,  
      "unitPrice": 129000  
    },  
    {  
      "id": "oi-uuid-new-2",  
      "orderId": "new-order-uuid",  
      "productSkuId": "73111111-1111-4311-8311-131111111111",  
      "selectedOptions": null,  
      "quantity": 1,  
      "unitPrice": 149000  
    }  
  \]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Giỏ hàng trống |
| `400` | `"SKU 'Áo thun đen M' chỉ còn 1 trong kho"` — kèm thông tin SKU nào |
| `401` | Token không hợp lệ |
| `403` | Không phải customer này |
| `404` | Customer không tồn tại trong tenant |

---

### **PUT `/api/customers/orders/{orderId}/cancel` *(Optional)*** {#put-/api/customers/orders/{orderid}/cancel-(optional)}

**Auth**: `[Authorize]` (customer — `userId == customerId`)  
 **Mô tả**: Customer tự hủy đơn hàng (chỉ khi status còn `"Pending"`)

**Chưa implement** — optional feature.

**Logic**:

* Kiểm tra `order.Status == "Pending"` → cho hủy  
* Các status khác (`"Confirmed"`, `"Shipping"`, ...) → 400 không cho hủy

**Request Body**: Không cần body

**Response 200**:

json  
{  
  "id": "91111111-1111-4111-8111-111111111111",  
  "status": "Cancelled",  
  "message": "Đã hủy đơn hàng thành công\!"  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `400` | Order không ở trạng thái `"Pending"` — không thể hủy |
| `403` | Order không thuộc customer này |
| `404` | Order không tồn tại |

---

11. # **Admin — `/api/admin` ⚠️ Test Only** {#admin-—-/api/admin-⚠️-test-only}

### **⚠️ QUAN TRỌNG — ĐỌC TRƯỚC KHI DÙNG** {#⚠️-quan-trọng-—-đọc-trước-khi-dùng}

**Admin controller hiện tại chỉ dùng cho mục đích test và debug trong quá trình phát triển.**

* **Không có `[Authorize]`**: Bất kỳ ai biết URL đều gọi được — không cần token.  
* **Không có role "admin"**: Hệ thống không có role admin thực sự. Các endpoint này không được bảo vệ.  
* **Trả entity thô**: Response bao gồm `passwordHash` của tất cả users — **rủi ro bảo mật nghiêm trọng**.  
* **Không có pagination**: Fetch toàn bộ dữ liệu với deep include — nặng về performance.  
* **Không có kế hoạch phát triển**: Không có ý định mở rộng admin role trong phiên bản hiện tại.

**Khuyến nghị**: Tắt hoặc restrict endpoint này trước khi deploy lên môi trường production. Không expose endpoint này ra ngoài.

---

### **GET `/api/admin/platformUsers`** {#get-/api/admin/platformusers}

**Auth**: Không yêu cầu (**lỗ hổng bảo mật — chỉ dùng test**)  
 **Mô tả**: Lấy toàn bộ platform users kèm nested data sâu (tenants → categories → products → SKUs, customers → cart, orders).

**Response thực tế** (ví dụ rút gọn — xem JSON đầy đủ ở phần dưới):

json  
\[  
  {  
    "id": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
    "fullname": "Van Ngoc Nhu Y",  
    "email": "vanngocnhuy30032006@gmail.com",  
    "passwordHash": "$2a$11$n3RuPIS3pgMJPnqp2FrST...",  
    "phone": null,  
    "role": "merchant",  
    "isActive": true,  
    "createdAt": "2026-03-04T10:14:58",  
    "tenants": \[  
      {  
        "id": "2d273f64-2b77-479c-b114-66311d41b573",  
        "ownerId": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
        "subdomain": "vanngocnhuy30032006",  
        "storeName": "Van Ngoc Nhu Y",  
        "isActive": true,  
        "categories": \[  
          {  
            "id": "44444444-4444-4444-8444-444444444444",  
            "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
            "name": "Bộ sưu tập mùa hè",  
            "description": "Danh mục demo",  
            "isActive": true,  
            "products": \[  
              {  
                "id": "64444444-4444-4444-8444-444444444444",  
                "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
                "categoryId": "44444444-4444-4444-8444-444444444444",  
                "name": "Summer Tote Bag",  
                "description": "Túi tote",  
                "attributes": "{\\"color\\":\[\\"cream\\"\],\\"size\\":\[\\"one-size\\"\]}",  
                "productSkus": \[  
                  {  
                    "id": "76666666-6666-4666-8666-666666666666",  
                    "productId": "64444444-4444-4444-8444-444444444444",  
                    "price": 99000,  
                    "stock": 60,  
                    "attributes": "{\\"color\\":\\"cream\\",\\"size\\":\\"one-size\\"}",  
                    "cartItems": \[\],  
                    "orderItems": \[\]  
                  }  
                \]  
              }  
            \]  
          }  
        \],  
        "customers": \[  
          {  
            "id": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
            "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
            "email": "dieuhoale6406@gmail.com",  
            "passwordHash": "$2a$11$eaFwqA...",  
            "isActive": true,  
            "createdAt": "2026-03-28T08:11:19",  
            "cart": {  
              "id": "e9cc8cf1-1dfb-41ab-be75-5f0eff693c8f",  
              "customerId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
              "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
              "cartItems": \[\]  
            },  
            "orders": \[  
              {  
                "id": "92222222-2222-4222-8222-222222222222",  
                "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
                "customerId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
                "address": "88 Le Loi, Da Nang",  
                "status": "Paid",  
                "paymentMethod": "Bank Transfer",  
                "paymentStatus": "Paid",  
                "totalAmount": 198000,  
                "createdAt": "2026-03-30T10:20:00",  
                "orderItems": \[\]  
              }  
            \]  
          }  
        \],  
        "orders": \[  
          {  
            "id": "92222222-2222-4222-8222-222222222222",  
            "tenantId": "2d273f64-2b77-479c-b114-66311d41b573",  
            "customerId": "5c20ba17-29de-459e-b2d2-a2736e85f75d",  
            "address": "88 Le Loi, Da Nang",  
            "status": "Paid",  
            "paymentMethod": "Bank Transfer",  
            "paymentStatus": "Paid",  
            "totalAmount": 198000,  
            "createdAt": "2026-03-30T10:20:00",  
            "orderItems": \[\]  
          }  
        \]  
      }  
    \]  
  }  
\]

**Vấn đề đã biết trong response**:

* `passwordHash` bị lộ — nghiêm trọng  
* Order xuất hiện **2 lần**: một lần trong `tenant.customers[x].orders` và một lần trong `tenant.orders` — duplicate  
* `cartItems: []` và `orderItems: []` trong ProductSku — thừa và nặng

---

### **DELETE `/api/admin/platformUsers/{id}`** {#delete-/api/admin/platformusers/{id}}

**Auth**: Không yêu cầu (**chỉ dùng test**)  
 **Mô tả**: Xóa một platform user theo ID.

**Path Params**: `id` — GUID của PlatformUser

**Response 200** — trả entity thô của user đã xóa (bao gồm `passwordHash`):

json  
{  
  "id": "b4ba40e9-7c8c-4d6f-bf8b-50839e99b3dd",  
  "fullname": "Van Ngoc Nhu Y",  
  "email": "vanngocnhuy30032006@gmail.com",  
  "passwordHash": "$2a$11$n3RuPIS3pgMJPnqp2FrST...",  
  "phone": null,  
  "role": "merchant",  
  "isActive": true,  
  "createdAt": "2026-03-04T10:14:58",  
  "tenants": \[\]  
}

**Errors**:

| Status | Trường hợp |
| ----- | ----- |
| `404` | PlatformUser không tìm thấy với ID này |

---

12. # **Luồng truy cập sản phẩm: Merchant vs Customer** {#luồng-truy-cập-sản-phẩm:-merchant-vs-customer}

Đây là điểm dễ gây nhầm lẫn. Sản phẩm được truy cập theo **2 luồng khác nhau** tùy theo vai trò.

---

## **Luồng 1: Merchant quản lý sản phẩm** {#luồng-1:-merchant-quản-lý-sản-phẩm}

Merchant đăng nhập và quản lý sản phẩm của store mình qua ID của tenant:

POST /simpleauth/merchant/login  
→ nhận tenants\[{ tenantId, subdomain }\]  
→ merchant chọn store muốn quản lý  
→ dùng tenantId đó cho tất cả các request tiếp theo

GET  /api/tenants/{tenantId}/products		→ Xem danh sách (biết tenantId)  
GET  /api/tenants/{tenantId}/products/{id}	→ Xem chi tiết  
POST /tenants/{tenantId}/products 		→ Tạo mới  
PUT /tenants/{tenantId}/products/{id} 		→ Sửa  
DELETE /tenants/{tenantId}/products/{id} 	→ Xóa  
GET /tenants/{tenantId}/orders 			→ Xem tất cả orders  
PUT /tenants/{tenantId}/orders/{id}/status 	→ Cập nhật trạng thái

**Cách merchant biết `tenantId`**: Sau khi đăng nhập, JWT chứa `tenantId`. Merchant dùng `tenantId` này trong tất cả request quản lý.

---

## **Luồng 2: Customer xem sản phẩm (Storefront)** {#luồng-2:-customer-xem-sản-phẩm-(storefront)}

Customer (hoặc khách vãng lai) truy cập store qua **subdomain**, không biết `tenantId`. Luồng như sau:

**\[Bước 1\] Lookup store**  
GET /tenants/subdomain/{subdomain}  
  → nhận { id: "tenant-uuid", ... }

**\[Bước 2\] Load nội dung store**  
GET /tenants/{tenantId}/categories      → Menu danh mục  
GET /tenants/{tenantId}/products        → Danh sách sản phẩm  
GET /tenants/{tenantId}/products/{id}   → Chi tiết sản phẩm (customer click)

**\[Bước 3\] Customer đăng nhập / đăng ký**  
POST /simpleauth/customer/register      → (kèm subdomain trong body)  
POST /simpleauth/customer/login?subdomain={subdomain}

**\[Bước 4\] Thêm vào giỏ**  
POST /tenants/{tenantId}/customers/{customerId}/cart/items

**\[Bước 5\] Xem giỏ hàng**  
GET /tenants/{tenantId}/customers/{customerId}/cart/items

**\[Bước 6\] Đặt hàng**  
POST /tenants/{tenantId}/customers/{customerId}/checkout

**\[Bước 7\] Xem lịch sử đơn**  
GET /tenants/{tenantId}/customers/{customerId}/orders

**Sơ đồ luồng đầy đủ cho storefront**:

\[Customer vào pbl3-shop.fluxify.io\]  
        ↓  
GET /api/tenants/subdomain/pbl3-shop  
        ↓ (nhận được tenantId)  
GET /api/tenants/{tenantId}/categories  → Hiển thị menu danh mục  
GET /api/tenants/{tenantId}/products    → Hiển thị danh sách sản phẩm  
        ↓ (customer chọn sản phẩm)  
GET /api/tenants/{tenantId}/products/{productId}  → Trang chi tiết sản phẩm  
        ↓ (customer đăng nhập / đã đăng nhập)  
POST /api/tenants/{tenantId}/customers/{customerId}/cartitems  → Thêm vào giỏ  
GET  /api/tenants/{tenantId}/customers/{customerId}/cartitems  → Xem giỏ hàng  
POST /api/tenants/{tenantId}/orders   → Đặt hàng  
---

### **⚠️ Lưu ý quan trọng về phân quyền hiện tại** {#⚠️-lưu-ý-quan-trọng-về-phân-quyền-hiện-tại}

Tất cả các endpoint `GET /products` và `GET /categories` hiện đang **public** (không cần auth). Điều này đúng về mặt nghiệp vụ cho storefront, nhưng **các write endpoints** (POST, PUT, DELETE) cũng chưa có auth — đây là lỗ hổng cần vá.

13. # **Error Codes Summary**  {#error-codes-summary}

| HTTP Code | Khi nào dùng | Ví dụ |
| ----- | ----- | ----- |
| `200 OK` | GET thành công, PUT/DELETE trả về body | GET danh sách, update có response |
| `201 Created` | POST tạo resource thành công | Tạo customer, tạo order |
| `204 No Content` | DELETE hoặc PUT không cần trả body | Xóa customer, update status order |
| `400 Bad Request` | Validation fail, vi phạm business rule, lỗi DB | Email sai format, giỏ trống khi checkout, hết hàng |
| `401 Unauthorized` | Token thiếu, hết hạn, hoặc không hợp lệ | Không có Authorization header, token expired |
| `403 Forbidden` | Đã auth nhưng không có quyền | Customer A đọc giỏ của Customer B, merchant sửa tenant của người khác |
| `404 Not Found` | Resource không tồn tại hoặc không thuộc tenant | Product sai tenantId, customer không tồn tại |
| `409 Conflict` | Duplicate unique field | Subdomain đã tồn tại, email trùng trong cùng store |
| `500 Internal Server Error` | Lỗi server không xử lý được | Exception chưa được catch |


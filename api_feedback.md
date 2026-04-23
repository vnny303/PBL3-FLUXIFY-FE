# Báo cáo Trạng thái Ghép nối API & Yêu cầu Frontend - Backend (Storefront)

Qua quá trình rà soát toàn bộ cấu trúc Frontend (`apps/storefront/src`), đây là danh sách phân loại chi tiết các tính năng **hiện đang chạy bằng Mock Data (chưa nối API)** hoặc **chưa được triển khai hoàn chỉnh do thiếu Endpoint từ Backend**. 

Bạn có thể gửi trực tiếp tài liệu này cho đội Backend làm Feedback:

---

## 1. Quản lý Hồ sơ Cá nhân (Profile Settings)
**File FE xử lý:** `ProfileSettings.jsx`
- **Trạng thái hiện tại:** Hoàn toàn chạy bằng `useState`. Avatar, Tên, Số điện thoại và logic Đổi mật khẩu đang bị Fake. Hàm `authService.getCurrentUser()` hiện tại trả về quá ít thông tin (thường chỉ có Email và ID).
- **👉 API Backend cần bổ sung/cung cấp:**
  1. `PUT /api/customer/profile`: Cập nhật thông tin cơ bản (`firstName`, `lastName`, `phone`).
  2. `PUT /api/customer/password`: Đổi mật khẩu (truyền `currentPassword`, `newPassword`).
  3. `POST /api/customer/avatar`: Upload và thay đổi ảnh đại diện.
  4. Nâng cấp response của `GET /api/auth/me`: Trả về đầy đủ object có chứa Phone, Avatar, Họ Tên.

## 2. Sổ Địa chỉ (Address Book)
**File FE xử lý:** `SavedAddresses.jsx` & `addressService.js`
- **Trạng thái hiện tại:** Trên giao diện `SavedAddresses.jsx` đang dùng mảng tĩnh "John Doe". File `addressService.js` có tồn tại các hàm gọi API nhưng lại đang bám dính vào **format cũ lỗi thời** giống hệt Cart trước đó (`/api/tenants/{tenantId}/customers/{customerId}/addresses`).
- **👉 API Backend & FE cần làm việc lại:**
  Thống nhất tạo ra cụm API gọn nhẹ lấy theo context Token (giống như My Orders vừa được fix):
  1. `GET /api/customer/addresses`: Lấy danh sách địa chỉ.
  2. `POST /api/customer/addresses`: Tạo địa chỉ mới (cờ `isDefault`).
  3. `PUT /api/customer/addresses/{id}`: Cập nhật địa chỉ.
  4. `DELETE /api/customer/addresses/{id}`: Xoá địa chỉ.

## 3. Hệ thống Thông báo (Notifications)
**File FE xử lý:** `Notifications.jsx`
- **Trạng thái hiện tại:** Toàn bộ lịch sử thông báo (Đơn hàng đang giao, Khuyến mãi,...) đều là Mock.
- **👉 API Backend cần bổ sung:**
  1. `GET /api/customer/notifications`: Lấy danh sách thông báo của User kèm cờ `isRead`.
  2. `PUT /api/customer/notifications/{id}/read`: Đánh dấu đã đọc.
  3. `PUT /api/customer/notifications/read-all`: Đánh dấu đọc tất cả.

## 4. Đánh giá & Bình luận (Reviews & Ratings)
**File FE xử lý:** `ProductTabs.jsx`, `ReviewList.jsx`
- **Trạng thái hiện tại:** Ở bước trước Frontend đã được cấu hình để "hứng" dữ liệu chuẩn từ properties `product.reviews`. Tuy nhiên, thực tế hàm API `getProductById` của BE có vẻ chưa support gộp Review vào payload. Nút "Write a Review" cũng chưa có hàm xử lý.
- **👉 API Backend cần bổ sung:**
  1. **Enrich Payload Product:** API `GET /api/products/{id}` cần trả kèm thêm trường `averageRating`, `numReviews`, và mảng `reviews: []` để Frontend hiển thị chữ.
  2. `POST /api/products/{id}/reviews`: Gửi một đánh giá mới (Gồm: Số sao, Text comment, Ảnh đính kèm nếu có).

## 5. Sản phẩm Yêu thích (Wishlist)
**File FE xử lý:** Nằm rải rác ở `ProductCard` và context.
- **Trạng thái hiện tại:** Chỉ lưu bằng biến ảo ở RAM `AppContext`. Cứ ấn F5 tải lại trang hoặc đăng xuất là bay màu danh sách Yêu thích.
- **👉 API Backend cần bổ sung:**
  1. `GET /api/customer/wishlist`: Lấy danh sách ID các sản phẩm đã thả tim.
  2. `POST /api/customer/wishlist` (Body chứa `productId`): Thêm vào danh sách thả tim.
  3. `DELETE /api/customer/wishlist/{productId}`: Bỏ yêu thích.

## 6. Hủy & Hoàn trả Đơn hàng (Quy trình Hậu Checkout)
**File FE xử lý:** `OrderDetails.jsx`
- **Trạng thái hiện tại:** Storefront đã view được thông tin Đơn sau khi thanh toán nhưng User hoàn toàn KHÔNG có quyền tự tác động lên Đơn hàng của mình. (Không có nút Submit Hủy Đơn).
- **👉 API Backend cần bổ sung (Nếu Bussiness Model yêu cầu):**
  1. `PUT /api/customer/orders/{orderId}/cancel`: Gửi yêu cầu hủy đơn với lý do.
  
---
**Tổng kết:** Để Storefront hoàn thiện 100% chuẩn e-commerce, thiết yếu nhất là BE cần làm phẳng lại Route cho cụm **Address** (xóa tenant/customer ID), và phát hành các endpoint quản lý tài nguyên nội tại của user đó gồm: **Profile, Password, Wishlist, và Notifications.**

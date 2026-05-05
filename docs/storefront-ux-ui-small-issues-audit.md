# [Audit] Storefront UX/UI & Small Issues

Tài liệu này liệt kê các khiếm khuyết về mặt giao diện, quy trình trải nghiệm người dùng (UX) và các lỗi nhỏ trong mã nguồn Frontend của ứng dụng Fluxify Storefront.

## 1. Các vấn đề Tổng quan (Global Issues)

### 1.1 Ngôn ngữ hỗn hợp (Mixed Languages)
*   **Vấn đề**: Giao diện đang bị trộn lẫn giữa tiếng Anh và tiếng Việt. Ví dụ: Trong `ReviewList.jsx`, có các chuỗi "Phân loại đã mua", "Không rõ" xen lẫn với "Newest", "Highest Rating".
*   **Tác động**: Gây cảm giác thiếu chuyên nghiệp và khó chịu cho người dùng.
*   **Vị trí**: 
    - `ReviewList.jsx`
    - `Header.jsx` (toast thông báo)
    - `MyOrders.jsx` (định dạng ngày tháng)
*   **Giải pháp**: Nhất quán sử dụng một ngôn ngữ (ưu tiên tiếng Việt cho demo local) hoặc triển khai i18n cơ bản.

### 1.2 Trạng thái trống và Tải dữ liệu (Empty & Loading States)
*   **Vấn đề**: Nhiều trang sử dụng văn bản đơn giản hoặc vòng xoay (spinner) cơ bản thay vì Skeleton.
*   **Vị trí**:
    - Trang Shop (`Shop.jsx`): Khi lọc không ra kết quả, giao diện chỉ hiện dòng chữ đơn điệu.
    - Trang Account (`MyOrders.jsx`): Spinner quay khi tải đơn hàng.
*   **Giải pháp**: Sử dụng component `Skeleton.jsx` đã có sẵn để tạo cảm giác mượt mà hơn khi tải dữ liệu.

---

## 2. Kiểm định chi tiết theo Trang

### 2.1 Header & Điều hướng (Navigation)
*   **Vấn đề**: 
    - Hiệu ứng `backdrop-blur` trong `Header.jsx` bị gắn cứng độ mờ (opacity `CC`), có thể không phù hợp với mọi màu sắc chủ đạo (theme primary color).
    - Menu Mobile (`Header.jsx`) còn sơ sài, chỉ là một danh sách link đơn giản.
    - Tìm kiếm (`Header.jsx`): Kết quả tìm kiếm hiển thị dạng danh sách thả xuống nhưng nút "See all results" chưa được trau chuốt về UI.
*   **Đề xuất**: 
    - Thêm hiệu ứng slide-in cho menu mobile.
    - Cải thiện hiển thị giá tiền trong ô search (sử dụng font-bold và màu sắc nổi bật hơn).

### 2.2 Trang Chủ (Home Page)
*   **Vấn đề**: 
    - Hình ảnh danh mục (`CATEGORY_IMAGES`) đang được lấy cứng từ Unsplash. Nếu ảnh bị lỗi hoặc chậm sẽ làm vỡ giao diện.
    - Các phần "Shop by Category" và "Featured Products" thiếu hiệu ứng hover sinh động.
*   **Đề xuất**: Thêm hiệu ứng `scale-105` và `shadow-xl` rõ rệt hơn khi hover vào các thẻ sản phẩm/danh mục.

### 2.3 Trang Cửa hàng (Shop Page)
*   **Vấn đề**: 
    - Bộ lọc giá (Range Slider): Sử dụng thẻ `input type="range"` mặc định của trình duyệt, trông khá thô và khó thao tác trên mobile.
    - Phân trang: Các nút số trang chưa có hiệu ứng chuyển cảnh (transition).
*   **Đề xuất**: Tùy chỉnh CSS cho Range Slider để phù hợp với thiết kế "Premium" của Fluxify.

### 2.4 Trang Chi tiết sản phẩm (Product Detail)
*   **Vấn đề**:
    - `ProductTabs.jsx`: Phần thông số kỹ thuật (Specifications) hiển thị dạng bảng đơn giản.
    - `ReviewList.jsx`: Nút "WRITE A REVIEW" luôn hiển thị cho người dùng đăng nhập nhưng quy trình gửi có thể lỗi nếu Backend chưa hỗ trợ tốt.
*   **Đề xuất**: 
    - Định dạng lại bảng Specifications với các dòng kẻ mờ và font chữ tinh tế hơn.
    - Thêm trạng thái "Verified Purchase" cho các đánh giá thực tế.

### 2.5 Quy trình Thanh toán (Checkout & Confirmation)
*   **Vấn đề**:
    - Trang `OrderConfirmation.jsx` chứa nhiều văn bản tiếng Anh mặc định (Account Holder, Transfer content, v.v.).
    - Thông tin chuyển khoản ngân hàng (`bankTransferMock.js`) đang là dữ liệu giả, cần có cảnh báo rõ ràng hơn cho khách hàng.
*   **Đề xuất**: Việt hóa toàn bộ trang xác nhận đơn hàng để demo thân thiện với người dùng Việt Nam.

---

## 3. Danh sách công việc (FE-Only Fix Checklist)

Dưới đây là các đầu việc có thể thực hiện ngay lập tức mà không cần Backend:

- [ ] **Nhất quán ngôn ngữ**: Chuyển đổi toàn bộ label sang tiếng Việt trong `ReviewList.jsx`, `MyOrders.jsx`, `CheckoutForm.jsx`.
- [ ] **Nâng cấp Footer**: Cập nhật các liên kết chết (About Us, Support, Privacy Policy) thành các trang tĩnh hoặc link placeholder chuyên nghiệp.
- [ ] **Hiệu ứng Micro-interactions**:
    - Thêm `transition` cho tất cả các nút bấm và thẻ sản phẩm.
    - Thêm hiệu ứng `hover:translate-y-[-4px]` cho Product Card.
- [ ] **Cải thiện Skeleton**: Áp dụng Skeleton cho trang Shop và trang Account để thay thế cho Spinner hiện tại.
- [ ] **Việt hóa format ngày tháng**: Sử dụng `vi-VN` thay vì `en-US` trong toàn bộ ứng dụng.

---

## 4. Các vấn đề phụ thuộc API (API-Dependent)

*   **Quản lý địa chỉ**: `SavedAddresses.jsx` hiện đang dùng ID mock cho các địa chỉ mới. Cần Backend ổn định để lưu thực tế.
*   **Cập nhật Profile**: Nút "Save Changes" trong `ProfileSettings.jsx` đang bị disabled cứng do API cập nhật thông tin người dùng (FirstName/LastName) chưa hoàn thiện ở Backend.
*   **Đánh giá sản phẩm**: API Product-level reviews hiện đang trả về 404, FE đang phải fallback.

---

**Kết luận**: Storefront hiện tại có nền tảng UI rất tốt và "Premium". Tuy nhiên, việc thiếu nhất quán trong ngôn ngữ và các trạng thái chờ (loading) làm giảm trải nghiệm tổng thể. Việc thực hiện các bản vá Frontend ở mục 3 sẽ giúp ứng dụng đạt trạng thái "Demo-ready" chuyên nghiệp.

---
*Người kiểm định: Senior UI/UX QA Engineer (Antigravity)*
*Ngày: 05/05/2026*

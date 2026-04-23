# UI Audit Report: Mock Data vs Real API

Báo cáo này tổng hợp các phần giao diện vẫn đang sử dụng dữ liệu giả (Mock Data) hoặc logic cứng (Hardcoded) trong ứng dụng Storefront, mặc dù đã được kết nối với API backend.

## 1. Hệ thống Tài khoản & Người dùng (Account & User)

| Tính năng | Trạng thái | Vấn đề cụ thể | Ưu tiên |
| :--- | :---: | :--- | :--- |
| **Profile Settings** | 🟡 Một phần | Tên (First/Last Name), Số điện thoại và Ảnh đại diện đang dùng `useState` mặc định (Alex Thompson). Cần lấy từ `user` object trong `AuthContext`. | Cao |
| **Saved Addresses** | 🔴 Giả | Dữ liệu địa chỉ trong trang Account là mảng cứng. Chưa có API CRUD cho địa chỉ người dùng. | Trung bình |
| **Notifications** | 🔴 Giả | Toàn bộ thông báo trong Header và trang Account là mockup. Cần hệ thống thông báo thực từ server. | Thấp |
| **User Avatar** | 🔴 Giả | Header và Profile đang dùng ảnh từ `pravatar.cc`. | Thấp |

## 2. Trang Chi tiết Sản phẩm (Product Detail)

| Tính năng | Trạng thái | Vấn đề cụ thể | Ưu tiên |
| :--- | :---: | :--- | :--- |
| **Reviews** | 🔴 Giả | Danh sách đánh giá đang mặc định trống hoặc dùng mẫu. Backend chưa trả về field `reviews` trong product detail. | Trung bình |
| **Specifications** | 🔴 Giả | Bảng thông số kỹ thuật (`ProductTabs`) đang chờ field `specifications`. Hiện tại đang hiện thông báo "No specifications". | Trung bình |
| **Related Products** | 🔴 Giả | Logic gợi ý sản phẩm liên quan đang lấy bừa từ danh sách catalog tổng, chưa có thuật toán gợi ý thực tế. | Thấp |
| **Stock Badge** | 🟡 Cứng | `ProductCard` luôn hiện "In Stock". Cần dùng biến `isInStock` đã tính toán trong `productService`. | Cao |

## 3. Quy trình Thanh toán (Checkout)

| Tính năng | Trạng thái | Vấn đề cụ thể | Ưu tiên |
| :--- | :---: | :--- | :--- |
| **Address Selection** | 🔴 Giả | Người dùng phải nhập tay địa chỉ mỗi lần thanh toán vì trang Checkout chưa lấy được danh sách `Saved Addresses`. | Cao |
| **Invoice Download** | 🔴 Chưa làm | Nút "Download Invoice" ở trang xác nhận đơn hàng chỉ là giao diện, chưa có logic sinh file PDF. | Thấp |
| **Shipping Fees** | 🟡 Cứng | Phí ship đang fix cứng 2 mức $5 và $15 trong code. | Trung bình |

## 4. Giao diện chung (Global UI)

| Tính năng | Trạng thái | Vấn đề cụ thể | Ưu tiên |
| :--- | :---: | :--- | :--- |
| **Category Images** | 🟡 Cứng | Ảnh đại diện cho category trên trang Home đang dùng mapping ID cứng (`CATEGORY_IMAGES`). | Trung bình |
| **Footer Links** | 🔴 Giả | Các link như "Our Story", "Careers", "Help Center" đều trỏ về `#`. | Thấp |
| **Newsletter** | 🔴 Giả | Form đăng ký nhận tin ở Footer chỉ hiện thông báo thành công mà không gửi đi đâu. | Thấp |

---

## Đề xuất hành động tiếp theo:
1. **Ưu tiên 1**: Cập nhật `ProfileSettings.jsx` để hiển thị đúng thông tin của User đang đăng nhập.
2. **Ưu tiên 2**: Sửa logic "In Stock" trên `ProductCard` để phản ánh đúng tồn kho từ SKU.
3. **Ưu tiên 3**: Tìm giải pháp API cho phần Địa chỉ (`Addresses`) để Checkout mượt mà hơn.

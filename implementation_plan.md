# Kế hoạch triển khai tích hợp FE (Phase 1)

Mục tiêu của giai đoạn này không phải refactor hoàn chỉnh, mà là làm cho cả `storefront` và `merchant` chạy end-to-end với backend: login được, giữ token được, gọi API được, và hiển thị dữ liệu không bị 401 vì thiếu auth.

---

## 1. Nguyên tắc triển khai

- Giữ nguyên monorepo hiện tại, không gộp 2 app thành 1.
- Không làm lại kiến trúc lớn ngay lúc này.
- Ưu tiên luồng chạy thực tế: `Login -> lưu token -> gọi API -> render data`.
- Chỉ chuẩn hóa những phần cần thiết để hệ thống chạy được ổn định.

---

## 2. Kế hoạch từng bước

### Bước 1: Chốt cấu hình API dùng chung

Mục tiêu: cả 2 app gọi cùng một backend base URL mà không hardcode.

- Kiểm tra và thống nhất biến môi trường `VITE_API_URL` trong `apps/storefront/.env` và `apps/merchant/.env`.
- Tạo hoặc chuẩn hóa file config API trong `packages/shared` để đọc base URL từ env.
- Đảm bảo tất cả request đều đi qua một axios instance dùng chung.

Kết quả mong đợi:
- FE storefront và merchant đều trỏ về cùng backend local.
- Không còn URL API được viết rải rác trong từng page/component.

### Bước 2: Chuẩn hóa token storage

Mục tiêu: token đăng nhập được lưu ở một nơi và đọc lại được ở cả 2 app.

- Dùng một key thống nhất trong `localStorage`.
- Tạo các hàm dùng chung trong `packages/shared`:
  - `getToken`
  - `setToken`
  - `removeToken`
- Không duplicate logic token trong `storefront` và `merchant`.

Kết quả mong đợi:
- Login ở app này thì app kia vẫn đọc được token.
- Logout xóa token ở cả hai app vì cùng dùng chung storage key.

### Bước 3: Gắn token tự động vào request

Mục tiêu: mọi API protected đều tự có `Authorization` header.

- Cấu hình axios interceptor ở `packages/shared`.
- Trước mỗi request, lấy token từ storage và gắn vào header `Authorization: Bearer <token>`.
- Nếu không có token thì request vẫn chạy cho các API public.

Kết quả mong đợi:
- Không cần set header thủ công ở từng page/hook.
- Giảm lỗi 401 do quên attach token.

### Bước 4: Làm login flow tối thiểu

Mục tiêu: login thành công và lưu token.

- Xác định endpoint login từ backend.
- Sau khi login thành công:
  - lưu token bằng `setToken`
  - chuyển hướng về trang phù hợp
- Nếu backend trả thêm role/user info thì lưu tạm ở state hiện tại để dùng ngay.

Kết quả mong đợi:
- Có thể đăng nhập từ FE.
- Token được lưu ngay sau khi login.

### Bước 5: Gọi `/me` để xác định user hiện tại

Mục tiêu: FE biết user đã login hay chưa và user là role nào.

- Khi app khởi động, gọi endpoint `/me` hoặc endpoint tương đương.
- Nếu request thành công:
  - cập nhật user state
  - xác định role hiện tại
- Nếu request trả 401:
  - xóa token
  - coi như chưa login

Kết quả mong đợi:
- App tự nhận diện trạng thái đăng nhập sau khi reload.
- FE có thể dựa vào user state để render đúng UI.

### Bước 6: Rẽ luồng theo role

Mục tiêu: user vào đúng app theo vai trò của mình.

- Customer dùng `storefront`.
- Admin/Merchant dùng `merchant`.
- Nếu role không phù hợp với app hiện tại, redirect về app đúng.

Kết quả mong đợi:
- Không để customer đi sâu vào merchant UI.
- Không để merchant account bị xem như customer bình thường.

### Bước 7: Kết nối data thật vào màn hình chính

Mục tiêu: chứng minh flow end-to-end bằng data thực từ backend.

- Chọn 1-2 màn hình chính ở mỗi app.
- Dùng shared axios client để gọi API thật.
- Render dữ liệu nhận được từ backend sau khi login.

Kết quả mong đợi:
- Có ít nhất một màn hình hoạt động đúng với auth thật.
- Không còn trạng thái “login xong nhưng không thấy data”.

### Bước 8: Test end-to-end

Mục tiêu: xác minh toàn bộ luồng hoạt động ổn định.

- Test login từ `storefront`.
- Refresh trang và kiểm tra token/user state còn hoạt động.
- Mở `merchant` và kiểm tra token có được nhận diện.
- Test API protected để xác nhận không còn lỗi 401 do thiếu token.
- Test logout để đảm bảo token bị xóa và user state được reset.

Kết quả mong đợi:
- FE gọi API được từ cả hai app.
- Auth hoạt động xuyên suốt.
- Data hiển thị đúng sau login.

---

## 3. Phạm vi không làm ở phase này

- Không tối ưu kiến trúc shared package đến mức hoàn chỉnh.
- Không chuyển toàn bộ code sang clean architecture.
- Không tái cấu trúc toàn bộ UI/components ngay lập tức.
- Không xử lý những phần chưa ảnh hưởng trực tiếp đến flow login/API.

---

## 4. Thứ tự triển khai đề xuất

1. Chuẩn hóa `VITE_API_URL` cho cả hai app.
2. Tạo shared token utilities trong `packages/shared`.
3. Cấu hình shared axios client và interceptor.
4. Hook login vào shared token storage.
5. Gọi `/me` để tạo user session state.
6. Thêm kiểm tra role và redirect cơ bản.
7. Nối ít nhất một màn hình thật với API protected.
8. Test lại end-to-end trên cả hai app.

---

## 5. Checklist hoàn thành

- [ ] Cả 2 app đọc được backend URL từ `.env`
- [ ] Có shared axios client dùng chung
- [ ] Token được lưu và đọc từ một nguồn duy nhất
- [ ] Request protected tự gắn `Authorization`
- [ ] Login thành công và lưu token
- [ ] `/me` trả về đúng user hiện tại
- [ ] Role được xác định rõ
- [ ] Redirect theo role hoạt động cơ bản
- [ ] Logout xóa token và reset session
- [ ] API protected không còn lỗi 401 do thiếu token
- [ ] Ít nhất một flow login -> data render chạy ổn định

---

## 6. Tiêu chí kết thúc phase 1

Phase 1 được xem là hoàn thành khi:

- Có thể login từ FE.
- FE gọi được API protected từ cả `storefront` và `merchant`.
- Token được dùng chung giữa hai app.
- Reload trang không làm mất nhận diện user.
- Data thật từ backend hiển thị đúng sau khi đăng nhập.

---

## 7. Ghi chú thực thi

- Nếu gặp chỗ nào đang duplicate API/auth logic, ưu tiên gom lại phần đó trước.
- Nếu shared package chưa đủ hoàn chỉnh, chỉ cần dùng nó cho API client và auth utilities trước.
- Sau khi phase 1 chạy ổn, mới tiếp tục sang phase 2: chuẩn hóa kiến trúc và mở rộng shared layer.

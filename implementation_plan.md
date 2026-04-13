# Kế hoạch Refactor Hệ thống Front-End (Monorepo)

Việc gộp `storefront` (dành cho end-user) và `merchant` (hệ thống admin quản lý) vào cùng một Monorepo (`pnpm workspace`) là một bước tiến rất tốt. Nó giúp dễ dàng quản lý dependencies và tái sử dụng code. Tuy nhiên, việc "refactor luồng" ở kiến trúc này đòi hỏi chúng ta phải có một phương án bài bản để không biến Monorepo thành một "Big Ball of Mud".

Dựa vào cấu trúc hiện tại (Gồm `apps/merchant`, `apps/storefront` và `packages/shared`), dưới đây là kế hoạch chi tiết để tái cấu trúc lại các luồng chính nhằm tối ưu hóa sự quản lý mã nguồn.

> [!NOTE]
> Hệ thống hiện tại đang hướng theo **Feature-Sliced Design (FSD)**, vì vậy chúng ta sẽ bám sát chuẩn thiết kế này khi gộp/tách các module nhé.

---

## 1. Luồng Tái cấu trúc Code Chung (Shared Layer)

Hiện tại thư mục `packages/shared` mới chỉ được khởi tạo nhưng chưa có mã nguồn bên trong. Rất nhiều logic và UI có thể tái sử dụng đang nằm rải rác.

### Các thành phần cần đưa vào `packages/shared`:
- **UI Components (`shared/ui`)**: Các component cơ sở dùng chung cho cả 2 dự án. Ví dụ: `Button`, `Input`, `Modal`, `Toaster`, `Table`.
- **API Client (`shared/api`)**: Khởi tạo Axios instances. Cấu hình sẵn base URL, headers mặc định, error handling. 
- **Utilities (`shared/lib`)**: Các hàm format giá tiền (`formatCurrency`), format ngày tháng (`formatDate`), validation (Regex/Zod schemas).
- **Entities (`shared/entities`)**: Định nghĩa chung về Type/Interface (nếu dùng TypeScript/JSDoc) cho các đối tượng như `Product`, `Order`, `Customer`.

## 2. Luồng Routing & Deployment (Navigation Flow)

Hiện tại ở `App.jsx` của cả hai app, route đều chạy ở root URL (`/`). Nếu chúng ta triển khai hệ thống, ta cần quy hoạch luồng chạy chung rõ ràng.

- **Option A - Sub-domain Routing (Khuyên dùng)**: 
  - `admin.fluxify.com` trỏ vào build của thư mục `apps/merchant`.
  - `fluxify.com` trỏ tới build của `apps/storefront`.
  - Ưu điểm: Tách biệt hoàn toàn session, cookie, thuận tiện quản lý bảo mật.
- **Option B - Path-based Routing**: 
  - Đẩy toàn bộ `merchant` vào scope `/admin/*`. Lúc này ta cần sửa cấu hình React Router `<Route path="/admin" ...>` ở trong `merchant`.
  - Ở local có thể setup Vite/Nginx để proxy cho proxy.

## 3. Luồng Authentication & Fetching Dữ liệu (State Flow)

Việc quản lý Token (Login, Refresh token, Logout) giữa Merchant Admin và Customer Storefront cần quy hoạch rõ ràng.

- **Refactor Interceptors**: Xây dựng một cấu hình Axios và Interceptor ở `packages/shared/api`. Hàm này sẽ tự inject Session/Token từ Storage. Tránh lặp lại cấu hình thư viện `axios` riêng ở từng app.
- **State Management**: Cả 2 project hiện đang dùng `@tanstack/react-query`. Bạn có thể thiết lập `QueryClient` wrapper trong `packages/shared` để đồng bộ chiến lược cache, retry... 
- **User Session**: Tách luồng Auth/Login thành các hooks (`useAuth`, `useLogin`).

---

## Các câu hỏi/Open Questions để đi vào bước thực thi

Tôi cần bạn phản hồi để chúng ta bắt đầu:

> [!IMPORTANT]
> 1. **Về Routing:** Bạn muốn chia luồng chạy giữa `merchant` và `storefront` thành 2 tên miền **Sub-domain (admin. domain. com)** hay là cùng 1 miền dùng **Path-based (domain. com/admin)**?
> 2. **Về Share Code:** Bạn dùng package manager nào? (Tôi thấy file `pnpm-workspace.yaml`, vậy chúng ta sẽ config workspace qua `pnpm` để cài dependencies từ `shared` vào `apps` chứ?)
> 3. **Công việc đầu tiên:** Bạn muốn thực thi phần nào ĐẦU TIÊN? (Ví dụ: Setup `pnpm` config và chuyển UI components xuống `/packages/shared`, HAY setup lại luồng Auth API dùng chung?).

---

## Verification Plan
1. **Chạy Local (Dev Server)**: Sau khi tách `packages/shared`, chạy `pnpm run dev` trên cả hai ứng dụng để đảm bảo việc load module local thành công.
2. **Kiểm tra luồng API/Auth**: Thực hiện login thử để kiểm chứng Axios Interceptors (từ shared) hoạt động chuẩn trên từng App.

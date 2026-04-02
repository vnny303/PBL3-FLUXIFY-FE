# PBL3 Fluxify FE

Frontend cho hệ thống Fluxify (Customer app), xây dựng bằng React + Vite, refactor theo kiến trúc FSD (Feature-Sliced Design).

## Overview

- Framework: React 19
- Build tool: Vite 7
- Router: react-router-dom
- HTTP client: axios
- UI icons: lucide-react
- Toast: sonner
- Styling: Tailwind CSS v4 (qua plugin Vite)
- Package manager: pnpm

## Tech Stack

- Runtime: Node.js LTS (khuyến nghị >= 20)
- Package manager: pnpm 10+
- Language: JavaScript (ESM)
- Lint: ESLint 9

## Project Structure

Source chính nằm trong `src/`:

```text
src/
	app/
		App.jsx
		providers/
		styles/
	apps/
		customer/
			pages/
			widgets/
	entities/
	features/
	shared/
	main.jsx
```

Ý nghĩa nhanh:

- `app/`: composition root (Router, Provider wiring, global app shell)
- `apps/customer/pages`: route-level pages cho customer
- `apps/customer/widgets`: widget cấp app/customer
- `features/`: user actions/flows (auth, cart-actions, checkout, ...)
- `entities/`: business entities (cart, product, order, user, ...)
- `shared/`: shared libs, api client, UI primitives

## Prerequisites

Đảm bảo cài sẵn:

- Node.js
- pnpm

Kiểm tra nhanh:

```bash
node -v
pnpm -v
```

## Installation

```bash
pnpm install
```

## Environment Variables

Tạo file `.env` (hoặc `.env.local`) tại root project nếu cần đổi API URL:

```bash
VITE_API_URL=http://localhost:5000
```

Ghi chú:

- Nếu không set `VITE_API_URL`, app fallback về `http://localhost:5000`.
- `src/shared/api/authService.js` hiện có `MOCK_API = true`, nên auth flow đang chạy mock mặc định.

## Available Scripts

```bash
pnpm run dev      # Start dev server
pnpm run build    # Production build
pnpm run preview  # Preview production build locally
pnpm run lint     # Run ESLint
```

## Run In Development

```bash
pnpm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

## Production Build

```bash
pnpm run build
pnpm run preview
```

Output build tại `dist/`.

## Route Map

- `/`
- `/shop`
- `/product/:id`
- `/about`
- `/contact`
- `/wishlist`
- `/account`
- `/checkout`
- `/order-confirmation`
- `/login`
- `/signup`

## Post-Refactor Smoke Test (10-15 minutes)

Chạy checklist này trước khi merge:

1. Build pass
- `pnpm run build`

2. Route smoke
- Mở các route chính trong mục Route Map.

3. Core user flows
- Từ `Shop`, mở `Product Detail`.
- Add to cart từ Product Detail.
- Trong popup, bấm `View Cart` (đảm bảo không crash).
- Trong cart drawer: tăng/giảm số lượng, remove item.
- Checkout button điều hướng đúng sang `/checkout`.

4. Auth and modal
- Khi chưa login, add-to-cart mở auth modal.
- Login/Signup điều hướng đúng.

5. Header interactions
- Search dropdown hoạt động.
- Notification dropdown hoạt động.
- Profile dropdown điều hướng đúng.

6. Account flows
- `My Orders` -> `Order Details`.
- Open/close Review modal.
- `Buy again` thêm sản phẩm lại vào cart.

## Known Notes

- Cảnh báo chunk size > 500 kB khi build là warning tối ưu hiệu năng, không phải build error.
- Có thể tối ưu thêm bằng route-level lazy loading hoặc manual chunking trong Vite/Rollup.

## Coding Conventions

- Ưu tiên tổ chức theo FSD layers.
- Component UI thuần tái sử dụng đặt ở `shared/ui` hoặc `entities/*/ui` tùy scope.
- Logic tương tác theo use-case đặt ở `features/*`.
- Tránh import ngược tầng (layer violation).

## Troubleshooting

Nếu gặp màn hình trắng:

1. Mở DevTools Console để xem runtime error.
2. Chạy lại:

```bash
pnpm run lint
pnpm run build
```

3. Hard reload trình duyệt (`Ctrl + F5`).

## License

Nội bộ học thuật / đồ án PBL3.

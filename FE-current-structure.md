# Cay thu muc va file code hien tai cua FE

Ngay snapshot: 2026-04-15
Pham vi: apps/ va packages/ (da loai tru node_modules, dist, .git, .dist)

## Root (muc repo)
- .dist/
- .git/
- .gitignore
- .vscode/
- apps/
- dist/
- FE-integration-architecture.md
- implementation_plan.md
- node_modules/
- package.json
- packages/
- pnpm-lock.yaml
- pnpm-workspace.yaml
- README.md

## Cay thu muc apps/ va packages/

apps/
|-- merchant
|   |-- src
|   |   |-- app
|   |   |   |-- styles
|   |   |   |   \-- index.css
|   |   |   |-- App.jsx
|   |   |   \-- main.jsx
|   |   |-- entities
|   |   |   |-- customer
|   |   |   |   \-- api
|   |   |   |       |-- customerApi.js
|   |   |   |       \-- mockData.js
|   |   |   |-- order
|   |   |   |   \-- api
|   |   |   |       |-- mockData.js
|   |   |   |       \-- orderApi.js
|   |   |   \-- product
|   |   |       \-- api
|   |   |           |-- mockData.js
|   |   |           \-- productApi.js
|   |   |-- features
|   |   |-- pages
|   |   |   |-- AddProduct
|   |   |   |   |-- AddProduct.jsx
|   |   |   |   \-- useAddProduct.js
|   |   |   |-- Analytics
|   |   |   |   \-- Analytics.jsx
|   |   |   |-- Begin
|   |   |   |   \-- Start.jsx
|   |   |   |-- CreateCategory
|   |   |   |   \-- CreateCategory.jsx
|   |   |   |-- CreateOrder
|   |   |   |   |-- CreateOrder.jsx
|   |   |   |   \-- useCreateOrder.js
|   |   |   |-- CustomerProfile
|   |   |   |   \-- CustomerProfile.jsx
|   |   |   |-- Customers
|   |   |   |   |-- Customers.jsx
|   |   |   |   \-- useCustomers.js
|   |   |   |-- Home
|   |   |   |   |-- Home.jsx
|   |   |   |   \-- useHome.js
|   |   |   |-- Inventory
|   |   |   |   \-- Inventory.jsx
|   |   |   |-- OnlineStore
|   |   |   |   \-- OnlineStore.jsx
|   |   |   |-- OrderDetails
|   |   |   |   \-- OrderDetails.jsx
|   |   |   |-- Orders
|   |   |   |   |-- Orders.jsx
|   |   |   |   \-- useOrders.js
|   |   |   |-- PageManager
|   |   |   |   \-- PageManager.jsx
|   |   |   |-- Products
|   |   |   |   |-- Products.jsx
|   |   |   |   \-- useProducts.js
|   |   |   \-- Settings
|   |   |       \-- Settings.jsx
|   |   |-- shared
|   |   |   |-- api
|   |   |   |   |-- axiosClient.js
|   |   |   |   |-- config.js
|   |   |   |   |-- mockApi.js
|   |   |   |   \-- queryKeys.js
|   |   |   |-- config
|   |   |   |   \-- storefrontSettings.js
|   |   |   \-- lib
|   |   |       |-- formatters
|   |   |       |   \-- formatters.js
|   |   |       \-- hooks
|   |   |           |-- useStoreData.js
|   |   |           \-- useUnsavedChangesGuard.js
|   |   \-- widgets
|   |       |-- Layout
|   |       |   \-- ui
|   |       |       |-- DashboardLayout.jsx
|   |       |       |-- Header.jsx
|   |       |       \-- Sidebar.jsx
|   |       \-- LivePreview
|   |           \-- ui
|   |               \-- LivePreview.jsx
|   |-- .env
|   |-- .gitignore
|   |-- eslint.config.js
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- README.md
|   \-- vite.config.js
\-- storefront
    |-- src
    |   |-- app
    |   |   |-- providers
    |   |   |   |-- AppContext.jsx
    |   |   |   |-- ProductContext.jsx
    |   |   |   |-- SearchContext.jsx
    |   |   |   \-- WishlistContext.jsx
    |   |   |-- styles
    |   |   |   \-- index.css
    |   |   \-- App.jsx
    |   |-- apps
    |   |   \-- customer
    |   |       |-- pages
    |   |       |   |-- about
    |   |       |   |   \-- ui
    |   |       |   |       \-- About.jsx
    |   |       |   |-- account
    |   |       |   |   \-- ui
    |   |       |   |       |-- AccountPage.jsx
    |   |       |   |       |-- MyOrders.jsx
    |   |       |   |       |-- Notifications.jsx
    |   |       |   |       |-- OrderDetails.jsx
    |   |       |   |       |-- ProfileSettings.jsx
    |   |       |   |       \-- SavedAddresses.jsx
    |   |       |   |-- auth
    |   |       |   |   \-- ui
    |   |       |   |       |-- Login.jsx
    |   |       |   |       \-- SignUp.jsx
    |   |       |   |-- checkout
    |   |       |   |   \-- ui
    |   |       |   |       \-- Checkout.jsx
    |   |       |   |-- contact
    |   |       |   |   \-- ui
    |   |       |   |       \-- Contact.jsx
    |   |       |   |-- home
    |   |       |   |   \-- ui
    |   |       |   |       \-- Home.jsx
    |   |       |   |-- order-confirmation
    |   |       |   |   \-- ui
    |   |       |   |       \-- OrderConfirmation.jsx
    |   |       |   |-- product-detail
    |   |       |   |   \-- ui
    |   |       |   |       \-- ProductDetail.jsx
    |   |       |   |-- shop
    |   |       |   |   \-- ui
    |   |       |   |       \-- Shop.jsx
    |   |       |   \-- wishlist
    |   |       |       \-- ui
    |   |       |           \-- Wishlist.jsx
    |   |       \-- widgets
    |   |           |-- CartDrawer.jsx
    |   |           |-- CheckoutLayout.jsx
    |   |           |-- Footer.jsx
    |   |           |-- Header.jsx
    |   |           \-- Sidebar.jsx
    |   |-- entities
    |   |   |-- cart
    |   |   |   \-- model
    |   |   |       \-- CartContext.jsx
    |   |   |-- notification
    |   |   |   \-- model
    |   |   |       \-- useNotifications.js
    |   |   |-- order
    |   |   |   \-- ui
    |   |   |       |-- InvoicePrint.jsx
    |   |   |       |-- OrderItemList.jsx
    |   |   |       |-- OrderStatusTimeline.jsx
    |   |   |       \-- OrderSummaryCard.jsx
    |   |   |-- product
    |   |   |   |-- model
    |   |   |   |   \-- ProductContext.jsx
    |   |   |   \-- ui
    |   |   |       |-- ProductActions.jsx
    |   |   |       |-- ProductCard.jsx
    |   |   |       |-- ProductImageGallery.jsx
    |   |   |       |-- ProductInfo.jsx
    |   |   |       |-- ProductTabs.jsx
    |   |   |       \-- ReviewList.jsx
    |   |   \-- user
    |   |       \-- model
    |   |           \-- AuthContext.jsx
    |   |-- features
    |   |   |-- address-management
    |   |   |   \-- ui
    |   |   |       \-- AddressModal.jsx
    |   |   |-- auth
    |   |   |   \-- model
    |   |   |       |-- useLogin.js
    |   |   |       \-- useSignUp.js
    |   |   |-- cart-actions
    |   |   |   \-- ui
    |   |   |       |-- AddToCartPopup.jsx
    |   |   |       \-- QuickAddModal.jsx
    |   |   |-- checkout
    |   |   |   \-- ui
    |   |   |       |-- CheckoutForm.jsx
    |   |   |       \-- OrderSummary.jsx
    |   |   |-- product-filter
    |   |   |   \-- model
    |   |   |       \-- useShopFilters.js
    |   |   \-- product-review
    |   |       \-- ui
    |   |           \-- ReviewModal.jsx
    |   |-- shared
    |   |   |-- api
    |   |   |   |-- addressService.js
    |   |   |   |-- authService.js
    |   |   |   |-- axiosClient.js
    |   |   |   |-- cartService.js
    |   |   |   |-- orderService.js
    |   |   |   \-- productService.js
    |   |   |-- lib
    |   |   |   |-- constants.js
    |   |   |   \-- data.js
    |   |   \-- ui
    |   |       |-- Button.jsx
    |   |       |-- Checkbox.jsx
    |   |       |-- Input.jsx
    |   |       |-- Modal.jsx
    |   |       \-- PasswordInput.jsx
    |   \-- main.jsx
    |-- .env
    |-- eslint.config.js
    |-- index.html
    |-- package.json
    |-- pnpm-lock.yaml
    \-- vite.config.js

packages/
|-- shared
|   |-- api
|   |   \-- createClient.js
|   |-- lib
|   \-- package.json

## Ghi chu
- File nay la snapshot cau truc hien tai de doi chieu trong qua trinh integration.
- Neu can bo sung thong ke (so luong file theo app/layer), co the tao them mot phien ban chi tiet.

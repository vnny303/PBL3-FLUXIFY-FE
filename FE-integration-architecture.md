# Fluxify FE Integration – Proposed Architecture & Implementation Guide

## 1. Proposed Folder Structure

```
apps/
  merchant/
    src/
      ...
    .env
  storefront/
    src/
      ...
    .env
packages/
  shared/
    api/
      axiosClient.js      # Centralized axios instance
      config.js           # API base URL config
    auth/
      authUtils.js        # getToken, setToken, removeToken
      useAuth.js          # (optional) shared auth hook
    constants/
      roles.js            # Role definitions
    index.js              # Barrel export
```

## 2. Organizing `packages/shared`

- **api/**: Contains the shared axios client and config logic.
- **auth/**: Contains token management utilities and (optionally) shared hooks for login/logout/state.
- **constants/**: Role definitions, error codes, etc.
- **index.js**: Barrel file for easy imports.

## 3. Shared API Client Setup

- **api/config.js**: Reads `VITE_API_URL` from environment (each app has its own `.env`).
- **api/axiosClient.js**:
  - Creates a single axios instance.
  - Sets baseURL from config.
  - Adds interceptor to attach JWT token from `authUtils`.

**Usage in apps:**
```js
import axiosClient from 'shared/api/axiosClient';
```

## 4. Auth Flow Implementation

- **auth/authUtils.js**:
  - `getToken()`, `setToken(token)`, `removeToken()` – all use `localStorage` (or `sessionStorage` if preferred).
  - Token key is consistent across apps (e.g., `fluxify_token`).
- **api/axiosClient.js**:
  - Interceptor reads token via `getToken()` and attaches to `Authorization` header.
- **Login/Logout**:
  - On login: call `setToken(token)` after successful API response.
  - On logout: call `removeToken()` and redirect as needed.

## 5. User State Synchronization

- Both apps call `/me` (or equivalent) endpoint on load to fetch current user info and role.
- Store user state in app-level context/provider (React Context or Zustand/Recoil, etc.).
- If `/me` fails (401), clear token and redirect to login.

## 6. Role-Based Routing & UI

- **constants/roles.js**: Define roles (e.g., `CUSTOMER`, `MERCHANT`, `ADMIN`).
- On `/me` response, check user role:
  - If role mismatch (e.g., customer tries to access merchant), redirect appropriately.
  - Use role in UI to show/hide features.
- (Optional) Shared `useAuth` hook can provide `user`, `role`, `isAuthenticated`.

## 7. Implementation Checklist

- [ ] Move API client and auth utils to `packages/shared`
- [ ] Ensure both apps import and use shared API client
- [ ] Use `.env` in each app for `VITE_API_URL`
- [ ] Implement login/logout using shared auth utils
- [ ] Attach token automatically via axios interceptor
- [ ] Fetch user info via `/me` on app load
- [ ] Store user state in context/provider
- [ ] Implement role-based routing/redirects
- [ ] Ensure logout clears token for both apps
- [ ] Remove duplicate logic from apps
- [ ] Document usage in README

## 8. Example: Shared Auth Utility (`authUtils.js`)

```js
// packages/shared/auth/authUtils.js
const TOKEN_KEY = 'fluxify_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
```

## 9. Example: Axios Client (`axiosClient.js`)

```js
// packages/shared/api/axiosClient.js
import axios from 'axios';
import { getToken } from '../auth/authUtils';
import { API_BASE_URL } from './config';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
```

## 10. Example: API Base URL Config (`config.js`)

```js
// packages/shared/api/config.js
export const API_BASE_URL = import.meta.env.VITE_API_URL;
```

## 11. Example: Role Constants (`roles.js`)

```js
// packages/shared/constants/roles.js
export const ROLES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  ADMIN: 'admin',
};
```

---

**With this setup, both apps share API/auth logic, support role-based flows, and are easy to extend.**

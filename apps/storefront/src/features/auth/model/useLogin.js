import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/useAppContext';
import { getStorefrontSubdomain } from '../../../shared/lib/getStorefrontSubdomain';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTimeoutRef = useRef(null);
  const { applyAuthResponse } = useAppContext();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState(null); // Lỗi validation phía client

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const subdomain = getStorefrontSubdomain();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) return { error: 'Please fill in all required fields.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
    if (!/^[a-z0-9-]{3,50}$/.test(subdomain)) return { error: 'Storefront subdomain chưa được cấu hình hợp lệ.' };

    return { subdomain, email, password };
  };

  // ─── useMutation ──────────────────────────────────────────────────────────
  const { mutate: login, isPending: isLoading, isSuccess } = useMutation({
    mutationFn: ({ subdomain, email, password }) =>
      authService.loginCustomer({ subdomain, email, password }),
    onSuccess: (response) => {
      applyAuthResponse(response);
      toast.success('Đăng nhập thành công!');
      setFormData((prev) => ({ ...prev, password: '' }));

      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1000);
    },
    onError: (err) => {
      const status = err.response?.status;
      let errorMessage;
      if (status === 401) {
        errorMessage = 'Email hoặc password không chính xác.';
      } else if (status === 400) {
        errorMessage = err.response?.data?.message || 'Store không tồn tại hoặc dữ liệu không hợp lệ.';
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      }
      setFormError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const result = validate();
    if (result.error) { setFormError(result.error); return; }

    login(result);
  };

  return {
    formData,
    isLoading,
    error: formError,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};
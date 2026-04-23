import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/useAppContext';
import { getStorefrontSubdomain } from '../../../shared/lib/getStorefrontSubdomain';

/*
store đó lấy từ:
VITE_STOREFRONT_SUBDOMAIN
hoặc hostname fallback
user không nên tự nhập subdomain ở form signup/login
*/

export const useSignUp = () => {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef(null);
  const { applyAuthResponse } = useAppContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptTerms: false,
  });
  const [formError, setFormError] = useState(null); // Lỗi validation phía client

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const subdomain = getStorefrontSubdomain();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) return { error: 'Please fill in all required fields.' };
    if (!/^[a-z0-9-]{3,50}$/.test(subdomain)) return { error: 'Storefront subdomain chưa được cấu hình hợp lệ.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/.test(password)) {
      return { error: 'Mật khẩu phải ít nhất 8 ký tự, chứa chữ hoa, số và ký tự đặc biệt (@$!%*?&.)' };
    }
    if (!formData.acceptTerms) return { error: 'You must agree to the Terms of Service and Privacy Policy to continue.' };

    return { subdomain, email, password };
  };

  // ─── useMutation ──────────────────────────────────────────────────────────
  const { mutate: register, isPending: isLoading, isSuccess } = useMutation({
    mutationFn: ({ subdomain, email, password }) =>
      authService.registerCustomer({ subdomain, email, password }),
    onSuccess: (response) => {
      applyAuthResponse(response);
      toast.success('Đăng ký thành công!');
      setFormData({ email: '', password: '', acceptTerms: false });

      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred. Please try again later.';
      setFormError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const result = validate();
    if (result.error) { setFormError(result.error); return; }

    register(result);
  };

  // Trả về tất cả state và function cần thiết
  return {
    formData,
    isLoading,
    error: formError,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};

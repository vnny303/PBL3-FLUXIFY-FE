import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/AppContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTimeoutRef = useRef(null);
  const { applyAuthResponse } = useAppContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const envSubdomain = (import.meta.env.VITE_STOREFRONT_SUBDOMAIN || '')
      .trim()
      .toLowerCase();

    const host = window.location.hostname || '';
    const hostSubdomain =
      host && host !== 'localhost' && host.includes('.')
        ? host.split('.')[0].toLowerCase()
        : '';

    const subdomain = envSubdomain || hostSubdomain;
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const subdomainRegex = /^[a-z0-9-]{3,50}$/;
    if (!subdomainRegex.test(subdomain)) {
      setError('Storefront subdomain chưa được cấu hình hợp lệ.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await authService.loginCustomer({
        subdomain,
        email,
        password,
      });

      setIsSuccess(true);
      applyAuthResponse(response);
      toast.success('Đăng nhập thành công!');

      setFormData((prev) => ({ ...prev, password: '' }));

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      redirectTimeoutRef.current = setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      const status = err.response?.status;
      let errorMessage;

      if (status === 401) {
        errorMessage = 'Email hoặc password không chính xác.';
      } else if (status === 400) {
        errorMessage =
          err.response?.data?.message ||
          'Store không tồn tại hoặc dữ liệu không hợp lệ.';
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Invalid email or password. Please try again.';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};
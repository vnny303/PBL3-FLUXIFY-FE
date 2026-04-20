import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/AppContext';


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
    //subdomain: '',
    email: '',
    password: '',
    acceptTerms: false,
  });

  // State quản lý UI khi gọi API
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
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
    const acceptTerms = formData.acceptTerms;

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const subdomainRegex = /^[a-z0-9-]{3,50}$/;
    if (!subdomainRegex.test(subdomain)) {
      setError('Storefront subdomain chưa được cấu hình hợp lệ.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Mật khẩu phải ít nhất 8 ký tự, chứa chữ hoa, số và ký tự đặc biệt (@$!%*?&.)');
      return;
    }

    if (!acceptTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await authService.registerCustomer({
        subdomain,
        email,
        password,
      });

      applyAuthResponse(response);
      setIsSuccess(true);
      toast.success('Đăng ký thành công!');

      setFormData({
        email: '',
        password: '',
        acceptTerms: false,
      });

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      redirectTimeoutRef.current = setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred. Please try again later.';

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Trả về tất cả state và function cần thiết
  return {
    formData,
    isLoading,
    error,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};

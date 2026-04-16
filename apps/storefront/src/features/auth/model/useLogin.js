import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/AppContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applyAuthResponse } = useAppContext();
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subdomain || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const subdomainRegex = /^[a-z0-9-]{3,50}$/;
    if (!subdomainRegex.test(formData.subdomain)) {
      setError("Subdomain phải 3-50 ký tự, chỉ chứa chữ thường, số và dấu gạch ngang (-)");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await authService.loginCustomer({
        subdomain: formData.subdomain,
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response);
      setIsSuccess(true);
      applyAuthResponse(response);
      toast.success('Đăng nhập thành công!');
      
      setFormData((prev) => ({ ...prev, password: '' }));
      
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true }); 
      }, 1000);

    } catch (err) {
      console.error("Login failed:", err);
      const status = err.response?.status;
      let errorMessage;
      if (status === 401) {
        errorMessage = 'Email hoặc password không chính xác.';
      } else if (status === 400) {
        errorMessage = err.response?.data?.message || 'Store không tồn tại hoặc dữ liệu không hợp lệ.';
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
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
    handleSubmit
  };
};


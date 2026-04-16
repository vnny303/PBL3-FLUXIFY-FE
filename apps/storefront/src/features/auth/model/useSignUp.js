import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/AppContext';

export const useSignUp = () => {
  const navigate = useNavigate();
  const { applyAuthResponse } = useAppContext();
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    password: '',
    acceptTerms: false
  });

  // State quản lý UI khi gọi API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   

    const subdomainRegex = /^[a-z0-9-]{3,50}$/;
    if (!subdomainRegex.test(formData.subdomain)) {
      setError('Subdomain phải 3-50 ký tự, chỉ gồm chữ thường, số và dấu gạch ngang (-).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Mật khẩu phải ít nhất 8 ký tự, chứa chữ hoa, số và ký tự đặc biệt (@$!%*?&)");
      return;
    }

    if (!formData.acceptTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await authService.registerCustomer({
        subdomain: formData.subdomain,
        email: formData.email,
        password: formData.password,
      });

      console.log("Registration successful:", response);
      applyAuthResponse(response);

      setIsSuccess(true);
      toast.success('Đăng ký thành công!');
      
      setFormData({ 
        subdomain: '',
        email: '', 
        password: '',
        acceptTerms: false
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred. Please try again later.';
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
    handleSubmit
  };
};

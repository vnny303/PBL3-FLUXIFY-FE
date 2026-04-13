import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';

export const useSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptTerms: false
  });

  // State quản lý UI khi gọi API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   

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
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.registerCustomer(payload);

      console.log("Registration successful:", response);

      if (response.token) localStorage.setItem('tenant_token', response.token);
      if (response.userId) localStorage.setItem('userId', response.userId);
      if (response.tenantId) localStorage.setItem('tenantId', response.tenantId);

      setIsSuccess(true);
      toast.success('Đăng ký thành công!');
      
      setFormData({ 
        email: '', 
        password: '',
        acceptTerms: false
      });

      setTimeout(() => {
        navigate('/login');
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

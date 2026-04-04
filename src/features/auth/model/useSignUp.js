import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { extractErrorMessage } from '../../../shared/lib/api';
import { buildLoginPath } from '../../../shared/lib/constants';

export const useSignUp = () => {
  const navigate = useNavigate();
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.subdomain || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
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
      // Map dữ liệu từ state sang format API yêu cầu
      const payload = {
        subdomain: formData.subdomain,
        email: formData.email,
        password: formData.password,
      };

      // Gọi API qua Service 
      await authService.registerCustomer(payload);
      setIsSuccess(true);
      toast.success('Đăng ký thành công!');
      
      // Xóa form sau khi thành công
      setFormData({ 
        subdomain: '', 
        email: '', 
        password: '',
        acceptTerms: false
      });

      // Nếu bạn dùng react-router-dom, bạn có thể chuyển hướng sang trang đăng nhập:
      setTimeout(() => {
        navigate(buildLoginPath(formData.subdomain));
      }, 1500);

    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = extractErrorMessage(err, 'An error occurred. Please try again later.');
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

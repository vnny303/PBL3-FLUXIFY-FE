import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';

export const useSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenantId: '',
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
    if (!formData.tenantId || !formData.email || !formData.password) {
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
        TenantId: formData.tenantId,
        Email: formData.email,
        PasswordHash: formData.password,
        // CreatedAt: Thường Backend sẽ tự tạo (hoặc bạn có thể truyền new Date().toISOString() nếu BE bắt buộc)
      };

      // Gọi API qua Service 
      const mockData = await authService.registerCustomer(payload);

      console.log("Registration successful:", mockData);
      setIsSuccess(true);
      toast.success('Đăng ký thành công!');
      
      // Xóa form sau khi thành công
      setFormData({ 
        tenantId: '', 
        email: '', 
        password: '',
        acceptTerms: false
      });

      // Nếu bạn dùng react-router-dom, bạn có thể chuyển hướng sang trang đăng nhập:
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error("Registration failed:", err);
      // Lấy lỗi trực tiếp từ response API trả về thông qua axios
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

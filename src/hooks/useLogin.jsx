import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user re-types
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Map state to API Payload (using Customer format for now)
      const payload = {
        Email: formData.email,
        PasswordHash: formData.password
      };

      // TẠM THỜI MÔ PHỎNG GỌI API BẰNG SETTIMEOUT
      // Xóa đoạn Promise này đi khi có Backend nha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      /* ĐOẠN GỌI API THẬT BẰNG AXIOS (Đã comment lại)
      const response = await axios.post('/api/simpleauth/customer/login', payload);
      // const responseData = response.data;
      */

      const mockData = { 
        message: "Login successful", 
        token: "fake-jwt-token-123xyz...", // API thường hay trả token
        user: { email: payload.Email } 
      };

      console.log("Login successful (Mock):", mockData);
      setIsSuccess(true);
      
      // Cleanup password on success (optional)
      setFormData((prev) => ({ ...prev, password: '' }));

      // Lưu Token vào LocalStorage để các API khác có thể sử dụng
      localStorage.setItem('tenant_token', mockData.token);
      
      // Đợi 1 chút (khoảng 1 giây) để người dùng kịp nhìn thấy thông báo thành công rồi mới chuyển trang
      setTimeout(() => {
        // Redirect về trang chủ hoặc Dashboard
        navigate('/'); 
      }, 1000);

    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setError(errorMessage);
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

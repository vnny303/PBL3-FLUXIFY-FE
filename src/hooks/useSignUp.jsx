import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

      // TẠM THỜI MÔ PHỎNG GỌI API (Do chưa có Backend)
      // Khi nào có Backend, bạn mở comment đoạn fetch bên dưới và xóa đoạn Promise này đi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      /* ĐOẠN GỌI API THẬT BẰNG AXIOS (Đã comment lại)
      const response = await axios.post('/api/simpleauth/customer/register', payload);
      // Khi dùng api thật thì bạn dùng biến này thay cho mockData phía dưới
      // const responseData = response.data;
      */

      // Mô phỏng data trả về thành công
      const mockData = { message: "Account created successfully", ...payload };

      console.log("Registration successful (Mock):", mockData);
      setIsSuccess(true);
      
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

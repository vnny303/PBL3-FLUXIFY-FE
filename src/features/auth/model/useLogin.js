import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/AppContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn } = useAppContext();
  const [formData, setFormData] = useState({
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
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const payload = {
        Email: formData.email,
        PasswordHash: formData.password
      };

      const mockData = await authService.loginCustomer(payload);

      console.log("Login successful:", mockData);
      setIsSuccess(true);
      setIsLoggedIn(true);
      toast.success('Đăng nhập thành công!');
      
      setFormData((prev) => ({ ...prev, password: '' }));

      localStorage.setItem('tenant_token', mockData.token);
      
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true }); 
      }, 1000);

    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
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


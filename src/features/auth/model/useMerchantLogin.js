import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/AppContext';
import { extractErrorMessage } from '../../../shared/lib/api';
import { ROUTES } from '../../../shared/lib/constants';

export const useMerchantLogin = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await authService.loginMerchant({
        email: formData.email,
        password: formData.password,
      });

      login({
        token: result.token,
        userId: result.userId,
        email: result.email,
        role: result.role,
        tenantId: result.tenantId,
        subdomain: result.subdomain,
      });

      setIsSuccess(true);
      toast.success('Merchant đăng nhập thành công!');

      setFormData((prev) => ({ ...prev, password: '' }));

      setTimeout(() => {
        navigate(ROUTES.MERCHANT_HOME, { replace: true });
      }, 1000);
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Invalid email or password. Please try again.');
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

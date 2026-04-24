import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    // Simulate send
    setTimeout(() => {
      toast.success('Gửi thông tin liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const inputClass = (error) => `w-full px-4 py-3 rounded-xl border outline-none transition-all ${
    error 
      ? 'border-red-500 bg-red-50 focus:ring-red-100' 
      : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary'
  }`;

  return (
    <main className="grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-500">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass(errors.firstName)}
                placeholder="Jane"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass(errors.lastName)}
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="jane@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
            <select 
              id="subject" 
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-slate-50 focus:bg-white text-slate-700"
            >
              <option>General Inquiry</option>
              <option>Order Status</option>
              <option>Returns & Exchanges</option>
              <option>Partnerships</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
            <textarea 
              id="message" 
              rows="5" 
              value={formData.message}
              onChange={handleChange}
              className={inputClass(errors.message) + " resize-none"}
              placeholder="How can we help you?"
            ></textarea>
            {errors.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Order Status',
  'Returns & Exchanges',
  'Partnerships'
];

export default function Contact() {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const selectSubject = (option) => {
    setFormData(prev => ({ ...prev, subject: option }));
    setShowSubjectDropdown(false);
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

  const inputStyle = (id) => {
    const hasError = !!errors[id];
    return {
      '--tw-ring-color': hasError ? undefined : `${primaryColor}33`,
    };
  };

  const inputClass = (error) => `w-full px-4 py-3 rounded-xl border outline-none transition-all ${
    error 
      ? 'border-red-500 bg-red-50 focus:ring-red-100' 
      : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:border-transparent'
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: primaryColor, borderBottomColor: 'transparent' }} />
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
                style={inputStyle('firstName')}
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
                style={inputStyle('lastName')}
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
              style={inputStyle('email')}
              placeholder="jane@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                  showSubjectDropdown ? 'bg-white ring-2 border-transparent' : 'bg-slate-50 border-slate-200'
                }`}
                style={{ 
                  '--tw-ring-color': `${primaryColor}33`,
                  borderColor: showSubjectDropdown ? primaryColor : undefined 
                }}
              >
                <span className="text-slate-700">{formData.subject}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSubjectDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1.5 z-20 overflow-hidden">
                  {SUBJECT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectSubject(option)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ 
                        backgroundColor: formData.subject === option ? `${primaryColor}1A` : undefined,
                        color: formData.subject === option ? primaryColor : '#334155',
                        fontWeight: formData.subject === option ? 'bold' : 'normal'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
            <textarea 
              id="message" 
              rows="5" 
              value={formData.message}
              onChange={handleChange}
              className={inputClass(errors.message) + " resize-none"}
              style={inputStyle('message')}
              placeholder="How can we help you?"
            ></textarea>
            {errors.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 10px 15px -3px ${primaryColor}4D`
            }}
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  );
}

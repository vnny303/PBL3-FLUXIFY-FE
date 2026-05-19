import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';

const SUPPORT_EMAIL = 'support@fluxify.store';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Order Status',
  'Returns & Exchanges',
  'Partnerships',
];

const FAQ_ITEMS = [
  {
    q: 'How do I track my order?',
    a: 'After your order is confirmed, you can view real-time status from My Account → My Orders. Each order shows its current status (Processing, Shipped, Delivered, etc.).',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 30 days of delivery for unused items in original condition. Please contact support with your order number to initiate a return.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3–5 business days. Express shipping (1–2 business days) is available at checkout for an additional fee.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be cancelled within 1 hour of placement while they are still in "Pending" status. After that, please contact us and we will do our best to help.',
  },
];

export default function Contact() {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const selectSubject = (option) => {
    setFormData((prev) => ({ ...prev, subject: option }));
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

    const subject = encodeURIComponent(`[${formData.subject}] from ${formData.firstName} ${formData.lastName}`);
    const body = encodeURIComponent(
      `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\n${formData.message}`
    );
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    toast.info('Your email client has been opened. Please send the pre-filled email to complete your inquiry.');
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${
      error
        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:border-transparent'
    }`;

  const inputStyle = (id) => ({
    '--tw-ring-color': errors[id] ? undefined : `${primaryColor}33`,
  });

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Contact Us</h1>
        <p className="text-slate-500">
          Have a question or need help? Reach out — we typically respond within one business day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
        {/* ── Left: Static Contact Info ─────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact details */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-5">Get in touch</h2>
            <div className="space-y-4">
              {[
                {
                  Icon: Mail,
                  label: 'Support Email',
                  value: SUPPORT_EMAIL,
                  href: `mailto:${SUPPORT_EMAIL}`,
                },
                {
                  Icon: Phone,
                  label: 'Hotline',
                  value: '+1 (800) 123-4567',
                  href: 'tel:+18001234567',
                },
                {
                  Icon: MapPin,
                  label: 'Address',
                  value: '123 Commerce Ave, Suite 400\nSan Francisco, CA 94105',
                  href: null,
                },
                {
                  Icon: Clock,
                  label: 'Support Hours',
                  value: 'Mon – Fri · 9 AM – 6 PM (PST)',
                  href: null,
                },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}1A` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium text-slate-800 hover:underline whitespace-pre-line"
                        style={{ color: primaryColor }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-800 whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-800 pr-4">{item.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        openFaq === i ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3 animate-in slide-in-from-top-2 duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Contact Form ────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Send us a message</h2>
            <p className="text-sm text-slate-500 mb-6">
              Fill in the form below and click{' '}
              <span className="font-semibold text-slate-700">Send via Email</span> — this will open
              your email app with the details pre-filled so you can send it directly.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass(errors.firstName)}
                    style={inputStyle('firstName')}
                    placeholder="Jane"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass(errors.lastName)}
                    style={inputStyle('lastName')}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Your Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass(errors.email)}
                  style={inputStyle('email')}
                  placeholder="jane@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left text-sm ${
                      showSubjectDropdown
                        ? 'bg-white ring-2 border-transparent'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                    style={{
                      '--tw-ring-color': `${primaryColor}33`,
                      borderColor: showSubjectDropdown ? primaryColor : undefined,
                    }}
                  >
                    <span className="text-slate-700">{formData.subject}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        showSubjectDropdown ? 'rotate-180' : ''
                      }`}
                    />
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
                            backgroundColor:
                              formData.subject === option ? `${primaryColor}1A` : undefined,
                            color: formData.subject === option ? primaryColor : '#334155',
                            fontWeight: formData.subject === option ? 'bold' : 'normal',
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
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClass(errors.message) + ' resize-none'}
                  style={inputStyle('message')}
                  placeholder="Describe your issue or question..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 10px 15px -3px ${primaryColor}4D`,
                }}
              >
                Send via Email
              </button>

              <p className="text-xs text-center text-slate-400 leading-relaxed">
                Clicking the button above opens your default email app with the details pre-filled.
                No data is sent through this website.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

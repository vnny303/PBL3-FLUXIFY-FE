import React from 'react';
import { toast } from 'sonner';

export default function Contact() {
  return (
    <main className="grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-500">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10">
        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          toast.success('Gửi thông tin liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
          e.target.reset();
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="Jane"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
            <select 
              id="subject" 
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-slate-50 focus:bg-white resize-none"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}

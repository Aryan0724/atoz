"use client";

import React from 'react';
import { toast } from 'sonner';

const NewsletterForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Successfully joined the intelligence matrix!');
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter your professional email" 
        className="flex-1 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-pink/40 outline-none text-white font-bold placeholder:text-white/20"
        required
      />
      <button 
        type="submit"
        className="px-12 py-5 bg-white text-brand-dark rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brand-pink hover:text-white transition-all shadow-xl"
      >
        Join Matrix
      </button>
    </form>
  );
};

export default NewsletterForm;

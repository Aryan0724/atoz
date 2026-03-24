"use client";

import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  Globe,
  Loader2,
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-pink/5 border border-brand-pink/10 text-brand-pink text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Strategic Partnerships
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter mb-8 leading-[0.95]">
             Elevate Your <br/>
             <span className="text-brand-pink underline decoration-brand-cyan/20 decoration-8 underline-offset-[12px]">Brand Identity.</span>
           </h1>
           <p className="text-gray-400 font-bold text-xl leading-relaxed max-w-2xl mx-auto">
             Get expert advice on custom branding, bulk production, and global logistics. Our specialists are ready to assist you in making a lasting impression.
           </p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-brand-pink/5 to-transparent -z-10"></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           {/* Inquiry Form */}
           <div className="bg-white p-10 md:p-12 rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-100 relative group">
              <div className="absolute top-0 right-0 p-8">
                 <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                    <Send className="h-6 w-6" />
                 </div>
              </div>

              <h2 className="text-3xl font-black text-brand-dark mb-8 tracking-tight">Send an Inquiry</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Name</label>
                       <input 
                         type="text" 
                         required
                         placeholder="e.g. Rahul Sharma"
                         className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                       <input 
                         type="email" 
                         required
                         placeholder="rahul@company.com"
                         className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Subject</label>
                    <select className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark appearance-none">
                       <option>Bulk Order Inquiry</option>
                       <option>Dropshipping Partnership</option>
                       <option>Custom Packaging Request</option>
                       <option>Other Business Enquiry</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Message</label>
                    <textarea 
                      rows={5}
                      required
                      placeholder="Tell us about your project requirements..."
                      className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-medium text-gray-600"
                    />
                 </div>

                 <button 
                   disabled={loading}
                   className="w-full py-6 bg-brand-dark text-white rounded-full font-black text-xl hover:bg-brand-pink hover:shadow-2xl hover:shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-4"
                 >
                   {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                   Launch Inquiry
                 </button>
              </form>
           </div>

           {/* Contact Info */}
           <div className="space-y-12 py-8">
              <div>
                 <h2 className="text-3xl font-black text-brand-dark mb-4 tracking-tight">Direct Connections</h2>
                 <p className="text-gray-400 font-medium max-w-sm">We&apos;re based in the heart of Delhi&apos;s printing district, ready to serve nationwide.</p>
              </div>

              <div className="space-y-8">
                 <div className="flex gap-6 items-start group">
                    <div className="h-16 w-16 bg-brand-lightGray rounded-3xl flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all">
                       <Mail className="h-8 w-8" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email us at</p>
                       <p className="text-xl font-black text-brand-dark tracking-tight">hello@atozprints.com</p>
                       <p className="text-sm text-gray-400 font-bold">Inquiries within 24 hours</p>
                    </div>
                 </div>

                 <div className="flex gap-6 items-start group">
                    <div className="h-16 w-16 bg-brand-lightGray rounded-3xl flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-white transition-all">
                       <Phone className="h-8 w-8" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Call Expertise</p>
                       <p className="text-xl font-black text-brand-dark tracking-tight">+91 999 000 1234</p>
                       <p className="text-sm text-gray-400 font-bold">Mon - Sat, 10 AM - 7 PM</p>
                    </div>
                 </div>

                 <div className="flex gap-6 items-start group">
                    <div className="h-16 w-16 bg-brand-lightGray rounded-3xl flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all">
                       <MapPin className="h-8 w-8" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Production HQ</p>
                       <p className="text-xl font-black text-brand-dark tracking-tight">Okhla Industrial Area, Phase II</p>
                       <p className="text-sm text-gray-400 font-bold">New Delhi, India - 110020</p>
                    </div>
                 </div>
              </div>

              <div className="pt-12 border-t border-gray-100 flex items-center gap-6">
                <div className="flex -space-x-4">
                  <div className="w-14 h-14 rounded-full border-4 border-white bg-brand-dark flex items-center justify-center text-brand-cyan shadow-xl ring-1 ring-gray-100 relative z-0">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-white bg-brand-pink flex items-center justify-center text-white shadow-xl ring-1 ring-gray-100 relative z-10 transition-transform hover:scale-110">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-white bg-brand-cyan flex items-center justify-center text-brand-dark shadow-xl ring-1 ring-gray-100 relative z-20 transition-transform hover:scale-110">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-dark tracking-tight uppercase">Trusted by 500+ Corporate Partners</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Excellence in production & delivery</p>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

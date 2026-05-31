'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowRight, GitBranch, Sparkles, Eye, EyeOff, Shield } from 'lucide-react';
import Link from 'next/link';
import { login } from '../actions';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-brand-500/20 to-brand-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-accent-500/20 to-accent-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-brand-400/5 to-accent-400/5 rounded-full blur-3xl" />
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'rgba(255,255,255,0.02)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%\' height=\'100%\' fill=\'url(%23grid)\' /%3E%3C/svg%3E')] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6 md:mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Zap className="text-white w-6 h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 md:mb-3 font-display">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Welcome </span>
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">Back</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-base font-medium"
          >
            Access your intelligent campus portal
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative group"
        >
          {/* Card glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-slate-900/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
            {/* Subtle inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-500/10 to-transparent rounded-bl-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-500/10 to-transparent rounded-tr-3xl" />
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="transform transition-all duration-200 focus-within:scale-[1.01]">
                  <Input 
                    name="email" 
                    type="email" 
                    label="Email Address" 
                    placeholder="name@university.edu" 
                    required 
                    className="bg-slate-800/50 border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-white placeholder:text-slate-500"
                  />
                </div>
                
                {/* Password Input with visibility toggle */}
                <div className="transform transition-all duration-200 focus-within:scale-[1.01] relative">
                  <Input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    label="Password" 
                    placeholder="••••••••" 
                    required 
                    className="bg-slate-800/50 border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-white placeholder:text-slate-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Forgot Password Link */}
              <div className="flex items-center justify-end px-1">
                <Link 
                  href="/forgot-password" 
                  className="text-xs md:text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors relative group/link"
                >
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-400 to-brand-300 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-right rounded-full" />
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 md:h-12 text-base md:text-lg font-bold bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-200 mt-2 rounded-xl" 
                isLoading={isLoading}
              >
                {!isLoading && <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />}
                Sign In
                {!isLoading && <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform group-hover:translate-x-1" />}
              </Button>


              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-2">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] text-slate-500 font-medium">Secure login powered by Campus AI</span>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Register Link */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8 md:mt-10 text-slate-400 text-sm md:text-base font-medium"
        >
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-400 font-bold hover:text-brand-300 transition-colors relative inline-block group">
            Create an account
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-400 to-brand-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
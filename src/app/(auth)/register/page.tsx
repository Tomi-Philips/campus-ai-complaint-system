'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { signup } from '../actions';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 bg-slate-50 text-slate-800">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-11 h-11 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Start your journey with Campus AI
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@university.edu"
                required
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Use 8+ characters with letters & numbers</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 rounded-lg"
              isLoading={isLoading}
            >
              Get started
            </Button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-brand-500 hover:text-brand-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
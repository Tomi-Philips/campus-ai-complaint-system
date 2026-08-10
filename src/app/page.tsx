'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck, Zap, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden selection:bg-brand-500/20">
      {/* Navigation */}
      <header className="relative z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Campus AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-brand-500 text-white hover:bg-brand-600 font-semibold shadow-sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10">
        <section className="flex-1 flex items-center justify-center pt-20 pb-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Next-generation campus management</span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.15]"
            >
              Intelligent Reporting for a{' '}
              <span className="text-brand-500">
                Smarter Campus
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Report issues, get real-time announcements, and let our AI handle the categorization.
              Experience the fastest way to improve your university environment.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 text-base font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-md rounded-lg">
                  Create Student Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12 px-8 text-base font-semibold border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg bg-white">
                  Access Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 border-t border-slate-200 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6 border border-brand-500/20">
                  <BrainCircuit className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900">AI Categorization</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our local AI models automatically read and route your complaints to the right department instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900">Duplicate Detection</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Advanced vector search prevents duplicate reports, ensuring admins can focus on solving unique problems.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <LayoutDashboard className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900">Real-time Dashboard</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Track your reports, receive official announcements, and watch issues get resolved in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-slate-400 relative z-10">
        <p className="text-xs font-medium">
          &copy; {new Date().getFullYear()} Campus AI Complaint System. Built for next-generation universities.
        </p>
      </footer>
    </div>
  );
}
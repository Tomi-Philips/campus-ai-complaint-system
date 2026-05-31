'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck, Zap, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col overflow-hidden selection:bg-brand-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'rgba(255,255,255,0.03)\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%\' height=\'100%\' fill=\'url(%23grid)\' /%3E%3C/svg%3E')]" />
      </div>

      {/* Navigation */}
      <header className="relative z-50 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight font-display">Campus AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-slate-950 hover:bg-slate-200 font-semibold shadow-lg shadow-white/10">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 mb-8"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Next-generation campus management</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-8 font-display leading-[1.1]"
            >
              Intelligent Reporting for a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400">
                Smarter Campus
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Report issues, get real-time announcements, and let our AI handle the categorization.
              Experience the fastest way to improve your university environment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full h-14 px-8 text-lg font-bold bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-xl shadow-brand-500/25 rounded-full">
                  Create Student Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-14 px-8 text-lg font-semibold border-slate-700 hover:bg-slate-800 text-white rounded-full bg-slate-900/50 backdrop-blur-sm">
                  Access Portal
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 border-t border-slate-800/50 bg-slate-950/50 relative">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 border border-brand-500/20">
                  <BrainCircuit className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Categorization</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our local AI models automatically read and route your complaints to the right department instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-6 border border-accent-500/20">
                  <ShieldCheck className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Duplicate Detection</h3>
                <p className="text-slate-400 leading-relaxed">
                  Advanced vector search prevents duplicate reports, ensuring admins can focus on solving unique problems.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Real-time Dashboard</h3>
                <p className="text-slate-400 leading-relaxed">
                  Track your reports, receive official announcements, and watch issues get resolved in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center text-slate-500 relative z-10">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Campus AI Complaint System. Built for next-generation universities.
        </p>
      </footer>
    </div>
  );
}
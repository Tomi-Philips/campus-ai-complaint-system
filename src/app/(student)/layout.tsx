import { Sidebar } from '@/components/dashboard/sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  // If admin, they should be in the admin dashboard (though we have separate route groups)
  // But for now, let's just ensure they have a profile
  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand-500/5 to-accent-500/5 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'rgba(255,255,255,0.02)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3E%3C/svg%3E')] opacity-50" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen transition-all duration-300 relative z-10">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-12 py-6 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-[10px] text-slate-500 font-medium">
                  Campus AI — Intelligent Campus Management
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                <span>© 2024 Campus AI</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <a href="#" className="hover:text-brand-400 transition-colors">Privacy</a>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <a href="#" className="hover:text-brand-400 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
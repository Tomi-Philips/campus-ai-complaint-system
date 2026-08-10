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
    <div className="flex min-h-screen relative bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen transition-all duration-300 relative z-10">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-slate-200 mt-12 py-6 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  Campus AI — Intelligent Campus Management
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-400">
                <span>© 2024 Campus AI</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <a href="#" className="hover:text-brand-500 transition-colors">Privacy</a>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <a href="#" className="hover:text-brand-500 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
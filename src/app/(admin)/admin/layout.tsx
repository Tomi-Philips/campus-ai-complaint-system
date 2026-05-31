import { AdminSidebar } from '@/components/dashboard/admin-sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
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
    .select('role')
    .eq('id', user.id)
    .single();

  // Redirect non-admins away from the admin routes
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen relative">
      <AdminSidebar />
      <main className="flex-1 lg:ml-72 p-4 md:p-10 transition-all duration-300">
        {children}
      </main>
    </div>
  );

}

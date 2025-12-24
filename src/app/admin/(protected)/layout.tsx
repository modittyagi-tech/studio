
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // This is the single source of truth for protecting admin routes.
  // 1. Check if a user is logged in.
  if (!user) {
    redirect('/admin/login');
  }

  // 2. Check if the logged-in user is an admin.
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  // 3. If they are not an admin, redirect them to the homepage.
  if (!profile?.is_admin) {
    redirect('/');
  }

  // If all checks pass, render the admin layout with the user object.
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={user as User} />
        <main className="flex-1 bg-muted/40 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

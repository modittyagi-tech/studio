
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. If no user session, redirect to login
  if (!user) {
    redirect("/admin/login");
  }

  // 2. If user exists, check for admin role in 'profiles' table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 3. If profile is not found or role is not admin, redirect to login.
  // This is the primary security guard for the entire admin section.
  // It's good practice to sign out the user if they are not an admin
  // but are trying to access admin routes.
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }
  
  // If all checks pass, render the admin layout with the user's data
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AdminHeader user={user} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}

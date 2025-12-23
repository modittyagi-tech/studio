import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'

export default async function LoginPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is already logged in and they land on the login page,
  // send them to the dashboard. This is a good user experience.
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'admin') {
      return redirect('/admin/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="font-headline text-center text-4xl text-primary">Glampify Admin</h1>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

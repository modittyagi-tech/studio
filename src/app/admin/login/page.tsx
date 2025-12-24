
"use client";

import { createClient } from '@/utils/supabase/client';
import { LoginForm } from '@/components/admin/login-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@supabase/supabase-js';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // If user is already logged in, redirect them to the dashboard.
        // This prevents logged-in users from seeing the login page.
        router.replace('/admin/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <div className="space-y-6 pt-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        </div>
      </div>
    );
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

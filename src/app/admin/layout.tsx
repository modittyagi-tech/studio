
// This root layout for /admin is intentionally minimal.
// It allows the login page to be public while grouping protected routes.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

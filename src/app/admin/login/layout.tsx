// This layout ensures that the login page is public and not wrapped by any auth guards.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

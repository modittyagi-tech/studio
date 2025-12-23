export default function Section({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container max-w-7xl text-center">
        <h1 className="font-headline text-4xl md:text-6xl text-primary">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

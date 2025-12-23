import { MotionDiv } from "./motion";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container max-w-7xl text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-headline text-4xl md:text-6xl text-primary">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </MotionDiv>
      </div>
    </section>
  );
}

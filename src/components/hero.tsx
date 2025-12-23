"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="max-w-4xl text-white"
        >
          <h1 className="text-5xl md:text-7xl font-headline leading-tight mb-6">
            Escape to Nature’s Embrace
          </h1>

          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            A luxury dome stay where silence, comfort, and the mountains meet.
          </p>

          <a
            href="#booking"
            className="inline-block rounded-md bg-white px-10 py-4 text-sm font-medium tracking-wide text-black transition hover:bg-neutral-200"
          >
            Book Your Stay
          </a>
        </motion.div>
      </div>
    </section>
  );
}

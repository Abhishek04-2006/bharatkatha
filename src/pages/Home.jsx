import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, MapPin, Clock, ChevronRight, Landmark, Palette, Music, Footprints, UtensilsCrossed, BookOpen, Brain } from "lucide-react";
import { Image } from "@/components/ui/image";
import { HERITAGE, CATEGORIES, ERAS, IMG } from "@/data/heritage";
import HeritageCard from "@/components/HeritageCard";
import SectionHeading from "@/components/SectionHeading";

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src={IMG.hero} alt="Ancient Nalanda at golden hour" className="h-full w-full" fittingType="fill" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={fade} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Heritage Experience
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fade}
            transition={{ delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-foreground"
          >
            Don't just learn India's history.
            <br />
            <span className="text-gradient-gold">Step inside it.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fade}
            transition={{ delay: 0.2 }}
            className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            Discover the stories, people, traditions and heritage that shaped India — through immersive, interactive experiences.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fade}
            transition={{ delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/explore"
              className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-7 py-3.5 text-sm font-semibold text-background"
            >
              <Compass className="h-4 w-4" /> Explore India
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-primary" /> Create Your Katha
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fade}
            transition={{ delay: 0.45 }}
            className="mt-14 flex items-center justify-center gap-8 sm:gap-12"
          >
            {["Discover", "Experience", "Create", "Preserve"].map((w, i) => (
              <div key={w} className="flex items-center gap-8 sm:gap-12">
                <span className="font-display text-sm sm:text-base uppercase tracking-[0.18em] text-muted-foreground">{w}</span>
                {i < 3 && <span className="h-1 w-1 rounded-full bg-primary/50" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED HERITAGE */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeading
            eyebrow="Featured Heritage"
            title="Stories etched in stone, silk and song"
            subtitle="A curated entry point into India's living heritage — each one a doorway to step inside."
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {HERITAGE.map((item, i) => (
              <motion.div key={item.id} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fade}>
                <HeritageCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE BY CATEGORY */}
      <section className="py-20 md:py-24 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeading center eyebrow="Explore by Category" title="Eight ways into a civilisation" />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fade}
              >
                <Link
                  to={`/explore?category=${cat.id}`}
                  className="group block h-full rounded-2xl border border-border bg-card p-5 card-hover"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                    <CatIcon name={cat.icon} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{cat.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE BY ERA */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeading eyebrow="Explore by Era" title="A timeline you can walk through" />
          <div className="mt-12 relative">
            <div className="absolute left-0 right-0 top-7 hidden md:block gold-divider" />
            <div className="grid md:grid-cols-4 gap-6">
              {ERAS.map((era, i) => (
                <motion.div key={era.id} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
                  <Link to={`/explore?era=${era.id}`} className="group relative block">
                    <div className="relative z-10 mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-background text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="mt-4 rounded-2xl border border-border bg-card p-5 card-hover">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">{era.period}</span>
                      <h3 className="mt-2 font-display text-xl font-bold text-foreground">{era.name}</h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{era.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-background p-10 md:p-16 text-center">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                History is not just something we read.
                <br />
                <span className="text-gradient-gold">It is something we can experience, create and preserve.</span>
              </h2>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/experience" className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-7 py-3.5 text-sm font-semibold text-background">
                  Enter a Story <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/characters" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors">
                  Meet History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CAT_ICONS = { Landmark, Palette, Music, Footprints, UtensilsCrossed, Sparkles, BookOpen, Brain };
function CatIcon({ name }) {
  const I = CAT_ICONS[name] || MapPin;
  return <I className="h-5 w-5" />;
}
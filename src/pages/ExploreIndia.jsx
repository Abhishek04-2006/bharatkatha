import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, ArrowLeft, Play, BookOpen, Lightbulb, Link2, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { HERITAGE, STATES, CATEGORIES, ERAS, getHeritage } from "@/data/heritage";
import HeritageCard from "@/components/HeritageCard";
import SearchFilter from "@/components/SearchFilter";
import { addPoints } from "@/lib/gamification";
import { searchContent, filterContent } from "@/lib/contentManagement";

export default function ExploreIndia() {
  const [params, setParams] = useSearchParams();
  const heritageId = params.get("heritage");
  const [selectedState, setSelectedState] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({
    state: "",
    era: "",
    category: "",
    difficulty: "",
    onlyFavorites: false,
  });

  const selected = heritageId ? getHeritage(heritageId) : null;

  useEffect(() => {
    if (selected) {
      addPoints(15, "first_explore");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [heritageId]);

  if (selected) return <HeritageDetail heritage={selected} onBack={() => setParams({})} />;

  // Combine legacy filters and new search/filters
  const categoryFilter = params.get("category");
  const eraFilter = params.get("era");

  let filtered = HERITAGE.filter((h) => {
    if (categoryFilter && h.categoryId !== categoryFilter) return false;
    if (eraFilter && h.eraId !== eraFilter) return false;
    return true;
  });

  // Apply search
  if (searchQuery.trim()) {
    filtered = searchContent(filtered, searchQuery);
  }

  // Apply advanced filters
  filtered = filterContent(filtered, advancedFilters);

  const activeLabel =
    (categoryFilter && CATEGORIES.find((c) => c.id === categoryFilter)?.name) ||
    (eraFilter && ERAS.find((e) => e.id === eraFilter)?.name) ||
    (searchQuery && `Search: "${searchQuery}"`) ||
    null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 md:py-20 border-b border-border">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <MapPin className="h-4 w-4" /> Explore India
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">
            India <span className="text-gradient-gold">→</span> State <span className="text-gradient-gold">→</span> Heritage
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Select a region to uncover its heritage, or browse the curated collection below.
          </p>
        </div>
      </section>

      {/* State selector */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-display text-2xl font-bold mb-6">Choose a State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedState(selectedState === s.id ? null : s.id)}
                className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                  selectedState === s.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={s.image} alt={s.name} className="h-full w-full" fittingType="fill" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="font-display text-lg font-bold text-foreground">{s.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{s.tagline}</p>
                </div>
              </button>
            ))}
          </div>

          {selectedState && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-border bg-card p-6">
              {(() => {
                const s = STATES.find((x) => x.id === selectedState);
                return (
                  <div>
                    <h3 className="font-display text-xl font-bold">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.tagline}</p>
                    <div className="mt-5 grid sm:grid-cols-3 gap-3">
                      {s.cities.map((c) => (
                        <div key={c.name} className="rounded-xl border border-border bg-background/50 p-4">
                          <p className="font-medium text-foreground flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" /> {c.name}
                          </p>
                          {c.heritage.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {c.heritage.map((hid) => {
                                const h = getHeritage(hid);
                                return h ? (
                                  <button
                                    key={hid}
                                    onClick={() => setParams({ heritage: hid })}
                                    className="block w-full text-left text-sm text-amber-200/90 hover:text-primary transition-colors"
                                  >
                                    → {h.name}
                                  </button>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">Heritage content coming soon.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      </section>

      {/* Collection */}
      <section className="py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-10">
            <SearchFilter
              onSearch={setSearchQuery}
              onFilter={setAdvancedFilters}
              states={STATES.map(s => s.name)}
              eras={ERAS.map(e => e.name)}
              categories={CATEGORIES.map(c => c.name)}
              showFavorites={true}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl font-bold">
              {activeLabel ? `${activeLabel} Heritage` : "Curated Heritage Collection"}
            </h2>
            {(categoryFilter || eraFilter || searchQuery || Object.values(advancedFilters).some(v => v)) && (
              <button
                onClick={() => {
                  setParams({});
                  setSearchQuery("");
                  setAdvancedFilters({
                    state: "",
                    era: "",
                    category: "",
                    difficulty: "",
                    onlyFavorites: false,
                  });
                }}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((item) => (
              <HeritageCard key={item.id} item={item} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No heritage items match your search or filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function HeritageDetail({ heritage, onBack }) {
  return (
    <div className="min-h-screen">
      <div className="relative h-[60vh] min-h-[420px]">
        <Image src={heritage.image} alt={heritage.name} className="h-full w-full" fittingType="fill" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-5xl mx-auto px-5 lg:px-8 pb-10">
            <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Explore
            </button>
            <span className="inline-block rounded-full glass px-3 py-1 text-xs text-amber-200 mb-3">{heritage.category}</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">{heritage.name}</h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {heritage.location}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {heritage.era} · {heritage.period}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <DetailBlock icon={BookOpen} title="Short History" text={heritage.shortHistory} />
          <DetailBlock icon={Lightbulb} title="Cultural Significance" text={heritage.significance} />
          <DetailBlock icon={Sparkle} title="Why It Matters Today" text={heritage.whyItMatters} />
          <div>
            <h3 className="font-display text-lg font-bold flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> Related Traditions</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {heritage.relatedTraditions.map((t) => (
                <span key={t} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold mb-3">Sources</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {heritage.sources.map((s) => (
                <li key={s} className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-primary" /> {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
            <h3 className="font-display text-lg font-bold">Enter the Story</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Don't just read about it — step inside a living, interactive reconstruction.
            </p>
            <Link
              to={`/experience?heritage=${heritage.id}`}
              className="btn-glow mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3.5 text-sm font-semibold text-background"
            >
              <Play className="h-4 w-4" /> Enter The Story
            </Link>
            <Link to="/characters" className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 transition-colors">
              Meet Historical Figures <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, text }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {title}</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function Sparkle(props) {
  return <Lightbulb {...props} />;
}
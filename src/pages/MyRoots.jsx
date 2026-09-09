import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Landmark, Music, UtensilsCrossed, Sparkles, BookOpen,
  Languages, Mic, Video, Image as ImageIcon, PenLine, Loader2, Heart, Check,
  Star, Clock, Camera, ArrowRight
} from "lucide-react";
import { ROOTS_DATA } from "@/data/heritage";
import { uploadMediaFile } from "@/lib/backend";
import { addPoints } from "@/lib/gamification";

const LOCATIONS = Object.keys(ROOTS_DATA);

// Featured heritage image per location
const LOCATION_IMAGES = {
  "Varanasi, Uttar Pradesh": "https://upload.wikimedia.org/wikipedia/commons/6/68/Sari_from_India%2C_Varanasi%2C_18th_century%2C_Honolulu_Museum_of_Art_10911.1.JPG",
  "Prayagraj, Uttar Pradesh": "https://upload.wikimedia.org/wikipedia/commons/6/6f/The_Dhamek_Stupa_%2C_500_CE_%2CSarnath%2C_Varanasi_Uttar_Pradesh.jpg",
  "Jaipur, Rajasthan": "https://upload.wikimedia.org/wikipedia/commons/c/c0/A_group_of_Rajasthan%E2%80%99s_premier_Langa_and_Manganiyar_musicians_traveled_to_London%2C_England%2C_to_perform_in_1983.jpg",
  "Madurai, Tamil Nadu": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bharata_Natyam_Performance_DS.jpg",
};

// Rich story cards per location
const LOCATION_STORIES = {
  "Varanasi, Uttar Pradesh": [
    {
      title: "The Eternal City",
      body: "Varanasi is said to be the oldest continuously inhabited city in the world, older than Rome. Known as Kashi — the City of Light — it sits on the banks of the Ganga and has drawn pilgrims, poets and seekers for over 3,000 years. Mark Twain wrote: 'Benares is older than history, older than tradition, older even than legend.'",
      tag: "Historical Record",
    },
    {
      title: "Kabir's Looms",
      body: "The mystic poet Kabir was born and lived in Varanasi in the 15th century. A weaver by trade, he sat at his loom composing couplets (dohas) that cut across Hindu and Muslim boundaries. His verses on love, doubt and the formless Divine are still sung in the lanes of Kashi.",
      tag: "Cultural Story",
    },
    {
      title: "Dev Deepawali",
      body: "On the full moon night of Kartik Purnima, the ghats of Varanasi come alive with over a million earthen lamps — Dev Deepawali, the 'Diwali of the Gods'. According to local tradition, the gods descend to the ghats to bathe in the Ganga on this night.",
      tag: "Living Tradition",
    },
  ],
  "Prayagraj, Uttar Pradesh": [
    {
      title: "The Invisible River",
      body: "At the Triveni Sangam, the Ganga and Yamuna meet visibly — the green-blue Yamuna and the murky Ganga flowing side by side. Hindu tradition holds that a third river, the Saraswati, flows invisibly beneath the confluence. Pilgrims believe bathing here at sacred times washes away accumulated karma.",
      tag: "Mythology & Place",
    },
    {
      title: "The Kumbh Mela",
      body: "The Kumbh Mela at Prayagraj is the largest peaceful gathering of humans on Earth. In 2019, over 240 million people attended across 49 days — a figure visible from satellite imagery. The festival follows a 12-year cycle tied to Jupiter's orbit, a tradition documented in ancient texts.",
      tag: "Historical Record",
    },
    {
      title: "Akbar's Name Change",
      body: "Mughal Emperor Akbar renamed the city 'Ilahabas' (Abode of God) around 1583 CE when he built Allahabad Fort at the Sangam. The city has carried variants of this name since — a palimpsest of ancient Hindu identity and Mughal administrative history.",
      tag: "Historical Fact",
    },
  ],
  "Jaipur, Rajasthan": [
    {
      title: "A Planned City of Pink",
      body: "Jaipur was founded in 1727 CE by Maharaja Sawai Jai Singh II — one of the first planned cities in India, laid out on a grid system inspired by ancient Vastu shastra texts. The distinctive terracotta-pink colour of its buildings dates to 1876 when the entire city was painted pink to welcome the Prince of Wales.",
      tag: "Historical Record",
    },
    {
      title: "Jantar Mantar's Cosmic Instruments",
      body: "Built between 1724–1735 CE, Jantar Mantar is an observatory of 19 astronomical instruments, some over 20 metres tall. Sawai Jai Singh II built five such observatories across India. The Samrat Yantra sundial at Jaipur can tell time accurate to within two seconds. It remains a functioning UNESCO World Heritage Site.",
      tag: "Science Heritage",
    },
    {
      title: "The Song of Teej",
      body: "Teej in Jaipur is not just a festival — it is the city's greatest procession. An idol of Goddess Teej is carried through the walled city in a palanquin, accompanied by folk dancers, musicians, camels and elephants. Women in green sarees sing traditional songs as the monsoon rains fall around them.",
      tag: "Living Tradition",
    },
  ],
  "Madurai, Tamil Nadu": [
    {
      title: "The Lotus City",
      body: "Madurai's urban plan was traditionally described as a lotus, with the Meenakshi Amman Temple at its centre. The temple's nine gateway towers (gopurams), covered in thousands of painted sculptures, are visible from across the city. Madurai has been an important trade and pilgrimage city for over 2,500 years, mentioned by Greek geographers.",
      tag: "Historical Record",
    },
    {
      title: "The Goddess Who Chose",
      body: "The central story of Madurai is of Meenakshi — the goddess born with three breasts who became a warrior queen. The legend says one breast would vanish when she met her true match. She fought and conquered kingdoms before meeting Shiva, disguised as a wanderer, at a crossroads. Today, their wedding is celebrated annually as the Chithirai Festival, drawing millions.",
      tag: "Mythological Story",
    },
    {
      title: "Sangam Literature",
      body: "Between roughly 300 BCE and 300 CE, Tamil poets gathered at the ancient Sangam (academy) in Madurai to compose poetry. This Sangam literature — among the world's oldest secular poetry — described love, war, society and nature with extraordinary vividness. Over 2,381 poems survive, authored by 473 named poets including 30 women.",
      tag: "Literary Heritage",
    },
  ],
};

export default function MyRoots() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [preserving, setPreserving] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preserved, setPreserved] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("bharatkatha_roots") || "[]");
    setPreserved(p);
  }, []);

  const search = (q) => {
    setQuery(q);
    setShowDropdown(q.length > 0);
    if (!q) { setSelected(null); setSelectedKey(null); }
  };

  const pick = (loc) => {
    setQuery(loc);
    setSelected(ROOTS_DATA[loc]);
    setSelectedKey(loc);
    setShowDropdown(false);
  };

  const doUpload = async (type, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadMediaFile(file, { name: file.name, type: file.type });
      const entry = { type, title: file.name, url: uploaded.file_url, created: new Date().toISOString() };
      const all = [entry, ...preserved];
      setPreserved(all);
      localStorage.setItem("bharatkatha_roots", JSON.stringify(all));
      addPoints(30, "root_keeper");
      setPreserving(null);
    } catch (e) {
      alert("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveStory = (text) => {
    if (!text.trim()) return;
    const entry = { type: "story", title: text.slice(0, 40) + "...", text, created: new Date().toISOString() };
    const all = [entry, ...preserved];
    setPreserved(all);
    localStorage.setItem("bharatkatha_roots", JSON.stringify(all));
    addPoints(30, "root_keeper");
    setPreserving(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-20 border-b border-border">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <MapPin className="h-4 w-4" /> My Roots
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">
            Discover the heritage of <span className="text-gradient-gold">your hometown</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every town holds a thousand stories. Search yours to uncover its history, traditions, living culture and forgotten tales.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl relative">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 py-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => search(e.target.value)}
                onFocus={() => setShowDropdown(query.length > 0)}
                placeholder="e.g. Varanasi, Jaipur, Madurai..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => { setQuery(""); setSelected(null); setSelectedKey(null); }} className="text-muted-foreground hover:text-foreground px-2 text-sm">✕</button>
              )}
            </div>
            {showDropdown && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card overflow-hidden shadow-xl">
                {LOCATIONS.filter((l) => l.toLowerCase().includes(query.toLowerCase())).length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No locations found for "{query}"</div>
                ) : (
                  LOCATIONS.filter((l) => l.toLowerCase().includes(query.toLowerCase())).map((l) => (
                    <button key={l} onClick={() => pick(l)} className="block w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {l}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick pick buttons */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Explore:</span>
            {LOCATIONS.map((l) => (
              <button
                key={l}
                onClick={() => pick(l)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${selectedKey === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
              >
                {l.split(",")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Detail */}
      {selected ? (
        <RootsView data={selected} locationKey={selectedKey} onPreserve={(t) => setPreserving(t)} />
      ) : (
        <section className="py-20 text-center">
          <div className="max-w-md mx-auto px-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">Search your hometown</h2>
            <p className="mt-2 text-sm text-muted-foreground">Choose from Varanasi, Prayagraj, Jaipur or Madurai to explore their heritage, traditions and stories.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {LOCATIONS.map((l) => {
                const img = LOCATION_IMAGES[l];
                return (
                  <button key={l} onClick={() => pick(l)} className="group relative overflow-hidden rounded-2xl border border-border aspect-[4/3] text-left">
                    {img && <img src={img} alt={l} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <div className="font-display text-base font-bold">{l.split(",")[0]}</div>
                      <div className="text-[11px] text-muted-foreground">{l.split(",")[1]?.trim()}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Preserve Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
            <Heart className="h-4 w-4" /> Preserve a Story From Your Family
          </div>
          <h2 className="font-display text-3xl font-bold">Keep your family's stories alive</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">Oral history vanishes in a generation. Record an elder's voice, a photo, a memory — and preserve it for the future.</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <PreserveBtn icon={Mic} label="Upload Audio" sublabel="Dadi/Nani stories" onClick={() => setPreserving("audio")} />
            <PreserveBtn icon={Video} label="Upload Video" sublabel="Family recordings" onClick={() => setPreserving("video")} />
            <PreserveBtn icon={Camera} label="Upload Photo" sublabel="Family memories" onClick={() => setPreserving("photo")} />
            <PreserveBtn icon={PenLine} label="Write a Story" sublabel="In your own words" onClick={() => setPreserving("story")} />
          </div>

          {preserved.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-bold mb-4">Your preserved stories</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {preserved.map((p, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-xs text-primary">
                      {p.type === "story" ? <PenLine className="h-3.5 w-3.5" /> : p.type === "audio" ? <Mic className="h-3.5 w-3.5" /> : p.type === "video" ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                      <span className="uppercase tracking-wide">{p.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-foreground line-clamp-2">{p.title}</p>
                    {p.type === "photo" && p.url && <img src={p.url} alt={p.title} className="mt-3 rounded-lg h-32 w-full object-cover" />}
                    {p.type === "story" && p.text && <p className="mt-2 text-xs text-muted-foreground line-clamp-3 italic">"{p.text.slice(0, 120)}..."</p>}
                    <p className="mt-2 text-[11px] text-muted-foreground">{new Date(p.created).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {preserving && (
        <PreserveModal type={preserving} uploading={uploading} onClose={() => setPreserving(null)} onUpload={doUpload} onSaveStory={saveStory} />
      )}
    </div>
  );
}

function RootsView({ data, locationKey, onPreserve }) {
  const stories = LOCATION_STORIES[locationKey] || [];
  const img = LOCATION_IMAGES[locationKey];

  const blocks = [
    { icon: Landmark, label: "Historical Places", items: data.historicalPlaces },
    { icon: Sparkles, label: "Local Traditions", items: data.localTraditions },
    { icon: UtensilsCrossed, label: "Food", items: data.food },
    { icon: Music, label: "Folk Culture", items: data.folkCulture },
    { icon: Star, label: "Festivals", items: data.festivals },
    { icon: BookOpen, label: "Local Stories & Legends", items: data.localStories },
    { icon: Languages, label: "Languages & Dialects", items: data.languages },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-14">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Location header with image */}
        {img && (
          <div className="relative h-56 rounded-2xl overflow-hidden mb-8">
            <img src={img} alt={data.region} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8">
              <div>
                <h2 className="font-display text-3xl md:text-5xl font-bold">{data.region}</h2>
                <p className="text-muted-foreground mt-1">{data.state}</p>
                <button onClick={() => onPreserve("story")} className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm text-primary hover:bg-primary/10 transition-colors">
                  <Heart className="h-4 w-4" /> Preserve a memory
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Heritage info grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {blocks.map((b) => (
            <div key={b.label} className="rounded-2xl border border-border bg-card p-5 card-hover">
              <div className="flex items-center gap-2 text-primary mb-3">
                <b.icon className="h-4 w-4 shrink-0" />
                <h3 className="font-display text-base font-bold text-foreground">{b.label}</h3>
              </div>
              <ul className="space-y-1.5">
                {b.items.map((it) => (
                  <li key={it} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Story cards */}
        {stories.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-2xl font-bold mb-5">Stories & Historical Records</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {stories.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-6 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest border border-primary/30 text-primary rounded px-2 py-0.5">{s.tag}</span>
                  </div>
                  <h4 className="font-display text-lg font-bold mb-3">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

function PreserveBtn({ icon: Icon, label, sublabel, onClick }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 card-hover text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <span className="text-sm font-medium block">{label}</span>
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      </div>
    </button>
  );
}

function PreserveModal({ type, uploading, onClose, onUpload, onSaveStory }) {
  const [story, setStory] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl font-bold capitalize">
          {type === "story" ? "Write a family story" : `Upload ${type}`}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Preserve a piece of your family's heritage for future generations.</p>
        <div className="mt-5">
          {type === "story" ? (
            <>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={6}
                placeholder="My grandmother used to tell me about the night of Diwali when..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary resize-none"
              />
              <button
                onClick={() => onSaveStory(story)}
                disabled={!story.trim()}
                className="mt-4 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 py-3 text-sm font-semibold text-background disabled:opacity-50"
              >
                Save Story
              </button>
            </>
          ) : (
            <label className="block rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-8 text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept={type === "audio" ? "audio/*" : type === "video" ? "video/*" : "image/*"}
                className="hidden"
                onChange={(e) => onUpload(type, e.target.files[0])}
              />
              {uploading ? (
                <>
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {type === "audio" ? <Mic className="h-5 w-5" /> : type === "video" ? <Video className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                  </div>
                  <p className="mt-3 text-sm text-foreground font-medium">Choose a {type} file</p>
                  <p className="mt-1 text-xs text-muted-foreground">Click here to browse your files</p>
                </>
              )}
            </label>
          )}
        </div>
        <button onClick={onClose} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
      </motion.div>
    </div>
  );
}
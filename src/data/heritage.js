// Curated Indian heritage content for the BharatKatha prototype.
// Static image URLs used by the heritage catalogue.

export const IMG = {
  hero: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Temple_12_-_Nalanda_Mahavihara_%2817%29.jpg",
  nalanda: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Temple_12_-_Nalanda_Mahavihara_%2817%29.jpg",
  banarasi: "https://upload.wikimedia.org/wikipedia/commons/6/68/Sari_from_India%2C_Varanasi%2C_18th_century%2C_Honolulu_Museum_of_Art_10911.1.JPG?utm_source=commons.wikimedia.org",
  hampi: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg?utm_source=commons.wikimedia.org",
  rajasthan: "https://upload.wikimedia.org/wikipedia/commons/c/c0/A_group_of_Rajasthan%E2%80%99s_premier_Langa_and_Manganiyar_musicians_traveled_to_London%2C_England%2C_to_perform_in_1983.jpg",
  bharatanatyam: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bharata_Natyam_Performance_DS.jpg",
  sarnath: "https://upload.wikimedia.org/wikipedia/commons/6/6f/The_Dhamek_Stupa_%2C_500_CE_%2CSarnath%2C_Varanasi_Uttar_Pradesh.jpg",
  aryabhata: "https://upload.wikimedia.org/wikipedia/commons/a/af/2064_aryabhata-crp.jpg",
  chanakya: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Chanakya.jpg?utm_source=commons.wikimedia.org",
  chandragupta: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Chandragupta_Maurya_Empire_c.290_BCE.png?utm_source=commons.wikimedia.org",
  kabir: "https://upload.wikimedia.org/wikipedia/commons/2/20/Kabir_%28postage_stamp%29.jpg?utm_source=commons.wikimedia.org",
};

export const CATEGORIES = [
  { id: "architecture", name: "Architecture", icon: "Landmark", desc: "Temples, stupas, forts & living cities." },
  { id: "art-crafts", name: "Art & Crafts", icon: "Palette", desc: "Weaves, paintings & handmade traditions." },
  { id: "music", name: "Music", icon: "Music", desc: "Folk, classical & devotional soundscapes." },
  { id: "dance", name: "Dance", icon: "Footprints", desc: "Classical & folk movement traditions." },
  { id: "food", name: "Food", icon: "UtensilsCrossed", desc: "Regional cuisines & culinary wisdom." },
  { id: "festivals", name: "Festivals", icon: "Sparkles", desc: "Celebrations that mark the seasons." },
  { id: "literature", name: "Literature", icon: "BookOpen", desc: "Epics, poetry & philosophical texts." },
  { id: "knowledge", name: "Traditional Knowledge", icon: "Brain", desc: "Ayurveda, astronomy & sciences." },
];

export const ERAS = [
  { id: "ancient", name: "Ancient India", period: "Up to 500 CE", desc: "Vedic civilization, Mauryan & Gupta golden ages, birth of Buddhism." },
  { id: "medieval", name: "Medieval India", period: "500 – 1700 CE", desc: "Temples, sultanates, the Mughal era & Bhakti movement." },
  { id: "colonial", name: "Colonial India", period: "1700 – 1857 CE", desc: "Trade companies, princely states & early resistance." },
  { id: "freedom", name: "Freedom Movement", period: "1857 – 1947 CE", desc: "The long struggle for independence." },
];

export const HERITAGE = [
  {
    id: "nalanda",
    name: "Nalanda University",
    image: IMG.nalanda,
    location: "Bihar",
    era: "Ancient India",
    eraId: "ancient",
    period: "5th Century CE",
    category: "Architecture",
    categoryId: "architecture",
    shortHistory:
      "Founded in the 5th century CE, Nalanda was one of the world's first residential universities. At its peak it housed over 10,000 students and 2,000 teachers from across Asia, drawn by its vast library, the Dharmaganja, which held hundreds of thousands of manuscripts.",
    significance:
      "Nalanda shaped Mahayana Buddhism and preserved centuries of Indian philosophy, logic and mathematics. Its curriculum spanned theology, grammar, astronomy, medicine and the arts — a true multidisciplinary centre of learning.",
    whyItMatters:
      "Long before modern universities, Nalanda proved that knowledge could be a shared, international pursuit. Its ruins are a UNESCO World Heritage Site and a reminder that India was once the world's classroom.",
    relatedTraditions: ["Buddhist logic & debate", "Sanskrit scholarship", "Tibetan Buddhism lineage"],
    sources: ["UNESCO World Heritage Listing", "Xuanzang's travel records (7th c.)", "Archaeological Survey of India"],
    experienceIntro:
      "You are a young scholar arriving at Nalanda University in the 5th century CE. The campus is filled with scholars, teachers and travellers from distant lands. Incense drifts from the temples and the sound of debate echoes through the courtyards.",
  },
  {
    id: "banarasi",
    name: "Banarasi Weaving",
    image: IMG.banarasi,
    location: "Varanasi, Uttar Pradesh",
    era: "Medieval India",
    eraId: "medieval",
    period: "Since 14th Century CE",
    category: "Art & Crafts",
    categoryId: "art-crafts",
    shortHistory:
      "Banarasi silk weaving flourished under Mughal patronage, blending Persian motifs with Indian techniques. Master weavers create intricate brocade saris using fine silk and real gold zari thread, a single piece taking weeks to months.",
    significance:
      "Each sari is a canvas of motifs — paisleys, florals, jaals — carrying stories of artisans across generations. The craft holds a GI (Geographical Indication) tag protecting its origin.",
    whyItMatters:
      "Supporting handloom Banarasi weaving keeps alive a livelihood and an art form that machines cannot replicate, sustaining artisan families and a living aesthetic tradition.",
    relatedTraditions: ["Mughal textile art", "Zari metalwork", "Wedding trousseau culture"],
    sources: ["Geographical Indication Registry", "Handloom Board of India", "Crafts Council records"],
  },
  {
    id: "hampi",
    name: "Hampi",
    image: IMG.hampi,
    location: "Karnataka",
    era: "Medieval India",
    eraId: "medieval",
    period: "14th – 16th Century CE",
    category: "Architecture",
    categoryId: "architecture",
    shortHistory:
      "Hampi was the capital of the Vijayanagara Empire, one of the wealthiest cities of the medieval world. Travellers described its markets filled with jewels, silk and spices, set among breathtaking temple complexes and boulder-strewn landscapes.",
    significance:
      "The Virupaksha Temple, stone chariot and musical pillars showcase extraordinary craftsmanship. Hampi fused Dravidian temple architecture with imperial ambition.",
    whyItMatters:
      "Today a UNESCO site, Hampi teaches how a city can harmonise commerce, faith and ecology — a model of urban heritage living within nature.",
    relatedTraditions: ["Dravidian temple architecture", "Carnatic music origins", "Pampa festival"],
    sources: ["UNESCO World Heritage Listing", "Domingo Paes & Nicolo Conti chronicles", "ASI Hampi reports"],
  },
  {
    id: "rajasthan-music",
    name: "Rajasthan Folk Music",
    image: IMG.rajasthan,
    location: "Rajasthan",
    era: "Medieval India",
    eraId: "medieval",
    period: "Living tradition",
    category: "Music",
    categoryId: "music",
    shortHistory:
      "Rajasthan's folk music carries the ballads of kings, lovers and warriors across the desert. Communities like the Manganiars and Langas preserve oral epics passed down for centuries, accompanied by the kamaicha, dholak and khartal.",
    significance:
      "These songs are living archives — encoding history, ecology and emotion. They narrate the romance of Dhola-Maru, the valour of Pabuji and the devotion of Meerabai.",
    whyItMatters:
      "In a fast-changing world, folk music keeps regional languages and community memory alive, and offers the next generation a doorway into their roots.",
    relatedTraditions: ["Manganiar-Laga musical lineage", "Phad painting storytelling", "Sufi-influenced devotional song"],
    sources: ["Sangeet Natak Akademi archives", "UNESCO Intangible Heritage documentation", "Ethnomusicology studies"],
  },
  {
    id: "bharatanatyam",
    name: "Bharatanatyam",
    image: IMG.bharatanatyam,
    location: "Tamil Nadu",
    era: "Ancient India",
    eraId: "ancient",
    period: "Origins ~2nd Century BCE",
    category: "Dance",
    categoryId: "dance",
    shortHistory:
      "Bharatanatyam grew from the temple dances of Tamil Nadu, codified in the Natya Shastra. It blends nritta (pure movement), nritya (expressive dance) and natya (drama) into a deeply spiritual art form.",
    significance:
      "Its grammar of mudras (hand gestures) and abhinaya (facial expression) can narrate entire mythologies without a word, making it one of the oldest classical dance forms in the world.",
    whyItMatters:
      "Bharatanatyam continues to evolve on global stages while staying rooted in devotion — a bridge between ancient temple aesthetics and contemporary expression.",
    relatedTraditions: ["Carnatic music", "Temple sculpture & iconography", "Tamil literature & Sangam poetry"],
    sources: ["Natya Shastra", "Sangeet Natak Akademi", "Tamil epigraphical records"],
  },
  {
    id: "sarnath",
    name: "Sarnath",
    image: IMG.sarnath,
    location: "Uttar Pradesh",
    era: "Ancient India",
    eraId: "ancient",
    period: "5th Century BCE",
    category: "Architecture",
    categoryId: "architecture",
    shortHistory:
      "Sarnath is where the Buddha delivered his first sermon, setting the 'Wheel of Dharma' in motion. The Dhamek Stupa and the Ashoka Pillar — whose lion capital is India's national emblem — mark this sacred ground.",
    significance:
      "Sarnath is one of the four holiest Buddhist sites. From here, Buddhist teachings spread across Asia, shaping cultures from Sri Lanka to Japan.",
    whyItMatters:
      "The Ashoka Chakra from Sarnath now turns at the centre of India's flag — a symbol of peace and dharma that still guides the nation's identity.",
    relatedTraditions: ["Buddhist pilgrimage", "Ashokan edicts", "Lion Capital iconography"],
    sources: ["Archaeological Survey of India", "UNESCO records", "Buddhist Pali canon"],
  },
];

export const STATES = [
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    tagline: "The cradle of civilization & faith",
    image: IMG.sarnath,
    cities: [
      { name: "Varanasi", heritage: ["banarasi"] },
      { name: "Sarnath", heritage: ["sarnath"] },
      { name: "Prayagraj", heritage: [] },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    tagline: "Land of kings, forts & desert songs",
    image: IMG.rajasthan,
    cities: [
      { name: "Jaisalmer", heritage: [] },
      { name: "Jodhpur", heritage: [] },
      { name: "Jaipur", heritage: [] },
    ],
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    tagline: "Temples, classical arts & Sangam lore",
    image: IMG.bharatanatyam,
    cities: [
      { name: "Thanjavur", heritage: [] },
      { name: "Madurai", heritage: [] },
      { name: "Mahabalipuram", heritage: [] },
    ],
  },
  {
    id: "bihar",
    name: "Bihar",
    tagline: "Where empires & enlightenment began",
    image: IMG.nalanda,
    cities: [
      { name: "Nalanda", heritage: ["nalanda"] },
      { name: "Bodh Gaya", heritage: [] },
      { name: "Pataliputra (Patna)", heritage: [] },
    ],
  },
];

export const CHARACTERS = [
  {
    id: "aryabhata",
    name: "Aryabhata",
    portrait: IMG.aryabhata,
    era: "476–550 CE",
    knownFor: "Mathematics & Astronomy",
    context:
      "Aryabhata was a pioneering mathematician and astronomer of the Gupta golden age. His work Aryabhatiya introduced the place-value system, approximated π, and proposed that the Earth rotates on its axis and that eclipses are caused by shadow, not myth.",
    greeting:
      "Namaste, traveller of a distant age. I am Aryabhata. I spent my life measuring the heavens with nothing but mind and numbers. Ask me about the stars, mathematics, or how I saw the Earth move.",
  },
  {
    id: "chanakya",
    name: "Chanakya",
    portrait: IMG.chanakya,
    era: "4th Century BCE",
    knownFor: "Statecraft & Economics",
    context:
      "Chanakya, also known as Kautilya, was the strategist behind the rise of the Mauryan Empire. His treatise, the Arthashastra, is a masterwork on governance, economics, diplomacy and realpolitik — studied to this day.",
    greeting:
      "You stand before Kautilya. I built an empire with patience and policy, not merely with swords. Ask me about statecraft, strategy, or the art of ruling wisely — and I shall answer as a teacher, not a king.",
  },
  {
    id: "chandragupta",
    name: "Chandragupta Maurya",
    portrait: IMG.chandragupta,
    era: "340–297 BCE",
    knownFor: "Founder of the Mauryan Empire",
    context:
      "Chandragupta Maurya unified much of the Indian subcontinent into the first great empire. Guided by Chanakya, he established a vast administration and later, in his final years, embraced Jain asceticism.",
    greeting:
      "I am Chandragupta. I rose from humble beginnings to unite a subcontinent, then walked away from it all as a monk. Ask me about empire, leadership, or what I learned when I gave it all up.",
  },
  {
    id: "kabir",
    name: "Kabir",
    portrait: IMG.kabir,
    era: "1398–1518 CE",
    knownFor: "Mystic Poetry & Bhakti",
    context:
      "Kabir was a 15th-century mystic poet and weaver of Varanasi. His dohas (couplets) cut across religious divides, speaking of an inner, formless divinity. He is revered by Hindus, Muslims and Sikhs alike.",
    greeting:
      "Saheb, I am Kabir — a weaver of cloth and of words. I searched for God in temples and mosques and found Him in the breath itself. Ask me about love, doubt, or the path that needs no name.",
  },
];

export const ROOTS_DATA = {
  "Prayagraj, Uttar Pradesh": {
    region: "Prayagraj (Allahabad)",
    state: "Uttar Pradesh",
    historicalPlaces: ["Triveni Sangam — confluence of Ganga, Yamuna & Saraswati", "Allahabad Fort (Akbar, 1583)", "Anand Bhavan — Nehru family home"],
    localTraditions: ["Magh Mela & Kumbh Mela gatherings", "Ganga aarti at the ghats"],
    food: ["Prayagraj ki chaat", "Netram ki kachori", "Loknath ki malaiyo (winter)"],
    folkCulture: ["Awadhi storytelling", "Birha folk songs of the region"],
    festivals: ["Kumbh Mela", "Magh Mela", "Vasant Panchami"],
    localStories: ["The legend of the invisible river Saraswati at the Sangam", "How Akbar renamed the city Ilahabas"],
    languages: ["Hindi", "Awadhi dialect", "Urdu"],
  },
  "Varanasi, Uttar Pradesh": {
    region: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    historicalPlaces: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath nearby"],
    localTraditions: ["Ganga Aarti", "Banarasi silk weaving"],
    food: ["Chena dahi vada", "Banarasi paan", "Malaiyo"],
    folkCulture: ["Banarasi thumri & classical music", "Kabir's dohas"],
    festivals: ["Dev Deepawali", "Ganga Mahotsav"],
    localStories: ["The eternal city of Shiva", "Kabir weaving on the looms of Kashi"],
    languages: ["Hindi", "Bhojpuri", "Sanskrit heritage"],
  },
  "Jaipur, Rajasthan": {
    region: "Jaipur (Pink City)",
    state: "Rajasthan",
    historicalPlaces: ["Amber Fort", "Hawa Mahal", "Jantar Mantar (UNESCO)"],
    localTraditions: ["Block printing & blue pottery", "Ghoomar dance"],
    food: ["Dal baati churma", "Ghevar", "Laal maas"],
    folkCulture: ["Rajasthani ballads", "Phad scroll painting"],
    festivals: ["Teej", "Gangaur", "Jaipur Literature Festival"],
    localStories: ["Sawai Jai Singh's planned city of pink", "The astronomical instruments of Jantar Mantar"],
    languages: ["Hindi", "Rajasthani (Dhundhari)"],
  },
  "Madurai, Tamil Nadu": {
    region: "Madurai",
    state: "Tamil Nadu",
    historicalPlaces: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Palace"],
    localTraditions: ["Temple car festivals", "Classical dance & Carnatic music"],
    food: ["Madurai idli & jigarthanda", "Parotta with salna"],
    folkCulture: ["Sangam-era Tamil poetry", "Devarattam folk dance"],
    festivals: ["Meenakshi Thirukalyanam", "Chithirai Festival"],
    localStories: ["The lotus-shaped temple city", "The wedding of Goddess Meenakshi"],
    languages: ["Tamil", "English"],
  },
};

export const KATHA_THEMES = [
  { id: "ancient", name: "Ancient India", icon: "Landmark" },
  { id: "science", name: "Indian Science", icon: "Brain" },
  { id: "folk", name: "Folk Culture", icon: "Music" },
  { id: "arts", name: "Traditional Arts", icon: "Palette" },
  { id: "freedom", name: "Freedom Movement", icon: "Flag" },
];

export const KATHA_SETTINGS = [
  { id: "nalanda", name: "Nalanda" },
  { id: "varanasi", name: "Varanasi" },
  { id: "rajasthan", name: "Rajasthan" },
  { id: "tamil-nadu", name: "Tamil Nadu" },
  { id: "pataliputra", name: "Pataliputra" },
];

export const KATHA_TYPES = [
  { id: "short", name: "Short Story", desc: "A concise, vivid tale." },
  { id: "cinematic", name: "Cinematic Story", desc: "Atmospheric, scene-driven narrative." },
  { id: "interactive", name: "Interactive Story", desc: "Branching with reader choices." },
  { id: "educational", name: "Educational Story", desc: "History woven with clear facts." },
];

export function getHeritage(id) {
  return HERITAGE.find((h) => h.id === id);
}

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id);
}
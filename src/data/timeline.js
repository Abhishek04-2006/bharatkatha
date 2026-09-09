// Interactive timeline data — years are numbers, negative = BCE.

export const YEAR_MIN = -500;
export const YEAR_MAX = 1947;

export function formatYear(y) {
    return y < 0 ? `${-y} BCE` : `${y} CE`;
}

export const TIMELINE_ERAS = [
    {
        id: "ancient",
        name: "Ancient India",
        period: "Up to 500 CE",
        from: -500,
        to: 500,
        color: "#fbbf24",
        desc: "Vedic civilization, the rise of Buddhism, and the great empires of the Mauryas and Guptas — a golden age of philosophy, science and statecraft.",
        events: [
            { year: -483, title: "The Buddha teaches at Sarnath", desc: "After enlightenment at Bodh Gaya, the Buddha sets the Wheel of Dharma in motion near Varanasi." },
            { year: -326, title: "Alexander reaches the Indus", desc: "Greek armies cross into the subcontinent, meeting the fortified cities and republics of the northwest." },
            { year: -322, title: "The Mauryan Empire rises", desc: "Chandragupta Maurya, guided by Chanakya, forges India's first great empire from Pataliputra." },
            { year: -261, title: "Ashoka turns to dharma", desc: "Horrified by the Kalinga war, Emperor Ashoka embraces Buddhism and carves edicts in stone across the land." },
            { year: 427, title: "Nalanda University founded", desc: "The world's first great residential university opens its doors to ten thousand scholars from across Asia." },
        ],
    },
    {
        id: "medieval",
        name: "Medieval India",
        period: "500 – 1700 CE",
        from: 500,
        to: 1700,
        color: "#f59e0b",
        desc: "Temple cities rise, sultanates rule from Delhi, and the Vijayanagara and Mughal eras create some of the most opulent civilisations on Earth.",
        events: [
            { year: 800, title: "Shankaracharya's journeys", desc: "The philosopher-monk travels the subcontinent, establishing centres of learning at its four corners." },
            { year: 1010, title: "Brihadeshwara Temple completed", desc: "Rajaraja Chola completes the great temple at Thanjavur, a masterpiece of Dravidian architecture." },
            { year: 1206, title: "The Delhi Sultanate established", desc: "Qutb al-Din Aibak founds a dynasty that will rule from Delhi for three centuries." },
            { year: 1336, title: "Vijayanagara founded", desc: "Two brothers establish a city-state that grows into one of the wealthiest cities of the medieval world — Hampi." },
            { year: 1653, title: "The Taj Mahal completed", desc: "Shah Jahan finishes his monument to Mumtaz Mahal, the crown jewel of Mughal architecture." },
        ],
    },
    {
        id: "colonial",
        name: "Colonial India",
        period: "1700 – 1857 CE",
        from: 1700,
        to: 1857,
        color: "#ea580c",
        desc: "A trading company becomes an empire. Princely states, battles and rebellions reshape the subcontinent under growing British dominance.",
        events: [
            { year: 1757, title: "Battle of Plassey", desc: "The East India Company's victory in Bengal begins a trading firm's transformation into a ruling power." },
            { year: 1799, title: "Tipu Sultan falls at Srirangapatna", desc: "The 'Tiger of Mysore' dies defending his kingdom, becoming an enduring symbol of resistance." },
            { year: 1818, title: "The Marathas defeated", desc: "Victory in the Anglo-Maratha wars leaves the Company dominant across the subcontinent." },
            { year: 1835, title: "English education introduced", desc: "Macaulay's education policy reshapes Indian learning and sparks debates that continue today." },
            { year: 1857, title: "The First War of Independence", desc: "A sepoy mutiny becomes a nationwide uprising, shaking Company rule to its core." },
        ],
    },
    {
        id: "freedom",
        name: "Freedom Movement",
        period: "1857 – 1947 CE",
        from: 1857,
        to: 1947,
        color: "#dc2626",
        desc: "A nation finds its voice — from the first political assemblies to Gandhi's salt march, the long, nonviolent road to independence.",
        events: [
            { year: 1885, title: "The Indian National Congress founded", desc: "Seventy-two delegates meet in Bombay to give the nation its first modern political voice." },
            { year: 1919, title: "Jallianwala Bagh massacre", desc: "British troops fire on an unarmed gathering in Amritsar, galvanising the freedom movement." },
            { year: 1930, title: "The Dandi March", desc: "Gandhi walks 240 miles to make salt from the sea, breaking an empire with a handful of grains." },
            { year: 1942, title: "Quit India Movement", desc: "The Congress demands immediate independence — 'Do or Die' becomes a nation's cry." },
            { year: 1947, title: "Independence", desc: "At the stroke of the midnight hour, India awakens to life and freedom." },
        ],
    },
];

export const ALL_TIMELINE_EVENTS = TIMELINE_ERAS.flatMap((e) =>
    e.events.map((ev) => ({ ...ev, eraId: e.id, color: e.color }))
);
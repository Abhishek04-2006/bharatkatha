// Mock Base44 client for local development
// Replaces Base44 platform SDK - uses local backend or returns mock data

import { generateWithGemini } from "./backendClient";

const MOCK_RESPONSES = {
  scholar: [
    "Namaste. Nalanda is a beacon of knowledge where students from China, Korea, and Tibet come to study the Dharma. Our library, the Dharmaganja, holds wisdom on palm leaves that would take lifetimes to read.",
    "A day here begins before dawn with chanting, then hours of debate in the courtyards. We study logic, medicine, astronomy — all under the shade of the Bodhi tree. The monks walk in silence, their minds full of questions.",
    "The Great Stupa stands at our heart, containing relics of the Buddha. Around it, eight viharas house thousands of scholars. Each cell has a niche for a lamp — learning never sleeps at Nalanda.",
  ],
  debate: {
    topic: "The nature of consciousness in Buddhist philosophy",
    participants: ["Vasubandhu", "Dignaga"],
    opening: "Vasubandhu: Consciousness is a stream, ever-changing, without a permanent self.",
    rounds: [
      "Dignaga: If consciousness is momentary, what carries karma between lives?",
      "Vasubandhu: The storehouse consciousness (alaya-vijnana) holds karmic seeds across moments.",
      "Dignaga: But then you posit a substrate — is that not a self by another name?",
      "Vasubandhu: It is not a self, but a causal continuum. The flame passes from candle to candle.",
    ],
  },
  katha: "In the golden hour before dawn, I walked the stone paths of Nalanda. The great stupa loomed against the pale sky, its bricks warm from centuries of devotion. Monks in saffron moved like shadows between the viharas, their chants weaving through the morning mist. I had come seeking the wisdom of Śīlabhadra, the abbot who had guided Xuanzang himself. In the library's cool darkness, palm-leaf manuscripts whispered of astronomy, medicine, logic — the collected mind of Asia. Each leaf was a universe. When I finally stood before the scholar, he smiled and said: 'Knowledge is not kept, traveller. It is breathed. Take what you need, and pass it on.'",
  character: "I am Aryabhata, born in Pataliputra in 476 CE. I calculated π as 3.1416 and proposed the earth rotates on its axis. My Aryabhatiya gave mathematics to the world. What do you seek to know?",
};

let mockIndex = 0;

async function mockInvokeLLM({ prompt }) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  if (prompt.includes("Silabhadra") || prompt.includes("scholar")) {
    return MOCK_RESPONSES.scholar[mockIndex++ % MOCK_RESPONSES.scholar.length];
  }
  if (prompt.includes("debate") || prompt.includes("scholarly debate")) {
    return JSON.stringify(MOCK_RESPONSES.debate);
  }
  if (prompt.includes("Katha") || prompt.includes("story")) {
    return MOCK_RESPONSES.katha;
  }
  if (prompt.includes("Aryabhata") || prompt.includes("Chanakya") || prompt.includes("Chandragupta") || prompt.includes("Kabir")) {
    return MOCK_RESPONSES.character;
  }
  return "The ancient texts speak of many wonders. Ask, and I shall share what I know.";
}

export const base44 = {
  integrations: {
    Core: {
      async InvokeLLM({ prompt, response_json_schema }) {
        // Try local backend first, fall back to mock
        try {
          if (import.meta.env.VITE_API_URL) {
            const result = await generateWithGemini(prompt, response_json_schema);
            return result;
          }
        } catch (e) {
          console.warn("Local LLM backend unavailable, using mock:", e.message);
        }
        const text = await mockInvokeLLM({ prompt });
        return response_json_schema ? JSON.stringify({ response: text }) : text;
      },
    },
  },
  // Mock file upload - stores in localStorage for demo
  files: {
    async UploadFile({ file, path }) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const id = `file_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          const mockFile = { id, name: file.name, url: reader.result, path, size: file.size };
          const stored = JSON.parse(localStorage.getItem("bharatkatha_files") || "[]");
          stored.push(mockFile);
          localStorage.setItem("bharatkatha_files", JSON.stringify(stored));
          resolve(mockFile);
        };
        reader.readAsDataURL(file);
      });
    },
    async ListFiles({ path }) {
      const stored = JSON.parse(localStorage.getItem("bharatkatha_files") || "[]");
      return stored.filter((f) => f.path === path);
    },
  },
  // Mock auth - no-op for local dev
  auth: {
    getCurrentUser() { return null; },
    async signIn() { return { user: null }; },
    async signOut() { },
  },
};

export default base44;
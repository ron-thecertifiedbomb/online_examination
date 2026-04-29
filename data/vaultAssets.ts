import { VaultAsset } from "../interfaces";

export const assets: VaultAsset[] = [
  // --- RD.SOLUTIONS & LIZARD INFRA (The Engine) ---
  {
    id: "dev-v0",
    serial: "DEV-AI-UI-GEN",
    name: "Vercel v0",
    category: "tool",
    type: "CODE",
    status: "online",
    version: "2026.Q2",
    price: 0,
    href: "https://v0.dev",
  },
  {
    id: "dev-claude",
    serial: "DEV-AI-LOGIC-CORE",
    name: "Anthropic Claude 3.5",
    category: "tool",
    type: "CODE",
    status: "online",
    version: "SONNET",
    price: 0,
    href: "https://claude.ai",
  },
  {
    id: "dev-cursor",
    serial: "DEV-IDE-SYNC",
    name: "Cursor AI Editor",
    category: "tool",
    type: "CODE",
    status: "online",
    version: "PRO",
    price: 0,
    href: "https://cursor.sh",
  },
  {
    id: "infra-supa",
    serial: "INF-DB-VEC-01",
    name: "Supabase",
    category: "infra",
    type: "CODE",
    status: "online",
    version: "v2.0",
    price: 0,
    href: "https://supabase.com",
  },

  // --- THE PSYCHEDELIC RIFFER RACK (The Soul) ---
  {
    id: "riffer-nam",
    serial: "PLG-AMP-FREE-NAM",
    name: "Neural Amp Modeler",
    category: "plugin",
    type: "IR", // NAM uses Impulse Responses
    status: "online",
    version: "0.7.2",
    price: 0,
    href: "https://www.neuralampmodeler.com/",
  },
  {
    id: "riffer-dist",
    serial: "PUB-MUS-DISTRO",
    name: "DistroKid",
    category: "plugin",
    type: "PDF", // Placeholder type for distribution docs
    status: "online",
    version: "7%_OFF",
    price: 0,
    href: "https://distrokid.com",
  },
  {
    id: "riffer-ml-roots",
    serial: "PLG-AMP-MLSL-01",
    name: "Amped Roots - ML Sound",
    category: "plugin",
    type: "IR", // ML Sound Lab is famous for their Cab IRs
    status: "online",
    version: "2.0.0",
    price: 0, // Highlight the Free version first
    href: "https://ml-sound-lab.com/products/amped-roots",
  },
];

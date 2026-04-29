export interface Emulator {
  id: string;
  name: string;
  system: string;
  version: string;
  desc: string;
  color: "emerald" | "purple" | "blue" | "zinc";
  status: "Operational" | "Testing" | "Offline";
}

export const EMULATORS: Emulator[] = [
  {
    id: "gbc",
    name: "GameBoy Color",
    system: "GBC",
    version: "Core v2.4.0",
    desc: "8-bit handheld legacy. High-compatibility rendering for retro exploration.",
    color: "emerald",
    status: "Offline",
  },
  {
    id: "nes",
    name: "Nintendo Entertainment",
    system: "NES",
    version: "Core v1.0.2",
    desc: "The foundation of 8-bit home console gaming. Optimized zero-lag input.",
    color: "emerald",
    status: "Operational",
  },
  {
    id: "gba",
    name: "GameBoy Advance",
    system: "GBA",
    version: "Core v3.1.1",
    desc: "32-bit power in the palm of your hand. Enhanced sprite processing active.",
    color: "purple",
    status: "Offline",
  },
  {
    id: "snes",
    name: "Super Nintendo",
    system: "SNES",
    version: "Core v1.0.0",
    desc: "16-bit perfection. Mode 7 rendering and expansion chip support initialized.",
    color: "zinc",
    status: "Offline",
  },
  {
    id: "genesis",
    name: "Sega Genesis",
    system: "GEN",
    version: "Core v0.8.4",
    desc: "High-speed 16-bit processing. Blast processing protocols ready for deployment.",
    color: "blue",
    status: "Offline",
  },
];

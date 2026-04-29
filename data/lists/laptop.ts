import { GearItem } from "@/interfaces";


// Extended interface for internal use if you want to keep specs separate
export interface LaptopGear extends GearItem {
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    display: string;
  };
}

export const bestLaptops2026: LaptopGear[] = [
  {
    id: "lp-m5-max",
    name: "MacBook Pro 14 (M5 Max)",
    brand: "Apple",
    category: "Hardware",
    description:
      "The 2026 king of silicon. With its new Fusion Architecture, it handles 8K ProRes RAW in Premiere without breaking a sweat. Perfect for zero-latency tracking.",
    affiliateUrl: "https://amazon.com/dp/example1",
    imageUrl: "/gear/macbook-m5.jpg",
    isFavorite: true,
    specs: {
      cpu: "18-Core M5 Max",
      gpu: "40-Core GPU",
      ram: "64GB Unified",
      display: '14.2" Liquid Retina XDR',
    },
  },
  {
    id: "lp-g16-2026",
    name: "ROG Zephyrus G16 (2026)",
    brand: "ASUS",
    category: "Hardware",
    description:
      "The ultimate Windows engine for After Effects. Features the RTX 5090 and a 240Hz OLED for frame-perfect motion design and rapid Next.js compilation.",
    affiliateUrl: "https://amazon.com/dp/example2",
    imageUrl: "/gear/dellxps.jpg",
    isFavorite: false,
    specs: {
      cpu: "Intel Core Ultra 9 386H",
      gpu: "RTX 5090 Laptop",
      ram: "64GB LPDDR5X",
      display: '16" 2.5K OLED 240Hz',
    },
  },

  {
    id: "lp-xps-14",
    name: "Dell XPS 14 (2026)",
    brand: "Dell",
    category: "Hardware",
    description:
      "Ultra-portable dev machine. Boasting a 21-hour battery life and the new Arc B390 graphics, it's the 200 OK choice for coding on the move.",
    affiliateUrl: "https://amazon.com/dp/example3",
    imageUrl: "/gear/zephyrus-g16.jpg",
    isFavorite: false,
    specs: {
      cpu: "Intel Core Ultra X7 358H",
      gpu: "Intel Arc B390",
      ram: "32GB LPDDR5x",
      display: '14" 2.8K OLED Touch',
    },
  },
];

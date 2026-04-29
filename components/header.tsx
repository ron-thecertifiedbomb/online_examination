"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "../components/container";
import { usePathname } from "next/navigation";
import { WeatherWidget } from "./WeatherWidget/WeatherWidget";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "About" },
    { href: "/blogs", label: "Blog" },
    { href: "/utilities", label: "Utilities" },
    { href: "/latest", label: "Latest" },
  ];

  return (
    <header className=" bg-dark-bg text-white ">
      <Container>
        <nav className="flex items-center justify-between">

          {/* LEFT — LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/lizardinteractive.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
            <span className="font-semibold text-lg hidden sm:block">
              Lizard Interactive
            </span>
          </Link>

          {/* RIGHT — DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-md font-medium transition-colors duration-200
                  ${pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* WEATHER */}
            <div className="w-10 h-10 flex items-center justify-center">
              <WeatherWidget className="w-10 h-10" />
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* MOBILE NAV DROPDOWN */}
        <div
          className={`md:hidden mt-4 flex flex-col gap-4 bg-gray-900 rounded-lg px-4 py-4 border border-gray-700 transition-all duration-200 
          ${mobileOpen
              ? "opacity-100 max-h-[300px]"
              : "opacity-0 max-h-0 overflow-hidden"
            }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md font-medium transition 
                ${pathname === link.href
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Weather widget small */}
          <div className="border-t border-gray-700 flex pt-4 justify-center">
            <WeatherWidget compact />
          </div>
        </div>
      </Container>
    </header>
  );
}

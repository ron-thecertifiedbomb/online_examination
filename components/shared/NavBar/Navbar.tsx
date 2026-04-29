"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { examLinks } from "@/types/natigation";


export default function NavBar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 h-[65px] z-[100] transition-all duration-300 ${scrolled
                    ? "bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm"
                    : "bg-transparent border-b border-transparent"
                }`}
        >
            <nav className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 h-full">
                {/* LIZARD BRANDING */}
                <Link href="/" className="flex flex-col items-start leading-none group">
                    <span className="font-black text-lg tracking-tighter text-emerald-600">
                       ONLINE <span className="text-zinc-900"> EXAMINATION</span>
                    </span>
            
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden md:flex gap-8">
                    {examLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold tracking-wide transition-colors uppercase ${pathname === link.href
                                    ? "text-emerald-600"
                                    : "text-zinc-500 hover:text-emerald-600"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button
                    className="md:hidden text-zinc-900 focus:outline-none"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* MOBILE OVERLAY */}
            <div className={`fixed inset-0 bg-white z-[99] flex flex-col items-center justify-center gap-8 transition-transform duration-500 md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <button className="absolute top-6 right-6 text-zinc-900" onClick={() => setMobileOpen(false)}>
                    <X size={32} />
                </button>
                {examLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-black uppercase tracking-tighter text-zinc-900 hover:text-emerald-600"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </header>
    );
}
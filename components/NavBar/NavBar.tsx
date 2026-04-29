"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { mainLinks } from "./links";

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Lock scroll when menu or transition is active
    useEffect(() => {
        document.body.style.overflow = (mobileOpen || isTransitioning) ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen, isTransitioning]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (pathname === href) {
            setMobileOpen(false);
            return;
        }

        e.preventDefault();

        // Start the transition sequence
        setIsTransitioning(true);
        setMobileOpen(false);

        // Trigger the page change
        router.push(href);

        // Keep the overlay visible for 600ms to mask the page swap
        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    const brandName = "LIZARD INTERACTIVE ONLINE";

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-[72px] md:h-[65px] z-[100] bg-black/80 backdrop-blur-xl border-b border-white/4 text-white">
                <nav className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 h-full relative">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/lizardinteractive.png"
                            alt="Logo"
                            width={30}
                            height={30}
                            className="rounded-full "
                            priority
                        />
                        <span className="font-bold tracking-tight text-emerald-500 hover:text-emerald-500/30" >{brandName}</span>
                    </Link>

                    {/* --- DESKTOP LINKS (Restored) --- */}
                    <div className="hidden md:flex gap-8">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors uppercase  ${pathname === link.href ? "text-emerald-500" : "text-emerald-500/70 hover:text-emerald-500/30"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        className="md:hidden p-2 relative z-[101] outline-none"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </header>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-[90] bg-black md:hidden transition-opacity duration-500 ease-in-out ${mobileOpen || isTransitioning
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col items-center justify-center h-full gap-10">
                    {mainLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className={`text-xl font-black uppercase tracking-tighter transition-all active:scale-95 ${pathname === link.href ? "text-emerald-500" : "text-white/40"
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
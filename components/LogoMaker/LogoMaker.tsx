// "use client";

// import { useState, useEffect, memo } from "react";
// import dynamic from "next/dynamic";
// import Head from "next/head";
// import ScreenContainer from "../../components/shared/ScreenContainer/ScreenContainer";

// /**
//  * 1. PROCESS ISOLATION
//  * Loading the heavy LogoMaker engine only on the client.
//  * This prevents the SSR thread from locking up during pre-rendering.
//  */
// const LogoMaker = dynamic(() => import("../../components/LogoMaker/LogoMaker"), {
//     ssr: false,
//     loading: () => (
//         <div className="w-full h-[600px] border border-zinc-900 flex flex-col items-center justify-center bg-[#050505]">
//             <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full mb-4" />
//             <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-[1em] animate-pulse">
//                 Initializing_Identity_Engine
//             </span>
//         </div>
//     )
// });

// /**
//  * 2. STATIC UI COMPONENTS
//  * We remove motion logic from the main layout to prevent GPU contention 
//  * while the vector canvas is drawing.
//  */
// const StaticHeader = memo(() => (
//     <div className="text-center space-y-4 mb-16">
//         <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
//             Media.Identity
//         </h2>
//         <p className="text-zinc-600 text-xs md:text-sm tracking-[0.3em] uppercase font-mono max-w-2xl mx-auto leading-relaxed italic">
//             Vector.Identity_Synthesis // Precision branding protocols for high-performance ecosystems.
//         </p>
//     </div>
// ));

// StaticHeader.displayName = "StaticHeader";

// export default function LogoMakerPage() {
//     const [isClient, setIsClient] = useState(false);

//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     const siteTitle = "Media.Identity | Logo Maker | Lizard Interactive";
//     const siteDescription = "Professional branding and vector identity synthesis with industrial precision.";

//     return (
//         <div className="min-h-screen w-full bg-black text-white selection:bg-emerald-500 selection:text-black antialiased">
//             <Head>
//                 <title>{siteTitle}</title>
//                 <meta name="description" content={siteDescription} />
//                 <meta property="og:title" content={siteTitle} />
//                 <meta property="og:url" content="https://www.lizardinteractive.online/logomaker" />
//                 <meta name="twitter:card" content="summary_large_image" />
//             </Head>

//             <ScreenContainer variant="dark" maxWidth="xl">
//                 <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-24 pb-40">

//                     <StaticHeader />

//                     {/* 3. EXECUTION BUFFER
//                         We use a standard div here instead of motion.div. 
//                         The 'key' ensures the component does not accidentally re-mount 
//                         during minor state changes in the parent.
//                     */}
//                     <div className="flex justify-center items-center">
//                         <div className="w-full min-h-[600px] relative shadow-2xl shadow-emerald-500/5">
//                             {isClient ? (
//                                 <LogoMaker key="stable-identity-engine" />
//                             ) : (
//                                 <div className="w-full h-[600px] border border-zinc-900 bg-black" />
//                             )}
//                         </div>
//                     </div>

//                     {/* MINIMAL FOOTER */}
//                     <div className="mt-24 flex flex-col items-center gap-6 opacity-30">
//                         <div className="h-px w-16 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
//                         <div className="flex flex-col items-center gap-2">
//                             <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.8em]">
//                                 Status: Operational // Engine: SVG_CANVAS_V1
//                             </span>
//                             <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-[0.4em]">
//                                 Memory_Isolation_Active // Zero_GSR_Threshold
//                             </span>
//                         </div>
//                     </div>

//                 </div>
//             </ScreenContainer>
//         </div>
//     );
// }

// /**
//  * 4. PERFORMANCE HYDRATION
//  * Empty getStaticProps ensures the shell is static but won't trigger 
//  * serialization RangeErrors for client components.
//  */
// export async function getStaticProps() {
//     return {
//         props: {},
//     };
// }
// File: pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        {/* LIZARD ARCHITECT TIP: Add your favicon and font imports here for 100/100 performance */}
      </Head>
      {/* REMOVED: bg-black 
          ADDED: bg-zinc-50 (This acts as the base layer for the Teacher Dashboard)
      */}
      <body className="bg-zinc-50 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
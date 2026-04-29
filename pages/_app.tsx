import '../styles/global.css';
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";

export default function MyApp({ Component, pageProps }: AppProps) {


  return (
    <>
      {/* Navigation Hub */}
      <NavBar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
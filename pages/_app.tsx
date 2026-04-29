import '../styles/global.css';
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";


import NavBar from '@/components/shared/NavBar/Navbar';
import Footer from '@/components/shared/Footer/Footer';


export default function MyApp({ Component, pageProps }: AppProps) {


  return (
    <>
      {/* Navigation Hub */}
      <NavBar />

      {/* Main Content Area */}
      <main>
        <Component {...pageProps} />
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
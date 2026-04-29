import '../styles/global.css';
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Auth0Provider } from "@auth0/auth0-react";
import { Analytics } from "@vercel/analytics/next";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import { TurboToastProvider } from "@/components/gba/TurboToastProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Define routes where we want a "Clean Hardware" look
  const isEmulatorPage = router.pathname.startsWith('/emulator/');

  return (
    <Auth0Provider
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      authorizationParams={{ redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined }}
    >


      {/* Navigation */}
      {!isEmulatorPage && (
        <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-auto">
          <NavBar />
        </div>
      )}

      {/* Main Content Area */}
      <TurboToastProvider>
        <Component {...pageProps} />
        <Analytics />
      </TurboToastProvider>

      {/* Footer */}
      {!isEmulatorPage && <Footer />}
    </Auth0Provider>
  );
}
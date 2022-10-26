import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";

import "@styles/Global.scss";
import { AuthContextProvider, ThemeContextProvider } from "@context/index";
import ProtectedRoute from "@components/ProtectedRoute";
import { Navbar } from "@molecules/index";
import Constants from "@utils/Constants";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <NextNProgress />
        <Head>
          <title>{Constants.defaultTitle}</title>
        </Head>
        {Constants.publicRoutes.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Navbar />
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;

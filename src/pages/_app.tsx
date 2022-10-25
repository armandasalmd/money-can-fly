import Head from "next/head";
import { useRouter } from "next/router";

import "@styles/Global.scss";
import { AuthContextProvider, ThemeContextProvider } from "@context/index";
import ProtectedRoute from "@components/ProtectedRoute";
import Constants from "@utils/Constants";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <Head>
          <title>{Constants.defaultTitle}</title>
        </Head>
        {Constants.publicRoutes.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;

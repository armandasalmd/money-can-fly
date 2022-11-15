import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { RecoilRoot } from "recoil";

import "@styles/Global.scss";
import { AuthContextProvider, ThemeContextProvider } from "@context/index";
import ProtectedRoute from "@components/ProtectedRoute";
import Constants from "@utils/Constants";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <RecoilRoot>
          <NextNProgress />
          <Head>
            <title>{Constants.defaultTitle}</title>
            <link rel="icon" href="/logo.svg" />
          </Head>
          {Constants.publicRoutes.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </RecoilRoot>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;

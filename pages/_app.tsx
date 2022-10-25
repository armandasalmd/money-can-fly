import Head from "next/head";
import { useRouter } from "next/router";

import "@styles/Global.scss";
import { AuthContextProvider } from "../context/AuthContext";
import { ThemeContextProvider } from "context/ThemeContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Constants from "@utils/Constants";

const publicRoutes = ["/login", "/register"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <Head>
          <title>{Constants.defaultTitle}</title>
        </Head>
        {publicRoutes.includes(router.pathname) ? (
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

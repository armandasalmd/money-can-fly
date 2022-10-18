import Head from "next/head";
import { useRouter } from "next/router";

import "@styles/Global.scss";
import Navbar from "../components/Navbar";
import { AuthContextProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Constants from "@utils/Constants";

const publicRoutes = ["/login", "/register"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <Head>
        <title>{Constants.defaultTitle}</title>
      </Head>
      <Navbar />
      {publicRoutes.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthContextProvider>
  );
}

export default MyApp;

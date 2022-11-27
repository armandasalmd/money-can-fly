import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@context/index";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  return <>{user ? children : null}</>;
}

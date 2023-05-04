import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import AuthUtils from "@utils/Auth";

export interface UseAuthProps {
  user: User;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<UseAuthProps>({
  user: null,
  login: (email, password) => undefined as Promise<UserCredential>,
  register: (email, password) => undefined as Promise<UserCredential>,
  logout: () => undefined as Promise<void>
});

export const useAuth = () => useContext<UseAuthProps>(AuthContext);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    AuthUtils.setApiLoginInProgress(false);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user || AuthUtils.isApiTokenExpired()) {
        if (!AuthUtils.apiLoginInProgress()) {
          AuthUtils.clearApiExpiry();
          loginToApi(user).then((success) => {
            setUser(success ? user : null);
          });
        }
      }

      if (!user) {
        router.push("/login");
        logout();
      }

      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loginToApi(user: User): Promise<boolean> {
    if (!user) return true;

    AuthUtils.setApiLoginInProgress(true);
    const token = await user.getIdToken(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ userIdToken: token }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    
    AuthUtils.setApiLoginInProgress(false);

    if (data?.success === true && data.user?.exp) {
      AuthUtils.setApiExpiry(data.user.exp);
      
      return true;
    }

    return false;
  }

  async function register(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    if (!await loginToApi(user.user)) {
      await logout();
      return;
    }

    return user;
  }

  async function login(email: string, password: string) {
    const user = await signInWithEmailAndPassword(auth, email, password);

    if (!await loginToApi(user.user)) {
      await logout();
      return;
    }

    return user;
  }

  async function logout() {
    AuthUtils.clearApiExpiry();
    
    AuthUtils.setApiLoginInProgress(true);
    const response = await fetch("/api/auth/logout");
    const data = await response.json();
    AuthUtils.setApiLoginInProgress(false);

    if (data?.success === true) {
      setUser(null);
    }

    return await auth.signOut();
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{loading ? null : children}</AuthContext.Provider>;
}

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../../firebase";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function loginToApi(user: UserCredential): Promise<boolean> {
    const token = await user.user.getIdToken(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ userIdToken: token }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data?.success === true;
  }

  async function register(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    if (!await loginToApi(user)) {
      await logout();
    }

    return user;
  }

  async function login(email: string, password: string) {
    const user = await signInWithEmailAndPassword(auth, email, password);

    if (!await loginToApi(user)) {
      await logout();
    }

    return user;
  }

  async function logout() {
    const response = await fetch("/api/auth/logout");
    const data = await response.json();

    if (data?.success === true) {
      setUser(null);
    }

    return await auth.signOut();
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{loading ? null : children}</AuthContext.Provider>;
}

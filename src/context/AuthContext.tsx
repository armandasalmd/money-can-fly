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

  async function register(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    setUser(null);
    return await auth.signOut();
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{loading ? null : children}</AuthContext.Provider>;
}

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onIdTokenChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import { getRequest, postRequest } from "@utils/Api";
import Constants from "@utils/Constants";

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
  const [user, setUser] = useState<User>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => onIdTokenChanged(auth, setUser), []);

  useEffect(() => {
    async function fn() {
      let { authorised } = await getRequest<any>("/api/status");
      
      if (user && !authorised) {
        await loginToApi(user);
        return;
      } else if (!user && authorised) {
        await logout();
        return;
      }

      // Invalid pathways should be put on correct track
      let isPrivatePath = !Constants.publicRoutes.includes(router.pathname);

      if (isPrivatePath && !authorised) {
        router.push("/login");
      } else if (!isPrivatePath && authorised) {
        router.push("/"); // User cant use public paths when authorized. Thus redirect
      }

      // When (Firebase Ready & Api Ready) OR (Firebase Not Ready & Api Not Ready)
      setLoading(false);
    }

    // Initial state (undefined) should not trigger fn. We should wait for firebase to either set it null OR user
    if (user !== undefined) fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loginToApi(user: User): Promise<void> {
    const token = await user.getIdToken(true);

    await postRequest("/api/auth/login", { userIdToken: token });
  }

  async function register(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await getRequest<any>("/api/auth/logout");
    await auth.signOut();
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{loading ? null : children}</AuthContext.Provider>;
}

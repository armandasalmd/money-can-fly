import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav>
      {user && (
        <Link href="/">
          <a>Home</a>
        </Link>
      )}
      {user && (
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      )}
      {!user && (
        <Link href="/login">
          <a>Login</a>
        </Link>
      )}
      {!user && (
        <Link href="/register">
          <a>Register</a>
        </Link>
      )}
      {user && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

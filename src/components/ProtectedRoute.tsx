import { useAuth } from "@context/index";

export default function ProtectedRoute({ children }) {
  return useAuth().user ? children : null;
}

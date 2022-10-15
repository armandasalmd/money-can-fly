import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(state.email, state.password);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  function inputChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return <div>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <input type="text" name="email" value={state.email} onChange={inputChange} placeholder="Email" />
      <input type="password" name="password" value={state.password} onChange={inputChange} placeholder="Password" />
      <input type="submit" value="Login" />
    </form>
  </div>
}

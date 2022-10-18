import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import AuthPage, { ActionButton, FormInputState, FormItem} from "@templates/AuthPage/AuthPage";


export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();

  const actionButton: ActionButton = {
    text: "Create an account",
    path: "register",
  };

  const formItems: FormItem[] = [
    {
      name: "email",
      placeholder: "Enter email",
      title: "Email",
    },
    {
      name: "password",
      placeholder: "Enter password",
      title: "Password",
      isPassword: true,
    },
  ];

  async function handleSubmit(state: FormInputState) {
    try {
      await login(state.email.value, state.password.value);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return (
    <AuthPage
      actionButton={actionButton}
      formItems={formItems}
      onSubmit={handleSubmit}
      submitText="Login"
      title="Login"
    />
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@context/index";
import AuthPage, {
  ActionButton,
  FormInputState,
  FormItem,
} from "@templates/AuthPage/AuthPage";
import Constants from "@utils/Constants";

export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();
  const pushPath = Constants.navbarLinks.dashboard.path || "/";
  const [error, setError] = useState<string | null>(null);

  const actionButton: ActionButton = {
    text: "Create an account",
    path: "/register",
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
      router.push(pushPath);
    } catch (error) {
      setError("Invalid email or password");
    }
  }

  useEffect(() => {
    if (user) {
      router.push(pushPath);
    }
  }, [router, user, pushPath]);

  return (
    <AuthPage
      actionButton={actionButton}
      formItems={formItems}
      onSubmit={handleSubmit}
      submitText="Login"
      title="Welcome back!"
      generalError={error}
      setGeneralError={setError}
    />
  );
}

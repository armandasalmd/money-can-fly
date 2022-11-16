import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@context/index";
import Constants from "@utils/Constants";
import AuthPage, {
  ActionButton,
  FormInputState,
  FormItem,
} from "@templates/AuthPage/AuthPage";

export default function Register() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const pushPath = Constants.navbarLinks.dashboard.path || "/";

  const actionButton: ActionButton = {
    text: "Sign in",
    path: "/login",
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
    {
      name: "password2",
      placeholder: "Re-enter password",
      title: "Repeat password",
      isPassword: true,
    },
  ];

  async function handleSubmit(state: FormInputState) {
    try {
      await register(state.email.value, state.password.value);
      router.push(pushPath);
    } catch (error) {
      setError("Check your details and try again");
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
      submitText="Register"
      title="Create an account"
      generalError={error}
      setGeneralError={setError}
    />
  );
}

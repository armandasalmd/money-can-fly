import { useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@context/index";
import Constants from "@utils/Constants";
import AuthPage, {
  ActionButton,
  FormInputState,
  FormItem,
} from "@templates/AuthPage/AuthPage";

export default function Register() {
  const { register } = useAuth();
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
      if (await register(state.email.value, state.password.value)) {
        router.push(pushPath);
      } else {
        setError("Server error. Try refreshing the page.");
      }
    } catch (error) {
      const [,message, errorType] = error.message.match(Constants.firebaseErrorRegex);

      setError(Constants.firebaseAuthErrors[errorType] + ". " + message + "." || "Unknown error");
    }
  }

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

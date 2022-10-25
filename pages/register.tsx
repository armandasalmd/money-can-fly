import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import AuthPage, { ActionButton, FormInputState, FormItem } from "@templates/AuthPage/AuthPage";

export default function Register() {
  const { user, register } = useAuth();
  const router = useRouter();

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

  return <AuthPage
    actionButton={actionButton}
    formItems={formItems}
    onSubmit={handleSubmit}
    submitText="Register"
    title="Create an account"
  />
}

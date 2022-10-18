import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Button from "@atoms/Button/Button";
import Input from "@atoms/Input/Input";
import Logo from "@atoms/Logo/Logo";

export interface FormItem {
  name: string;
  defaultValue?: string;
  isPassword?: boolean;
  placeholder: string;
  title: string;
}

export interface FormInputState {
  [key: string]: {
    value: string;
    error: string;
  };
}

export interface ActionButton {
  text: string;
  path: string;
}

interface AuthFormProps {
  actionButton: ActionButton;
  formItems: FormItem[];
  generalError?: string;
  onSubmit(state: any): void;
  submitText: string;
  title: string;
  termsWarning?: boolean;
}

export default function AuthPage(props: AuthFormProps) {
  const router = useRouter();

  const defaultState = props.formItems.reduce<FormInputState>(function (acc, item: FormItem) {
    return {
      ...acc,
      [item.name]: {
        value: item.defaultValue || "",
        error: "",
      },
    };
  }, {});

  const [formState, setFormState] = useState(defaultState);

  const onActionClick = () => router.push(props.actionButton.path);

  function setValue(name: string, value: string) {
    setFormState({
      ...formState,
      [name]: {
        error: formState[name].error,
        value,
      },
    });
  }

  function getValue(name: string): string {
    return formState[name].value || "";
  }

  function getError(name: string) {
    return formState[name].error;
  }

  function handleSubmit() {
    props.onSubmit(formState);
  }

  const inputs = props.formItems.map((item: FormItem) => {
    return (
      <Input
        key={item.name}
        placeholder={item.placeholder}
        title={item.title}
        tall
        value={getValue(item.name)}
        setValue={setValue.bind(null, item.name)}
        onSubmit={handleSubmit}
        error={getError(item.name)}
        password={item.isPassword}
      />
    );
  });

  useEffect(() => {
    setFormState(defaultState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="auth">
      <Image className="auth__background" alt="login-background" src="/images/login-bg-gradient.svg" layout="fill" />
      <div className="auth__container">
        <div className="auth__logo">
          <Logo size="L" />
        </div>
        <div className="auth__main">
          <div className="auth__card">
            <h1 className="auth__cardTitle">{props.title}</h1>
            <div className="auth__cardBody">
              {inputs}
              {props.generalError && <p className="auth__error">{props.generalError}</p>}
              {props.termsWarning && (
                <p className="auth__termsWarning">By creating an account you agree with Terms and Conditions</p>
              )}
              <Button type="primary" centerText tall onClick={handleSubmit}>
                {props.submitText}
              </Button>
            </div>
            <div className="auth__cardFooter">
              <Button onClick={onActionClick}>
                {props.actionButton.text}
              </Button>
            </div>
          </div>
          <div className="auth__mainFooter">Luggage card game &copy; Armandas Barkauskas</div>
        </div>
      </div>
    </div>
  );
}

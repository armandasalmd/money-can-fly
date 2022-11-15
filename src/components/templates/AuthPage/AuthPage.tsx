import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button, Input, Logo } from "@atoms/index";
import { useTheme } from "@context/index";

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
  const { setSuspend } = useTheme();

  const defaultState = props.formItems.reduce<FormInputState>(function (
    acc,
    item: FormItem
  ) {
    return {
      ...acc,
      [item.name]: {
        value: item.defaultValue || "",
        error: "",
      },
    };
  },
  {});

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
        white
      />
    );
  });

  useEffect(() => {
    setFormState(defaultState);
    setSuspend(true);

    return () => setSuspend(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth">
      <Image
        className="auth__background"
        alt="login-background"
        src="/images/unsplash/sunset.jpg"
        layout="fill"
      />
      <div className="auth__container">
        <div className="auth__card">
          <div className="auth__logo">
            <Logo size="M" />
          </div>
          <div className="auth__form">
            <h3 className="auth__title">{props.title}</h3>
            {inputs}
            {props.generalError && (
              <p className="auth__error">{props.generalError}</p>
            )}
            {props.termsWarning && (
              <p className="auth__termsWarning">
                By creating an account you agree with Terms and Conditions
              </p>
            )}
            <div className="auth__buttons">
              <Button type="primary" centerText tall onClick={handleSubmit}>
                {props.submitText}
              </Button>
              <Button type="text" centerText onClick={onActionClick}>
                {props.actionButton.text}
              </Button>
            </div>
          </div>
          <div className="auth__footer">
            {/* Generate me copyright text */}
            <p className="auth__footerText">&copy; 2021 Armandas Barkauskas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

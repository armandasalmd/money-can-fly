import classNames from "classnames";
import { useRouter } from "next/router";
import { MoonStars, Sun, SignOut, User } from "phosphor-react";

import { useAuth, useTheme } from "@context/index";
import { Button, Logo } from "@atoms/index";
import Constants from "@utils/Constants";

function getNavigationButton(pushFn: (path: string) => void, currentPath: string, linkPath: string, text: string) {
  const buttonType = currentPath === linkPath ? "easy" : "text";

  return <Button tall key={linkPath} type={buttonType} onClick={() => pushFn(linkPath)}>{text}</Button>;
}

interface NavbarProps {
  className?: string;
}

export default function Navbar(props: NavbarProps) {
  const { navbarLinks } = Constants;
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const displayName = user.displayName || user.email.split("@")[0];
  const classses = classNames("navbar", props.className);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const navButtons = navbarLinks.map((link) => getNavigationButton(router.push, router.pathname, link.path, link.title));

  return (
    <div className={classses}>
      <div className="navbar__left">
        <div className="navbar__logo">
          <Logo />
        </div>
        <div className="navbar__container">{navButtons}</div>
      </div>
      <div className="navbar__right">
        <Button tall icon={theme === "dark" ? Sun : MoonStars} onClick={toggleTheme} />
        <Button tall icon={User}>{displayName}</Button>
        <Button tall icon={SignOut} onClick={handleLogout} />
      </div>
    </div>
  );
}

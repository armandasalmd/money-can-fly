import classNames from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import { MoonStars, Sun, SignOut, User } from "phosphor-react";

import { useAuth, useTheme } from "@context/index";
import { Button, Logo } from "@atoms/index";
import Constants from "@utils/Constants";

function getNavigationButton(currentPath: string, linkPath: string, text: string) {
  const buttonType = currentPath === linkPath ? "easy" : "default";

  return (
    <Link href={linkPath} key={linkPath}>
      <Button type={buttonType}>{text}</Button>
    </Link>
  );
}

export default function Navbar() {
  const { navbarLinks } = Constants;
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const displayName = user.displayName || user.email.split("@")[0];

  const classses = classNames("navbar", {});

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const navButtons = navbarLinks.map((link) => getNavigationButton(router.pathname, link.path, link.title));

  return (
    <div className={classses}>
      <div className="navbar__left">
        <div className="navbar__logo">
          <Logo />
        </div>
        <div className="navbar__container">{navButtons}</div>
      </div>
      <div className="navbar__right">
        <Button icon={theme === "dark" ? Sun : MoonStars} onClick={toggleTheme} />
        <Button icon={User}>{displayName}</Button>
        <Button icon={SignOut} onClick={handleLogout} />
      </div>
    </div>
  );
}

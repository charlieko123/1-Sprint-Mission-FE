import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../images/pandaLogo.png";
import smallLogo from "../images/pandaLogo_small.png";
import icon from "../images/userIcon.png";
import styles from "@styles/Navigation.module.css";
import { useRouter } from "next/router";
import { AuthContext } from "@contexts/AuthProvider";

function Navigation() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.navLeft}>
        <Link href="/">
          <Image className={styles.logo} src={logo} alt="Home Logo" />
          <Image
            className={styles.smallLogo}
            src={smallLogo}
            alt="Home Logo small"
          />
        </Link>
        <div className={`${styles.menu} text-2lg bold`}>
          <span className={styles.menuContent}>
            <Link
              href="/community"
              className={router.pathname === "/community" ? styles.active : ""}
            >
              자유게시판
            </Link>
          </span>
          <span className={styles.menuContent}>
            <Link
              href="/items"
              className={router.pathname === "/items" ? styles.active : ""}
            >
              중고마켓
            </Link>
          </span>
        </div>
      </div>

      <div className={styles.navRight}>
        {user ? (
          <div className={styles.profile}>
            <Image className={styles.icon} src={icon} alt="User Icon" />
            <span className={`${styles.nickname} text-2lg regular`}>
              {user.nickname}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className={`${styles.loginButton} text-lg semibold`}>
              로그인
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;

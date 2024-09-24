import styles from "@styles/SimpleLogin.module.css";
import Image from "next/image";
import Link from "next/link";

import googleLogo from "@images/ic_google.svg";
import kakaoLogo from "@images/ic_kakao.svg";

const SimpleLogin = () => {
  return (
    <div className={styles.simpleLoginContainer}>
      <h2 className="text-lg medium">간편 로그인하기</h2>
      <div className={styles.logoBox}>
        <Link href="https://www.google.com" passHref>
          <Image src={googleLogo} width={42} height={42} />
        </Link>
        <Link href="https://www.kakaocorp.com/page" passHref>
          <Image src={kakaoLogo} width={42} height={42} />
        </Link>
      </div>
    </div>
  );
};

export default SimpleLogin;

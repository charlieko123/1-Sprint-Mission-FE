import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import axios from "@/lib/axios";
import styles from "@styles/Login.module.css";
import Link from "next/link";
import Image from "next/image";
import SimpleLogin from "@components/SimpleLogin";
import { AuthContext } from "@contexts/AuthProvider";

import pandaLogo from "@images/pandaLogo.png";
import eyeBtn from "@images/btn_eye.svg";
import eyeSlashBtn from "@images/btn_eye_slash.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/folder");
  }, [router]);

  const mutation = useMutation(
    async (loginData) => {
      const response = await axios.post("/auth/signIn", loginData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        login({
          accessToken: data.accessToken,
          nickname: data.nickname,
        });
        router.push("/items");
      },
      onError: (error) => {
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.");
      },
    }
  );

  const handleLogin = (e) => {
    e.preventDefault();

    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("이메일을 확인해 주세요.");
      valid = false;
    }
    if (!password) {
      setPasswordError("비밀번호를 확인해 주세요.");
      valid = false;
    }

    if (valid) {
      mutation.mutate({ email, password });
    }
  };

  const togglePasswordVisible = () => {
    setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src={pandaLogo} alt="panda logo" fill />
        </Link>
      </div>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputContainer}>
          <label className={`${styles.label} text-2lg bold`}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            className={styles.input}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.inputContainer}>
          <label className={`${styles.label} text-2lg bold`}>비밀번호</label>
          <div className={styles.passwordWrapper}>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className={styles.input}
            />
            <div onClick={togglePasswordVisible} className={styles.eyeButton}>
              <Image
                src={passwordVisible ? eyeBtn : eyeSlashBtn}
                alt="eye toggle button"
                width={24}
                height={24}
              />
            </div>
          </div>
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </div>
        <button
          type="submit"
          disabled={!email || !password}
          className={`${styles.button} text-xl semibold`}
        >
          로그인
        </button>
      </form>
      <SimpleLogin />
      <br />
      <br />
      <p className="text-md medium">
        판다마켓이 처음이신가요?&nbsp;
        <Link href="/register">회원가입</Link>
      </p>
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return page;
};

export default Login;

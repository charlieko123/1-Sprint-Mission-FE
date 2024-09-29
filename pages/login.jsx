import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import axios from "@/lib/axios";
import styles from "@styles/Login.module.css";
import Link from "next/link";
import Image from "next/image";
import SimpleLogin from "@components/SimpleLogin";
import { AuthContext } from "@contexts/AuthProvider";
import Modal from "@components/Modal";

import pandaLogo from "@images/pandaLogo.png";
import eyeBtn from "@images/btn_eye.svg";
import eyeSlashBtn from "@images/btn_eye_slash.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
        setModalMessage("비밀번호가 일치하지 않습니다.");
        setIsModalOpen(true);
      },
    }
  );

  const validateEmail = () => {
    if (!email) {
      setEmailError("이메일을 확인해 주세요.");
      return false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("잘못된 이메일입니다.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("비밀번호를 확인해 주세요.");
      return false;
    } else if (password.length < 8) {
      setPasswordError("비밀번호를 8자 이상 입력해 주세요.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      mutation.mutate({ email, password });
    }
  };

  const togglePasswordVisible = () => {
    setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            onBlur={validateEmail}
            placeholder="이메일을 입력해주세요"
            className={`${styles.input} ${emailError ? styles.inputError : ""}`}
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
              onBlur={validatePassword}
              placeholder="비밀번호를 입력해주세요"
              className={`${styles.input} ${
                passwordError ? styles.inputError : ""
              } `}
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
      {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return page;
};

export default Login;

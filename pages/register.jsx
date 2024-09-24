import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import styles from "@styles/Register.module.css";
import Link from "next/link";
import Image from "next/image";
import SimpleLogin from "@/src/components/SimpleLogin";

import pandaLogo from "@images/pandaLogo.png";
import eyeBtn from "@images/btn_eye.svg";
import eyeSlashBtn from "@images/btn_eye_slash.svg";

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/folder");
  }, [router]);

  const [values, setValues] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordRepeat: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(false);

  const mutation = useMutation(
    async (formData) => {
      const response = await axios.post(
        "https://panda-market-api.vercel.app/auth/signUp",
        formData
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        router.push("/items");
      },
      onError: (error) => {
        alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
      },
    }
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (values.password !== values.passwordRepeat) {
      setPasswordError("비밀번호가 일치하지 않아요.");
      return;
    }
    setPasswordError("");

    mutation.mutate({
      email: values.email,
      nickname: values.nickname,
      password: values.password,
      passwordConfirmation: values.passwordRepeat,
    });
  }

  const togglePasswordVisible = () => {
    setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible);
  };
  const togglePasswordRepeatVisible = () => {
    setPasswordRepeatVisible(
      (prevPasswordRepeatVisible) => !prevPasswordRepeatVisible
    );
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src={pandaLogo} alt="panda logo" fill />
        </Link>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label className={`${styles.label} text-2lg bold`}>이메일</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="이메일을 입력해주세요"
            className={styles.input}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={`${styles.label} text-2lg bold`}>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={values.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력해주세요"
            className={styles.input}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={`${styles.label} text-2lg bold`}>비밀번호</label>
          <div className={styles.passwordWrapper}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
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
        </div>
        <div className={styles.inputContainer}>
          <label className={`${styles.label} text-2lg bold`}>
            비밀번호 확인
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={passwordRepeatVisible ? "text" : "password"}
              name="passwordRepeat"
              value={values.passwordRepeat}
              onChange={handleChange}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
              className={styles.input}
            />
            <div
              onClick={togglePasswordRepeatVisible}
              className={styles.eyeButton}
            >
              <Image
                src={passwordRepeatVisible ? eyeBtn : eyeSlashBtn}
                alt="eye toggle button"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
        {passwordError && <p className={styles.error}>{passwordError}</p>}
        <button
          type="submit"
          disabled={
            !values.email ||
            !values.nickname ||
            !values.password ||
            !values.passwordRepeat
          }
          className={`${styles.button} text-xl semibold`}
        >
          회원가입
        </button>
      </form>
      <SimpleLogin />
      <br />
      <br />
      <p className="text-md medium">
        이미 회원이신가요?&nbsp;<Link href="/login">로그인</Link>
      </p>
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return page;
};

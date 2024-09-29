import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import styles from "@styles/Register.module.css";
import Link from "next/link";
import Image from "next/image";
import SimpleLogin from "@/src/components/SimpleLogin";
import { AuthContext } from "@contexts/AuthProvider";
import Modal from "@components/Modal";

import pandaLogo from "@images/pandaLogo.png";
import eyeBtn from "@images/btn_eye.svg";
import eyeSlashBtn from "@images/btn_eye_slash.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

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

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const mutation = useMutation(
    async (formData) => {
      const response = await axios.post("/auth/signUp", formData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        login(data);
        router.push("/items");
      },
      onError: () => {
        setModalMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
        setIsModalOpen(true);
      },
    }
  );

  function handleValid(e) {
    const { name } = e.target;

    if (name === "email") {
      validateEmail();
    } else if (name === "password") {
      validatePassword();
    } else if (name === "passwordRepeat") {
      validatePasswordRepeat();
    }
  }

  const validateEmail = () => {
    if (!values.email || !EMAIL_REGEX.test(values.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "잘못된 이메일입니다.",
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      return true;
    }
  };

  const validatePassword = () => {
    if (values.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "비밀번호를 8자 이상 입력해 주세요.",
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      return true;
    }
  };

  const validatePasswordRepeat = () => {
    if (values.password !== values.passwordRepeat) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordRepeat: "비밀번호가 일치하지 않습니다.",
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, passwordRepeat: "" }));
      return true;
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isPasswordRepeatValid = validatePasswordRepeat();

    if (isEmailValid && isPasswordValid && isPasswordRepeatValid) {
      mutation.mutate({
        email: values.email,
        nickname: values.nickname,
        password: values.password,
        passwordConfirmation: values.passwordRepeat,
      });
    }
  }

  const togglePasswordVisible = () => {
    setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible);
  };
  const togglePasswordRepeatVisible = () => {
    setPasswordRepeatVisible(
      (prevPasswordRepeatVisible) => !prevPasswordRepeatVisible
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            onBlur={handleValid}
            placeholder="이메일을 입력해주세요"
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
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
              onBlur={handleValid}
              placeholder="비밀번호를 입력해주세요"
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
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
          {errors.password && <p className={styles.error}>{errors.password}</p>}
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
              onBlur={handleValid}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
              className={`${styles.input} ${
                errors.passwordRepeat ? styles.inputError : ""
              }`}
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
          {errors.passwordRepeat && (
            <p className={styles.error}>{errors.passwordRepeat}</p>
          )}
        </div>
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
      {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return page;
};

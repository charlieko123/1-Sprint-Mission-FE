import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import styles from "@styles/Register.module.css";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [values, setValues] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordRepeat: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const mutation = useMutation(
    async (formData) => {
      const response = await axios.post(
        "https://panda-market-api.vercel.app/api/signUp",
        formData,
        { withCredentials: true }
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
    });
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.logo}>로고</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={values.nickname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="passwordRepeat"
            value={values.passwordRepeat}
            onChange={handleChange}
          />
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
        >
          회원가입
        </button>
      </form>
      <div className={styles.socialLogin}>간편 로그인하기</div>
      <div className={styles.alreadyMember}>
        이미 회원이신가요? <Link href="/login">로그인</Link>
      </div>
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return page;
};

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import styles from "@styles/Login.module.css";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const mutation = useMutation(
    async (loginData) => {
      const res = await axios.post(
        "https://panda-market-api.vercel.app/api/signIn",
        loginData,
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

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            className={styles.input}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </div>

        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            className={styles.input}
          />
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </div>

        <button
          type="submit"
          disabled={!email || !password}
          className={styles.button}
        >
          로그인
        </button>
      </form>

      <p>
        판다마켓이 처음이신가요?
        <Link href="/register">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;

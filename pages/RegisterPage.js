import { useRouter } from "next/router";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [values, setValues] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordRepeat: "",
  });

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
      // 입력한 비밀번호와 확인이 다를때 처리해야함
      console.log("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { email, nickname, password } = values;
    /**
     * @TODO
     * 서버에 회원을 생성한다
     * 회원 생성이 성공하면 로그인을 시도한다
     * 로그인이 성공하면 `/items`로 이동한다
     */
    router.push("/items");
  }

  return (
    <>
      <div>로고</div>
      <form>
        <label>이메일</label>
        <input />
        <label>닉네임</label>
        <input />
        <label>비밀번호</label>
        <input />
        <label>비밀번호 확인</label>
        <input />
        <button>회원가입</button>
      </form>
      <div>간편 로그인하기</div>
      <div>이미 회원이신가요?</div>
      <div>로그인</div>
    </>
  );
}

RegisterPage.getLayout = function getLayout(page) {
  return page;
};

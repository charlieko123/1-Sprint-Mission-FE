import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: "https://panda-market-api.vercel.app",
});

export default instance;

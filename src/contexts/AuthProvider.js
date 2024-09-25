import axios from "@/lib/axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  updateMe: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.accessToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateMe = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data);
        })
        .catch(() => {
          console.error("Error fetching user data:", error);
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateMe }}>
      {children}
    </AuthContext.Provider>
  );
}

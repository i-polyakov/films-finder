import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("setUser");
  }, [user]);
  const login = useCallback(( user) => {
    setUser(user);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user:user
      })
    );
  }, []);
  const logout = () => {
    setSession(null);
    setUser(null);
    localStorage.removeItem("userData");
  };
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data && data.user) {
      login(data.user);
    }
    setIsReady(true);
  }, []);
  return { login, logout, setUser, user, isReady };
};

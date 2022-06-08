import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const login = useCallback((session, user) => {
   
    setSession(session);
    setUser(user);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user,
        session,
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
    if (data && data.session) {
      login(data.session, data.user);
    }
    setIsReady(true);
  }, []);
  return { login, logout,setUser, session, user, isReady };
};

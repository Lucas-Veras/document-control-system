import { JwtPayload, jwtDecode } from "jwt-decode";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { IAuthTokens } from "../interfaces/IAuth";
import AuthServices from "../services/AuthServices";

interface IAuthContext {
  user: JwtPayload | null;
  authTokens: IAuthTokens | null;
  logoutUser: () => void;
  setAuthTokens: React.Dispatch<IAuthTokens>;
  setUser: React.Dispatch<React.SetStateAction<JwtPayload | null>>;
}

const AuthContext = createContext<IAuthContext>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authTokens, setAuthTokens] = useState<IAuthTokens | null>(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens")!)
      : null
  );
  const [loading, setLoading] = useState(true);

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  }, []);

  const updateToken = useCallback(async () => {
    const refreshToken = {
      refresh: authTokens?.refresh ?? null,
    };
    AuthServices.getRefreshToken(refreshToken)
      .then((res) => {
        if (!authTokens) return;

        const tokens = {
          access: res.access,
          refresh: authTokens.refresh,
        };

        setAuthTokens(tokens);
        setUser(jwtDecode(res.access));
        localStorage.setItem("authTokens", JSON.stringify(tokens));
      })
      .catch(() => {
        logoutUser();
      })
      .finally(() => {
        if (loading) setLoading(false);
      });
  }, [authTokens, loading, logoutUser]);

  const contextData = {
    user: user,
    authTokens: authTokens,
    logoutUser: logoutUser,
    setAuthTokens,
    setUser,
  };

  useEffect(() => {
    if (!localStorage.getItem("authTokens")) {
      setLoading(false);
      return;
    }
    if (loading) updateToken();

    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(() => {
      if (authTokens) updateToken();
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading, updateToken]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

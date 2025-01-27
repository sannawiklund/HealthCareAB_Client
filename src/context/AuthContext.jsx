import { createContext, useState, useEffect } from "react";
// authentication context to handle global auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const storedAuthState = localStorage.getItem("authState");
    return storedAuthState
      ? JSON.parse(storedAuthState)
      : { isAuthenticated: false, user: null, roles: [] };
  });
  
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

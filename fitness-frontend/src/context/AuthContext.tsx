import { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return <AuthContext.Provider value={{ token, setToken: saveToken }}>{children}</AuthContext.Provider>;
};

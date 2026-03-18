import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('p_token'));
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('p_token', data.token);
    setToken(data.token);
    return data;
  };
  const logout = () => { localStorage.removeItem('p_token'); setToken(null); };
  return <AuthContext.Provider value={{ token, isAdmin: !!token, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

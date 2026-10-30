import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isAuth = false;
    let storedUser = null;
    let storedToken = null;

    try {
      isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const userRaw = localStorage.getItem('user');
      storedToken = localStorage.getItem('token');
      if (userRaw) {
        storedUser = JSON.parse(userRaw);
      }
    } catch (err) {
      console.warn('[AuthContext] Error leyendo datos de auth en localStorage:', err);
    }

    if (isAuth && storedUser && storedToken) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setToken(storedToken);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      try {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    if (!userData || !authToken) return;

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);

    setIsAuthenticated(true);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

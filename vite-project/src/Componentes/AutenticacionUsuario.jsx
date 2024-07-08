import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (token && storedUser && role) {
      setUser({ ...JSON.parse(storedUser), role });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5104/api/Auth/Login', {
        Id: username,
        Password: password,
      });

      if (response.status === 200) {
        const { token, user, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);
        setUser({ ...user, role });
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en la autenticación', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

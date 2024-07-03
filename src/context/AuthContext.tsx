import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import localforage from 'localforage';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  roleType: string;
  password: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, roleType: string) => Promise<void>;
  logout: () => Promise<void>; // Changed to promise-based logout
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const loggedInUser = await localforage.getItem<User>('user');
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
      }
    };
    checkUser();
  }, []);

  const login = (username: string, password: string, roleType: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const users: User[] = await localforage.getItem<User[]>('users') || [];
          const foundUser = users.find(u => u.username === username && u.password === password);
          if (foundUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            await localforage.setItem('user', foundUser);
            navigate(`/profile/${foundUser.id}`);
            resolve();
          } else {
            reject('Invalid credentials');
          }
        } catch (error) {
          reject(error);
        }
      }, 2000);
    });
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await localforage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, navigate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

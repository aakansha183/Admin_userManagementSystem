// src/hooks/useRegister.tsx
import { useState } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  password: string;
  roleType: 'admin' | 'user';
  name: string;
  address: string;
  phoneNumber: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (user: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);

    return new Promise<void>(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const allUsers = await localforage.getItem<User[]>('users') || [];
          const existingUser = allUsers.find(u => u.username === user.username);
          
          if (existingUser) {
            setError('User already exists');
            reject(new Error('User already exists'));
            return;
          }

          const newUser = { ...user, id: uuidv4() };
          allUsers.push(newUser);
          await localforage.setItem('users', allUsers);
          resolve();
        } catch (e) {
          setError('Registration failed');
          reject(e);
        } finally {
          setLoading(false);
        }
      }, 2000);
    });
  };

  return { register, loading, error };
};

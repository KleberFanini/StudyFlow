// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

const STORAGE_KEYS = {
  USER_TOKEN: '@studyflow_user_token',
  USER_DATA: '@studyflow_user_data',
  REGISTERED_USERS: '@studyflow_registered_users',
};

// Usuário padrão acadêmico para avaliação rápida da banca
const DEFAULT_STUDENT = {
  id: 'student_demo_1',
  name: 'Lucas Cavalcanti',
  email: 'estudante@studyflow.com',
  course: 'Pós-Graduação em Desenvolvimento Mobile',
  institution: 'Faculdade FAFIRE',
  registration: '202610-994',
  semester: '2º Semestre / 2026',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
};

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega a sessão salva ao abrir o app
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          setUserToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Erro ao recuperar sessão do aluno:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    let target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!target && (email.toLowerCase() === 'estudante@studyflow.com' || email.toLowerCase() === 'aluno@fafire.br')) {
      target = DEFAULT_STUDENT;
    }

    if (!target) {
      target = {
        ...DEFAULT_STUDENT,
        id: `student_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
      };
    }

    const token = `token_${Date.now()}`;
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(target));

    setUserToken(token);
    setCurrentUser(target);
    return target;
  };

  const register = async (userData) => {
    const newStudent = {
      id: `student_${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      institution: userData.institution || 'Faculdade FAFIRE',
      course: userData.course || 'Desenvolvimento de Aplicativos Móveis',
      semester: userData.semester || '2026.2',
      ...userData,
    };

    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];
    users.push(newStudent);
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));

    const token = `token_${Date.now()}`;
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newStudent));

    setUserToken(token);
    setCurrentUser(newStudent);
    return newStudent;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setUserToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        currentUser,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

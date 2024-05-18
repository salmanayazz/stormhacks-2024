import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext, AuthState } from "./AuthContext";
import { axiosInstance } from "../AxiosInstance";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
  });

  useEffect(() => {
    getUser();
  }, []);

  async function signupUser(userData: {
    username: string;
    password: string;
  }) {
    try {
      await axiosInstance.post(`auth/signup`, userData);
      getUser();
    } catch (error: any) {
      console.log(error);
      return error?.response?.data || { other: error.message };
    }
    return;
  }

  const loginUser = async (userData: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axiosInstance.post(`auth/login`, userData);
      setAuthState({ ...authState, user: response.data.user });
    } catch (error: any) {
      console.log(error);
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      setAuthState({ ...authState });
      await axiosInstance.delete(`auth/logout`);
      setAuthState({ ...authState, user: undefined });
    } catch (error: any) {
      setAuthState({ ...authState });
    }
  };

  // check is user session is still valid and get user data  
  const getUser = async () => {
    try {
      setAuthState({ ...authState });
      const response = await axiosInstance.get(`auth/login`);
      setAuthState({ ...authState, user: response.data.user });
    } catch (error: any) {
      setAuthState({ ...authState });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signupUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { createContext, useContext } from "react";

export interface User {
  username: string;
}

export interface AuthState {
  user: User | undefined;
}

export interface AuthContextType {
  authState: AuthState;
  signupUser: (userData: {
    username: string;
    password: string;
  }) => Promise<void>;
  loginUser: (userData: {
    username: string;
    password: string;
  }) => Promise<void>;
  logoutUser: () => Promise<void>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

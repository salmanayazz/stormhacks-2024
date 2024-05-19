import { createContext, useContext } from "react";

export interface Interview {
  _id: string;
  position: string;
  company: string;
}

export interface InterviewsContextType {
  interviews: Interview[];
  getInterviews: () => Promise<void>;
  createInterview: (
    position: string,
    company: string,
    jobPosting: string,
  ) => Promise<void>;
}

export const useInterviews = () => {
  const context = useContext(InterviewsContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const InterviewsContext = createContext<InterviewsContextType | undefined>(
  undefined
);

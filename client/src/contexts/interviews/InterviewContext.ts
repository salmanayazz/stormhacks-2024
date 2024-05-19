import { createContext, useContext } from "react";

export interface Interview {
  _id: string;
  position: string;
  company: string;
  info: Question[];
}

export interface Question {
  _id: string;
  question: string;
  answer: string;
  feedback: string;
}

export interface InterviewsContextType {
  interviews: Interview[];
  getInterviews: () => Promise<void>;
  createInterview: (
    position: string,
    company: string,
    jobPosting: string,
  ) => Promise<void>;
  answerQuestion: (
    interviewId: string,
    questionId: string,
    answer: string,
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

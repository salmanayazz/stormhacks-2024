import React, { ReactNode, useEffect, useState } from "react";
import { axiosInstance } from "../AxiosInstance";
import { Interview, InterviewsContext} from "./InterviewContext";

interface InterviewsProviderProps {
  children: ReactNode;
}

const InterviewsProvider: React.FC<InterviewsProviderProps> = ({ children }: InterviewsProviderProps) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    getInterviews();
  }, []);

  const getInterviews = async () => {
    try {
      const response = await axiosInstance.get("/interviews");
      setInterviews(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const createInterview = async (
    position: string,
    company: string,
    jobPosting: string
  ) => {
    try {
      const response = await axiosInstance.post("/interviews", {
        position,
        company,
        jobPosting,
      });
      
      getInterviews();
      return response.data._id;
    } catch (error: any) {
      console.log(error);
    }
  };

  const answerQuestion = async (
    interviewId: string,
    questionId: string,
    answer: string
  ) => {
    try {
      await axiosInstance.post(`/interview/${interviewId}/question/${questionId}`, {
        answer: answer,
      });
      await getInterviews();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <InterviewsContext.Provider
      value={{
        interviews,
        getInterviews,
        createInterview,
        answerQuestion
      }}
    >
      {children}
    </InterviewsContext.Provider>
  );
};

export default InterviewsProvider;

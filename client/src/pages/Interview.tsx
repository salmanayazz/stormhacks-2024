import { useParams } from "react-router";
import { Question, useInterviews } from "../contexts/interviews/InterviewContext";
import { Box, Heading, Button, Text, Textarea, FormLabel, FormControl } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { Icon } from "@chakra-ui/icon";
import SpeechRecognition from "../components/SpeechRecognition";
import { Switch } from '@chakra-ui/react'


export default function Interview() {
  const [isChecked, setIsChecked] = useState(false);
  const handleToggle = () => {
    setIsChecked(!isChecked);
  }
  const { interviewId } = useParams();
  const { interviews, answerQuestion } = useInterviews();
  const [loadingAnswers, setLoadingAnswers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const interview = interviews.find((interview) => interview._id === interviewId);
  const handleSubmitAnswer = async (questionId: string, answer: string) => {
    setLoadingAnswers((prevLoadingAnswers) => [...prevLoadingAnswers, questionId]);
    try {
      await answerQuestion(interviewId!, questionId, answer);
    } catch (error) {
      console.error("Error answering question:", error);
    } finally {
      setLoadingAnswers((prevLoadingAnswers) => prevLoadingAnswers.filter((id) => id !== questionId));
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>{interview?.position}</Heading>
      <Heading as="h2" size="lg" mb={4}>{interview?.company}</Heading>
      <FormControl display='flex' alignItems='center' className="mr-2 mb-3">
        <FormLabel htmlFor='email-alerts' mb='0'>
            Speech to Text
        </FormLabel>
      <Switch size='md'isChecked={isChecked} onChange={handleToggle}/>
      </FormControl>


      {interview?.info.map((question: Question) => {
        const isAnswering = loadingAnswers.includes(question._id);
        const currentAnswer = answers[question._id] ?? question.answer;

        return (
          <Box key={question._id} mb={6}>
            <Heading as="h3" size="sm" mb={2}>{question.question}</Heading>
            {!isChecked && <Box mb={2}>
              <Textarea
                value={currentAnswer}
                onChange={(e: any) => setAnswers((prevAnswers) => ({ ...prevAnswers, [question._id]: e.target.value }))}
                mb={2}
                variant="filled"
                colorScheme="primary"
              />

                <Button 
                colorScheme="teal" 
                variant="solid"
                mr={2}
                isLoading={isAnswering}
                loadingText="Submitting"
                onClick={() => handleSubmitAnswer(question._id, currentAnswer)}
              >
                Submit
              </Button>
            </Box>}
  
            {isChecked &&<Box mb={2}>
            <SpeechRecognition 
                question={question}
                interviewId={interviewId!}
              />
            </Box> }
            <Box display="flex">
              
              
            </Box>
            <Text>{question.feedback}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

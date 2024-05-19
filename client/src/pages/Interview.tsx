import { useParams } from "react-router";
import { Question, useInterviews } from "../contexts/interviews/InterviewContext";
import { Box, Heading, Textarea, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import SpeechRecognition from "../components/SpeechRecognition";

export default function Interview() {
  const { interviewId } = useParams();
  const { interviews, answerQuestion } = useInterviews();
  const [loadingAnswers, setLoadingAnswers] = useState<string[]>([]);
  
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

      {interview?.info.map((question: Question) => {
        const isAnswering = loadingAnswers.includes(question._id);

        return (
          <Box key={question._id} mb={6}>
            <Heading as="h3" size="sm" mb={2}>{question.question}</Heading>
            <SpeechRecognition answer={question.answer} />
            <Textarea
              value={question.answer}
              onChange={(event: any) => question.answer = event.target.value}
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
              onClick={() => handleSubmitAnswer(question._id, question.answer)}
            >
              Submit
            </Button>
            <Text>{question.feedback}</Text>
          </Box>
        );
      })}
    </Box>
  );
}


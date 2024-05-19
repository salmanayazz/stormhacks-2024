import { useParams } from "react-router";
import { Question, useInterviews } from "../contexts/interviews/InterviewContext";
import { Box, Heading, Button, Text, Textarea } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { Icon } from "@chakra-ui/icon";

export default function Interview() {
  const { interviewId } = useParams();
  const { interviews, answerQuestion } = useInterviews();
  const [loadingAnswers, setLoadingAnswers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const interview = interviews.find((interview) => interview._id === interviewId);

  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }
      setTranscript((prevTranscript) => prevTranscript + interim);
      setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestionId!]: transcript + final }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [currentQuestionId]);

  const startListening = (questionId: string) => {
    setCurrentQuestionId(questionId);
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    setCurrentQuestionId(null);
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

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
        const currentAnswer = answers[question._id] ?? question.answer;

        return (
          <Box key={question._id} mb={6}>
            <Heading as="h3" size="sm" mb={2}>{question.question}</Heading>
            <Box mb={2}>
              <Textarea
                value={currentAnswer}
                onChange={(e: any) => setAnswers((prevAnswers) => ({ ...prevAnswers, [question._id]: e.target.value }))}
                mb={2}
                variant="filled"
                colorScheme="primary"
              />
            </Box>
            <Box display="flex">
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
              <Button onClick={isListening ? stopListening : () => startListening(question._id)} mb={2}>
                {isListening && currentQuestionId === question._id ? <Icon as={FiMicOff} /> : <Icon as={FiMic} />}
              </Button>
            </Box>
            <Text>{question.feedback}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

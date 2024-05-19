import { useParams } from "react-router";
import { Question, useInterviews } from "../contexts/interviews/InterviewContext";
import { Box, Heading, Textarea, Button, Text } from "@chakra-ui/react";

export default function Interview() {
  const { interviewId } = useParams();
  const { interviews } = useInterviews();
  
  const interview = interviews.find((interview) => interview._id === interviewId);
  
  return(
    <Box p={4}>
      <Heading mb={4}>{interview?.position}</Heading>
      <Heading as="h2" size="lg" mb={4}>{interview?.company}</Heading>

      {interview?.info.map((question: Question) => {
        return (
          <Box key={question._id} mb={6}>
            <Heading as="h3" size="sm" mb={2}>{question.question}</Heading>
            <Textarea
              value={question.answer}
              mb={2}
              variant="filled"
              colorScheme="primary"
            />
            <Button colorScheme="blue" variant="solid" mr={2}>Submit</Button>
            <Text>{question.feedback}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

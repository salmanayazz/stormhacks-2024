import { useState } from "react";
import { useInterviews } from "../contexts/interviews/InterviewContext";
import {
  Box,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";

export default function CreateInterview() {
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    jobPosting: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { createInterview } = useInterviews();

  const handleChange = (event: any, field: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await createInterview(formData.position, formData.company, formData.jobPosting);
    setIsLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <Input
        placeholder="Position"
        value={formData.position}
        onChange={(event: any) => handleChange(event, "position")}
        mb={4}
        variant="filled"
      />

      <Input
        placeholder="Company"
        value={formData.company}
        onChange={(event: any) => handleChange(event, "company")}
        mb={4}
        variant="filled"
      />

      <Textarea
        placeholder="Job Posting"
        value={formData.jobPosting}
        onChange={(event: any) => handleChange(event, "jobPosting")}
        mb={4}
        variant="filled"
      />

      <Button 
        colorScheme="teal" 
        variant="solid"
        mr={2}
        isLoading={isLoading}
        loadingText="Submitting"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

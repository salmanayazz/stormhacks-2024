import { useState } from "react";
import { useInterviews } from "../contexts/interviews/InterviewContext";
import { Heading } from "@chakra-ui/layout";
import {
  Box,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


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

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    const _id = await createInterview(formData.position, formData.company, formData.jobPosting);
    // redirect to the new interview page
    if (_id) {
      navigate("/interviews/" + _id);
    }
    setIsLoading(false);
  };

  return (

    <Box
      display="flex"
      flexDirection="column"
      p={8}
    >
      <Box>
        <Heading as="h1" size="xl" mb={4}>
          Create Interview
        </Heading>
      </Box>

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

      <Box>

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
    </Box>

  );
}

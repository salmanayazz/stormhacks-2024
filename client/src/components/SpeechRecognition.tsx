import React, { useState, useEffect, useRef } from 'react';
import {Button, Icon, Textarea} from "@chakra-ui/react";
import { FiMic, FiMicOff } from 'react-icons/fi';
import { Box } from '@chakra-ui/layout';
import { Question, useInterviews } from '../contexts/interviews/InterviewContext';

interface propsType {
    answer: string | undefined,
    setAudioText: (answer: string) => void
    question: Question,
    interviewId: string
}
const SpeechRecognition = (props: propsType) => {
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const { answerQuestion } = useInterviews();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
      setTranscript((prev) => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleSubmitAnswer = async (questionId: string, answer: string) => {
    setIsLoading(true);
    await answerQuestion(props.interviewId, props.question._id, answer);
    setIsLoading(false);
    setTranscript('');
    setInterimTranscript('');
  }

  return (
    <div>
      <Textarea 
       value={transcript}
       onChange={(event: any) => setTranscript(event.target.value)}
       mb={2}
       variant="filled"
       colorScheme="primary"
      >{transcript}</Textarea>
      <Box display="flex">
       
        <Button 
          colorScheme="teal" 
          variant="solid"
          mr={2}
          loadingText="Submitting"
          isLoading={isLoading}
          onClick={() => handleSubmitAnswer(props.question._id, transcript)}
        >
          Submit
        </Button>
        <Button onClick={()=>{isListening ? stopListening() : startListening()}} mb={2}>
                {isListening ? <Icon as={FiMicOff} /> : <Icon as={FiMic} />}
        </Button>
      </Box>
      
      
      <p style={{ color: 'gray' }}>{interimTranscript}</p>
    </div>
  );
};

export default SpeechRecognition;
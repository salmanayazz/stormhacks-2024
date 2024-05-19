import { Box, Button, IconButton } from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import { NavLink, useParams } from 'react-router-dom';
import { useInterviews } from '../contexts/interviews/InterviewContext';
import { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  const { interviews, getInterviews } = useInterviews();
  const { interviewId } = useParams();

  useEffect(() => {
    getInterviews();
  }, []);

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      width={isOpen ? '20rem' : '0'}
      overflowY="auto"
      transition="width 0.3s"
      zIndex={10}
      bg="white"
    >
      <Box px={4} py={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box fontSize="xl" fontWeight="bold">Interviews</Box>
        <IconButton icon={<CloseIcon />} onClick={onClose} />
      </Box>
      <Box px={4}>
        <Button variant="link" leftIcon={<AddIcon />} mb={3} as={NavLink} to="/interviews/create">Create Interview</Button>
        {interviews.map((interview) => (
          <Button
            key={interview._id}
            mb={3}
            as={NavLink}
            to={`/interviews/${interview._id}`}
            onClick={onClose}
            variant="solid"
            bg={interview._id === interviewId ? undefined : 'transparent'}
            width="100%"
            paddingX={2}
            justifyContent="flex-start"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {interview.position}, {interview.company}
          </Button>
        ))}
      </Box>
    </Box>
  );
};


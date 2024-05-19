import { Box, Button, IconButton } from '@chakra-ui/react';
import { CloseIcon, AddIcon, DeleteIcon,  } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { useInterviews } from '../contexts/interviews/InterviewContext';
import { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  const { interviews, getInterviews } = useInterviews();

  useEffect(() => {
    getInterviews();
  }, []);

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      width={isOpen ? '240px' : '0'}
      overflowY="auto"
      transition="width 0.3s"
      zIndex={10}
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
            variant="link"
            leftIcon={<DeleteIcon />}
            mb={3}
            as={NavLink}
            to={`/interviews/${interview._id}`}
            onClick={onClose}
          >
            {interview.position}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

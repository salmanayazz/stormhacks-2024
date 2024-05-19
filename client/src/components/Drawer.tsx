import { useInterviews } from '../contexts/interviews/InterviewContext';
import { NavLink } from 'react-router-dom';
import { Drawer, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomDrawer({ open, onClose }: CustomDrawerProps) {
  const { interviews } = useInterviews();

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <button onClick={onClose}>Close</button>
      <NavLink to="/interviews/create">Create Interview</NavLink>
      
          {interviews.map((interview) => (
            <div key={interview._id} className="">
              <div className="flex">
                <h2>{interview.position}</h2>
                <h3>{interview.company}</h3>
              </div>
              <IconButton aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </Drawer>
      );
    
}

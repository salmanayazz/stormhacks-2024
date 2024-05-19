import { Box, Button, IconButton, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import CustomDrawer from './Drawer';

const Navbar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('pri.100', 'pri.200');

  const signupHandler = () => navigate('/signup');
  const loginHandler = () => navigate('/login');

  return (
    <>
      <Box bg={bgColor} p={4} display="flex" alignItems="center" justifyContent="space-between">
        {!isOpen && (
          <IconButton 
            icon={<HamburgerIcon />} 
            onClick={onOpen} 
          />
        )}
        
        <Box flex="1" textAlign="center" fontWeight="bold">
          InterviewPrep.
        </Box>
        <Box>
          <Button
            variant="solid"
            colorScheme="blackAlpha"
            mr={2}
            onClick={signupHandler}
          >
            Signup
          </Button>
          <Button
            variant="solid"
            colorScheme="blackAlpha"
            mr={2}
            onClick={loginHandler}
          >
            Login
          </Button>
        </Box>
      </Box>
      <CustomDrawer isOpen={isOpen} onClose={onClose} />
      <Box ml={isOpen ? '240px' : '0'} transition="margin 0.3s">
        <Outlet />
      </Box>
    </>
  );
};

export default Navbar;

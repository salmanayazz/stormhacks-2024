import { Box, IconButton, useDisclosure, Flex, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useNavigate, Outlet } from 'react-router-dom';
import CustomDrawer from './Drawer';
import { useAuth } from '../contexts/auth/AuthContext';

const Navbar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const { authState, logoutUser } = useAuth();

  const loginHandler = () => navigate('/login');
  const logoutHandler = () => logoutUser();

  return (
    <>
      <Box p={4} display="flex" alignItems="center" justifyContent="space-between">

        {!isOpen &&
        <IconButton 
          icon={<HamburgerIcon />} 
          onClick={isOpen ? onClose : onOpen} 
        /> }

        <Box flex="1" textAlign="center" fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
          InterviewPrep
        </Box>
        <Flex alignItems="center">
          {authState?.user ? (
            <Button 
              onClick={logoutHandler} 
              variant="solid"
              rightIcon={<FiLogOut />}
            >
              {authState.user.username}
            </Button>
          ) : (
            <Button 
              onClick={loginHandler} 
              variant="solid"
              rightIcon={<FiLogIn/>}
              >
              Login
            </Button>
          )}
        </Flex>
      </Box>
      <CustomDrawer isOpen={isOpen} onClose={onClose} />
      <Box position="fixed" bottom="0" left="0" right="0" zIndex="drawer" display={{ base: isOpen ? 'block' : 'none', md: 'none' }}>
        <CustomDrawer isOpen={isOpen} onClose={onClose} />
      </Box>
      <Box ml={isOpen ? { base: '0', md: '20rem' } : '0'} transition="margin 0.3s">
        <Outlet />
      </Box>
    </>
  );
};

export default Navbar;

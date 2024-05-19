import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';

const ProtectedRoute = ({ children }: any) => {
  const user = useAuth();
  console.log(user);

  if (!user.authState.user) {

    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo && userInfo.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
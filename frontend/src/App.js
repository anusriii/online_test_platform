import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageTests from './pages/ManageTests';
import ManageQuestions from './pages/ManageQuestions';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const { userInfo } = useAuth();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={userInfo ? <Navigate to={userInfo.role === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage />} />
        <Route path="/register" element={userInfo ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/test/:id" element={<PrivateRoute><TestPage /></PrivateRoute>} />
        <Route path="/result/:id" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/tests" element={<AdminRoute><ManageTests /></AdminRoute>} />
        <Route path="/admin/questions" element={<AdminRoute><ManageQuestions /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
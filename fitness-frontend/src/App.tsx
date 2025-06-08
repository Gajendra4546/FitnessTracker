import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Plans from './pages/Plan';
import Home from './pages/Home';
import SelectPlan from './pages/SelectPlan';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
}

function PublicRoute({ children }: { children: React.ReactElement }) {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/home" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/plans" element={<PrivateRoute><Plans /></PrivateRoute>} />
      <Route path="/select-plan" element={<PrivateRoute><SelectPlan /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

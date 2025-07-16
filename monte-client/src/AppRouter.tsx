import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainLayout from './layouts/MainLayout';
import Simulation from './pages/Simulation';
import Journal from './pages/Journal';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage'; // Import LandingPage

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/signin" />;
};

// This component will prevent logged-in users from accessing public routes
const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/app" /> : children;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

                {/* Protected routes */}
                <Route 
                    path="/app"
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Navigate to="simulation" replace />} />
                    <Route path="simulation" element={<Simulation />} />
                    <Route path="journal" element={<Journal />} />
                    <Route path="assistant" element={<Assistant />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;

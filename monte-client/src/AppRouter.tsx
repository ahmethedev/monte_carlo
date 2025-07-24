import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainLayout from './layouts/MainLayout';
import Simulation from './pages/Simulation';
import Journal from './pages/Journal';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Loading from './components/Loading';
import NotFoundPage from './pages/NotFoundPage';
import ProRoute from './components/ProRoute';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div><Loading></Loading></div>; 
    }

    return isAuthenticated ? children : <Navigate to="/signin" />;
};

// This component will prevent logged-in users from accessing public routes
const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/app" /> : children;
};

const AppRouter = () => {
    return (
        <Router>
            <AuthProvider>
                    <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                    <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
                    <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                    <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

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
                        <Route path="journal" element={
                            <ProRoute feature="journal">
                                <Journal />
                            </ProRoute>
                        } />
                        <Route path="assistant" element={<Assistant />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRouter;

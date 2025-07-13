import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainLayout from './layouts/MainLayout';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/signin" />;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <App />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;

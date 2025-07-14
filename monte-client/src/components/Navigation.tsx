import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

export const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setUser(null);
        });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/signin');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-semibold text-lg">Monte Carlo Trading</span>
          </div>
          
          {user && (
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User as UserIcon, LogOut, TrendingUp } from 'lucide-react';

interface HeaderProps {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ isNavOpen, setIsNavOpen }) => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-md z-50 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="mr-4 text-white"
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>

              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight">EdgePro.ai</span>
              </div>
            </div>
          </div>
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 rounded-full text-white hover:bg-gray-700"
              >
                <UserIcon size={24} />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 text-white">
                  <button
                    onClick={() => navigate('/app/profile')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
                  >
                    <UserIcon size={16} /> Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

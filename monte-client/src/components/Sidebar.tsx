import { NavLink } from 'react-router-dom';
import { Book, Bot, LineChart, User } from 'lucide-react';

const navItems = [
  { to: '/journal', icon: Book, label: 'Journal' },
  { to: '/assistant', icon: Bot, label: 'Assistant' },
  { to: '/', icon: LineChart, label: 'Simulation' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900/50 backdrop-blur-md text-white flex-shrink-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white">EdgePro AI</h1>
      </div>
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive
                    ? 'bg-gray-700/50 text-white'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

import { NavLink } from 'react-router-dom';
import { Book, Bot, LineChart } from 'lucide-react';

const navItems = [
  { to: '/app/simulation', icon: LineChart, label: 'Simulation' },
  { to: '/app/journal', icon: Book, label: 'Journal' },
  { to: '/app/assistant', icon: Bot, label: 'Assistant' },
];

interface SidebarProps {
  isNavOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isNavOpen }) => {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900/80 backdrop-blur-lg text-white transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>

      <nav className="mt-4">
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

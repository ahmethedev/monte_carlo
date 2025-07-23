import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Menu, X, User as UserIcon, LogOut, BarChart3, BookOpen, Bot, Settings } from 'lucide-react';
import Footer from '../components/Footer';

const MainLayout = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout, hasFeatureAccess } = useAuth();
    const location = useLocation();

    const handleSignOut = () => {
        logout();
        window.location.href = '/';
    };

    const navigation = [
        { name: 'Simulation', href: '/app/simulation', icon: BarChart3, current: location.pathname === '/app/simulation' },
        { 
            name: 'Journal', 
            href: '/app/journal', 
            icon: BookOpen, 
            current: location.pathname === '/app/journal',
            isPro: true,
            hasAccess: hasFeatureAccess('journal')
        },
        { name: 'Assistant', href: '/app/assistant', icon: Bot, current: location.pathname === '/app/assistant' },
        { name: 'Profile', href: '/app/profile', icon: Settings, current: location.pathname === '/app/profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-neutral-100">
            {/* Modern Header */}
            <header className="glass-strong border-b border-slate-800/50 sticky top-0 z-50">
                <div className="content-container">
                    <div className="flex items-center justify-between h-18">
                        {/* Logo */}
                        <Link to="/app" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                                <TrendingUp className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-gradient">EdgePro</span>
                                <span className="text-xs text-primary-400 font-bold -mt-1 tracking-wider">TRADING INTELLIGENCE</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.current;
                                const canAccess = !item.isPro || item.hasAccess;
                                
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`
                                            relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                                            ${isActive 
                                                ? 'bg-primary-600/20 text-primary-400 shadow-glow' 
                                                : canAccess
                                                    ? 'text-neutral-300 hover:text-primary-400 hover:bg-slate-800/50'
                                                    : 'text-neutral-500 hover:text-neutral-400'
                                            }
                                            ${!canAccess ? 'cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : ''}`} />
                                        <span>{item.name}</span>
                                        {item.isPro && !item.hasAccess && (
                                            <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse"></div>
                                        )}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-primary-600/10 rounded-xl blur"></div>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            {user && (
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-semibold text-neutral-200">{user.username}</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        user.subscription_status === 'pro' 
                                            ? 'bg-primary-600/20 text-primary-400' 
                                            : 'bg-neutral-700/50 text-neutral-400'
                                    }`}>
                                        {user.subscription_status === 'pro' ? 'Pro' : 'Free'}
                                    </span>
                                </div>
                            )}
                            
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="p-2.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-neutral-200 hover:bg-slate-700/50 transition-all duration-300"
                                >
                                    <UserIcon className="w-5 h-5" />
                                </button>
                                
                                {isProfileMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-64 glass-strong border border-slate-700/50 rounded-2xl shadow-strong py-2 z-20 animate-slide-down">
                                            <div className="px-4 py-3 border-b border-slate-800/50">
                                                <p className="text-sm font-semibold text-neutral-200">{user?.username}</p>
                                                <p className="text-xs text-neutral-400">{user?.email}</p>
                                            </div>
                                            
                                            <div className="lg:hidden py-2 border-b border-slate-800/50">
                                                {navigation.map((item) => {
                                                    const Icon = item.icon;
                                                    const canAccess = !item.isPro || item.hasAccess;
                                                    
                                                    return (
                                                        <Link
                                                            key={item.name}
                                                            to={item.href}
                                                            className={`
                                                                flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors
                                                                ${item.current 
                                                                    ? 'text-primary-400 bg-primary-600/10' 
                                                                    : canAccess
                                                                        ? 'text-neutral-300 hover:text-primary-400 hover:bg-slate-800/50'
                                                                        : 'text-neutral-500'
                                                                }
                                                            `}
                                                            onClick={() => setIsProfileMenuOpen(false)}
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                            <span>{item.name}</span>
                                                            {item.isPro && !item.hasAccess && (
                                                                <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse ml-auto"></div>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-neutral-300 hover:text-danger-400 hover:bg-danger-600/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 min-h-[calc(100vh-4.5rem)]">
                <div className="content-container py-8">
                    <Outlet />
                </div>
            </main>
            
            <Footer />
        </div>
    );
};
export default MainLayout;

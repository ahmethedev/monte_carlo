import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, User as UserIcon, LogOut, BarChart3, BookOpen, Bot, Settings,Briefcase } from 'lucide-react';
import Footer from '../components/Footer';
import SubscriptionBanner from '../components/SubscriptionBanner';

const MainLayout = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout, hasFeatureAccess, hasProAccess } = useAuth();
    const location = useLocation();

    const handleSignOut = () => {
        logout();
    };

    const navigation = [
        { name: 'Dashboard', href: '/app', icon: BarChart3, current: location.pathname === '/app' || location.pathname === '/app/dashboard' },
        { name: 'Simulation', href: '/app/simulation', icon: TrendingUp, current: location.pathname === '/app/simulation' },
        { name: 'Portfolio', href: '/app/portfolio', icon: Briefcase, current: location.pathname === '/app/portfolio' },
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
                            <div className="relative">
                                <TrendingUp className="h-8 w-8 text-blue-500" />
                            </div>
                            <span className="text-2xl font-bold text-white">EdgePro.ai</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.current;
                                const canAccess = !item.isPro || item.hasAccess;
                                
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`
                                            flex items-center space-x-2 text-sm font-medium transition-colors duration-200
                                            ${isActive 
                                                ? 'text-blue-400' 
                                                : canAccess
                                                    ? 'text-slate-300 hover:text-white'
                                                    : 'text-slate-500 hover:text-slate-400'
                                            }
                                            ${!canAccess ? 'cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                                        <span>{item.name}</span>
                                        {item.isPro && !item.hasAccess && (
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            {user && (
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-medium text-slate-200">{user.username}</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        hasProAccess() 
                                            ? 'bg-blue-500/20 text-blue-400' 
                                            : 'bg-slate-700/50 text-slate-400'
                                    }`}>
                                        {hasProAccess() ? 'Pro' : 'Free'}
                                    </span>
                                </div>
                            )}
                            
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 hover:bg-slate-700/50 transition-colors"
                                >
                                    <UserIcon className="w-5 h-5" />
                                </button>
                                
                                {isProfileMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-20">
                                            <div className="px-4 py-3 border-b border-slate-700">
                                                <p className="text-sm font-medium text-slate-200">{user?.username}</p>
                                                <p className="text-xs text-slate-400">{user?.email}</p>
                                            </div>
                                            
                                            <div className="lg:hidden py-2 border-b border-slate-700">
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
                                                                    ? 'text-blue-400 bg-blue-500/10' 
                                                                    : canAccess
                                                                        ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                                                        : 'text-slate-500'
                                                                }
                                                            `}
                                                            onClick={() => setIsProfileMenuOpen(false)}
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                            <span>{item.name}</span>
                                                            {item.isPro && !item.hasAccess && (
                                                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse ml-auto"></div>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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

            {/* Subscription Banner */}
            <SubscriptionBanner />

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

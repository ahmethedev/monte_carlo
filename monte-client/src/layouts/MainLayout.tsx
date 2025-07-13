import React from 'react';
import { BarChart3, Activity } from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-black">
            <header className="bg-gray-900 shadow-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-8 w-8 text-green-400" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Monte Carlo Trading Simulator</h1>
                                <p className="text-sm text-gray-400">Professional trading simulation and analysis platform</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-400" />
                            <span className="text-sm font-medium text-gray-300">API Connected</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="bg-gray-900 border-t border-gray-800 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-sm text-gray-400">
                        Monte Carlo Trading Simulator - Professional Trading Analysis Platform
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

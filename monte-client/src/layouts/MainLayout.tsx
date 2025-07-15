import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-black">
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

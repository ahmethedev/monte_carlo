import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

const MainLayout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
            
            <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar isNavOpen={isNavOpen} />
            </div>

            {isNavOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30" 
                    onClick={() => setIsNavOpen(false)}
                ></div>
            )}

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-8 pt-24">
                <Outlet />
            </main>
        </div>
    );
};
export default MainLayout;

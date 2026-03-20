import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AuthModal from '@/components/modals/AuthModal';
import AskQuestionModal from '@/components/modals/AskQuestionModal';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setMobileSidebarOpen(v => !v);
    else setSidebarCollapsed(v => !v);
  };

  return (
    <>
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex pt-14 min-h-screen">
        {/* Desktop sidebar */}
        {!isMobile && <Sidebar collapsed={sidebarCollapsed} isMobile={false} />}
        {/* Mobile sidebar drawer */}
        {isMobile && <Sidebar collapsed={!mobileSidebarOpen} isMobile={true} onClose={() => setMobileSidebarOpen(false)} />}

        <div className="flex-1 min-w-0 flex justify-center">
          <main className="flex-1 min-w-0 p-4 md:p-5 max-w-[900px]">
            <Outlet />
          </main>
        </div>
      </div>
      <AuthModal />
      <AskQuestionModal />
    </>
  );
}

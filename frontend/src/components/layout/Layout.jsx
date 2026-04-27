import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Bell,
  Shield,
  TrendingUp,
  Search,
  Activity,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WalletButton from '../WalletButton';
import ConnectModal from '../ConnectModal';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <motion.div
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      backgroundColor: active ? 'rgba(163, 255, 18, 0.1)' : 'transparent',
      color: active ? '#A3FF12' : '#9ca3af',
      display: 'flex',
      alignItems: 'center',
      padding: '0.85rem 1rem',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      gap: '0.75rem',
      margin: '0.25rem 0',
      transition: 'all 0.2s ease',
      border: active ? '1px solid rgba(163, 255, 18, 0.2)' : '1px solid transparent'
    }}
  >
    <Icon size={20} />
    <span style={{ fontWeight: active ? 600 : 500, fontSize: '14px' }}>{label}</span>
  </motion.div>
);

const Layout = ({
  isSocketConnected,
  isConnectModalOpen,
  setIsConnectModalOpen,
  searchQuery,
  setSearchQuery,
  onSearchFocus,
  onSearchBlur,
  activeTab,
  setActiveTab
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on navigation (for mobile)
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, activeTab, isMobile]);

  const SidebarContent = () => (
    <>
      <div
        onClick={() => navigate('/terminal')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 0.5rem', cursor: 'pointer', marginBottom: '2.5rem' }}
      >
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(163, 255, 18, 0.15)'
        }}>
          <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="FourGuard Logo" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'white' }}>
          FourGuard <span style={{ color: 'var(--primary)' }}>AI</span>
        </h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#444', letterSpacing: '0.1em', padding: '0 1rem 0.5rem' }}>MENU</p>
        <SidebarItem
          icon={LayoutDashboard}
          label="Terminal"
          active={location.pathname === '/terminal' && activeTab === 'trending'}
          onClick={() => {
            setActiveTab('trending');
            navigate('/terminal');
          }}
        />
        <SidebarItem
          icon={Clock}
          label="Scan History"
          active={location.pathname === '/terminal' && activeTab === 'history'}
          onClick={() => {
            setActiveTab('history');
            navigate('/terminal');
          }}
        />
        <SidebarItem
          icon={TrendingUp}
          label="Watchlist"
          active={location.pathname === '/terminal' && activeTab === 'watchlist'}
          onClick={() => {
            setActiveTab('watchlist');
            navigate('/terminal');
          }}
        />
      </nav>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: 'auto' }}>
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          borderRadius: '24px',
          fontSize: '13px',
          border: '1px solid var(--border-bright)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: isSocketConnected ? 'var(--primary)' : '#ff3b3b', opacity: 0.1, borderRadius: '50%', filter: 'blur(20px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              backgroundColor: isSocketConnected ? '#A3FF12' : '#ff3b3b',
              boxShadow: isSocketConnected ? '0 0 10px #A3FF12' : '0 0 10px #ff3b3b'
            }} />
            <p style={{ color: '#888', fontWeight: 500 }}>{isSocketConnected ? 'LIVE FEED ACTIVE' : 'RECONNECTING...'}</p>
          </div>
          <div style={{ fontSize: '13px', color: '#eee', lineHeight: '1.6', fontWeight: 700 }}>
            {isSocketConnected
              ? 'Receiving global memecoin events.'
              : 'Blockchain bridge interrupted. Retrying...'}
          </div>
        </div>
      </nav>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{
          width: '280px',
          borderRight: '1px solid var(--border)',
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 20,
          backgroundColor: 'var(--bg-main)'
        }}>
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(4px)',
                zIndex: 40
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                backgroundColor: '#0A0A0B',
                padding: '2rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                borderRight: '1px solid var(--border)'
              }}
            >
              <div style={{ position: 'absolute', top: '1.5rem', right: '1rem' }}>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#666', padding: '8px' }}
                >
                  <X size={24} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: isMobile ? '64px' : '72px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 1.25rem' : '0 2.5rem',
          background: 'rgba(3, 3, 3, 0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '2rem' }}>
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  style={{ background: 'none', border: 'none', color: 'white', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  <Menu size={24} />
                </button>
                <div 
                  onClick={() => navigate('/terminal')}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
                </div>
              </div>
            )}
            
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input
                type="text"
                placeholder={isMobile ? "Search..." : "Search by token or address..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '10px 14px 10px 40px',
                  color: 'white',
                  width: isMobile ? '100%' : '380px',
                  maxWidth: isMobile ? '160px' : 'none',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '1.5rem' }}>
            <div className="hide-mobile" style={{ position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '50%', border: '1px solid var(--border)' }}>
              <Bell size={20} color="#9ca3af" />
              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                width: '6px', height: '6px', background: '#ff3b3b',
                borderRadius: '50%', border: '1px solid var(--bg-main)'
              }} />
            </div>
            <WalletButton onOpenModal={() => setIsConnectModalOpen(true)} />
          </div>
          <ConnectModal
            isOpen={isConnectModalOpen}
            onClose={() => setIsConnectModalOpen(false)}
          />
        </header>

        {/* Page specific content renders here */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;


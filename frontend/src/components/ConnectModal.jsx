import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Wallet, ChevronRight, Loader2 } from 'lucide-react';
import { useConnect } from 'wagmi';

const WalletIcon = ({ name }) => {
  // Branded colors and icons for common wallets
  if (name.toLowerCase().includes('metamask')) {
    return (
      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(246, 133, 27, 0.1)', borderRadius: '12px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Alpha_software_logo.svg" alt="MetaMask" style={{ width: '24px', height: '24px' }} />
      </div>
    );
  }
  if (name.toLowerCase().includes('coinbase')) {
    return (
      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 82, 255, 0.1)', borderRadius: '12px' }}>
        <img src="https://images.ctfassets.net/q5ulk4u67rxd/1r9999r7y9r/1a2a-coinbase-wallet-logo.png" alt="Coinbase" style={{ width: '24px', height: '24px' }} />
      </div>
    );
  }
  return (
    <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
      <Wallet size={24} color="var(--primary)" />
    </div>
  );
};

const ConnectModal = ({ isOpen, onClose }) => {
  const { connectors, connect, status, error } = useConnect();

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div style={{
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px',
        pointerEvents: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)', 
            backdropFilter: 'blur(12px)'
          }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass"
          style={{
            position: 'relative', 
            width: '100%', 
            maxWidth: '440px',
            maxHeight: '90vh',
            background: '#0d1117', 
            borderRadius: '28px', 
            border: '1px solid var(--border)',
            boxShadow: '0 32px 128px rgba(0, 0, 0, 0.8)', 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 10000
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="black" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>Connect Wallet</h2>
            </div>
            <button 
              onClick={onClose} 
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#666', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = 'white'}
              onMouseOut={e => e.currentTarget.style.color = '#666'}
            >
              <X size={20} />
            </button>
          </div>

          {/* List of Connectors */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {connectors.map((connector) => (
              <motion.button
                key={connector.uid}
                whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.03)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  connect({ connector });
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                    <img 
                      src={connector.icon || (connector.name.toLowerCase().includes('meta') ? "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/Metamask-logo.svg" : "https://raw.githubusercontent.com/wagmi-dev/wagmi/main/packages/connectors/src/coinbaseWallet.svg")} 
                      alt={connector.name} 
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                    />
                    <Wallet size={24} color="var(--primary)" style={{ display: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{connector.name}</div>
                  <div style={{ color: '#555', fontSize: '12px' }}>Browser Extension</div>
                </div>
                {status === 'pending' ? (
                   <Loader2 size={18} color="var(--primary)" className="spin" />
                ) : (
                   <ChevronRight size={18} color="#333" />
                )}
              </motion.button>
            ))}

            {error && (
              <div style={{ 
                marginTop: '12px', padding: '12px 16px', borderRadius: '12px', 
                background: 'rgba(255, 60, 60, 0.05)', border: '1px solid rgba(255, 60, 60, 0.1)',
                color: '#ff6b6b', fontSize: '13px', textAlign: 'center'
              }}>
                {error.message.includes('User rejected') ? 'User rejected the connection request.' : 'Failed to connect. Make sure your extension is unlocked.'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 32px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontSize: '12px', color: '#555' }}>
              By connecting, you agree to our <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Terms of Service</span>
            </p>
          </div>
        </motion.div>
      </div>
      
      <style>{`
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AnimatePresence>,
    document.body
  );
};

export default ConnectModal;

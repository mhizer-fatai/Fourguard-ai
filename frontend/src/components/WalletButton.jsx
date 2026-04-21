import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';

const WalletButton = ({ onOpenModal }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.05, background: 'var(--primary-glow)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenModal}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 20px', borderRadius: '12px',
          background: 'var(--primary)', border: 'none',
          color: 'black', fontWeight: 800, fontSize: '14px',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(163, 255, 18, 0.2)',
          transition: 'all 0.2s'
        }}
      >
        <Wallet size={18} />
        CONNECT WALLET
      </motion.button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <motion.div
        whileHover={{ background: 'rgba(255,255,255,0.05)' }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '8px 16px', borderRadius: '14px',
          background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
          color: 'white', cursor: 'default'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
        <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>{truncateAddress(address)}</span>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1, color: '#ff6b6b' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => disconnect()}
        style={{
          background: 'rgba(255,255,255,0.05)', border: 'none',
          width: '38px', height: '38px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#666', cursor: 'pointer', transition: 'all 0.2s'
        }}
        title="Disconnect"
      >
        <LogOut size={18} />
      </motion.button>
    </div>
  );
};

export default WalletButton;

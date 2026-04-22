import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Globe,
  MessageSquare,
  Loader2,
  Database,
  Activity,
  TrendingUp,
  Zap,
  ArrowLeft,
  Search,
  ChevronRight,
  Shield,
  ShieldAlert,
  Target,
  ExternalLink
} from 'lucide-react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';

// Four.Meme Helper ABI
const HELPER_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "getTokenInfo",
    "outputs": [
      { "internalType": "uint256", "name": "version", "type": "uint256" },
      { "internalType": "address", "name": "tokenManager", "type": "address" },
      { "internalType": "address", "name": "quote", "type": "address" },
      { "internalType": "uint256", "name": "lastPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "tradingFeeRate", "type": "uint256" },
      { "internalType": "uint256", "name": "minTradingFee", "type": "uint256" },
      { "internalType": "uint256", "name": "launchTime", "type": "uint256" },
      { "internalType": "uint256", "name": "offers", "type": "uint256" },
      { "internalType": "uint256", "name": "maxOffers", "type": "uint256" },
      { "internalType": "uint256", "name": "funds", "type": "uint256" },
      { "internalType": "uint256", "name": "maxFunds", "type": "uint256" },
      { "internalType": "bool", "name": "liquidityAdded", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const getRiskColor = (score) => {
  if (score < 40) return '#ff3c3c';
  if (score < 65) return '#f0b90b';
  return 'var(--primary)';
};

const getRiskBg = (score) => {
  if (score < 40) return 'rgba(255, 60, 60, 0.05)';
  if (score < 65) return 'rgba(240, 185, 11, 0.05)';
  return 'rgba(163, 255, 18, 0.05)';
};

const getRiskGlow = (score) => {
  if (score < 40) return '0 0 20px rgba(255, 60, 60, 0.2)';
  if (score < 65) return '0 0 20px rgba(240, 185, 11, 0.2)';
  return '0 0 30px rgba(163, 255, 18, 0.3)';
};

// Component to render the split sections of the Initial AI Overview
const InitialIntelligence = ({ aiFeedback, token }) => {
  if (!aiFeedback) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
       {[1, 2, 3].map(i => (
         <motion.div 
           key={i}
           animate={{ opacity: [0.05, 0.1, 0.05] }}
           transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
           style={{ 
             height: i === 1 ? '60px' : '100px', 
             width: '100%', 
             background: 'white', 
             borderRadius: '16px',
             border: '1px solid rgba(255,255,255,0.03)'
           }} 
         />
       ))}
       <div style={{ textAlign: 'center', marginTop: '8px' }}>
         <motion.p 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase' }}
          >
            Synthesizing Intelligence...
          </motion.p>
       </div>
    </div>
  );

  // Detect sections if they were returned with markdown headings or split manually
  // We'll enforce a clean split for display
  const sections = aiFeedback.split('**').filter(s => s.trim().length > 0);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {aiFeedback.includes('**') ? (
         sections.map((section, idx) => {
           if (idx % 2 === 0) {
             const title = section.trim();
             const content = sections[idx + 1]?.trim();
             if (!content) return null;
             return (
               <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 className="glass" 
                 style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}
               >
                 <h5 style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>{title}</h5>
                 <p style={{ fontSize: '14px', color: '#eee', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{content}</p>
               </motion.div>
             );
           }
           return null;
         })
      ) : (
        <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <p style={{ fontSize: '15px', color: '#eee', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};

// New Component: Deep Post-Audit Insight (Audit Strategist)
const AuditStrategist = ({ insight, score }) => {
  if (!insight) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      {/* 1. Executive Summary / Score Reasons */}
      <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: `0 20px 40px ${getRiskColor(score)}08` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield color={getRiskColor(score)} size={20} />
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>SUMMARY</h4>
        </div>
        <p style={{ fontSize: '18px', color: '#fff', lineHeight: 1.7, fontWeight: 500 }}>{insight.summary}</p>
      </div>

      {/* 2. Pros vs Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '36px', borderRadius: '28px', background: 'rgba(163, 255, 18, 0.02)', border: '1px solid rgba(163, 255, 18, 0.1)', boxShadow: 'inset 0 0 30px rgba(163, 255, 18, 0.05)' }}>
          <div style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '1px' }}>
            <Zap size={18} /> POSITIVE INDICATORS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {insight.pros?.map((p, i) => (
              <div key={`pro-${i}`} style={{ fontSize: '16px', color: '#eee', display: 'flex', gap: '14px', lineHeight: 1.6 }}>
                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '9px' }} /> {p}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '36px', borderRadius: '28px', background: 'rgba(255, 60, 60, 0.02)', border: '1px solid rgba(255, 60, 60, 0.1)', boxShadow: 'inset 0 0 30px rgba(255, 60, 60, 0.05)' }}>
          <div style={{ color: '#ff3c3c', fontSize: '14px', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '1px' }}>
            <ShieldAlert size={18} /> RISK FACTORS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {insight.cons?.map((c, i) => (
              <div key={`con-${i}`} style={{ fontSize: '16px', color: '#eee', display: 'flex', gap: '14px', lineHeight: 1.6 }}>
                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#ff3c3c', marginTop: '9px' }} /> {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Watchlist & Strategy */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div className="glass" style={{ padding: '36px', borderRadius: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#787b86', fontSize: '12px', fontWeight: 900, marginBottom: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>THINGS TO WATCH</div>
          <p style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{insight.watchlist}</p>
        </div>
        <div style={{ 
          padding: '40px', borderRadius: '28px', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #d4ff00 100%)', 
          color: 'black', boxShadow: '0 15px 40px rgba(163, 255, 18, 0.25)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 950, marginBottom: '16px', letterSpacing: '2px', opacity: 0.8, textTransform: 'uppercase' }}>STRATEGIC ADVISORY</div>
          <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.4 }}>{insight.strategy}</p>
        </div>
      </div>
    </motion.div>
  );
};

import config from '../config';

const AuditPage = ({ isConnected, onOpenConnectModal, onScanComplete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle');
  const [auditResult, setAuditResult] = useState(null);
  
  const API_BASE = config.BACKEND_URL;

  // 1. Fetch Token Data if not present
  useEffect(() => {
    const fetchToken = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/lookup/${id}`);
        if (!res.ok) throw new Error('Token not found');
        const data = await res.json();
        setToken(data);
        
        // --- AUTO-FETCH EXISTING AUDIT ---
        if (data.guardScore !== null || data.isVerified) {
          const statusRes = await fetch(`${API_BASE}/api/scan-status/${data.id}`);
          const statusData = await statusRes.json();
          if (statusData.status === 'completed') {
            setAuditResult(statusData.report);
            if (!silent) setScanStatus('completed');
          } else {
            if (!silent) setScanStatus('idle');
          }
        }
      } catch (err) {
        if (!silent) setError(err.message);
      } finally {
        if (!silent) setLoading(false);
      }
    };
    fetchToken();

    // NUCLEAR RECOVERY: Poll if aiFeedback is missing
    let pollInterval;
    if (!token?.aiFeedback) {
      pollInterval = setInterval(() => {
        console.log("🛠️ [Audit Recovery] Retrying intelligence fetch...");
        fetchToken(true);
      }, 5000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [id, !!token?.aiFeedback]);

  // 2. Poll for Scan Status
  useEffect(() => {
    let interval;
    if (scanStatus === 'scanning' && token?.id) {
       interval = setInterval(async () => {
         try {
           const res = await fetch(`${API_BASE}/api/scan-status/${token.id}`);
           const data = await res.json();
            if (data.status === 'completed') {
              setAuditResult(data.report);
              setScanStatus('completed');
              if (onScanComplete) onScanComplete({ ...token, ...data.report });
              clearInterval(interval);
            } else if (data.status === 'finalizing') {
              setScanStatus('finalizing');
            }
         } catch (e) {
           console.error("Polling error:", e);
         }
       }, 3000);
    }
    return () => clearInterval(interval);
  }, [scanStatus, token?.id]);

  const handleDeepScan = async () => {
    if (!isConnected) {
      onOpenConnectModal();
      return;
    }
    
    // Clear existing results to show scanning state
    setAuditResult(null);
    setScanStatus('scanning');
    try {
      const res = await fetch(`${API_BASE}/api/scan-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: token.id })
      });
      const data = await res.json();
      if (!data.success) setScanStatus('error');
    } catch (err) {
      setScanStatus('error');
    }
  };

  const { data: onChainData } = useReadContract({
    address: '0xF251F83e40a78868FcfA3FA4599Dad6494E46034',
    abi: HELPER_ABI,
    functionName: 'getTokenInfo',
    args: [token?.id],
  });

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ 
          position: 'absolute', width: '80px', height: '80px', 
          borderRadius: '50%', border: '2px solid var(--primary)', 
          opacity: 0.2, filter: 'blur(10px)' 
        }} />
        <Loader2 size={64} color="var(--primary)" />
      </motion.div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 950, color: 'white', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          FourGuard Intelligence
        </h2>
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          Synchronizing Data...
        </motion.p>
      </div>
    </div>
  );

  if (error || !token) return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', gap: '20px' }}>
      <ShieldAlert size={64} color="#ff3c3c" />
      <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Token Not Found</h2>
      <button onClick={() => navigate('/')} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'black', fontWeight: 800, border: 'none', cursor: 'pointer' }}>BACK TO DASHBOARD</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: '#787b86', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
          onMouseOver={e => e.currentTarget.style.color = 'white'}
          onMouseOut={e => e.currentTarget.style.color = '#787b86'}
        >
          <ArrowLeft size={16} /> BACK TO TERMINAL
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: 0 }}>{token.name === 'Scanning...' ? 'Token Profile' : token.name}</h1>
              <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px' }}>{token.symbol || 'TKN'} / BNB</div>
           </div>
           
           <div style={{ position: 'relative' }}>
             {/* Scan Beam Effect */}
             {scanStatus === 'scanning' && (
               <motion.div 
                 initial={{ top: '-10%' }}
                 animate={{ top: '110%' }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 style={{ 
                   position: 'absolute', left: 0, right: 0, height: '2px', 
                   background: 'var(--primary)', zIndex: 10, boxShadow: '0 0 15px var(--primary)',
                   borderRadius: '2px'
                 }}
               />
             )}
             
             {token.logo ? (
               <motion.img 
                 animate={scanStatus === 'scanning' ? { scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] } : {}}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 src={token.logo} 
                 alt={token.symbol} 
                 style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover', background: '#131722', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
               />
             ) : (
               <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <ShieldCheck size={36} color="black" />
               </div>
             )}
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Left Column: Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Initial Overview Sections */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Activity size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#787b86', letterSpacing: '2px' }}>PROJECT OVERVIEW</h4>
              </div>
              <InitialIntelligence aiFeedback={token.aiFeedback} token={token} />
            </div>

          {/* Audit Strategy (Post-Scan) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Target size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#787b86', letterSpacing: '2px' }}>SUMMARY</h4>
              </div>
              
              {!auditResult?.insight && scanStatus === 'scanning' ? (
                <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#666' }}>
                    <Loader2 className="animate-spin" size={16} /> 
                    <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>FINALIZING REVIEW...</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <AuditStrategist insight={auditResult?.insight} score={auditResult?.guardScore} />
                  
                  {/* Smart Re-Scan Button */}
                  {scanStatus === 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeepScan}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--primary)',
                        fontSize: '13px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '12px'
                      }}
                    >
                      <Activity size={16} /> SCAN AGAIN
                    </motion.button>
                  )}
                </div>
              )}
            </div>

          {/* Initial Call to Action & Re-Scan Logic */}
          {(scanStatus === 'idle' && (!auditResult || (auditResult.timestamp && Date.now() - auditResult.timestamp > 5 * 60 * 1000))) && (
            <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>{auditResult ? 'DATA STALE (5m+)' : 'READY FOR SCAN?'}</h3>
              <p style={{ color: '#888', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                {auditResult 
                  ? "This report was generated over 5 minutes ago. You can now run a fresh scan to get the latest holder distribution and market security data."
                  : "Scan this token with GenLayer to analyze the contract logic and holder distribution in real-time."
                }
              </p>
              <button
                onClick={handleDeepScan}
                style={{
                  padding: '20px 60px', borderRadius: '16px', background: 'var(--primary)', color: 'black', 
                  fontSize: '18px', fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 12px 40px rgba(163, 255, 18, 0.3)'
                }}
              >
                SCAN WITH GENLAYER
              </button>
            </div>
          )}

      {scanStatus === 'scanning' && (
    <div className="glass" style={{ padding: '60px', borderRadius: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={48} color="var(--primary)" />
      </motion.div>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '2px', color: 'white', marginBottom: '8px' }}>SCAN IN PROGRESS... WAITING FOR GENLAYER</h3>
        <p style={{ fontSize: '14px', color: '#888', maxWidth: '400px', margin: '0 auto' }}>
          FourGuard AI is currently waiting for the GenLayer network to finish the deep scan of {token?.symbol || 'BSC'}.
        </p>
      </div>
    </div>
  )}

  {scanStatus === 'finalizing' && (
    <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={24} color="var(--primary)" />
      </motion.div>
      <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '2px', color: 'var(--primary)' }}>FINALIZING REVIEW...</span>
    </div>
  )}
        </div>

        {/* Right Column: Market & Technical Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Quick Stats */}
          <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
             <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#787b86', letterSpacing: '2px', marginBottom: '24px' }}>MARKET CONTEXT</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: "Current Price", val: `$${token.price?.toFixed(8) || '0.00'}`, icon: Activity },
                  { label: "Market Cap (FDV)", val: `$${token.marketCap?.toLocaleString() || '0'}`, icon: TrendingUp },
                  { label: "Locked Liquidity", val: `$${token.liquidity?.toLocaleString() || '0'}`, icon: Zap },
                  { label: "Project Age", val: token.details?.age || 'New', icon: Database }
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                     <div>
                       <div style={{ fontSize: '10px', color: '#666', fontWeight: 800 }}>{stat.label}</div>
                       <div style={{ fontSize: '16px', fontWeight: 900, color: 'white' }}>{stat.val}</div>
                     </div>
                     <stat.icon size={16} color="#333" />
                  </div>
                ))}
             </div>
          </div>

          {/* Social Links & Trade Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Real Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { icon: Globe, label: "Web", url: token.website || '' },
                  { icon: MessageSquare, label: "X", url: token.twitter || '' },
                  { icon: MessageSquare, label: "Tele", url: token.telegram || '' },
                  { icon: ExternalLink, label: "Scan", url: `https://bscscan.com/address/${token.id}` }
                ].map((link, i) => (
                  <a key={i} href={link.url || '#'} target="_blank" rel="noreferrer" style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 6px', 
                    background: link.url ? 'rgba(163, 255, 18, 0.05)' : '#131722', 
                    borderRadius: '12px', 
                    border: link.url ? '1px solid rgba(163, 255, 18, 0.2)' : '1px solid #1e222d',
                    color: link.url ? 'white' : '#333', 
                    textDecoration: 'none', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    transition: 'all 0.2s',
                    pointerEvents: link.url ? 'auto' : 'none',
                    opacity: link.url ? 1 : 0.5
                  }} onMouseOver={e => { if(link.url) { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; } }} onMouseOut={e => { if(link.url) { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(163, 255, 18, 0.2)'; } }}>
                    <link.icon size={14} />
                    {link.label}
                  </a>
                ))}
            </div>

            {/* Trading Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <a 
                 href={`https://pancakeswap.finance/swap?outputCurrency=${token.id}`} 
                 target="_blank" rel="noreferrer"
                 style={{ 
                   width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
                   border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: 800, transition: 'all 0.2s'
                 }}
                 onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                 onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
               >
                 <TrendingUp size={16} color="var(--primary)" /> TRADE ON PANCAKESWAP
               </a>

               <a 
                 href={`https://four.meme/token/${token.id}`} 
                 target="_blank" rel="noreferrer"
                 style={{ 
                   width: '100%', padding: '16px', borderRadius: '12px', backend: '#000', 
                   border: '1px solid #333', color: 'var(--primary)', textDecoration: 'none',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: 800, transition: 'all 0.2s'
                 }}
                 onMouseOver={e => e.currentTarget.style.border = '1px solid var(--primary)'}
                 onMouseOut={e => e.currentTarget.style.border = '1px solid #333'}
               >
                 <Zap size={16} /> TRADE ON FOUR.MEME
               </a>
            </div>
          </div>

          {/* Final Score (If Scanned) */}
          {(scanStatus === 'completed' || auditResult) && (
             <div style={{ padding: '40px', borderRadius: '24px', background: getRiskBg(auditResult?.guardScore || 0), border: `1px solid ${getRiskColor(auditResult?.guardScore || 0)}33`, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#787b86', fontWeight: 800, marginBottom: '8px', letterSpacing: '2px' }}>FOURGUARD SAFETY SCORE</div>
                <div style={{ fontSize: '72px', fontWeight: 950, color: getRiskColor(auditResult?.guardScore || 0) }}>
                  {auditResult?.guardScore || '??'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginTop: '8px', textTransform: 'uppercase' }}>
                  {(auditResult?.riskLevel || 'neutral')} RISK DETECTED
                </div>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Help with lucide icon mapping for explorer
const ExternalLinkIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);

export default AuditPage;

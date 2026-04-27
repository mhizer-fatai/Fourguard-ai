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
  ExternalLink,
  Copy,
  Check
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
      <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
        <p style={{ fontSize: '18px', color: '#eee', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
          {aiFeedback.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'white', fontWeight: 800 }}>{part}</strong> : part)}
        </p>
      </div>
    </div>
  );
};

const SecurityChecklist = ({ checks }) => {
  if (!checks) return null;
  
  const rules = [
    { id: '01', label: 'Social Presence', key: 'socials', desc: 'Website, Twitter, or Telegram links verified' },
    { id: '02', label: 'Liquidity Depth', key: 'liquidity', desc: 'Liquidity is above the $10k security threshold' },
    { id: '03', label: 'Ownership Renounced', key: 'ownership', desc: 'Contract ownership has been fully renounced' },
    { id: '04', label: 'Mint Authority', key: 'mint', desc: 'Token minting authority is permanently disabled' },
    { id: '05', label: 'Holder Concentration', key: 'concentration', desc: 'Top 10 holders own less than 50% of supply' },
    { id: '06', label: 'Dev Wallet Exposure', key: 'dev_wallet', desc: 'Developer wallet holds less than 10% of supply' },
    { id: '07', label: 'Market Integrity', key: 'integrity', desc: 'Market Cap and Liquidity ratios are balanced' }
  ];

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
         <ShieldCheck size={18} color="var(--primary)" />
         <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#787b86', letterSpacing: '2px', textTransform: 'uppercase' }}>SECURITY PROTOCOL VERIFICATION</h4>
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
         {rules.map((rule, i) => (
           <div key={rule.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', background: '#0a0a0b', gap: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#333', width: '20px' }}>{rule.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{rule.label}</div>
                <div style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>{rule.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '10px', background: checks[rule.key] ? 'rgba(163, 255, 18, 0.03)' : 'rgba(255, 60, 60, 0.03)' }}>
                {checks[rule.key] ? (
                  <Check size={16} color="var(--primary)" strokeWidth={3} />
                ) : (
                  <X size={16} color="#ff3c3c" strokeWidth={3} />
                )}
              </div>
           </div>
         ))}
       </div>
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
      {/* 1. GenLayer Findings */}
      <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: `0 20px 40px ${getRiskColor(score)}08` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield color={getRiskColor(score)} size={20} />
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>GENLAYER AUDIT FINDINGS</h4>
        </div>
        <p style={{ fontSize: '16px', color: '#fff', lineHeight: 1.7, fontWeight: 500 }}>{insight.findings || insight.summary}</p>
      </div>

      {/* 2. Remarks Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '36px', borderRadius: '28px', background: 'rgba(163, 255, 18, 0.02)', border: '1px solid rgba(163, 255, 18, 0.1)', boxShadow: 'inset 0 0 30px rgba(163, 255, 18, 0.05)' }}>
          <div style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '1px' }}>
            <Zap size={18} /> POSITIVE REMARKS
          </div>
          <p style={{ fontSize: '15px', color: '#eee', lineHeight: 1.6, fontWeight: 500 }}>
            {Array.isArray(insight.pros) ? insight.pros.join(' ') : insight.pros}
          </p>
        </div>
        <div style={{ padding: '36px', borderRadius: '28px', background: 'rgba(255, 60, 60, 0.02)', border: '1px solid rgba(255, 60, 60, 0.1)', boxShadow: 'inset 0 0 30px rgba(255, 60, 60, 0.05)' }}>
          <div style={{ color: '#ff3c3c', fontSize: '14px', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '1px' }}>
            <ShieldAlert size={18} /> NEGATIVE REMARKS
          </div>
          <p style={{ fontSize: '15px', color: '#eee', lineHeight: 1.6, fontWeight: 500 }}>
            {Array.isArray(insight.cons) ? insight.cons.join(' ') : insight.cons}
          </p>
        </div>
      </div>

      {/* 3. Watchlist & Suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div className="glass" style={{ padding: '36px', borderRadius: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#787b86', fontSize: '12px', fontWeight: 900, marginBottom: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>WHAT TO LOOK OUT FOR</div>
          <p style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{insight.watchlist}</p>
        </div>
        <div style={{ 
          padding: '40px', borderRadius: '28px', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #d4ff00 100%)', 
          color: 'black', boxShadow: '0 15px 40px rgba(163, 255, 18, 0.25)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 950, marginBottom: '16px', letterSpacing: '2px', opacity: 0.8, textTransform: 'uppercase' }}>SUGGESTIONS</div>
          <p style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.4 }}>{insight.suggestions || insight.strategy}</p>
        </div>
      </div>
    </motion.div>
  );
};

import config from '../config';

const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'New';
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hrs ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

const formatPrice = (val) => {
  if (!val || val === 0) return "$0.00";
  if (val >= 0.01) return `$${val.toFixed(4)}`;
  
  const strVal = val.toFixed(20);
  const match = strVal.match(/^0\.(0+)(\d{1,4})/);
  if (match) {
    const zeroCount = match[1].length;
    if (zeroCount >= 3) {
      return `$0.0(${zeroCount})${match[2]}`;
    }
  }
  return `$${val.toFixed(8).replace(/0+$/, '')}`;
};

const AuditPage = ({ isConnected, onOpenConnectModal, onScanComplete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
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
    if ((scanStatus === 'scanning' || scanStatus === 'finalizing') && token?.id) {
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

  const isMobile = window.innerWidth <= 768;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ 
        padding: isMobile ? '20px' : '40px', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? '24px' : '40px' 
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '20px' : '0'
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: '#787b86', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
          onMouseOver={e => e.currentTarget.style.color = 'white'}
          onMouseOut={e => e.currentTarget.style.color = '#787b86'}
        >
          <ArrowLeft size={16} /> BACK
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
           <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 900, color: 'white', margin: 0 }}>{token.name === 'Scanning...' ? 'Token Profile' : token.name}</h1>
              <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', marginBottom: '4px' }}>{token.symbol || 'TKN'}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                  {token.id.slice(0, 10)}...{token.id.slice(-6)}
                </span>
                <div 
                  onClick={(e) => handleCopy(e, token.id)}
                  style={{ cursor: 'pointer', opacity: 0.6, display: 'flex', alignItems: 'center' }}
                >
                  {copied ? <Check size={14} color="var(--primary)" /> : <Copy size={14} color="#888" />}
                </div>
              </div>
              
            </div>
            
            <div style={{ position: 'relative' }}>
             {token.logo ? (
               <motion.img 
                 src={token.logo} 
                 alt={token.symbol} 
                 style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', background: '#131722' }} 
               />
             ) : (
               <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} color="black" />
               </div>
             )}
           </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
        gap: isMobile ? '24px' : '40px' 
      }}>
        {/* Left Column: Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}>
          
          {/* Initial Overview Sections */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '16px' : '24px' }}>
                <Activity size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#787b86', letterSpacing: '2px' }}>PROJECT OVERVIEW</h4>
              </div>
              <InitialIntelligence aiFeedback={token.aiFeedback} token={token} />
            </div>
            
            {auditResult?.insight?.checks && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SecurityChecklist checks={auditResult.insight.checks} />
              </motion.div>
            )}

          {/* Audit Strategy (Post-Scan) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '16px' : '24px' }}>
                <Target size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#787b86', letterSpacing: '2px' }}>AUDIT SUMMARY</h4>
              </div>
              
              {!auditResult?.insight && scanStatus === 'scanning' ? (
                <div style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#666' }}>
                    <Loader2 className="animate-spin" size={16} /> 
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>SYNTHESIZING...</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <AuditStrategist insight={auditResult?.insight} score={auditResult?.guardScore} />
                  
                  {scanStatus === 'completed' && (
                    <button
                      onClick={handleDeepScan}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                      }}
                    >
                      <Activity size={16} /> RE-SCAN TOKEN
                    </button>
                  )}
                </div>
              )}
            </div>

          {/* Initial Call to Action */}
          {(scanStatus === 'idle' && !auditResult) && (
            <div className="glass" style={{ padding: isMobile ? '32px 24px' : '40px', borderRadius: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 900, color: 'white', marginBottom: '12px' }}>READY FOR DEEP SCAN?</h3>
              <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>Analyze the contract logic and holder distribution in real-time with GenLayer.</p>
              <button
                onClick={handleDeepScan}
                style={{
                  width: isMobile ? '100%' : 'auto',
                  padding: '18px 48px', borderRadius: '16px', background: 'var(--primary)', color: 'black', 
                  fontSize: '16px', fontWeight: 900, border: 'none', cursor: 'pointer'
                }}
              >
                SCAN WITH GENLAYER
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Market & Technical Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}>
          
          {/* Quick Stats */}
          <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
             <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#787b86', letterSpacing: '2px', marginBottom: '20px' }}>MARKET CONTEXT</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: "Price", val: formatPrice(token.price), icon: Activity },
                  { label: "Market Cap", val: `$${token.marketCap?.toLocaleString() || '0'}`, icon: TrendingUp },
                  { label: "Liquidity", val: `$${token.liquidity?.toLocaleString() || '0'}`, icon: Zap },
                  { label: "Age", val: getRelativeTime(token.createdAt), icon: Database }
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                     <div>
                       <div style={{ fontSize: '10px', color: '#666', fontWeight: 800 }}>{stat.label}</div>
                       <div style={{ fontSize: '14px', fontWeight: 900, color: 'white' }}>{stat.val}</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Trade Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <a 
               href={`https://pancakeswap.finance/swap?outputCurrency=${token.id}`} 
               target="_blank" rel="noreferrer"
               style={{ 
                 width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
                 border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', fontWeight: 800
               }}
             >
               TRADE ON PANCAKE
             </a>

             <a 
               href={`https://four.meme/token/${token.id}`} 
               target="_blank" rel="noreferrer"
               style={{ 
                 width: '100%', padding: '14px', borderRadius: '12px', background: '#000', 
                 border: '1px solid #333', color: 'var(--primary)', textDecoration: 'none',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', fontWeight: 800
               }}
             >
               TRADE ON FOUR.MEME
             </a>
          </div>

          {/* Final Score */}
          {(scanStatus === 'completed' || auditResult) && (
             <div style={{ padding: '32px', borderRadius: '24px', background: getRiskBg(auditResult?.guardScore || 0), border: `1px solid ${getRiskColor(auditResult?.guardScore || 0)}33`, textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#787b86', fontWeight: 800, marginBottom: '4px', letterSpacing: '2px' }}>SAFETY SCORE</div>
                <div style={{ fontSize: isMobile ? '48px' : '64px', fontWeight: 950, color: getRiskColor(auditResult?.guardScore || 0) }}>
                  {auditResult?.guardScore || '??'}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>
                  {(auditResult?.riskLevel || 'neutral')} RISK
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

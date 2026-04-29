import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { io } from 'socket.io-client';

// Layout & Pages
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AuditPage from './pages/AuditPage';
import { AnimatePresence } from 'framer-motion';
import config from './config';

const SOCKET_URL = config.SOCKET_URL;

export default function App() {
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { address, isConnected } = useAccount();

  // 1. REAL-TIME DATA (SOCKET.IO)
  useEffect(() => {
    const socket = io(SOCKET_URL);

    // Connection Safety Timeout
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [Live Feed] Slow connection. Proceeding with safe-mode render.');
        setIsLoading(false);
      }
    }, 8000);

    socket.on('connect_error', () => {
      setIsError(true);
      setIsLoading(false);
    });

    socket.on('connect', () => {
      setIsSocketConnected(true);
      setIsError(false);
      // Force 'new' tab on connect to ensure data visibility
      if (activeTab === 'watchlist' && watchlist.length === 0) {
        setActiveTab('new');
      }
    });

    socket.on('initial-data', (data) => {
      const hasData = (data?.length || 0) > 0;
      if (hasData) {
        setRawData(data);
        setIsLoading(false);
        clearTimeout(timeout);
      }
    });

    socket.on('new-token', (token) => {
      console.log(`✨ [Live Feed] Token Arrival: ${token.symbol} @ ${token.id}`);
      setRawData(prev => {
        const ts = token.capturedAt ? Number(token.capturedAt) : Date.now();
        const newToken = { ...token, capturedAt: ts };
        
        const filteredNew = prev.filter(t => t.id !== newToken.id);

        return [newToken, ...filteredNew]
          .sort((a, b) => (b.capturedAt || 0) - (a.capturedAt || 0))
          .slice(0, 500);
      });
    });

    socket.on('price-update', (data) => {
      setRawData(data);
    });

    return () => socket.disconnect();
  }, []);

  // 2. State & Persistence Logic
  useEffect(() => {
    if (isConnected && address) {
      const savedWatchlist = localStorage.getItem(`watchlist_${address}`);
      setWatchlist(savedWatchlist ? JSON.parse(savedWatchlist) : []);
      
      const savedHistory = localStorage.getItem(`scanHistory_${address}`);
      if (savedHistory) {
        let parsed = JSON.parse(savedHistory);
        // FRESH START: If the history contains old Bitquery-era mocks, wipe it clean.
        const hasMocks = parsed.some(t => t.id?.startsWith('mock-') || t.tokenId?.startsWith('mock-'));
        if (hasMocks) {
          console.log("🛡️ [FourGuard] Mock data detected in history. Resetting for Fresh Start...");
          localStorage.removeItem(`scanHistory_${address}`);
          setScanHistory([]);
        } else {
          setScanHistory(parsed);
        }
      } else {
        setScanHistory([]);
      }
    } else {
      setWatchlist([]);
      setScanHistory([]);
    }
  }, [address, isConnected]);

  const toggleWatchlist = (e, tokenId) => {
    e.stopPropagation();
    if (!isConnected || !address) {
      setIsConnectModalOpen(true);
      return;
    }
    const updated = watchlist.includes(tokenId)
      ? watchlist.filter(id => id !== tokenId)
      : [...watchlist, tokenId];
    
    setWatchlist(updated);
    localStorage.setItem(`watchlist_${address}`, JSON.stringify(updated));
  };

  const handleScanComplete = (updatedToken) => {
    if (!isConnected || !address) return;
    setScanHistory(prev => {
      const existsIdx = prev.findIndex(t => t.id === updatedToken.id || t.id === updatedToken.tokenId);
      const newEntry = { ...updatedToken, timestamp: new Date().toISOString() };
      let newHistory;
      if (existsIdx !== -1) {
        newHistory = [...prev];
        newHistory[existsIdx] = newEntry;
      } else {
        newHistory = [newEntry, ...prev];
      }
      localStorage.setItem(`scanHistory_${address}`, JSON.stringify(newHistory.slice(0, 50)));
      return newHistory;
    });
  };

  // 3. Computed Data for Pages
  let tokens = [];
  if (activeTab === 'watchlist') {
    const allUnique = new Map();
    rawData.forEach(t => {
      if (t && t.id) allUnique.set(t.id.toLowerCase(), t);
    });
    tokens = Array.from(allUnique.values())
      .filter(t => watchlist.includes(t.id))
      .sort((a, b) => (b.capturedAt || 0) - (a.capturedAt || 0));
  } else if (activeTab === 'history') {
    tokens = scanHistory;
  } else {
    // DEFAULT TERMINAL VIEW: Deduplicate, and show 75 NEWEST at the top
    const allUnique = new Map();
    rawData.forEach(t => {
      if (t && t.id) allUnique.set(t.id.toLowerCase(), t);
    });
    
    tokens = Array.from(allUnique.values())
      .sort((a, b) => (b.capturedAt || 0) - (a.capturedAt || 0))
      .slice(0, 75);
  }

  const filteredTokens = tokens.filter(token => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;

    return token.name.toLowerCase().includes(term) || 
           token.symbol.toLowerCase().includes(term) || 
           token.id.toLowerCase().includes(term);
  });

  // 4. GLOBAL SEARCH DISCOVERY
  // If user pastes a CA and it's not found locally, ask the backend to hunt for it.
  useEffect(() => {
    const term = searchQuery.toLowerCase().trim();
    if (term.startsWith('0x') && term.length >= 40) {
      const isFoundLocally = filteredTokens.some(t => t.id.toLowerCase() === term);
      if (!isFoundLocally) {
        console.log(`🔍 [Global Search] Prompting backend to discover: ${term}`);
        fetch(`${SOCKET_URL}/api/lookup/${term}`)
          .then(res => res.json())
          .then(data => {
            if (data.id) {
               console.log(`✅ [Global Search] Discovery successful: ${data.symbol}`);
               // Note: Backend emits 'new-token' via socket, so rawData updates automatically.
            }
          })
          .catch(err => console.warn(`⚠️ [Global Search] Lookup failed for ${term}`));
      }
    }
  }, [searchQuery, filteredTokens]);

  // DIAGNOSTIC LOG: This tells us exactly what the frontend is trying to draw
  if (tokens.length > 0) {
    const listNames = tokens.slice(0, 3).map(t => t.symbol).join(', ');
    console.log(`📊 [Dashboard] State: ${tokens.length} tokens found. Top symbols: [${listNames}]. Filtered: ${filteredTokens.length}`);
  }

  return (
    <>
      <Routes>
        {/* Landing Page - No Sidebar/Layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Terminal Layout */}
        <Route element={
          <Layout 
            isSocketConnected={isSocketConnected}
            isConnectModalOpen={isConnectModalOpen}
            setIsConnectModalOpen={setIsConnectModalOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }>
          <Route path="/terminal" element={
            <DashboardPage 
              isLoading={isLoading}
              isError={isError}
              filteredTokens={filteredTokens}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              scanHistory={scanHistory}
              activeTab={activeTab}
              setSelectedToken={setSelectedToken}
            />
          } />
          <Route path="/audit/:id" element={
            <AuditPage 
              isConnected={isConnected}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onScanComplete={handleScanComplete}
            />
          } />
        </Route>
      </Routes>
    </>
  );
}

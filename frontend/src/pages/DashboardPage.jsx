import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Filter, ArrowUpRight, ShieldAlert, Search } from 'lucide-react';
import TokenCard from '../components/TokenCard';
import ScanHistoryView from '../components/ScanHistoryView';
import { useNavigate, useOutletContext } from 'react-router-dom';

const DashboardPage = ({ 
  activeTab, 
  isLoading, 
  isError, 
  filteredTokens, 
  watchlist, 
  toggleWatchlist, 
  scanHistory,
  initialReportLoading,
  setSelectedToken
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '3rem 2.5rem', 
      flex: 1,
      minHeight: '400px',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.03)'
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Activity size={14} color="var(--primary)" />
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Live Updates</span>
          </div>
          <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            FourGuard <span style={{ color: 'var(--primary)' }}>Dashboard</span>
          </h2>
          <p style={{ color: '#666', marginTop: '6px', fontSize: '16px' }}>Tracking new tokens and their safety on BNB Chain</p>
          {filteredTokens.length > 0 && (
             <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--primary)', opacity: 0.8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
                Data Freshness: {filteredTokens[0]?.fetchedAt || 'Live'} (Updated every ~30s)
             </div>
          )}
        </motion.div>
      </div>

      <motion.div 
        layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          background: '#0b0e14', 
          borderRadius: '12px',
          border: '1px solid #1e222d',
          overflow: 'hidden'
        }}>
        
        {/* Table Header */}
        <div style={{ 
          display: 'flex', padding: '12px 24px', background: '#131722', borderBottom: '1px solid #1e222d', 
          fontSize: '11px', fontWeight: 600, color: '#787b86', textTransform: 'uppercase', letterSpacing: '0.05em' 
        }}>
           <div style={{ flex: 2 }}>Token</div>
           <div style={{ flex: 1, textAlign: 'right' }}>Price</div>
           <div style={{ flex: 1, textAlign: 'right' }}>24H Volume</div>
           <div style={{ flex: 1, textAlign: 'right' }}>Market Cap</div>
           <div style={{ flex: 1, textAlign: 'right' }}>Security</div>
        </div>

        <AnimatePresence mode='popLayout'>
          {activeTab === 'history' ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <ScanHistoryView 
                history={scanHistory} 
                onViewReport={(token) => navigate(`/audit/${token.id}`)} 
              />
            </div>
          ) : isLoading || initialReportLoading ? (
            // Loading Skeletons
            [...Array(6)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass"
                style={{ height: '80px', borderRadius: '4px', margin: '8px 24px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ padding: '15px' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--surface)' }} />
                     <div style={{ flex: 1 }}>
                       <div style={{ width: '30%', height: '12px', background: 'var(--surface)', borderRadius: '4px', marginBottom: '8px' }} />
                       <div style={{ width: '20%', height: '8px', background: 'var(--surface)', borderRadius: '4px' }} />
                     </div>
                   </div>
                </div>
              </motion.div>
            ))
          ) : isError ? (
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
              <ShieldAlert size={48} color="var(--critical)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Connection Error</h3>
              <p style={{ color: '#666' }}>Unable to reach the indexer. Please refresh.</p>
            </div>
          ) : (
              filteredTokens.map((token, index) => (
                <motion.div
                  key={token.id ? `token-${token.id}` : `token-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <TokenCard 
                  token={token} 
                  onScan={() => navigate(`/audit/${token.id}`)}
                  isFavorite={watchlist.includes(token.id)}
                  onToggleFavorite={(e) => toggleWatchlist(e, token.id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {!isLoading && filteredTokens.length === 0 && activeTab !== 'history' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', height: '80px', background: 'var(--surface)', 
                borderRadius: '24px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border)'
              }}>
                <Search size={32} color="#444" />
              </div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Results Found</h3>
              <p style={{ color: '#666', fontSize: '15px' }}>Try adjusting your search or filters.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;

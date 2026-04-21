import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, ArrowRight, Zap, Clock, ShieldAlert, Share2, Check } from 'lucide-react';

const getRiskColor = (score) => {
  if (score < 40) return '#ff3c3c';
  if (score < 65) return '#f0b90b';
  return 'var(--primary)';
};

const ScanHistoryView = ({ history, onViewReport }) => {
  const [copiedId, setCopiedId] = useState(null);

  if (history.length === 0) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', height: '80px', background: 'var(--surface)', 
          borderRadius: '24px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border)'
        }}>
          <Clock size={32} color="#444" />
        </div>
        <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Scan History</h3>
        <p style={{ color: '#666', fontSize: '15px' }}>Your completed deep scans will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', 
        marginBottom: '24px', padding: '0 8px' 
      }}>
        <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }} />
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#787b86', letterSpacing: '2px' }}>RECENT AUDITS</h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {history.map((entry, index) => (
          <motion.div
            key={entry.reportId || entry.id || `history-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass"
            style={{ 
              padding: '20px 24px', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            whileHover={{ scale: 1.01, border: '1px solid var(--border-bright)', background: 'rgba(255,255,255,0.03)' }}
            onClick={() => onViewReport(entry)}
          >
            {/* Score Badge */}
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: 'rgba(0,0,0,0.3)', border: `1px solid ${getRiskColor(entry.guardScore)}33`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: getRiskColor(entry.guardScore) }}>{entry.guardScore}</span>
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#555' }}>SCORE</span>
            </div>

            {/* Token Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>{entry.name}</h3>
                <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>${entry.symbol}</span>
                {entry.isGeminiBackup && (
                  <span style={{ 
                    fontSize: '9px', padding: '2px 6px', borderRadius: '4px', 
                    background: 'rgba(255,255,255,0.05)', color: '#666', border: '1px solid rgba(255,255,255,0.1)' 
                  }}>BACKUP ENGINE</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  <span style={{ fontSize: '12px' }}>{new Date(entry.timestamp).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} />
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', color: getRiskColor(entry.guardScore), fontWeight: 700 }}>{entry.riskLevel}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(entry.reportId || (entry.id && entry.id.startsWith('fg_'))) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rid = entry.reportId || entry.id;
                    const shareUrl = `${window.location.origin}/audit/${rid}`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedId(rid);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  style={{ 
                    padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', 
                    color: copiedId === (entry.reportId || entry.id) ? 'var(--primary)' : '#888', 
                    fontSize: '12px', fontWeight: 700, border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {copiedId === (entry.reportId || entry.id) ? <Check size={14} /> : <Share2 size={14} />}
                  {copiedId === (entry.reportId || entry.id) ? 'COPIED!' : 'SHARE LINK'}
                </button>
              )}

              <div style={{ 
                padding: '10px 16px', borderRadius: '10px', background: 'var(--surface)', 
                color: 'var(--primary)', fontSize: '12px', fontWeight: 700, 
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                VIEW REPORT <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistoryView;

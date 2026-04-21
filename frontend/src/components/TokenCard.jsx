import React, { useState } from 'react';
import { Shield, Zap, Star } from 'lucide-react';

const TokenCard = ({ token, onScan, isFavorite, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { 
    name, 
    symbol, 
    marketCap, 
    price,
    volume,
    guardScore, 
    riskLevel, 
    isAiGenerated,
    hasAntiSniper,
    isTaxToken,
    isFourMeme,
    logo
  } = token;

  const getStatusColor = () => {
    if (riskLevel === 'safe') return 'var(--safe)';
    if (riskLevel === 'warning') return 'var(--warning)';
    return 'var(--critical)';
  };

  const formatNumber = (value) => {
    if (!value || value === 0) return '$0';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatPrice = (val, isFour) => {
    if ((!val || val === 0) && isFour) return "Bonding Phase";
    if (!val || val === 0) return "$0.00";
    if (val < 0.01) return `$${val.toFixed(6)}`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onScan}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #1e222d',
        background: isHovered ? 'rgba(0, 255, 131, 0.02)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
    >
      {/* 1. Token Info */}
      <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          onClick={(e) => onToggleFavorite(e)}
          style={{ 
            cursor: 'pointer', 
            color: isFavorite ? '#F0B90B' : '#333',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <Star size={18} fill={isFavorite ? '#F0B90B' : 'transparent'} />
        </div>
        
        {/* Token Logo */}
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: '#1e222d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
          {token.logo ? (
            <img src={token.logo} alt={symbol} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 800 }}>{symbol?.slice(0, 2)}</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#d1d4dc' }}>{name}</span>
            {isFourMeme && (
              <span style={{ padding: '2px 6px', background: 'rgba(138, 43, 226, 0.15)', color: '#d08cff', fontSize: '9px', fontWeight: 700, borderRadius: '4px', border: '1px solid rgba(138, 43, 226, 0.4)', textTransform: 'uppercase' }}>
                4.M
              </span>
            )}
          </div>
          <span style={{ fontSize: '11px', color: '#787b86', fontWeight: 600 }}>${symbol}</span>
        </div>
      </div>

      {/* 2. Price */}
      <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#d1d4dc', fontWeight: 600 }}>
        {formatPrice(price, isFourMeme)}
      </div>

      {/* 3. Volume */}
      <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>
        {formatNumber(volume)}
      </div>

      {/* 4. Market Cap */}
      <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#d1d4dc', fontWeight: 500 }}>
        {formatNumber(marketCap)}
      </div>

      {/* 4.5 Security Status */}
      <div style={{ flex: 1, textAlign: 'right' }}>
        <span style={{ 
          padding: '4px 8px', 
          fontSize: '10px', 
          fontWeight: 700, 
          borderRadius: '4px',
          background: token.details?.ownership === 'Renounced' ? 'rgba(0, 255, 131, 0.1)' : 'rgba(255, 178, 62, 0.1)',
          color: token.details?.ownership === 'Renounced' ? 'var(--primary)' : 'var(--warning)',
          border: `1px solid ${token.details?.ownership === 'Renounced' ? 'rgba(0, 255, 131, 0.2)' : 'rgba(255, 178, 62, 0.2)'}`,
          textTransform: 'uppercase'
        }}>
          {token.details?.ownership || 'Active'}
        </span>
      </div>
    </div>
  );
};

export default TokenCard;


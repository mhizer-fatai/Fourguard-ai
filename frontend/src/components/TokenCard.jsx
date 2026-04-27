import React, { useState } from 'react';
import { Shield, Zap, Star, Copy, Check } from 'lucide-react';

const TokenCard = ({ token, onScan, isFavorite, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const isMobile = window.innerWidth <= 768;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onScan}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '12px 16px' : '16px 24px',
        borderBottom: '1px solid #1e222d',
        background: isHovered ? 'rgba(0, 255, 131, 0.02)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
    >
      {/* 1. Token Info */}
      <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <div 
          onClick={(e) => onToggleFavorite(e)}
          style={{ 
            cursor: 'pointer', 
            color: isFavorite ? '#F0B90B' : '#333',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <Star size={isMobile ? 16 : 18} fill={isFavorite ? '#F0B90B' : 'transparent'} />
        </div>
        
        {/* Token Logo */}
        <div style={{ width: isMobile ? '28px' : '32px', height: isMobile ? '28px' : '32px', borderRadius: '8px', overflow: 'hidden', background: '#1e222d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
          {token.logo ? (
            <img src={token.logo} alt={symbol} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 800 }}>{symbol?.slice(0, 2)}</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 700, color: '#d1d4dc' }}>{name}</span>
            <span style={{ fontSize: '11px', color: '#787b86', fontWeight: 600 }}>${symbol}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>
              {token.id.slice(0, 6)}...{token.id.slice(-4)}
            </span>
            <div 
              onClick={(e) => handleCopy(e, token.id)}
              style={{ cursor: 'pointer', opacity: 0.6, display: 'flex', alignItems: 'center' }}
              title="Copy Address"
            >
              {copied ? <Check size={10} color="var(--primary)" /> : <Copy size={10} color="#888" />}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Price */}
      {!isMobile && (
        <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#d1d4dc', fontWeight: 600 }}>
          {formatPrice(price, isFourMeme)}
        </div>
      )}

      {/* 3. Volume */}
      {!isMobile && (
        <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>
          {formatNumber(volume)}
        </div>
      )}

      {/* 4. Market Cap */}
      <div style={{ flex: 1, textAlign: 'right', fontSize: isMobile ? '12px' : '13px', color: '#d1d4dc', fontWeight: 500 }}>
        {formatNumber(marketCap)}
      </div>

      {/* 4.5 24H Change */}
      <div style={{ flex: 1, textAlign: 'right' }}>
        <span style={{ 
          padding: '4px 8px', 
          fontSize: isMobile ? '10px' : '11px', 
          fontWeight: 700, 
          borderRadius: '6px',
          background: (token.priceChange?.h24 || 0) >= 0 ? 'rgba(0, 255, 131, 0.1)' : 'rgba(255, 60, 60, 0.1)',
          color: (token.priceChange?.h24 || 0) >= 0 ? 'var(--safe)' : 'var(--critical)',
        }}>
          {(token.priceChange?.h24 || 0) > 0 ? '+' : ''}{(token.priceChange?.h24 || 0).toFixed(isMobile ? 1 : 2)}%
        </span>
      </div>
    </div>
  );
};

export default TokenCard;


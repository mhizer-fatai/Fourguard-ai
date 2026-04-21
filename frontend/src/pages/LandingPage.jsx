import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Database, 
  Lock, 
  Activity, 
  Search, 
  ShieldCheck, 
  Globe, 
  ArrowRight
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="glass"
    style={{
      padding: '40px',
      borderRadius: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      border: '1px solid rgba(255,255,255,0.05)',
      height: '100%'
    }}
  >
    <div style={{ 
      width: '64px', height: '64px', borderRadius: '16px', 
      background: 'rgba(163, 255, 18, 0.1)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' 
    }}>
      <Icon size={32} />
    </div>
    <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{title}</h3>
    <p style={{ color: '#888', lineHeight: 1.6, fontSize: '16px' }}>{description}</p>
  </motion.div>
);

const Step = ({ number, title, description }) => (
  <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
    <div style={{ 
      minWidth: '48px', height: '48px', borderRadius: '50%', 
      border: '2px solid var(--primary)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', 
      fontSize: '20px', fontWeight: 900, color: 'var(--primary)'
    }}>
      {number}
    </div>
    <div>
      <h4 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: '#888', lineHeight: 1.6 }}>{description}</p>
    </div>
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '0 0 100px' }}>
      
      {/* Navigation */}
      <nav style={{ 
        padding: '30px 40px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', maxWidth: '1400px', margin: '0 auto' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" style={{ width: '40px', height: '40px', borderRadius: '12px' }} alt="Logo" />
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>FourGuard <span style={{ color: 'var(--primary)' }}>AI</span></h1>
        </div>
        <a 
          href="https://www.genlayer.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            padding: '8px 20px', backgroundColor: 'rgba(163, 255, 18, 0.05)', color: 'white', 
            borderRadius: '50px', fontWeight: 700, border: '1px solid rgba(163, 255, 18, 0.2)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
            textDecoration: 'none', transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(163, 255, 18, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(163, 255, 18, 0.05)'}
        >
          <img src="/genlayer.png" style={{ width: '24px', height: 'auto', display: 'block' }} alt="GenLayer Logo" />
          <span style={{ fontSize: '14px', letterSpacing: '0.5px' }}>Powered by GenLayer</span>
        </a>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '100px 40px', maxWidth: '1000px', margin: '0 auto', 
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' 
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ 
            color: 'var(--primary)', fontSize: '14px', fontWeight: 800, 
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px', display: 'block' 
          }}>
            The Future of On-Chain Security
          </span>
          <h2 style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1.1, color: 'white', marginBottom: '32px' }}>
            Professional Intelligence for <span style={{ color: 'var(--primary)' }}>Every Token.</span>
          </h2>
          <p style={{ fontSize: '20px', color: '#888', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 48px' }}>
            FourGuard is a research terminal that provides instant security audits for memecoins. We replace manual checks with automated, decentralized intelligence that you can trust.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/terminal')}
              style={{ 
                padding: '24px 48px', backgroundColor: 'var(--primary)', color: 'black', 
                borderRadius: '18px', fontWeight: 900, fontSize: '18px', border: 'none', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 20px 40px rgba(163, 255, 18, 0.15)'
              }}
            >
              Start Researching <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trust & Power Section */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.02)', padding: '80px', borderRadius: '48px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div>
            <h2 style={{ fontSize: '40px', fontWeight: 900, color: 'white', marginBottom: '24px' }}>
              Why FourGuard is Different
            </h2>
            <p style={{ color: '#888', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px' }}>
              Most tools rely on a single private server to scan tokens. If that server is wrong, you lose money.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <ShieldCheck style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'white', fontWeight: 600 }}>Decentralized AI Consensus</span>
              </div>
              <p style={{ color: '#666', marginLeft: '40px' }}>
                Instead of one server, we use GenLayer. This is a network of many AI nodes that must all agree on a token's security before we give it a passing grade.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <FeatureCard 
              icon={Lock}
              title="Tamper-Proof"
              description="Our audit reports are stored on the blockchain. They cannot be changed or deleted by token owners."
            />
            <FeatureCard 
              icon={Globe}
              title="Global Accuracy"
              description="By using a distributed network of AI nodes, we ensure that our data is free from centralized bias."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>How It Works</h2>
          <p style={{ color: '#888', fontSize: '18px' }}>Security research simplified into three simple steps.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '100px' }}>
          <div>
            <Step 
              number="01"
              title="Automatic Token Discovery"
              description="Our system scans every new token launched on the market. We instantly pull technical data like price, liquidity, and project age."
            />
            <Step 
              number="02"
              title="Deep AI Auditing"
              description="When you initiate a scan, our system sends the token's code to GenLayer's network. Multiple AI nodes analyze the contract for hidden risks."
            />
            <Step 
              number="03"
              title="Verifiable Reports"
              description="Once the nodes reach a consensus, a permanent security report is issued. You get a direct 'Smart & Simple' analysis of the risks."
            />
          </div>
          <div className="glass" style={{ 
            borderRadius: '40px', padding: '40px', border: '1px solid var(--primary)', 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', 
            background: 'linear-gradient(135deg, rgba(163, 255, 18, 0.05) 0%, rgba(0,0,0,0) 100%)' 
          }}>
            <h3 style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '24px' }}>Ready to start?</h3>
            <p style={{ color: '#888', lineHeight: 1.6, marginBottom: '40px' }}>
              Stop guessing and start using professional on-chain research. Join the experts using FourGuard to stay safe in the memecoin market.
            </p>
            <button 
              onClick={() => navigate('/terminal')}
              style={{ 
                padding: '20px', backgroundColor: 'white', color: 'black', 
                borderRadius: '16px', fontWeight: 900, fontSize: '16px', border: 'none', cursor: 'pointer' 
              }}
            >
              Enter the Terminal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '60px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', 
        maxWidth: '1400px', margin: '100px auto 0', color: '#444', 
        display: 'flex', justifyContent: 'space-between' 
      }}>
        <p>© 2026 FourGuard Intelligence Engine</p>
        <div style={{ display: 'flex', gap: '32px' }}>
          <span>Powered by GenLayer</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </footer>
    </div>
  );
}

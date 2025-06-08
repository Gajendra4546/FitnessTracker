import { useState } from 'react';
import { User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { signup } from '../../services/api';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  orb1: {
    position: 'absolute',
    top: '-160px',
    right: '-160px',
    width: '320px',
    height: '320px',
    background: '#a855f7',
    borderRadius: '50%',
    mixBlendMode: 'multiply' as const,
    filter: 'blur(40px)',
    opacity: 0.2,
    animation: 'pulse 4s ease-in-out infinite'
  },
  orb2: {
    position: 'absolute',
    bottom: '-160px',
    left: '-160px',
    width: '320px',
    height: '320px',
    background: '#3b82f6',
    borderRadius: '50%',
    mixBlendMode: 'multiply' as const,
    filter: 'blur(40px)',
    opacity: 0.2,
    animation: 'pulse 4s ease-in-out infinite 2s'
  },
  orb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '320px',
    height: '320px',
    background: '#6366f1',
    borderRadius: '50%',
    mixBlendMode: 'multiply' as const,
    filter: 'blur(40px)',
    opacity: 0.1,
    animation: 'pulse 4s ease-in-out infinite 1s'
  },
  mainContainer: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '448px'
  },
  card: {
    backdropFilter: 'blur(16px)',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px'
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold' as const,
    color: 'white',
    marginBottom: '8px',
    margin: 0
  },
  subtitle: {
    color: '#d1d5db',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  },
  inputGroup: {
    position: 'relative'
  },
  iconWrapper: {
    position: 'absolute',
    top: '50%',
    left: '16px',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    transition: 'color 0.3s ease'
  },
  input: {
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box' as const
  },
  button: {
    width: '100%',
    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    color: 'white',
    fontWeight: '600' as const,
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed' as const
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center' as const
  },
  footerText: {
    color: '#9ca3af',
    fontSize: '14px',
    margin: 0
  },
  link: {
    color: '#c084fc',
    textDecoration: 'none' as const,
    fontWeight: '500' as const,
    transition: 'color 0.3s ease'
  },
  bottomText: {
    textAlign: 'center' as const,
    marginTop: '24px'
  },
  bottomTextContent: {
    color: '#9ca3af',
    fontSize: '12px',
    margin: 0
  }
};

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await signup(form);
    setIsLoading(false);
    alert('Signup successful. Please login.');
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder {
            color: #9ca3af;
          }
          
          input:focus {
            background: rgba(255, 255, 255, 0.1);
            border-color: #a855f7;
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3);
          }
          
          input:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          input:focus + .icon-wrapper {
            color: #c084fc;
          }
          
          button:hover:not(:disabled) {
            background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
            transform: scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .link:hover {
            color: #d8b4fe;
          }
          
          .arrow-icon {
            transition: transform 0.3s ease;
          }
          
          button:hover .arrow-icon {
            transform: translateX(4px);
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.backgroundDecoration}>
          <div style={styles.orb1}></div>
          <div style={styles.orb2}></div>
          <div style={styles.orb3}></div>
        </div>

        <div style={styles.mainContainer}>
          <div style={styles.card}>
            <div style={styles.header}>
              <div style={styles.iconContainer}>
                <Sparkles size={32} color="white" />
              </div>
              <h1 style={styles.title}>Create Account</h1>
              <p style={styles.subtitle}>Join us and start your amazing journey</p>
            </div>

            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <div style={styles.iconWrapper} className="icon-wrapper">
                  <User size={20} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.iconWrapper} className="icon-wrapper">
                  <Mail size={20} color="#9ca3af" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.iconWrapper} className="icon-wrapper">
                  <Lock size={20} color="#9ca3af" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={styles.input}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...(isLoading ? styles.buttonDisabled : {})
                }}
              >
                {isLoading ? (
                  <>
                    <div style={styles.spinner}></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} className="arrow-icon" />
                  </>
                )}
              </button>
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Already have an account?{' '}
                <a href="/" style={styles.link} className="link">
                  Sign in
                </a>
              </p>
            </div>
          </div>

          <div style={styles.bottomText}>
            <p style={styles.bottomTextContent}>
              Secure • Fast • Reliable
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
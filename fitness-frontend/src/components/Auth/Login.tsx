import { useState, useContext } from 'react';
import { Mail, Lock, LogIn, Shield } from 'lucide-react';
import { login } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
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
    pointerEvents: 'none' as const
  },
  orb1: {
    position: 'absolute',
    top: '-160px',
    right: '-160px',
    width: '320px',
    height: '320px',
    background: '#06b6d4',
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
    background: '#0ea5e9',
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
    background: '#0284c7',
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
    background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
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
    color: '#cbd5e1',
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
    background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
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
  forgotPassword: {
    textAlign: 'center' as const,
    marginTop: '16px'
  },
  forgotLink: {
    color: '#38bdf8',
    textDecoration: 'none' as const,
    fontSize: '14px',
    fontWeight: '500' as const,
    transition: 'color 0.3s ease'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    color: '#64748b',
    fontSize: '14px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '0 16px'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center' as const
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '14px',
    margin: 0
  },
  link: {
    color: '#38bdf8',
    textDecoration: 'none' as const,
    fontWeight: '500' as const,
    transition: 'color 0.3s ease'
  },
  bottomText: {
    textAlign: 'center' as const,
    marginTop: '24px'
  },
  bottomTextContent: {
    color: '#94a3b8',
    fontSize: '12px',
    margin: 0
  }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(AuthContext);

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await login(form);
    setToken(res.data.token);
    setIsLoading(false);
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
            color: #94a3b8;
          }
          
          input:focus {
            background: rgba(255, 255, 255, 0.1);
            border-color: #06b6d4;
            box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3);
          }
          
          input:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          input:focus + .icon-wrapper {
            color: #38bdf8;
          }
          
          button:hover:not(:disabled) {
            background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%);
            transform: scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .link:hover {
            color: #7dd3fc;
          }
          
          .forgot-link:hover {
            color: #7dd3fc;
          }
          
          .login-icon {
            transition: transform 0.3s ease;
          }
          
          button:hover .login-icon {
            transform: translateX(2px);
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
                <Shield size={32} color="white" />
              </div>
              <h1 style={styles.title}>Welcome Back</h1>
              <p style={styles.subtitle}>Sign in to your account to continue</p>
            </div>

            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <div style={styles.iconWrapper} className="icon-wrapper">
                  <Mail size={20} color="#94a3b8" />
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
                  <Lock size={20} color="#94a3b8" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.forgotPassword}>
                <a href="#" style={styles.forgotLink} className="forgot-link">
                  Forgot your password?
                </a>
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
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={20} className="login-icon" />
                  </>
                )}
              </button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span>or</span>
              <div style={styles.dividerLine}></div>
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Don't have an account?{' '}
                <a href="/signup" style={styles.link} className="link">
                  Sign up
                </a>
              </p>
            </div>
          </div>

          <div style={styles.bottomText}>
            <p style={styles.bottomTextContent}>
              Secure • Trusted • Reliable
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
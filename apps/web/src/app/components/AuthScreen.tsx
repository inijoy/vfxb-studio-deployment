import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';
import vfxbLogo from "../../assets/87baff59339294d92e591456a1fc7b6ab9585915.png";
import { useAuthStore } from '../../store/auth.ts';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:5000';

interface AuthScreenProps {
  onAuthenticate: () => void;
}

export function AuthScreen({ onAuthenticate }: AuthScreenProps) {
  const[mode, setMode] = useState<'signIn' | 'signUp' | 'forgot'>('signIn');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [secretWord, setSecretWord] = useState('');

  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithGitHub = useAuthStore((s) => s.signInWithGitHub);

  // 1. GITHUB LISTENER
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname); 
      
      signInWithGitHub(code)
        .then(() => {
          onAuthenticate();
          toast.success('Signed in with GitHub successfully');
        })
        .catch((err) => {
          toast.error((err as Error).message || 'GitHub sign-in failed');
        });
    }
  }, [signInWithGitHub, onAuthenticate]);

  // 2. GOOGLE LOGIN POPUP
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await signInWithGoogle(tokenResponse.access_token);
        onAuthenticate();
        toast.success('Signed in with Google successfully');
      } catch (err: unknown) {
        toast.error((err as Error).message || 'Google sign-in failed');
      }
    },
    onError: () => toast.error('Google login popup closed or failed'),
  });

  // 3. GITHUB REDIRECT
  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId || clientId === 'your_github_client_id_here') {
      return toast.error('GitHub Client ID missing in .env');
    }
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'signIn') {
        await signInWithEmail(email, password);
        onAuthenticate();
        toast.success('Signed in successfully');
        
      } else if (mode === 'signUp') {
        await signUpWithEmail(email, password, name || undefined, secretWord);
        onAuthenticate();
        toast.success('Account created successfully');
        
      } else if (mode === 'forgot') {
        const res = await fetch(`${AUTH_API_URL}/api/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, secretWord, newPassword: password })
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Password reset failed');
        }
        
        toast.success('Password reset successfully! Please sign in with your new password.');
        setMode('signIn'); 
        setPassword(''); 
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Authentication failed');
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ 
        backgroundColor: '#070707',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      {/* Background Gradient Effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(10, 132, 255, 0.2), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 120%, rgba(10, 132, 255, 0.15), transparent 60%)',
          opacity: 0.8
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1000px] h-[800px] sm:h-[1000px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(10, 132, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(10, 132, 255, 0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(10, 132, 255, 0.08), transparent 40%)'
        }}
      />

      {/* Auth Card */}
      <div 
        className="w-full max-w-md relative z-10 rounded-2xl border p-6 sm:p-8 md:p-10"
        style={{
          backgroundColor: 'rgba(14, 14, 14, 0.6)',
          borderColor: '#2A2A2A',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(10,132,255,0.6))'
            }}
          >
            <img 
              src={vfxbLogo} 
              alt="VFXB" 
              className="w-full h-full"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>

        {/* Dynamic Title */}
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white', letterSpacing: '-0.02em' }}
        >
          {mode === 'signIn' && 'Welcome Back'}
          {mode === 'signUp' && 'Get Started'}
          {mode === 'forgot' && 'Reset Password'}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-center text-sm sm:text-base mb-6 sm:mb-8" style={{ color: '#999' }}>
          {mode === 'signIn' && 'Sign in to continue to VFXB'}
          {mode === 'signUp' && 'Create your account to start editing with AI'}
          {mode === 'forgot' && 'Enter your email and secret word to reset'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          
          {/* Full Name (Sign Up Only) */}
          {mode === 'signUp' && (
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: '#AAA' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2.5 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base"
                style={{ backgroundColor: 'rgba(14, 14, 14, 0.8)', borderColor: '#2A2A2A', color: 'white' }}
                onFocus={(e) => e.target.style.borderColor = '#0A84FF'}
                onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: '#AAA' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base"
              style={{ backgroundColor: 'rgba(14, 14, 14, 0.8)', borderColor: '#2A2A2A', color: 'white' }}
              onFocus={(e) => e.target.style.borderColor = '#0A84FF'}
              onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
            />
          </div>

          {/* Secret Word Field */}
          {(mode === 'signUp' || mode === 'forgot') && (
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: '#AAA' }}>
                Secret Word (For Password Recovery)
              </label>
              <input
                type="text"
                value={secretWord}
                onChange={(e) => setSecretWord(e.target.value)}
                placeholder="e.g. your childhood pet's name"
                required
                className="w-full px-4 py-2.5 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base"
                style={{ backgroundColor: 'rgba(14, 14, 14, 0.8)', borderColor: '#2A2A2A', color: 'white' }}
                onFocus={(e) => e.target.style.borderColor = '#0A84FF'}
                onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: '#AAA' }}>
              {mode === 'forgot' ? 'Enter New Password' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base"
              style={{ backgroundColor: 'rgba(14, 14, 14, 0.8)', borderColor: '#2A2A2A', color: 'white' }}
              onFocus={(e) => e.target.style.borderColor = '#0A84FF'}
              onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
            />
          </div>

          {/* Forgot Password Link */}
          {mode === 'signIn' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs sm:text-sm hover:underline"
                style={{ color: '#0A84FF' }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base transition-all hover:shadow-[0_0_30px_rgba(10,132,255,0.5)]"
            style={{ backgroundColor: '#0A84FF', color: 'white', fontFamily: 'Syne, sans-serif' }}
          >
            {mode === 'signIn' && 'Sign In'}
            {mode === 'signUp' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </button>

          {/* Social Logins */}
          {mode !== 'forgot' && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-3 my-5 sm:my-6">
                <div className="flex-1 h-px" style={{ backgroundColor: '#2A2A2A' }}></div>
                <span className="text-xs" style={{ color: '#555' }}>OR</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#2A2A2A' }}></div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full py-2.5 sm:py-3 rounded-lg border font-medium text-sm sm:text-base transition-all hover:bg-[#1A1A1A] flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'rgba(14, 14, 14, 0.5)', borderColor: '#2A2A2A', color: 'white' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  className="w-full py-2.5 sm:py-3 rounded-lg border font-medium text-sm sm:text-base transition-all hover:bg-[#1A1A1A] flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'rgba(14, 14, 14, 0.5)', borderColor: '#2A2A2A', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>
            </>
          )}
        </form>

        {/* Dynamic Footer Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm" style={{ color: '#888' }}>
            {mode === 'forgot' ? (
              <button onClick={() => setMode('signIn')} className="font-semibold hover:underline" style={{ color: '#0A84FF' }}>
                Back to Sign In
              </button>
            ) : mode === 'signIn' ? (
              <>Don't have an account? <button onClick={() => setMode('signUp')} className="font-semibold hover:underline" style={{ color: '#0A84FF' }}>Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('signIn')} className="font-semibold hover:underline" style={{ color: '#0A84FF' }}>Sign In</button></>
            )}
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-[10px] sm:text-xs" style={{ color: '#555' }}>
          By continuing, you agree to VFXB's{' '}
          <button className="hover:underline" style={{ color: '#0A84FF' }}>Terms of Service</button>
          {' '}and{' '}
          <button className="hover:underline" style={{ color: '#0A84FF' }}>Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
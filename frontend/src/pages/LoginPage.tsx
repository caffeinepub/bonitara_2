import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useManualAuth } from '../hooks/useManualAuth';
import { Loader2, Eye, EyeOff, LogIn, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { manualLogin, isLoading, error, clearError, isManuallyAuthenticated } = useManualAuth();

  const [activeTab, setActiveTab] = useState<'manual' | 'ii'>('manual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const isAuthenticated = !!identity || isManuallyAuthenticated;

  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '/profile';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    clearError();
    setFormError('');
  }, [activeTab, clearError]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!email.trim()) {
      setFormError('Email or username is required.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }
    const success = await manualLogin(email.trim(), password);
    if (success) {
      window.location.hash = '/profile';
    }
  };

  const handleIILogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('II login error:', err);
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="#/" className="inline-block">
            <img src="/assets/generated/bonitara-logo.dim_400x120.png" alt="BONITARA" className="h-12 mx-auto object-contain" />
          </a>
          <h1 className="font-serif text-3xl text-foreground mt-4 tracking-wide">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your BONITARA account</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-medium tracking-wide transition-colors min-h-[44px] ${
                activeTab === 'manual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Email / Password
            </button>
            <button
              onClick={() => setActiveTab('ii')}
              className={`flex-1 py-4 text-sm font-medium tracking-wide transition-colors min-h-[44px] ${
                activeTab === 'ii'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Internet Identity
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'manual' ? (
              <form onSubmit={handleManualLogin} className="space-y-5">
                {displayError && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                    {displayError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com or admin"
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-11 px-4 pr-11 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                  ) : (
                    <><LogIn className="w-4 h-4" /> Sign In</>
                  )}
                </button>

                {/* Admin hint */}
                <div className="bg-muted/50 rounded-lg p-3 flex gap-2 items-start">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Admin access:</span> Use username <code className="bg-muted px-1 rounded">admin</code> with the admin password.
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">Internet Identity</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sign in securely using the Internet Computer's decentralized identity system. No passwords required.
                  </p>
                </div>

                <button
                  onClick={handleIILogin}
                  disabled={loginStatus === 'logging-in'}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {loginStatus === 'logging-in' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                  ) : (
                    'Sign in with Internet Identity'
                  )}
                </button>
              </div>
            )}

            {/* Register link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <a href="#/register" className="text-primary hover:underline font-medium">
                Create one
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="#/" className="hover:text-foreground transition-colors">← Back to Shop</a>
        </p>
      </div>
    </div>
  );
}

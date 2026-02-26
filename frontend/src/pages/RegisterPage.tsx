import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useManualAuth } from '../hooks/useManualAuth';
import { Loader2, Eye, EyeOff, UserPlus, Shield } from 'lucide-react';

export default function RegisterPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { manualRegister, isLoading, error, clearError, isManuallyAuthenticated } = useManualAuth();

  const [activeTab, setActiveTab] = useState<'manual' | 'ii'>('manual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid email address is required.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const success = await manualRegister(name.trim(), email.trim(), password);
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
          <h1 className="font-serif text-3xl text-foreground mt-4 tracking-wide">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join the BONITARA family today</p>
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
              <form onSubmit={handleRegister} className="space-y-4">
                {displayError && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                    {displayError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full h-11 px-4 pr-11 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                      autoComplete="new-password"
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full h-11 px-4 pr-11 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Create Account</>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">Internet Identity</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Register and sign in securely using the Internet Computer's decentralized identity system. No passwords required.
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
                    'Continue with Internet Identity'
                  )}
                </button>
              </div>
            )}

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <a href="#/login" className="text-primary hover:underline font-medium">
                Sign in
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

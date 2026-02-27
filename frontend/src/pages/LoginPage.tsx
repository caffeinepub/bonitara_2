import React, { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2, Shield, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '/profile';
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="#/" className="inline-block">
            <img src="/assets/generated/bonitara-logo.dim_400x120.png" alt="BONITARA" className="h-12 mx-auto object-contain" />
          </a>
          <h1 className="font-serif text-3xl text-foreground mt-4 tracking-wide">Welcome</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in or create your BONITARA account</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Internet Identity Icon */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-xl text-foreground mb-2">Secure Authentication</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                BONITARA uses Internet Identity — a secure, passwordless authentication system. No email or password needed.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Sign In Button */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
                Returning Customer
              </p>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {isLoggingIn ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                ) : (
                  <><LogIn className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Sign Up Button */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
                New Customer
              </p>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full h-12 border-2 border-primary text-primary rounded-lg font-medium tracking-wide hover:bg-primary/5 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {isLoggingIn ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Create Account</>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Internet Identity handles both sign-in and registration automatically.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="#/" className="hover:text-foreground transition-colors">← Back to Shop</a>
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Lock, Shield } from 'lucide-react';

// Hardcoded admin credentials — change these in the source code to update
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (sessionStorage.getItem('adminSession') === 'true') {
      window.location.hash = '/admin';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    // Simulate a brief loading state for UX
    await new Promise(resolve => setTimeout(resolve, 400));

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminSession', 'true');
      window.location.hash = '/admin';
    } else {
      setError('Invalid username or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <a href="#/" className="inline-block mb-4">
            <img
              src="/assets/generated/bonitara-logo.dim_400x120.png"
              alt="Bonitara"
              className="h-10 mx-auto object-contain"
            />
          </a>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-700" />
            <h1 className="font-serif text-2xl text-stone-800 tracking-wide">Admin Portal</h1>
          </div>
          <p className="text-stone-500 text-sm">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter admin username"
                className="w-full h-11 px-4 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-sm"
                autoComplete="username"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  className="w-full h-11 px-4 pr-11 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-sm"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <><Lock className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          <a href="#/" className="hover:text-stone-600 transition-colors">← Back to Shop</a>
        </p>
      </div>
    </div>
  );
}

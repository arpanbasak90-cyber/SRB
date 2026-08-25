'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // In a real app we would call next-auth signIn here
    // await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
    setTimeout(() => {
      setLoading(false)
      window.location.href = '/' // Mock redirect
    }, 1000)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', email })
      })
      const data = await res.json()
      if (res.ok) {
        setStep('otp')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: otp, password })
      })
      const data = await res.json()
      if (res.ok) {
        // Successfully verified and set password, auto login or redirect to login
        setMode('login')
        setStep('email')
        setPassword('')
        alert('Account created! Please log in.')
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch (err) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center -mt-20">
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Glow behind form */}
        <div className="absolute inset-0 bg-neon-lime/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-noise"></div>
          
          <div className="relative z-10 flex flex-col gap-8">
            <div className="text-center">
              <Link href="/" className="inline-block w-12 h-12 rounded-xl bg-neon-lime text-black flex items-center justify-center font-bold text-2xl font-sans tracking-tighter mx-auto mb-4">
                S
              </Link>
              <h2 className="text-2xl font-bold tracking-tight">{mode === 'login' ? 'Welcome back.' : 'Create an account.'}</h2>
              <p className="text-white/50 text-sm mt-2 font-mono">
                {mode === 'login' ? 'SECURE SYSTEM ACCESS' : 'INITIALIZING NEW USER'}
              </p>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">{error}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-neon-lime/50 transition-colors"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-neon-lime/50 transition-colors"
                />
                <button type="submit" disabled={loading} className="neon-button mt-4 py-3 disabled:opacity-50 text-sm">
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp} className="flex flex-col gap-4">
                {step === 'email' && (
                  <>
                    <input 
                      type="email" 
                      placeholder="Email address"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-neon-lime/50 transition-colors"
                    />
                    <button type="submit" disabled={loading} className="neon-button mt-4 py-3 disabled:opacity-50 text-sm">
                      {loading ? 'Sending OTP...' : 'Continue with Email'}
                    </button>
                  </>
                )}

                {step === 'otp' && (
                  <>
                    <p className="text-sm text-white/70 text-center mb-2">An OTP was sent to {email}. Check console.</p>
                    <input 
                      type="text" 
                      placeholder="6-digit OTP"
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-neon-lime/50 transition-colors font-mono tracking-widest text-center"
                    />
                    <input 
                      type="password" 
                      placeholder="Create a Password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-neon-lime/50 transition-colors mt-2"
                    />
                    <button type="submit" disabled={loading} className="neon-button mt-4 py-3 disabled:opacity-50 text-sm">
                      {loading ? 'Verifying...' : 'Verify & Sign Up'}
                    </button>
                  </>
                )}
              </form>
            )}

            <div className="text-center mt-4">
              <button 
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setStep('email'); setError('') }}
                className="text-white/50 hover:text-neon-lime text-sm transition-colors"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

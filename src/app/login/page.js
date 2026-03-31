"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fallback to mock navigation if real keys aren't added yet
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/dashboard");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '4rem 3rem' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{isLogin ? "Welcome Back" : "Register"}</h1>
          <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>
            {isLogin 
              ? "Access the elite Member Portal" 
              : "Join the Fairway Philanthropy Circle"}
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#f87171', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input 
                type="email" 
                placeholder="member@elite.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '0.75rem', 
                  padding: '1rem 1rem 1rem 3rem', 
                  color: '#fff',
                  outline: 'none',
                  fontSize: '1rem'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '0.75rem', 
                  padding: '1rem 1rem 1rem 3rem', 
                  color: '#fff',
                  outline: 'none',
                  fontSize: '1rem'
                }} 
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Enter Portal" : "Join Circle")}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ opacity: 0.5, marginBottom: '1.5rem' }}>
            {isLogin ? "Seeking membership?" : "Already a member?"}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', marginLeft: '0.5rem' }}
            >
              {isLogin ? "Identify Yourself Here" : "Login Here"}
            </button>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.4 }}>
            <ShieldCheck size={16} />
            Secure Member Authentication
          </div>
        </footer>
      </div>
    </div>
  );
}

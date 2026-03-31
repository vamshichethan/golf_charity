"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ShieldAlert, Loader2, ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
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

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      let { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      const isEnvAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL && authData.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (!isEnvAdmin && (userError || !userData || userData.role !== "admin")) {
        setError("Unauthorized Access. This portal is for Circle Administrators only.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #0c1410 0%, #050a08 100%)', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '4rem 3rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <ShieldAlert size={32} color="#f87171" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Admin Portal</h1>
          <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>
            Restricted Circle Management Interface
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#f87171', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Admin Identifier</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input 
                type="email" 
                placeholder="admin@elite-circle.com" 
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
                  outline: 'none'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Security Key</label>
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
                  outline: 'none'
                }} 
              />
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem', background: '#dc2626', color: '#fff' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authenticate Admin"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Return to User Access
          </Link>
        </footer>
      </div>
    </div>
  );
}

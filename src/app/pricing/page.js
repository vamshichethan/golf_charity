"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, Crown, Shield, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubscribe = async (tier) => {
    setLoading(tier);
    setError(null);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        setError(data.error || "Something went wrong.");
        setLoading(null);
        return;
      }

      router.push("/dashboard?subscription=active");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  };

  const features = [
    "Precision Stableford Tracking",
    "Monthly Elite Sweepstakes",
    "10% Direct Philanthropy",
    "Verified Charity Partners",
    "Priority Member Support",
  ];

  return (
    <div className="container animate-fade" style={{ paddingTop: '6rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2rem' }}>
          Membership Tiers
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '1.5rem' }}>Select Your <span className="text-gradient">Impact</span></h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.6 }}>
          Join the elite Circle. Every membership is a commitment to personal excellence and global change.
        </p>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '1rem', marginBottom: '3rem', textAlign: 'center', color: '#f87171' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Monthly Plan */}
        <div className="glass-panel" style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Monthly</h2>
            <p style={{ opacity: 0.5 }}>The gateway to impact</p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>£</span>
              <span style={{ fontSize: '3.5rem', fontWeight: '700', fontFamily: 'Playfair Display, serif' }}>9.99</span>
              <span style={{ opacity: 0.5 }}>/month</span>
            </div>
          </div>

          <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
            {features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', opacity: 0.8 }}>
                <Check size={18} color="var(--primary)" />
                {f}
              </li>
            ))}
          </ul>

          <button
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}
            onClick={() => handleSubscribe("monthly")}
            disabled={loading !== null}
          >
            {loading === "monthly" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Initiate Membership <ArrowRight size={18} /></>
            )}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="glass-panel" style={{ 
          padding: '3.5rem 3rem', 
          display: 'flex', 
          flexDirection: 'column',
          border: '2px solid var(--primary)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--primary)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            Best Allocation
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <Crown size={32} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Annual</h2>
            <p style={{ opacity: 0.5 }}>Maximize your commitment</p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>£</span>
              <span style={{ fontSize: '3.5rem', fontWeight: '700', fontFamily: 'Playfair Display, serif' }}>99.99</span>
              <span style={{ opacity: 0.5 }}>/year</span>
            </div>
            <p style={{ color: 'var(--primary)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: '600' }}>Save £19.89 annually</p>
          </div>

          <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
            {features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', opacity: 0.8 }}>
                <Check size={18} color="var(--primary)" />
                {f}
              </li>
            ))}
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent)', fontWeight: '600' }}>
              <Sparkles size={18} />
              Elite Membership Status
            </li>
          </ul>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}
            onClick={() => handleSubscribe("yearly")}
            disabled={loading !== null}
          >
            {loading === "yearly" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Claim Elite Status <ArrowRight size={18} /></>
            )}
          </button>
        </div>

      </div>

      <p style={{ textAlign: 'center', marginTop: '6rem', opacity: 0.4, maxWidth: '600px', margin: '6rem auto 0', fontSize: '0.875rem' }}>
        🔒 Secure Member Activation. Cancel anytime through the Member Portal. 
        10% of every membership is directly routed to your chosen philanthropic partner.
      </p>
    </div>
  );
}

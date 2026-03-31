import Link from "next/link";
import { Trophy, Globe, Heart, ChevronRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="animate-fade">
      <section style={{ padding: '8rem 2rem 4rem', textAlign: 'center', position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '-1' }}>
          <img 
            src="/hero.png" 
            alt="Luxury Golf Course" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
          />
          <div style={{ background: 'linear-gradient(rgba(5, 10, 8, 1) 0%, transparent 40%, rgba(5, 10, 8, 1) 100%)', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}></div>
        </div>
        
        <div className="container" style={{ position: 'relative', width: '100%' }}>
          <p style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem' }}>
            The Elite Golfing Circle
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Master the Green. <br />
            <span className="text-gradient">Fuel the Change.</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto 3rem', fontSize: '1.25rem', opacity: 0.7, lineHeight: '1.6' }}>
            The club for those who believe excellence on the fairway should translate to impact in the world. 
            Automated philanthropy, monthly sweepstakes, and precision score tracking.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
              Claim Your Invitation 
              <ChevronRight size={20} />
            </Link>
            <Link href="/charities" className="btn btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
              View Our Impact
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '3rem', transition: 'transform 0.3s' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <Trophy size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>The Monthly Classic</h3>
              <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
                Every month, your best scores enter you into our premium sweepstakes. Winners don't just win for themselves, but for their chosen cause.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '3rem', transition: 'transform 0.3s' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <Globe size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Global Philanthropy</h3>
              <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
                We've partnered with the world's most effective charities. 10% of every membership is directly routed to verified impact programs.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '3rem', transition: 'transform 0.3s' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <Heart size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>The Power of Play</h3>
              <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
                Join a community of players who care. Track your stats, compete with peers, and make every swing count for something bigger.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 2rem' }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center', background: 'linear-gradient(rgba(16, 185, 129, 0.05), rgba(0, 0, 0, 0))' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Elevated Membership</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 3.5rem', opacity: 0.7, fontSize: '1.1rem' }}>
              Unlock the full potential of your game. Access detailed analytics, participate in exclusive events, and maximize your charitable footprint.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ padding: '1.2rem 3rem' }}>
              Level Up Your Game
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

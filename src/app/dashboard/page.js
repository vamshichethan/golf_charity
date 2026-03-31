import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Trophy, Heart, Activity, Award, Plus, Calendar, Target, ExternalLink } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (authError || !user)) {
    redirect("/login");
  }

  // Data fetching
  const { scores, charity, subscription, latestDraw, userWinnings } = await (async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && user) {
      // 1. Subscription
      const { data: subData } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single();
      
      // 2. Scores
      const { data: realScores } = await supabase.from('scores').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5);
      
      // 3. Charity
      const { data: userData } = await supabase.from('users').select('charity_percentage, selected_charity_id, charities(name)').eq('id', user.id).single();
      
      // 4. Latest Draw
      const { data: lastDraw } = await supabase.from('draws').select('*').order('date', { ascending: false }).limit(1).single();
      
      // 5. User Winnings
      const { data: wins } = await supabase.from('winners').select('*, draws(date)').eq('user_id', user.id).order('created_at', { ascending: false });
      
      return { 
        scores: realScores || [], 
        charity: userData?.charities ? { name: userData.charities.name, percentage: userData.charity_percentage } : { name: "None Selected", percentage: 10 },
        subscription: subData,
        latestDraw: lastDraw,
        userWinnings: wins || []
      };
    }
    return { scores: [], charity: { name: "None Selected", percentage: 10 }, subscription: null, latestDraw: null, userWinnings: [] };
  })();

  // Server Action to add a new score
  async function addScore(formData) {
    "use server";
    const scoreVal = formData.get("score");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && scoreVal) {
      const { data: userExists } = await supabase.from('users').select('id').eq('id', user.id).single();
      if (!userExists) {
        await supabase.from('users').insert({ id: user.id, email: user.email, role: 'user' });
      }

      await supabase.from("scores").insert({
        user_id: user.id,
        score: parseInt(scoreVal, 10),
        date: new Date().toISOString()
      });
      
      revalidatePath("/dashboard");
    }
  }

  return (
    <div className="container animate-fade" style={{ paddingTop: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Member <span className="text-gradient">Portal</span></h1>
          <p style={{ opacity: 0.6 }}>Welcome back, {user?.email?.split('@')[0] || 'Member'}. Your performance overview.</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: subscription ? 'var(--primary)' : '#f59e0b' }}></div>
          <span style={{ fontWeight: '600' }}>{subscription ? `Pro (${subscription.tier})` : 'Silver Tier'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        
        {/* Main Stats */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={24} color="var(--primary)" /> Rolling Performance
              </h2>
              <form action={addScore} style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="number" 
                  name="score" 
                  min="1" 
                  max="45" 
                  placeholder="New Score" 
                  required 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '0.75rem', 
                    padding: '0.5rem 1rem', 
                    color: '#fff',
                    width: '120px'
                  }} 
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                  <Plus size={18} /> Add
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
              {scores.map((s, idx) => (
                <div key={s.id} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: idx === 0 ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass)' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'Playfair Display, serif' }}>{s.score}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5 }}>Points</span>
                </div>
              ))}
              {[...Array(Math.max(0, 5 - scores.length))].map((_, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderStyle: 'dashed', opacity: 0.3 }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Pending</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>-</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} color="var(--accent)" /> Latest Sweepstakes
              </h3>
              {latestDraw ? (
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {latestDraw.winning_numbers.map((num, i) => (
                      <div key={i} style={{ width: '40px', height: '40px', background: 'var(--primary)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {num}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.875rem', opacity: 0.5 }}>Completed on {new Date(latestDraw.date).toLocaleDateString()}</p>
                </div>
              ) : (
                <p style={{ opacity: 0.5 }}>Waiting for next draw cycle...</p>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={20} color="#f87171" /> Philanthropy
              </h3>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{charity.name}</p>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: 'var(--primary)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', opacity: 0.6 }}>
                <span>Fixed Contribution</span>
                <span>{charity.percentage}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Info */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/charities" className="btn btn-outline" style={{ justifyContent: 'space-between', width: '100%' }}>
                Change Beneficiary <ExternalLink size={16} />
              </Link>
              <Link href="/pricing" className="btn btn-outline" style={{ justifyContent: 'space-between', width: '100%' }}>
                Membership Plans <Target size={16} />
              </Link>
              <button className="btn btn-outline" style={{ justifyContent: 'space-between', width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                Print Tax Certificate <Calendar size={16} />
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Award size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Pro Status</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.6, marginBottom: '1.5rem' }}>
              Unlock advanced analytics and exclusive tournament entries.
            </p>
            <Link href="/pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Upgrade Now
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

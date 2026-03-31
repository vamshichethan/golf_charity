import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Heart, CheckCircle2, TrendingUp, Globe, Award } from "lucide-react";

export default async function Charities() {
  const supabase = await createClient();
  let charities = [
    {
      id: "mock-1",
      name: "The Green Earth Alliance",
      description: "Leading the transition to sustainable golf course management. We project re-wilding 500+ acres of fairway margins annually to restore local biodiversity.",
      impact: "Climate Action"
    },
    {
      id: "mock-2",
      name: "Future Fairways Foundation",
      description: "Transforming lives through the discipline of golf. Providing world-class coaching and educational scholarships to underprivileged youth globally.",
      impact: "Education & Youth"
    },
    {
      id: "mock-3",
      name: "Water For Life International",
      description: "Implementing precision irrigation technology for courses in water-stressed regions, while funding clean water access for surrounding communities.",
      impact: "Water Security"
    }
  ];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data: realCharities } = await supabase
      .from('charities')
      .select('*')
      .eq('active_status', true);
      
    if (realCharities && realCharities.length > 0) {
      charities = realCharities;
    }
  }

  // Top-level Server Action for charity selection
  async function selectCharity(formData) {
    "use server";
    const charityId = formData.get("charityId");
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (user && charityId) {
      // Ensure user exists in public.users first
      const { data: userExists } = await supabaseServer.from('users').select('id').eq('id', user.id).single();
      if (!userExists) {
        await supabaseServer.from('users').insert({ id: user.id, email: user.email, role: 'user' });
      }
      
      await supabaseServer.from('users').update({ selected_charity_id: charityId }).eq('id', user.id);
      redirect('/dashboard');
    }
  }

  // Get current user's charity if available
  let currentUserCharityId = null;
  const { data: { user } = {} } = await supabase.auth.getUser();
  if (user) {
    const { data: userData } = await supabase.from('users').select('selected_charity_id').eq('id', user.id).single();
    currentUserCharityId = userData?.selected_charity_id;
  }

  return (
    <div className="container animate-fade" style={{ paddingTop: '6rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2rem' }}>
          Philanthropic Strategy
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '1.5rem' }}>Select Your <span className="text-gradient">Legacy</span></h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.6, lineHeight: '1.6' }}>
          Every swing contributes to a greater cause. Choose the organization that will receive your membership's dedicated 10% funding. 
          Transparent reporting, direct impact.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        {charities.map((charity) => (
          <div key={charity.id} className="glass-panel" style={{ 
            padding: '4rem 3rem', 
            position: 'relative', 
            overflow: 'hidden', 
            transition: 'all 0.4s ease',
            border: currentUserCharityId === charity.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
            background: currentUserCharityId === charity.id ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0,0,0,0.4))' : ''
          }}>
            {currentUserCharityId === charity.id && (
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                <CheckCircle2 color="var(--primary)" size={32} />
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                {charity.impact || 'Global Impact'}
              </div>
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{charity.name}</h2>
            <p style={{ opacity: 0.7, lineHeight: '1.8', marginBottom: '3rem', fontSize: '1.05rem' }}>{charity.description}</p>
            
            <form action={selectCharity}>
              <input type="hidden" name="charityId" value={charity.id} />
              <button 
                type="submit" 
                className={`btn ${currentUserCharityId === charity.id ? 'btn-outline' : 'btn-primary'}`}
                style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', opacity: currentUserCharityId === charity.id ? 0.7 : 1 }}
                disabled={currentUserCharityId === charity.id}
              >
                {currentUserCharityId === charity.id ? 'Currently Supporting' : 'Pledge Support'}
                {currentUserCharityId !== charity.id && <TrendingUp size={18} />}
              </button>
            </form>

            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', opacity: 0.5, fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} /> Verified Partner</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={14} /> Tier 1 Impact</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

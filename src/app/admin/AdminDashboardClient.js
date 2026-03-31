"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Users,
  Heart,
  Trophy,
  CreditCard,
  Award,
  LogOut,
  Shield,
  Plus,
  Trash2,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Search,
  ExternalLink,
  Settings,
  Mail,
  Calendar,
  DollarSign
} from "lucide-react";

export default function AdminDashboardClient({
  users,
  charities,
  subscriptions,
  draws,
  winners,
  adminEmail,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddCharity, setShowAddCharity] = useState(false);
  const [charityName, setCharityName] = useState("");
  const [charityDesc, setCharityDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const tabs = [
    { id: "overview", label: "Intelligence", icon: <TrendingUp size={18} /> },
    { id: "users", label: "Member Directory", icon: <Users size={18} /> },
    { id: "charities", label: "Impact Partners", icon: <Heart size={18} /> },
    { id: "subscriptions", label: "Allocations", icon: <CreditCard size={18} /> },
    { id: "draws", label: "Sweepstakes", icon: <Trophy size={18} /> },
    { id: "winners", label: "Disbursements", icon: <Award size={18} /> },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleAddCharity = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const { error } = await supabase.from("charities").insert({
      name: charityName,
      description: charityDesc,
      active_status: true,
    });
    if (!error) {
      setCharityName("");
      setCharityDesc("");
      setShowAddCharity(false);
      router.refresh();
    }
    setActionLoading(false);
  };

  const handleToggleCharity = async (id, currentStatus) => {
    await supabase
      .from("charities")
      .update({ active_status: !currentStatus })
      .eq("id", id);
    router.refresh();
  };

  const handleDeleteCharity = async (id) => {
    if (confirm("Confirm permanent removal of impact partner?")) {
      await supabase.from("charities").delete().eq("id", id);
      router.refresh();
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    await supabase.from("users").update({ role: newRole }).eq("id", userId);
    router.refresh();
  };

  const handleUpdateWinnerPayout = async (id, status) => {
    await supabase
      .from("winners")
      .update({ payout_status: status })
      .eq("id", id);
    router.refresh();
  };

  // Stats
  const totalUsers = users.length;
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length;
  const totalCharities = charities.length;
  const totalDraws = draws.length;
  const pendingPayouts = winners.filter((w) => w.payout_status === "pending").length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      
      {/* Sidebar - Elevated Design */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--glass-border)', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', background: 'rgba(5, 10, 8, 0.5)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ padding: '0.75rem', background: '#dc2626', borderRadius: '0.75rem' }}>
            <Shield size={24} color="#fff" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Fairway <span style={{ color: '#dc2626' }}>Admin</span></span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#f87171' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                fontWeight: activeTab === tab.id ? '600' : '400',
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '0.95rem' }}>{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {adminEmail?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminEmail}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Authorized Admin</p>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'transparent', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p style={{ opacity: 0.5 }}>System Management Interface › {adminEmail}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {activeTab === 'charities' && (
              <button 
                onClick={() => setShowAddCharity(!showAddCharity)}
                className="btn btn-primary" 
                style={{ background: '#dc2626', color: '#fff' }}
              >
                <Plus size={18} /> Partner Registration
              </button>
            )}
            {activeTab === 'draws' && (
                <button 
                onClick={async () => {
                  setActionLoading(true);
                  try {
                    const res = await fetch("/api/draws", { method: "POST", body: JSON.stringify({ strategy: "random" }) });
                    const result = await res.json();
                    if (result.success) {
                      alert(`Draw complete. Disbursements triggered for ${result.winnersCount} members.`);
                      router.refresh();
                    } else { alert("Operational Error: " + result.error); }
                  } catch (err) { alert("Operational Failure. Check terminal."); }
                  setActionLoading(false);
                }}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{ background: '#dc2626', color: '#fff' }}
              >
                {actionLoading ? <RefreshCw className="animate-spin" size={18} /> : <Trophy size={18} />}
                Execute Sweepstakes
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="animate-fade">
          
          {activeTab === "overview" && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                {[
                  { label: "Total Members", value: totalUsers, icon: <Users />, color: 'var(--primary)' },
                  { label: "Active Revenue", value: activeSubscriptions, icon: <DollarSign />, color: '#fbbf24' },
                  { label: "Partner Charities", value: totalCharities, icon: <Heart />, color: '#f87171' },
                  { label: "Draws Executed", value: totalDraws, icon: <Calendar />, color: '#60a5fa' }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'Playfair Display, serif', display: 'block' }}>{stat.value}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Recent Operational Activity</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem' }}>Identifier</th>
                        <th style={{ padding: '1rem' }}>Authentication Role</th>
                        <th style={{ padding: '1rem' }}>Target Philanthropy</th>
                        <th style={{ padding: '1rem' }}>Onboarding Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 8).map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '1.25rem', fontWeight: '600' }}>{u.email}</td>
                          <td style={{ padding: '1.25rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', background: u.role === 'admin' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#f87171' : 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase' }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem', opacity: 0.7 }}>{u.charities?.name || "None Selected"}</td>
                          <td style={{ padding: '1.25rem', opacity: 0.5 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem' }}>Email Address</th>
                        <th style={{ padding: '1rem' }}>Role</th>
                        <th style={{ padding: '1rem' }}>Philanthropy</th>
                        <th style={{ padding: '1rem' }}>Funding %</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '1.25rem', fontWeight: '600' }}>{u.email}</td>
                          <td style={{ padding: '1.25rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', background: u.role === 'admin' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#f87171' : 'rgba(255,255,255,0.6)', fontWeight: '700' }}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem', opacity: 0.7 }}>{u.charities?.name || "—"}</td>
                          <td style={{ padding: '1.25rem', opacity: 0.7 }}>{u.charity_percentage}%</td>
                          <td style={{ padding: '1.25rem' }}>
                            <button 
                              onClick={() => handleChangeUserRole(u.id, u.role === "admin" ? "user" : "admin")}
                              style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                               <RefreshCw size={12} /> {u.role === "admin" ? "Revoke Admin" : "Grant Admin"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          )}

          {activeTab === "charities" && (
            <>
              {showAddCharity && (
                <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem', borderLeft: '4px solid #dc2626' }}>
                  <h3 style={{ marginBottom: '2rem' }}>Register New Impact Partner</h3>
                  <form onSubmit={handleAddCharity} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700' }}>Legal Name</label>
                      <input 
                        className="form-input" 
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                        value={charityName}
                        onChange={(e) => setCharityName(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700' }}>Mission Objectives</label>
                      <textarea 
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                        value={charityDesc}
                        onChange={(e) => setCharityDesc(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                       <button type="button" onClick={() => setShowAddCharity(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                       <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ background: '#dc2626', color: '#fff' }}>
                         {actionLoading ? "Processing..." : "Confirm Final Registration"}
                       </button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                {charities.map((c) => (
                  <div key={c.id} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                       <h3 style={{ fontSize: '1.5rem' }}>{c.name}</h3>
                       <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', background: c.active_status ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', color: c.active_status ? 'var(--primary)' : 'rgba(255,255,255,0.5)', fontWeight: '700' }}>
                          {c.active_status ? 'OPERATIONAL' : 'DEACTIVATED'}
                       </span>
                    </div>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2.5rem', flex: 1, lineHeight: '1.6' }}>{c.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                      <button onClick={() => handleToggleCharity(c.id, c.active_status)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <RefreshCw size={14} /> {c.active_status ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeleteCharity(c.id)} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Purge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "winners" && (
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem' }}>Recipient</th>
                        <th style={{ padding: '1rem' }}>Draw Reference</th>
                        <th style={{ padding: '1rem' }}>Match Accuracy</th>
                        <th style={{ padding: '1rem' }}>Disbursement</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {winners.map((w) => (
                        <tr key={w.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '1.25rem', fontWeight: '600' }}>{w.users?.email}</td>
                          <td style={{ padding: '1.25rem', opacity: 0.6 }}>{w.draws?.date ? new Date(w.draws.date).toLocaleDateString() : '—'}</td>
                          <td style={{ padding: '1.25rem', fontWeight: '600' }}>{w.match_type}</td>
                          <td style={{ padding: '1.25rem', color: 'var(--primary)', fontWeight: '700' }}>£{parseFloat(w.payout_amount).toFixed(2)}</td>
                          <td style={{ padding: '1.25rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', background: w.payout_status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : w.payout_status === 'pending' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: w.payout_status === 'paid' ? 'var(--primary)' : w.payout_status === 'pending' ? '#fbbf24' : '#f87171', fontWeight: '700' }}>
                               {w.payout_status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem' }}>
                            {w.payout_status === 'pending' && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleUpdateWinnerPayout(w.id, "paid")} style={{ background: 'var(--primary)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', color: '#000', fontWeight: '700' }}>Resolve</button>
                                <button onClick={() => handleUpdateWinnerPayout(w.id, "rejected")} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', color: '#f87171' }}>Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem' }}>Principal Member</th>
                        <th style={{ padding: '1rem' }}>Allocation Tier</th>
                        <th style={{ padding: '1rem' }}>Subscription ID</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Renewal Data</th>
                        <th style={{ padding: '1rem' }}>Enrollment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '1.25rem', fontWeight: '600' }}>{s.users?.email}</td>
                          <td style={{ padding: '1.25rem' }}>
                             <span style={{ padding: '0.25rem 0.5rem', background: s.tier === 'yearly' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)', color: s.tier === 'yearly' ? '#fbbf24' : '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                                {s.tier?.toUpperCase()}
                             </span>
                          </td>
                          <td style={{ padding: '1.25rem', opacity: 0.5, fontFamily: 'monospace' }}>#{s.id.slice(0, 8)}</td>
                          <td style={{ padding: '1.25rem' }}>
                             <span style={{ color: s.status === 'active' ? 'var(--primary)' : '#f87171', fontWeight: '600' }}>{s.status.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: '1.25rem', opacity: 0.6 }}>{s.next_renewal ? new Date(s.next_renewal).toLocaleDateString() : 'Continuous'}</td>
                          <td style={{ padding: '1.25rem', opacity: 0.5 }}>{new Date(s.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          )}

          {activeTab === "draws" && (
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem' }}>Sweepstakes Date</th>
                        <th style={{ padding: '1rem' }}>Methodology</th>
                        <th style={{ padding: '1rem' }}>Winning Sequence</th>
                        <th style={{ padding: '1rem' }}>Elite Pool (5)</th>
                        <th style={{ padding: '1rem' }}>Match 4 Pool</th>
                        <th style={{ padding: '1rem' }}>Publication</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draws.map((d) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '1.25rem', fontWeight: '600' }}>{new Date(d.date).toLocaleString()}</td>
                          <td style={{ padding: '1.25rem', opacity: 0.7 }}>{d.type.toUpperCase()}</td>
                          <td style={{ padding: '1.25rem' }}>
                             <div style={{ display: 'flex', gap: '0.4rem' }}>
                               {d.winning_numbers?.map((num, i) => (
                                 <span key={i} style={{ width: '24px', height: '24px', background: '#dc2626', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>{num}</span>
                               ))}
                             </div>
                          </td>
                          <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>£{parseFloat(d.pool_5_match).toFixed(2)}</td>
                          <td style={{ padding: '1.25rem', opacity: 0.7 }}>£{parseFloat(d.pool_4_match).toFixed(2)}</td>
                          <td style={{ padding: '1.25rem' }}>
                             <span style={{ padding: '0.2rem 0.5rem', background: d.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)', color: d.status === 'published' ? 'var(--primary)' : '#fbbf24', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                                {d.status.toUpperCase()}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

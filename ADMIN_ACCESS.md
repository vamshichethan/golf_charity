# 🛡️ Circle Intelligence: Admin Access Guide

The administrative layer of **Fairway Philanthropy** has been upgraded to a high-security, luxury command center. Below is how you can access and manage the internal network.

## 1. Promoting Your Account to Admin
Since you are the owner, you need to manually grant your user account the `admin` role in your Supabase dashboard.

### Via Supabase SQL Editor:
Run the following SQL command in your Supabase dashboard:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'laharinaik13@gmail.com';
```

## 2. Accessing the Admin Portal
Once promoted, navigate to the restricted entry point:
- **URL**: `http://localhost:3000/admin`
- **Redirects**: If you are not an admin, you will be redirected to the secure **Admin Login**.

## 3. Command Center Capabilities
The new **Circle Intelligence** dashboard allows you to:

### 👤 Member Directory
- Monitor all registered members of the elite circle.
- Manage roles and grant/revoke administrative privileges.
- View individual philanthropic choices and contribution history.

### 🤝 Impact Partners (Charities)
- Register new global charities (Impact Partners).
- Deactivate or purge partners that no longer meet the Circle's standards.
- Edit mission statements and track partner status.

### 🏆 Sweepstakes Engine
- **Execute Draws**: Manually trigger the monthly sweepstakes algorithm.
- **Winning Sequences**: View winning numbers and member matches.
- **Disbursements**: Track and approve prize payouts to lucky members.

### 📊 Intelligence Overview
- Real-time snapshots of member growth, active allocations (subscriptions), and total philanthropic impact.

> [!IMPORTANT]
> The admin portal uses a distinct security-focused design language (Deep Red) to ensure you always know when you are in a privileged management state.

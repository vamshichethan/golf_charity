-- RESET DATABASE (Optional: Uncomment to purge old data)
-- DROP TRIGGER IF EXISTS enforce_max_5_scores ON public.scores;
-- DROP TABLE IF EXISTS public.winners;
-- DROP TABLE IF EXISTS public.draws;
-- DROP TABLE IF EXISTS public.scores;
-- DROP TABLE IF EXISTS public.subscriptions;
-- DROP TABLE IF EXISTS public.users;
-- DROP TABLE IF EXISTS public.charities;

-- ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHARITIES TABLE (Impact Partners)
CREATE TABLE IF NOT EXISTS public.charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    active_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USERS TABLE (Circle Members)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    selected_charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
    charity_percentage NUMERIC (5,2) DEFAULT 10.00 CHECK (charity_percentage >= 10.00 AND charity_percentage <= 100.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SUBSCRIPTIONS TABLE (Allocations)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_id TEXT UNIQUE, 
    status TEXT NOT NULL DEFAULT 'active',
    tier TEXT CHECK (tier IN ('monthly', 'yearly')),
    next_renewal TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SCORES TABLE (Performance Tracking)
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 45),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. AUTO-CLEANUP FUNCTION (Rolling 5 Scores)
CREATE OR REPLACE FUNCTION maintain_last_5_scores() 
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.scores
  WHERE id IN (
    SELECT id FROM public.scores
    WHERE user_id = NEW.user_id
    ORDER BY date DESC, created_at DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_max_5_scores ON public.scores;
CREATE TRIGGER enforce_max_5_scores
AFTER INSERT ON public.scores
FOR EACH ROW EXECUTE PROCEDURE maintain_last_5_scores();

-- 6. DRAWS TABLE (Sweepstakes Engine)
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT CHECK (type IN ('random', 'algorithmic')) NOT NULL,
    pool_5_match NUMERIC (10,2) DEFAULT 0.00,
    pool_4_match NUMERIC (10,2) DEFAULT 0.00,
    pool_3_match NUMERIC (10,2) DEFAULT 0.00,
    winning_numbers INT[] NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. WINNERS TABLE (Disbursements)
CREATE TABLE IF NOT EXISTS public.winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_type TEXT NOT NULL CHECK (match_type IN ('5-number', '4-number', '3-number')),
    payout_amount NUMERIC (10,2) NOT NULL,
    proof_url TEXT,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INITIAL DATA SEEDING (Premium Partners)
-- Use ON CONFLICT to avoid duplicate seeding errors
INSERT INTO public.charities (name, description, active_status) 
VALUES
('The Green Earth Alliance', 'Leading sustainable golf through ecosystem restoration and re-wilding programs.', true),
('Future Fairways Foundation', 'Elite coaching and life-trajectory scholarships for global youth development.', true),
('Water For Life International', 'Precision irrigation engineering and clean water access in water-stressed regions.', true)
ON CONFLICT DO NOTHING;


UPDATE public.users 
SET role = 'admin' 
WHERE email = 'laharinaik13@gmail.com';
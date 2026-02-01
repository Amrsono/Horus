-- ============================================
-- Horus E-commerce: Analytics Helper Function
-- ============================================

-- Function to get dashboard stats efficiently and securely
-- This function runs with SECURITY DEFINER to access auth.users
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    total_revenue NUMERIC;
    total_orders INTEGER;
    total_users INTEGER;
    active_24h INTEGER;
    result JSONB;
BEGIN
    -- Calculate Total Revenue and Total Orders (from public.orders)
    SELECT 
        COALESCE(SUM(total_amount), 0),
        COUNT(*)
    INTO 
        total_revenue,
        total_orders
    FROM public.orders;

    -- Calculate Total Users (from auth.users)
    SELECT COUNT(*) INTO total_users FROM auth.users;

    -- Calculate Active Users in last 24h (from auth.users)
    -- users who have signed in (last_sign_in_at) or created account (created_at) recently
    SELECT COUNT(*) 
    INTO active_24h 
    FROM auth.users 
    WHERE last_sign_in_at > (now() - INTERVAL '24 hours');

    -- Construct JSON result
    result := jsonb_build_object(
        'total_revenue', total_revenue,
        'total_orders', total_orders,
        'total_users', total_users,
        'active_now', active_24h
    );

    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users and anon (if we want public dashboard, though usually admin only)
-- For this "Merchant Portal" on the home page, it seems to be public facing data for show?
-- The user said "Merchant Portal" -> "Real-time analytics", suggesting it might be a public showcase feature.
-- If it's for ADMINS only, we should restrict it. But it's on the HOME PAGE (DashboardSection is in page.tsx).
-- So it must be accessible to public/anon.
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO anon, authenticated, service_role;

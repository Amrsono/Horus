import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });


        // Fetch users with pagination (fetch all)
        let users: any[] = [];
        try {
            const { data, error } = await supabase.auth.admin.listUsers({
                page: 1,
                perPage: 1000
            });
            if (error) {
                console.error('Error fetching auth users (check service role key):', error);
            } else {
                users = data.users || [];
            }
        } catch (e) {
            console.error('Exception fetching auth users:', e);
        }

        console.log('Fetched users count:', users.length);

        // Fetch orders - rely on this if auth fails
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('guest_email, total_amount, created_at');

        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            // If orders fail, we can't show much sales data, but maybe we have users
            // If both fail, return error
            if (users.length === 0) {
                return NextResponse.json({ error: ordersError.message }, { status: 500 });
            }
        }

        const customerMap = new Map<string, { orders: number; spent: number; lastActive: string; status: string }>();

        // Add registered users
        if (users) {
            users.forEach(user => {
                const email = user.email || 'Unknown';
                const userStatus = (user.user_metadata?.status) || 'active';

                customerMap.set(email, {
                    orders: 0,
                    spent: 0,
                    lastActive: user.created_at || new Date().toISOString(),
                    status: userStatus
                });
            });
        }

        // Process orders
        if (orders) {
            orders.forEach(order => {
                const email = order.guest_email || 'Unknown';
                const existing = customerMap.get(email) || {
                    orders: 0,
                    spent: 0,
                    lastActive: order.created_at,
                    status: 'active'
                };

                customerMap.set(email, {
                    orders: existing.orders + 1,
                    spent: existing.spent + Number(order.total_amount),
                    lastActive: new Date(order.created_at) > new Date(existing.lastActive)
                        ? order.created_at
                        : existing.lastActive,
                    status: existing.status
                });
            });
        }

        const customersArray = Array.from(customerMap.entries())
            .map(([email, data]) => ({
                email,
                totalOrders: data.orders,
                totalSpent: data.spent,
                lastActive: data.lastActive,
                status: data.status
            }))
            .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

        return NextResponse.json(customersArray);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

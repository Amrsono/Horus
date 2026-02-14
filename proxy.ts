import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 1. Path Categorization
    const isMaintenancePage = path === "/maintenance";
    const isLoginPage = path === "/login";
    const isAdminPath = path.startsWith("/admin");
    const isAuthPath = path.startsWith("/auth");
    const isStaticAsset = path.includes(".") || path.startsWith("/_next") || path.startsWith("/api") || path.startsWith("/favicon.ico");

    // 2. CHECK MAINTENANCE MODE (Server-side check)
    // We fetch from the 'site_config' table
    let maintenanceEnabled = false;

    try {
        const { data } = await supabase
            .from('site_config')
            .select('value')
            .eq('key', 'maintenance_mode')
            .single();

        maintenanceEnabled = data?.value === "true";
    } catch (e) {
        // Default to false if table doesn't exist or query fails
        maintenanceEnabled = false;
    }

    if (maintenanceEnabled && !isMaintenancePage && !isAdminPath && !isLoginPage && !isAuthPath && !isStaticAsset) {
        // Redirection logic: Admins bypass
        const isAdminUser = user?.email === "admin@horus.com";
        if (!isAdminUser) {
            return NextResponse.redirect(new URL("/maintenance", request.url));
        }
    }

    // 3. Protected Admin Routes
    if (isAdminPath) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (user.email !== "admin@horus.com") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 4. Protected Profile Routes
    if (path.startsWith("/profile")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

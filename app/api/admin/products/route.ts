import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Uses the service role key — server-side only, never exposed to browser
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!serviceKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.");
    }
    return createClient(url, serviceKey);
}

// POST /api/admin/products — create a product
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = getServiceClient();
        const { data, error } = await supabase.from("products").insert([body]).select();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data });
    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}

// PATCH /api/admin/products — update a product
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...fields } = body;
        if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

        const supabase = getServiceClient();
        const { data, error } = await supabase
            .from("products")
            .update(fields)
            .eq("id", id)
            .select();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data });
    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}

// DELETE /api/admin/products?id=xxx — delete a product
export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

        const supabase = getServiceClient();
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}

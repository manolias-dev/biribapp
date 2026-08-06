import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = requireAuth();
  if (r) return r;
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name, location, default_teams, default_target_score, created_at, closed_at")
    .order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ rooms: data });
}

export async function POST(req) {
  const r = requireAuth();
  if (r) return r;
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return Response.json({ error: "Name required" }, { status: 400 });
  const insert = {
    name,
    location: typeof body.location === "string" ? body.location.trim() || null : null,
    default_teams: Array.isArray(body.default_teams) ? body.default_teams : [],
    default_target_score: Number(body.default_target_score) || 3000,
  };
  const { data, error } = await supabase.from("rooms").insert(insert).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ room: data });
}

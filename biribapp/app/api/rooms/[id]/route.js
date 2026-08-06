import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const r = requireAuth();
  if (r) return r;
  const body = await req.json().catch(() => ({}));
  const update = {};
  if (typeof body.name === "string") update.name = body.name.trim();
  if (body.location === null || typeof body.location === "string") {
    update.location = body.location ? String(body.location).trim() : null;
  }
  if (Array.isArray(body.default_teams)) update.default_teams = body.default_teams;
  if (Number.isFinite(body.default_target_score)) update.default_target_score = body.default_target_score;
  if (body.closed_at === null || typeof body.closed_at === "string") update.closed_at = body.closed_at;
  if (Object.keys(update).length === 0) {
    return Response.json({ error: "No fields to update" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("rooms")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ room: data });
}

export async function DELETE(_req, { params }) {
  const r = requireAuth();
  if (r) return r;
  // Games in this room cascade-delete via the FK, which also cascades their rounds.
  const { error } = await supabase.from("rooms").delete().eq("id", params.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

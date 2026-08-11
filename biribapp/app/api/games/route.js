import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = requireAuth();
  if (r) return r;
  const { data: games, error: gErr } = await supabase
    .from("games")
    .select("id, room_id, name, target_score, teams, seating, shuffle_start, atou_card, created_at, finished_at")
    .order("created_at", { ascending: false });
  if (gErr) return Response.json({ error: gErr.message }, { status: 500 });

  const ids = games.map((g) => g.id);
  let roundsByGame = {};
  if (ids.length > 0) {
    const { data: rounds, error: rErr } = await supabase
      .from("rounds")
      .select("id, game_id, scores, meta, edited_at, at")
      .in("game_id", ids)
      .order("at", { ascending: true });
    if (rErr) return Response.json({ error: rErr.message }, { status: 500 });
    for (const rd of rounds) {
      if (!roundsByGame[rd.game_id]) roundsByGame[rd.game_id] = [];
      roundsByGame[rd.game_id].push(rd);
    }
  }

  const result = games.map((g) => ({ ...g, rounds: roundsByGame[g.id] || [] }));
  return Response.json({ games: result });
}

export async function POST(req) {
  const r = requireAuth();
  if (r) return r;
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return Response.json({ error: "Name required" }, { status: 400 });
  const insert = {
    name,
    target_score: Number(body.target_score) || 3000,
    teams: Array.isArray(body.teams) ? body.teams : [],
  };
  if (body.room_id) insert.room_id = body.room_id;
  if (Array.isArray(body.seating)) insert.seating = body.seating;
  if (Number.isFinite(body.shuffle_start)) insert.shuffle_start = body.shuffle_start;
  if (body.atou_card === null || (body.atou_card && typeof body.atou_card === "object")) insert.atou_card = body.atou_card;
  const { data, error } = await supabase.from("games").insert(insert).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ game: { ...data, rounds: [] } });
}

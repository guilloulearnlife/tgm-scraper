import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const AUTH_KEY = process.env.API_SECRET;
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  if (req.headers.get('x-api-key') !== AUTH_KEY) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const secteur = searchParams.get('secteur');
  const ville = searchParams.get('ville');
  const pays = searchParams.get('pays');
  const limit = parseInt(searchParams.get('limit') || '25');

  let query = supabase
    .from('prospects_email')
    .select('*')
    .eq('statut', 'NOUVEAU')
    .not('email', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (secteur) query = query.eq('secteur', secteur);
  if (ville) query = query.eq('ville', ville);
  if (pays) query = query.eq('pays', pays);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, count: data.length, leads: data });
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-api-key') !== AUTH_KEY) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const leads = await req.json();
  if (!Array.isArray(leads)) {
    return NextResponse.json({ error: 'Array de leads requis' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('prospects_email')
    .upsert(leads, { onConflict: 'email' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, saved: leads.length });
}

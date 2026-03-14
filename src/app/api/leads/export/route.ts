import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const AUTH_KEY = process.env.API_SECRET;
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (req.headers.get('x-api-key') !== AUTH_KEY) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = params;
  const { statut } = await req.json();

  const validStatuts = ['NOUVEAU', 'EMAIL_ENVOYE', 'REFUSÉ', 'REPONDU', 'CONVERTI'];
  if (!validStatuts.includes(statut)) {
    return NextResponse.json({ error: `Statut invalide. Valeurs: ${validStatuts.join(', ')}` }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('prospects_email')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, lead: data });
}

import { NextRequest, NextResponse } from 'next/server';

const AUTH_KEY = process.env.API_SECRET;
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function POST(req: NextRequest) {
  // Auth
  if (req.headers.get('x-api-key') !== AUTH_KEY) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { query, ville, pays, secteur, max_results = 20 } = await req.json();
  if (!query) return NextResponse.json({ error: 'query requis' }, { status: 400 });

  try {
    const results: any[] = [];
    let pageToken: string | null = null;

    // Google Places Text Search
    do {
      const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
      url.searchParams.set('query', query);
      url.searchParams.set('language', 'fr');
      url.searchParams.set('key', GOOGLE_KEY!);
      if (pageToken) url.searchParams.set('pagetoken', pageToken);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API: ${data.status} - ${data.error_message || ''}`);
      }

      const places = data.results || [];

      for (const place of places) {
        if (results.length >= max_results) break;

        // Détails du lieu pour avoir website + phone
        const detailUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailUrl.searchParams.set('place_id', place.place_id);
        detailUrl.searchParams.set('fields', 'name,website,formatted_phone_number,formatted_address,rating,user_ratings_total,types,url');
        detailUrl.searchParams.set('language', 'fr');
        detailUrl.searchParams.set('key', GOOGLE_KEY!);

        const detailRes = await fetch(detailUrl.toString());
        const detailData = await detailRes.json();
        const d = detailData.result || {};

        if (!d.website) continue; // Skip sans site web
        if (d.website.includes('facebook.com')) continue;
        if (d.website.includes('instagram.com')) continue;

        const domaine = d.website
          .replace(/^https?:\/\//, '')
          .replace(/\/.*$/, '')
          .replace(/^www\./, '');

        results.push({
          nom_entreprise: d.name || place.name,
          site_web: d.website,
          domaine,
          telephone: d.formatted_phone_number || null,
          adresse: d.formatted_address || null,
          note_google: d.rating || null,
          nb_avis: d.user_ratings_total || null,
          google_maps_url: d.url || null,
          ville: ville || null,
          pays: pays || null,
          secteur: secteur || null,
          place_id: place.place_id,
          date: new Date().toISOString().split('T')[0]
        });

        // Pause pour éviter rate limit
        await new Promise(r => setTimeout(r, 200));
      }

      pageToken = data.next_page_token || null;
      if (pageToken) await new Promise(r => setTimeout(r, 2000)); // Google exige 2s entre pages

    } while (pageToken && results.length < max_results);

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

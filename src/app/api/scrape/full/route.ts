import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const AUTH_KEY = process.env.API_SECRET;
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const IGNORED = ['gmail.com','hotmail.com','yahoo.com','outlook.com','example.com','sentry.io','w3.org'];
const CONTACT_PATHS = ['','/contact','/nous-contacter','/contactez-nous','/a-propos','/mentions-legales'];

async function fetchEmails(siteUrl: string, domaine: string): Promise<string[]> {
  const found = new Set<string>();
  const base = siteUrl.replace(/\/$/, '');
  for (const path of CONTACT_PATHS) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(6000)
      });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);
      ($.text().match(EMAIL_REGEX) || []).forEach(e => found.add(e.toLowerCase()));
      $('a[href^="mailto:"]').each((_, el) => {
        const email = ($(el).attr('href') || '').replace('mailto:','').split('?')[0].trim();
        if (email.includes('@')) found.add(email.toLowerCase());
      });
      if (path.includes('contact') && found.size > 0) break;
      await new Promise(r => setTimeout(r, 400));
    } catch { continue; }
  }
  return Array.from(found)
    .filter(e => {
      const d = e.split('@')[1];
      return d && !IGNORED.some(ig => d.includes(ig));
    })
    .sort((a, b) => {
      const aD = a.split('@')[1], bD = b.split('@')[1];
      if (domaine && aD === domaine) return -1;
      if (domaine && bD === domaine) return 1;
      const pro = ['contact','info','hello','direction','admin'];
      return (pro.some(p => b.startsWith(p)) ? 1 : 0) - (pro.some(p => a.startsWith(p)) ? 1 : 0);
    })
    .slice(0, 2);
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-api-key') !== AUTH_KEY) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { query, ville, pays, secteur, max_results = 15 } = await req.json();
  if (!query) return NextResponse.json({ error: 'query requis' }, { status: 400 });

  try {
    // Étape 1 — Google Places
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.set('query', query);
    url.searchParams.set('language', 'fr');
    url.searchParams.set('key', GOOGLE_KEY!);
    const placesRes = await fetch(url.toString());
    const placesData = await placesRes.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places: ${placesData.status}`);
    }

    const places = (placesData.results || []).slice(0, max_results);
    const leadsWithEmail = [];

    // Étape 2 — Pour chaque lieu, récupère site + email
    for (const place of places) {
      try {
        const detailUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailUrl.searchParams.set('place_id', place.place_id);
        detailUrl.searchParams.set('fields', 'name,website,formatted_phone_number,formatted_address,rating,user_ratings_total');
        detailUrl.searchParams.set('key', GOOGLE_KEY!);

        const detailRes = await fetch(detailUrl.toString());
        const detailData = await detailRes.json();
        const d = detailData.result || {};

        if (!d.website) continue;
        if (d.website.includes('facebook.com') || d.website.includes('instagram.com')) continue;

        const domaine = d.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');

        // Étape 3 — Extrait emails du site
        const emails = await fetchEmails(d.website, domaine);
        if (emails.length === 0) continue;

        leadsWithEmail.push({
          nom_entreprise: d.name || place.name,
          site_web: d.website,
          domaine,
          email: emails[0],
          emails_trouves: emails,
          telephone: d.formatted_phone_number || null,
          adresse: d.formatted_address || null,
          note_google: d.rating || null,
          nb_avis: d.user_ratings_total || null,
          place_id: place.place_id,
          ville: ville || null,
          pays: pays || null,
          secteur: secteur || null,
          email_source: 'website_scraping',
          statut: 'NOUVEAU',
          date: new Date().toISOString().split('T')[0]
        });

        await new Promise(r => setTimeout(r, 300));
      } catch { continue; }
    }

    return NextResponse.json({
      success: true,
      total_scanned: places.length,
      count: leadsWithEmail.length,
      data: leadsWithEmail
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

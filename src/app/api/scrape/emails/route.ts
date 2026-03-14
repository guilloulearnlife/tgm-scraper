import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const AUTH_KEY = process.env.API_SECRET;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const IGNORED_DOMAINS = ['gmail.com','hotmail.com','yahoo.com','outlook.com','example.com','sentry.io','w3.org'];
const CONTACT_PATHS = ['', '/contact', '/nous-contacter', '/contactez-nous', '/a-propos', '/mentions-legales'];

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'fr-FR,fr;q=0.9'
      },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow'
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractEmails(html: string, domaine: string): string[] {
  const $ = cheerio.load(html);
  const found = new Set<string>();

  // Texte brut
  const text = $.text();
  (text.match(EMAIL_REGEX) || []).forEach(e => found.add(e.toLowerCase()));

  // Liens mailto
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const email = href.replace('mailto:', '').split('?')[0].trim();
    if (email.includes('@')) found.add(email.toLowerCase());
  });

  // Filtrer
  return Array.from(found)
    .filter(email => {
      const d = email.split('@')[1];
      if (!d) return false;
      if (IGNORED_DOMAINS.some(ig => d.includes(ig))) return false;
      return true;
    })
    .sort((a, b) => {
      const aD = a.split('@')[1];
      const bD = b.split('@')[1];
      // Emails du même domaine en premier
      if (domaine && aD === domaine) return -1;
      if (domaine && bD === domaine) return 1;
      // Emails pro en premier
      const proPrefix = ['contact','info','hello','bonjour','direction','admin'];
      const aP = proPrefix.some(p => a.startsWith(p));
      const bP = proPrefix.some(p => b.startsWith(p));
      if (aP && !bP) return -1;
      if (!aP && bP) return 1;
      return 0;
    })
    .slice(0, 3);
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-api-key') !== AUTH_KEY) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { sites } = await req.json();
  if (!sites || !Array.isArray(sites)) {
    return NextResponse.json({ error: 'sites[] requis' }, { status: 400 });
  }

  const results: any[] = [];

  for (const site of sites) {
    const baseUrl = (site.site_web || '').replace(/\/$/, '');
    if (!baseUrl) continue;

    const allEmails = new Set<string>();

    for (const path of CONTACT_PATHS) {
      const html = await fetchPage(`${baseUrl}${path}`);
      if (!html) continue;

      const emails = extractEmails(html, site.domaine || '');
      emails.forEach(e => allEmails.add(e));

      // Si on trouve des emails sur /contact, stop
      if (path.includes('contact') && allEmails.size > 0) break;

      await new Promise(r => setTimeout(r, 500));
    }

    const emailList = Array.from(allEmails).slice(0, 3);

    if (emailList.length > 0) {
      results.push({
        ...site,
        email: emailList[0],
        emails_trouves: emailList,
        email_source: 'website_scraping'
      });
    }
  }

  return NextResponse.json({ success: true, count: results.length, data: results });
}

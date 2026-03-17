import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import { detectTechnologies } from '../../../../utils/tech-detector';

// Configuration Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configuration Google Places API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

interface ScrapedProspect {
  nom_entreprise: string;
  site_web?: string;
  domaine?: string;
  email?: string;
  emails_trouves?: string[];
  telephone?: string;
  adresse?: string;
  note_google?: number;
  nb_avis?: number;
  ville?: string;
  pays?: string;
  secteur?: string;
  technologies_detectees?: any;
  niveau_digital?: string;
  a_chatbot?: boolean;
  a_formulaire_contact?: boolean;
  statut: string;
}

/**
 * Route API pour scraper les prospects avec détection de technologies
 */
export async function POST(req: NextRequest) {
  try {
    const { query, location, secteur } = await req.json();

    if (!query || !location) {
      return NextResponse.json(
        { error: 'query et location sont requis' },
        { status: 400 }
      );
    }

    console.log(`🔍 Recherche: "${query}" à ${location}`);

    // 1. Recherche sur Google Places
    const placesResults = await searchGooglePlaces(query, location);
    
    if (!placesResults || placesResults.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun résultat trouvé',
        prospects: [],
      });
    }

    console.log(`📍 ${placesResults.length} établissements trouvés`);

    // 2. Scraper chaque prospect
    const prospects: ScrapedProspect[] = [];
    
    for (const place of placesResults) {
      try {
        const prospect = await scrapeProspect(place, secteur);
        prospects.push(prospect);
        
        // Délai entre chaque scraping (éviter rate limiting)
        await sleep(1500);
      } catch (error) {
        console.error(`❌ Erreur scraping ${place.name}:`, error);
      }
    }

    // 3. Sauvegarder dans Supabase
    const { data, error } = await supabase
      .from('prospects_email')
      .insert(prospects)
      .select();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde', details: error },
        { status: 500 }
      );
    }

    console.log(`✅ ${prospects.length} prospects sauvegardés`);

    // 4. Statistiques sur les technologies détectées
    const stats = calculateTechStats(prospects);

    return NextResponse.json({
      success: true,
      message: `${prospects.length} prospects scrapés et analysés`,
      prospects: data,
      stats,
    });

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Recherche sur Google Places API
 */
async function searchGooglePlaces(query: string, location: string) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query + ' ' + location
  )}&key=${GOOGLE_PLACES_API_KEY}&language=fr`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    console.error('Google Places API error:', data.status);
    return [];
  }

  return data.results || [];
}

/**
 * Scrape un prospect individuel avec détection de technologies
 */
async function scrapeProspect(place: any, secteur?: string): Promise<ScrapedProspect> {
  const prospect: ScrapedProspect = {
    nom_entreprise: place.name,
    adresse: place.formatted_address,
    note_google: place.rating,
    nb_avis: place.user_ratings_total,
    ville: extractCity(place.formatted_address),
    pays: 'Cameroun',
    secteur: secteur || 'Non défini',
    statut: 'nouveau',
  };

  // Extraire le téléphone
  if (place.formatted_phone_number) {
    prospect.telephone = place.formatted_phone_number;
  }

  // Récupérer les détails de l'établissement
  const placeDetails = await getPlaceDetails(place.place_id);
  
  if (placeDetails?.website) {
    prospect.site_web = placeDetails.website;
    prospect.domaine = extractDomain(placeDetails.website);

    // 🔥 SCRAPER LE SITE WEB + DÉTECTER LES TECHNOLOGIES
    try {
      const siteData = await scrapeWebsite(placeDetails.website);
      
      // Emails
      prospect.email = siteData.primaryEmail;
      prospect.emails_trouves = siteData.allEmails;

      // Technologies détectées
      prospect.technologies_detectees = siteData.techDetection.technologies_detectees;
      prospect.niveau_digital = siteData.techDetection.niveau_digital;
      prospect.a_chatbot = siteData.techDetection.a_chatbot;
      prospect.a_formulaire_contact = siteData.techDetection.a_formulaire_contact;


    } catch (error) {
      console.error(`❌ Erreur scraping site ${placeDetails.website}:`, error);
    }
  }

  return prospect;
}

/**
 * Récupère les détails d'un lieu via Google Places API
 */
async function getPlaceDetails(placeId: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website,formatted_phone_number&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Erreur getPlaceDetails:', error);
    return null;
  }
}

/**
 * Scrape un site web pour extraire emails + détecter technologies
 */
async function scrapeWebsite(url: string) {
  try {
    // Fetch avec headers réalistes
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const html = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Extraction des emails
    const $ = cheerio.load(html);
    const emails = extractEmails(html, $);

    // 🔥 DÉTECTION DES TECHNOLOGIES
    const techDetection = await detectTechnologies(html, headers, url);

    return {
      primaryEmail: emails[0] || undefined,
      allEmails: emails,
      techDetection,
    };

  } catch (error) {
    console.error('Erreur scrapeWebsite:', error);
    return {
      primaryEmail: undefined,
      allEmails: [],
      techDetection: {
        technologies_detectees: {},
        niveau_digital: 'basique',
        a_chatbot: false,
        a_formulaire_contact: false,
      },
    };
  }
}

/**
 * Extrait les emails d'une page web
 */
function extractEmails(html: string, $: cheerio.CheerioAPI): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = new Set<string>();

  // 1. Chercher dans le HTML brut
  const matches = html.match(emailRegex);
  if (matches) {
    matches.forEach(email => {
      // Filtrer les emails génériques/inutiles
      if (!isGenericEmail(email)) {
        emails.add(email.toLowerCase());
      }
    });
  }

  // 2. Chercher dans les liens mailto:
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      const email = href.replace('mailto:', '').split('?')[0];
      if (!isGenericEmail(email)) {
        emails.add(email.toLowerCase());
      }
    }
  });

  return Array.from(emails);
}

/**
 * Filtre les emails génériques
 */
function isGenericEmail(email: string): boolean {
  const genericPatterns = [
    'noreply', 'no-reply', 'mailer-daemon', 'postmaster',
    'example.com', 'test@', 'admin@localhost',
    'wix.com', 'squarespace.com', 'wordpress.com',
  ];

  return genericPatterns.some(pattern => email.includes(pattern));
}

/**
 * Extrait le nom de domaine d'une URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Extrait la ville d'une adresse
 */
function extractCity(address: string): string {
  // Format typique: "123 Rue, Ville, Pays"
  const parts = address.split(',');
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim();
  }
  return '';
}

/**
 * Délai entre requêtes
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calcule des statistiques sur les technologies détectées
 */
function calculateTechStats(prospects: ScrapedProspect[]) {
  const stats = {
    total: prospects.length,
    avec_site: prospects.filter(p => p.site_web).length,
    avec_email: prospects.filter(p => p.email).length,
    avec_chatbot: prospects.filter(p => p.a_chatbot).length,
    niveau_digital: {
      basique: prospects.filter(p => p.niveau_digital === 'basique').length,
      intermédiaire: prospects.filter(p => p.niveau_digital === 'intermédiaire').length,
      avancé: prospects.filter(p => p.niveau_digital === 'avancé').length,
    },
    cms: {} as Record<string, number>,
    cibles_ideales: 0, // Wix/WordPress basique + sans chatbot
  };

  // Compter les CMS
  prospects.forEach(p => {
    if (p.technologies_detectees?.cms) {
      const cms = p.technologies_detectees?.cms || "N/A";
      stats.cms[cms] = (stats.cms[cms] || 0) + 1;
    }
  });

  // Cibles idéales pour TGM
  stats.cibles_ideales = prospects.filter(p => {
    const cms = p.technologies_detectees?.cms;
    const basiqueCMS = ['Wix', 'WordPress', 'Squarespace'].includes(cms || '');
    const pasDeChatbot = !p.a_chatbot;
    return basiqueCMS && pasDeChatbot;
  }).length;

  return stats;
}

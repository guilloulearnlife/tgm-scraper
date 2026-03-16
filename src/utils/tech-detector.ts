import * as cheerio from 'cheerio';

interface TechDetectionResult {
  technologies_detectees: {
    cms?: string;
    crm?: string[];
    frameworks?: string[];
    analytics?: string[];
    marketing?: string[];
    ecommerce?: string;
  };
  niveau_digital: 'basique' | 'intermédiaire' | 'avancé';
  a_chatbot: boolean;
  a_formulaire_contact: boolean;
}

/**
 * Détecte les technologies utilisées sur un site web
 */
export async function detectTechnologies(
  html: string,
  headers: Record<string, string>,
  url: string
): Promise<TechDetectionResult> {
  const $ = cheerio.load(html);
  const htmlLower = html.toLowerCase();
  
  const result: TechDetectionResult = {
    technologies_detectees: {},
    niveau_digital: 'basique',
    a_chatbot: false,
    a_formulaire_contact: false,
  };

  // === DÉTECTION CMS ===
  result.technologies_detectees.cms = detectCMS($, htmlLower, headers);

  // === DÉTECTION CRM ===
  result.technologies_detectees.crm = detectCRM($, htmlLower);

  // === DÉTECTION FRAMEWORKS ===
  result.technologies_detectees.frameworks = detectFrameworks($, htmlLower);

  // === DÉTECTION ANALYTICS ===
  result.technologies_detectees.analytics = detectAnalytics($, htmlLower);

  // === DÉTECTION MARKETING ===
  result.technologies_detectees.marketing = detectMarketing($, htmlLower);

  // === DÉTECTION E-COMMERCE ===
  result.technologies_detectees.ecommerce = detectEcommerce($, htmlLower);

  // === DÉTECTION CHATBOT ===
  result.a_chatbot = detectChatbot($, htmlLower);

  // === DÉTECTION FORMULAIRE ===
  result.a_formulaire_contact = detectContactForm($);

  // === CALCUL NIVEAU DIGITAL ===
  result.niveau_digital = calculateDigitalLevel(result);

  return result;
}

/**
 * Détecte le CMS utilisé
 */
function detectCMS($: cheerio.CheerioAPI, html: string, headers: Record<string, string>): string | undefined {
  // WordPress
  if (
    html.includes('wp-content') ||
    html.includes('wp-includes') ||
    html.includes('wordpress') ||
    $('meta[name="generator"]').attr('content')?.includes('WordPress')
  ) {
    return 'WordPress';
  }

  // Wix
  if (
    html.includes('wix.com') ||
    html.includes('_wix') ||
    html.includes('parastorage.com') ||
    $('meta[name="generator"]').attr('content')?.includes('Wix')
  ) {
    return 'Wix';
  }

  // Shopify
  if (
    html.includes('shopify') ||
    html.includes('cdn.shopify.com') ||
    $('meta[name^="shopify-"]').length > 0 ||
    headers['x-shopify-stage']
  ) {
    return 'Shopify';
  }

  // Squarespace
  if (
    html.includes('squarespace') ||
    html.includes('static.squarespace.com') ||
    $('meta[name="generator"]').attr('content')?.includes('Squarespace')
  ) {
    return 'Squarespace';
  }

  // Webflow
  if (
    html.includes('webflow') ||
    html.includes('assets.website-files.com') ||
    $('meta[name="generator"]').attr('content')?.includes('Webflow')
  ) {
    return 'Webflow';
  }

  // Drupal
  if (
    html.includes('drupal') ||
    $('meta[name="generator"]').attr('content')?.includes('Drupal')
  ) {
    return 'Drupal';
  }

  // Joomla
  if (
    html.includes('joomla') ||
    $('meta[name="generator"]').attr('content')?.includes('Joomla')
  ) {
    return 'Joomla';
  }

  // PrestaShop
  if (html.includes('prestashop') || html.includes('presta-')) {
    return 'PrestaShop';
  }

  // Custom (pas de CMS détecté)
  return 'Custom';
}

/**
 * Détecte les CRM
 */
function detectCRM($: cheerio.CheerioAPI, html: string): string[] {
  const crms: string[] = [];

  if (html.includes('hubspot') || html.includes('hs-analytics')) {
    crms.push('HubSpot');
  }

  if (html.includes('salesforce') || html.includes('force.com')) {
    crms.push('Salesforce');
  }

  if (html.includes('zoho') || html.includes('zohocrm')) {
    crms.push('Zoho');
  }

  if (html.includes('pipedrive')) {
    crms.push('Pipedrive');
  }

  if (html.includes('activecampaign')) {
    crms.push('ActiveCampaign');
  }

  return crms;
}

/**
 * Détecte les frameworks frontend
 */
function detectFrameworks($: cheerio.CheerioAPI, html: string): string[] {
  const frameworks: string[] = [];

  if (html.includes('react') || $('#__next').length > 0 || $('[data-reactroot]').length > 0) {
    frameworks.push('React');
  }

  if (html.includes('next') || html.includes('_next')) {
    frameworks.push('Next.js');
  }

  if (html.includes('nuxt') || html.includes('__nuxt')) {
    frameworks.push('Nuxt');
  }

  if ($('[ng-version]').length > 0 || html.includes('angular')) {
    frameworks.push('Angular');
  }

  if (html.includes('vue') || $('[data-v-]').length > 0) {
    frameworks.push('Vue.js');
  }

  return frameworks;
}

/**
 * Détecte les outils analytics
 */
function detectAnalytics($: cheerio.CheerioAPI, html: string): string[] {
  const analytics: string[] = [];

  if (html.includes('google-analytics') || html.includes('gtag') || html.includes('ga.js')) {
    analytics.push('Google Analytics');
  }

  if (html.includes('googletagmanager') || html.includes('gtm.js')) {
    analytics.push('Google Tag Manager');
  }

  if (html.includes('hotjar')) {
    analytics.push('Hotjar');
  }

  if (html.includes('matomo') || html.includes('piwik')) {
    analytics.push('Matomo');
  }

  if (html.includes('clarity.ms') || html.includes('microsoft clarity')) {
    analytics.push('Microsoft Clarity');
  }

  return analytics;
}

/**
 * Détecte les outils marketing
 */
function detectMarketing($: cheerio.CheerioAPI, html: string): string[] {
  const marketing: string[] = [];

  if (html.includes('mailchimp')) {
    marketing.push('Mailchimp');
  }

  if (html.includes('sendinblue') || html.includes('brevo')) {
    marketing.push('Brevo/Sendinblue');
  }

  if (html.includes('intercom')) {
    marketing.push('Intercom');
  }

  if (html.includes('drift')) {
    marketing.push('Drift');
  }

  if (html.includes('facebook pixel') || html.includes('fbevents.js')) {
    marketing.push('Facebook Pixel');
  }

  return marketing;
}

/**
 * Détecte la plateforme e-commerce
 */
function detectEcommerce($: cheerio.CheerioAPI, html: string): string | undefined {
  if (html.includes('shopify')) return 'Shopify';
  if (html.includes('woocommerce')) return 'WooCommerce';
  if (html.includes('prestashop')) return 'PrestaShop';
  if (html.includes('magento')) return 'Magento';
  if (html.includes('bigcommerce')) return 'BigCommerce';
  return undefined;
}

/**
 * Détecte la présence d'un chatbot
 */
function detectChatbot($: cheerio.CheerioAPI, html: string): boolean {
  // Patterns courants de chatbots
  const chatbotIndicators = [
    'intercom',
    'drift',
    'tawk.to',
    'crisp.chat',
    'zendesk',
    'livechat',
    'tidio',
    'olark',
    'freshchat',
    'chatbot',
    'messenger-plugin',
    'chatbase',
    'landbot',
    'botpress',
  ];

  // Chercher dans le HTML
  const hasInHTML = chatbotIndicators.some(indicator => html.includes(indicator));

  // Chercher des éléments DOM typiques
  const hasChatWidget = $(
    '[class*="chat"], [id*="chat"], [class*="messenger"], [id*="messenger"], [class*="bot"], [id*="bot"]'
  ).length > 0;

  return hasInHTML || hasChatWidget;
}

/**
 * Détecte la présence d'un formulaire de contact
 */
function detectContactForm($: cheerio.CheerioAPI): boolean {
  // Chercher des formulaires avec des champs email
  const forms = $('form');
  
  for (let i = 0; i < forms.length; i++) {
    const form = $(forms[i]);
    const hasEmail = form.find('input[type="email"], input[name*="email"], input[id*="email"]').length > 0;
    const hasMessage = form.find('textarea, input[name*="message"], input[id*="message"]').length > 0;
    
    if (hasEmail && hasMessage) {
      return true;
    }
  }

  // Alternative : chercher des patterns dans les classes/IDs
  const contactPatterns = $(
    '[class*="contact-form"], [id*="contact-form"], [class*="contactform"], [id*="contactform"]'
  );
  
  return contactPatterns.length > 0;
}

/**
 * Calcule le niveau digital global
 */
function calculateDigitalLevel(result: TechDetectionResult): 'basique' | 'intermédiaire' | 'avancé' {
  let score = 0;

  // CMS moderne = +2
  if (['Webflow', 'Custom'].includes(result.technologies_detectees.cms || '')) {
    score += 2;
  }
  // CMS basique = +0
  else if (['Wix', 'Squarespace'].includes(result.technologies_detectees.cms || '')) {
    score += 0;
  }
  // CMS intermédiaire = +1
  else {
    score += 1;
  }

  // Framework moderne = +2
  if (result.technologies_detectees.frameworks && result.technologies_detectees.frameworks.length > 0) {
    score += 2;
  }

  // CRM = +2
  if (result.technologies_detectees.crm && result.technologies_detectees.crm.length > 0) {
    score += 2;
  }

  // Analytics = +1
  if (result.technologies_detectees.analytics && result.technologies_detectees.analytics.length > 0) {
    score += 1;
  }

  // Chatbot = +1
  if (result.a_chatbot) {
    score += 1;
  }

  // Marketing automation = +1
  if (result.technologies_detectees.marketing && result.technologies_detectees.marketing.length > 0) {
    score += 1;
  }

  // Calcul final
  if (score <= 2) return 'basique';
  if (score <= 5) return 'intermédiaire';
  return 'avancé';
}

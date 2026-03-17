'use client';
import { useState, useEffect } from 'react';

const TARGETS = [
  // === FRANCE - Grandes villes ===
  { pays: 'France', ville: 'Paris', secteur: 'agence_marketing', query: 'agence marketing digital Paris' },
  { pays: 'France', ville: 'Paris', secteur: 'agence_immobiliere', query: 'agence immobilière promoteur Paris' },
  { pays: 'France', ville: 'Paris', secteur: 'cabinet_comptable', query: 'cabinet comptable expertise Paris' },
  { pays: 'France', ville: 'Paris', secteur: 'cabinet_juridique', query: 'cabinet avocat notaire Paris' },
  { pays: 'France', ville: 'Paris', secteur: 'coaching', query: 'coach professionnel consultant Paris' },
  
  { pays: 'France', ville: 'Lyon', secteur: 'agence_marketing', query: 'agence communication marketing Lyon' },
  { pays: 'France', ville: 'Lyon', secteur: 'cabinet_comptable', query: 'cabinet comptable expertise Lyon' },
  { pays: 'France', ville: 'Lyon', secteur: 'formation', query: 'organisme formation professionnelle Lyon' },
  { pays: 'France', ville: 'Lyon', secteur: 'agence_immobiliere', query: 'agence immobilière Lyon' },
  
  { pays: 'France', ville: 'Marseille', secteur: 'agence_marketing', query: 'agence marketing digital Marseille' },
  { pays: 'France', ville: 'Marseille', secteur: 'cabinet_juridique', query: 'cabinet avocat Marseille' },
  { pays: 'France', ville: 'Marseille', secteur: 'agence_immobiliere', query: 'agence immobilière Marseille' },
  
  { pays: 'France', ville: 'Toulouse', secteur: 'agence_web', query: 'agence web développement Toulouse' },
  { pays: 'France', ville: 'Toulouse', secteur: 'cabinet_juridique', query: 'cabinet avocat notaire Toulouse' },
  { pays: 'France', ville: 'Toulouse', secteur: 'formation', query: 'centre formation Toulouse' },
  
  { pays: 'France', ville: 'Bordeaux', secteur: 'formation', query: 'organisme formation professionnelle Bordeaux' },
  { pays: 'France', ville: 'Bordeaux', secteur: 'agence_marketing', query: 'agence marketing Bordeaux' },
  { pays: 'France', ville: 'Bordeaux', secteur: 'cabinet_comptable', query: 'expert comptable Bordeaux' },
  
  { pays: 'France', ville: 'Nice', secteur: 'agence_immobiliere', query: 'agence immobilière Nice' },
  { pays: 'France', ville: 'Nice', secteur: 'coaching', query: 'coach professionnel Nice' },
  
  { pays: 'France', ville: 'Nantes', secteur: 'agence_web', query: 'agence web digital Nantes' },
  { pays: 'France', ville: 'Nantes', secteur: 'formation', query: 'organisme formation Nantes' },
  
  { pays: 'France', ville: 'Strasbourg', secteur: 'cabinet_juridique', query: 'cabinet avocat Strasbourg' },
  { pays: 'France', ville: 'Rennes', secteur: 'agence_marketing', query: 'agence marketing Rennes' },
  { pays: 'France', ville: 'Lille', secteur: 'cabinet_comptable', query: 'expert comptable Lille' },
  
  // === BELGIQUE ===
  { pays: 'Belgique', ville: 'Bruxelles', secteur: 'agence_web', query: 'agence web développement digital Bruxelles' },
  { pays: 'Belgique', ville: 'Bruxelles', secteur: 'agence_marketing', query: 'agence marketing communication Bruxelles' },
  { pays: 'Belgique', ville: 'Bruxelles', secteur: 'cabinet_comptable', query: 'cabinet comptable fiduciaire Bruxelles' },
  { pays: 'Belgique', ville: 'Bruxelles', secteur: 'coaching', query: 'coach professionnel consultant Bruxelles' },
  { pays: 'Belgique', ville: 'Bruxelles', secteur: 'formation', query: 'organisme formation Bruxelles' },
  
  { pays: 'Belgique', ville: 'Anvers', secteur: 'agence_marketing', query: 'agence marketing Anvers' },
  { pays: 'Belgique', ville: 'Liège', secteur: 'cabinet_juridique', query: 'cabinet avocat Liège' },
  { pays: 'Belgique', ville: 'Gand', secteur: 'agence_web', query: 'agence web Gand' },
  
  // === SUISSE ===
  { pays: 'Suisse', ville: 'Genève', secteur: 'consultant_b2b', query: 'cabinet conseil stratégie Genève' },
  { pays: 'Suisse', ville: 'Genève', secteur: 'cabinet_comptable', query: 'fiduciaire expert comptable Genève' },
  { pays: 'Suisse', ville: 'Genève', secteur: 'agence_immobiliere', query: 'agence immobilière Genève' },
  { pays: 'Suisse', ville: 'Genève', secteur: 'coaching', query: 'coach business professionnel Genève' },
  
  { pays: 'Suisse', ville: 'Lausanne', secteur: 'agence_marketing', query: 'agence marketing digital Lausanne' },
  { pays: 'Suisse', ville: 'Lausanne', secteur: 'formation', query: 'organisme formation Lausanne' },
  
  { pays: 'Suisse', ville: 'Zurich', secteur: 'consultant_b2b', query: 'cabinet conseil Zurich' },
  { pays: 'Suisse', ville: 'Zurich', secteur: 'agence_web', query: 'agence web Zurich' },
  
  // === LUXEMBOURG ===
  { pays: 'Luxembourg', ville: 'Luxembourg', secteur: 'cabinet_comptable', query: 'fiduciaire cabinet comptable Luxembourg' },
  { pays: 'Luxembourg', ville: 'Luxembourg', secteur: 'consultant_b2b', query: 'cabinet conseil Luxembourg' },
  { pays: 'Luxembourg', ville: 'Luxembourg', secteur: 'agence_marketing', query: 'agence marketing Luxembourg' },
  
  // === CANADA - QUÉBEC ===
  { pays: 'Canada', ville: 'Montréal', secteur: 'agence_marketing', query: 'agence marketing digital Montréal' },
  { pays: 'Canada', ville: 'Montréal', secteur: 'agence_web', query: 'agence web développement Montréal' },
  { pays: 'Canada', ville: 'Montréal', secteur: 'cabinet_comptable', query: 'cabinet comptable CPA Montréal' },
  { pays: 'Canada', ville: 'Montréal', secteur: 'formation', query: 'organisme formation Montréal' },
  { pays: 'Canada', ville: 'Montréal', secteur: 'agence_immobiliere', query: 'agence immobilière courtier Montréal' },
  
  { pays: 'Canada', ville: 'Québec', secteur: 'agence_marketing', query: 'agence marketing Québec' },
  { pays: 'Canada', ville: 'Québec', secteur: 'cabinet_juridique', query: 'cabinet avocat notaire Québec' },
  
  { pays: 'Canada', ville: 'Gatineau', secteur: 'formation', query: 'centre formation Gatineau' },
  { pays: 'Canada', ville: 'Laval', secteur: 'agence_immobiliere', query: 'agence immobilière Laval' },
  
  // === CAMEROUN ===
  { pays: 'Cameroun', ville: 'Douala', secteur: 'microfinance', query: 'microfinance institution financière Douala' },
  { pays: 'Cameroun', ville: 'Douala', secteur: 'agence_immobiliere', query: 'agence immobilière promoteur Douala' },
  { pays: 'Cameroun', ville: 'Douala', secteur: 'ecole_privee', query: 'école privée institut formation Douala' },
  { pays: 'Cameroun', ville: 'Douala', secteur: 'cabinet_comptable', query: 'cabinet comptable expertise Douala' },
  { pays: 'Cameroun', ville: 'Douala', secteur: 'agence_marketing', query: 'agence marketing communication Douala' },
  { pays: 'Cameroun', ville: 'Douala', secteur: 'clinique', query: 'clinique centre médical Douala' },
  
  { pays: 'Cameroun', ville: 'Yaoundé', secteur: 'microfinance', query: 'microfinance établissement crédit Yaoundé' },
  { pays: 'Cameroun', ville: 'Yaoundé', secteur: 'agence_immobiliere', query: 'agence immobilière Yaoundé' },
  { pays: 'Cameroun', ville: 'Yaoundé', secteur: 'ecole_privee', query: 'école privée université Yaoundé' },
  { pays: 'Cameroun', ville: 'Yaoundé', secteur: 'cabinet_juridique', query: 'cabinet avocat conseil juridique Yaoundé' },
  { pays: 'Cameroun', ville: 'Yaoundé', secteur: 'formation', query: 'centre formation professionnelle Yaoundé' },
  { pays: 'Cameroun', ville: 'Yaoundé', secteur: 'clinique', query: 'clinique polyclinique Yaoundé' },
  
  { pays: 'Cameroun', ville: 'Bafoussam', secteur: 'microfinance', query: 'microfinance Bafoussam' },
  { pays: 'Cameroun', ville: 'Garoua', secteur: 'agence_immobiliere', query: 'agence immobilière Garoua' },
  
  // === SÉNÉGAL ===
  { pays: 'Sénégal', ville: 'Dakar', secteur: 'immobilier', query: 'promoteur immobilier agence Dakar' },
  { pays: 'Sénégal', ville: 'Dakar', secteur: 'microfinance', query: 'microfinance institution financière Dakar' },
  { pays: 'Sénégal', ville: 'Dakar', secteur: 'agence_marketing', query: 'agence marketing digital Dakar' },
  { pays: 'Sénégal', ville: 'Dakar', secteur: 'ecole_privee', query: 'école privée formation Dakar' },
  { pays: 'Sénégal', ville: 'Dakar', secteur: 'cabinet_comptable', query: 'cabinet comptable expertise Dakar' },
  { pays: 'Sénégal', ville: 'Dakar', secteur: 'agence_web', query: 'agence web digital Dakar' },
  
  { pays: 'Sénégal', ville: 'Thiès', secteur: 'formation', query: 'centre formation Thiès' },
  { pays: 'Sénégal', ville: 'Saint-Louis', secteur: 'agence_immobiliere', query: 'agence immobilière Saint-Louis' },
  
  // === CÔTE D'IVOIRE ===
  { pays: "Côte d'Ivoire", ville: 'Abidjan', secteur: 'ecole_privee', query: 'école privée université Abidjan' },
  { pays: "Côte d'Ivoire", ville: 'Abidjan', secteur: 'microfinance', query: 'microfinance institution Abidjan' },
  { pays: "Côte d'Ivoire", ville: 'Abidjan', secteur: 'agence_immobiliere', query: 'agence immobilière promoteur Abidjan' },
  { pays: "Côte d'Ivoire", ville: 'Abidjan', secteur: 'agence_marketing', query: 'agence marketing communication Abidjan' },
  { pays: "Côte d'Ivoire", ville: 'Abidjan', secteur: 'cabinet_comptable', query: 'cabinet comptable expertise Abidjan' },
  { pays: "Côte d'Ivoire", ville: 'Abidjan', secteur: 'formation', query: 'centre formation professionnelle Abidjan' },
  
  { pays: "Côte d'Ivoire", ville: 'Bouaké', secteur: 'ecole_privee', query: 'école privée Bouaké' },
  { pays: "Côte d'Ivoire", ville: 'Yamoussoukro', secteur: 'formation', query: 'centre formation Yamoussoukro' },
  
  // === BÉNIN ===
  { pays: 'Bénin', ville: 'Cotonou', secteur: 'microfinance', query: 'microfinance institution Cotonou' },
  { pays: 'Bénin', ville: 'Cotonou', secteur: 'agence_immobiliere', query: 'agence immobilière Cotonou' },
  { pays: 'Bénin', ville: 'Cotonou', secteur: 'ecole_privee', query: 'école privée formation Cotonou' },
  { pays: 'Bénin', ville: 'Cotonou', secteur: 'agence_marketing', query: 'agence marketing Cotonou' },
  
  // === TOGO ===
  { pays: 'Togo', ville: 'Lomé', secteur: 'microfinance', query: 'microfinance Lomé' },
  { pays: 'Togo', ville: 'Lomé', secteur: 'agence_immobiliere', query: 'agence immobilière Lomé' },
  { pays: 'Togo', ville: 'Lomé', secteur: 'ecole_privee', query: 'école privée Lomé' },
  
  // === BURKINA FASO ===
  { pays: 'Burkina Faso', ville: 'Ouagadougou', secteur: 'microfinance', query: 'microfinance Ouagadougou' },
  { pays: 'Burkina Faso', ville: 'Ouagadougou', secteur: 'agence_immobiliere', query: 'agence immobilière Ouagadougou' },
  { pays: 'Burkina Faso', ville: 'Ouagadougou', secteur: 'formation', query: 'centre formation Ouagadougou' },
  
  // === MALI ===
  { pays: 'Mali', ville: 'Bamako', secteur: 'microfinance', query: 'microfinance Bamako' },
  { pays: 'Mali', ville: 'Bamako', secteur: 'agence_immobiliere', query: 'agence immobilière Bamako' },
  { pays: 'Mali', ville: 'Bamako', secteur: 'ecole_privee', query: 'école privée Bamako' },
  
  // === NIGER ===
  { pays: 'Niger', ville: 'Niamey', secteur: 'microfinance', query: 'microfinance Niamey' },
  { pays: 'Niger', ville: 'Niamey', secteur: 'formation', query: 'centre formation Niamey' },
  
  // === GABON ===
  { pays: 'Gabon', ville: 'Libreville', secteur: 'agence_immobiliere', query: 'agence immobilière Libreville' },
  { pays: 'Gabon', ville: 'Libreville', secteur: 'microfinance', query: 'microfinance Libreville' },
  { pays: 'Gabon', ville: 'Libreville', secteur: 'ecole_privee', query: 'école privée Libreville' },
  
  // === CONGO-BRAZZAVILLE ===
  { pays: 'Congo', ville: 'Brazzaville', secteur: 'agence_immobiliere', query: 'agence immobilière Brazzaville' },
  { pays: 'Congo', ville: 'Brazzaville', secteur: 'microfinance', query: 'microfinance Brazzaville' },
  
  // === RDC ===
  { pays: 'RD Congo', ville: 'Kinshasa', secteur: 'microfinance', query: 'microfinance Kinshasa' },
  { pays: 'RD Congo', ville: 'Kinshasa', secteur: 'agence_immobiliere', query: 'agence immobilière Kinshasa' },
  { pays: 'RD Congo', ville: 'Kinshasa', secteur: 'ecole_privee', query: 'école privée université Kinshasa' },
  
  // === MADAGASCAR ===
  { pays: 'Madagascar', ville: 'Antananarivo', secteur: 'microfinance', query: 'microfinance Antananarivo' },
  { pays: 'Madagascar', ville: 'Antananarivo', secteur: 'agence_immobiliere', query: 'agence immobilière Antananarivo' },
  { pays: 'Madagascar', ville: 'Antananarivo', secteur: 'formation', query: 'centre formation Antananarivo' },
  
  // === MAURICE ===
  { pays: 'Maurice', ville: 'Port-Louis', secteur: 'agence_marketing', query: 'agence marketing Port-Louis' },
  { pays: 'Maurice', ville: 'Port-Louis', secteur: 'cabinet_comptable', query: 'cabinet comptable Port-Louis' },
  
  // === MAROC (francophone) ===
  { pays: 'Maroc', ville: 'Casablanca', secteur: 'agence_marketing', query: 'agence marketing digital Casablanca' },
  { pays: 'Maroc', ville: 'Casablanca', secteur: 'agence_immobiliere', query: 'agence immobilière Casablanca' },
  { pays: 'Maroc', ville: 'Casablanca', secteur: 'formation', query: 'centre formation Casablanca' },
  
  { pays: 'Maroc', ville: 'Rabat', secteur: 'cabinet_comptable', query: 'cabinet comptable expertise Rabat' },
  { pays: 'Maroc', ville: 'Marrakech', secteur: 'agence_marketing', query: 'agence marketing Marrakech' },
  
  // === TUNISIE (francophone) ===
  { pays: 'Tunisie', ville: 'Tunis', secteur: 'agence_web', query: 'agence web développement Tunis' },
  { pays: 'Tunisie', ville: 'Tunis', secteur: 'agence_marketing', query: 'agence marketing Tunis' },
  { pays: 'Tunisie', ville: 'Tunis', secteur: 'formation', query: 'centre formation Tunis' },
  
  // === ALGÉRIE (francophone) ===
  { pays: 'Algérie', ville: 'Alger', secteur: 'agence_immobiliere', query: 'agence immobilière Alger' },
  { pays: 'Algérie', ville: 'Alger', secteur: 'formation', query: 'centre formation Alger' },
  { pays: 'Algérie', ville: 'Oran', secteur: 'agence_marketing', query: 'agence marketing Oran' },
];

type Lead = {
  id: number;
  nom_entreprise: string;
  site_web: string;
  email: string;
  ville: string;
  pays: string;
  secteur: string;
  note_google: number;
  statut: string;
  created_at: string;
};

type Log = { time: string; msg: string; type: 'info' | 'success' | 'error' };

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({ total: 0, withEmail: 0, sent: 0 });
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [maxResults, setMaxResults] = useState(10);

  const log = (msg: string, type: Log['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('fr-FR');
    setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 50));
  };

  const runScraper = async () => {
    if (!apiKey) { log('⚠️ Entrez votre clé API', 'error'); return; }
    setRunning(true);
    const target = TARGETS[selectedTarget];
    log(`🚀 Démarrage scraping: ${target.query}`);

    try {
      // Étape 1: Google Maps
      log(`📍 Recherche Google Maps...`);
      const mapsRes = await fetch('/api/scrape/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ ...target, max_results: maxResults })
      });
      const mapsData = await mapsRes.json();

      if (!mapsData.success) throw new Error(mapsData.error);
      log(`✅ ${mapsData.count} entreprises avec site web trouvées`, 'success');

      // Étape 2: Extraction emails
      log(`📧 Extraction emails des sites...`);
      const emailRes = await fetch('/api/scrape/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ sites: mapsData.data })
      });
      const emailData = await emailRes.json();
      log(`✅ ${emailData.count} emails trouvés`, 'success');

      // Étape 3: Sauvegarde Supabase
      if (emailData.count > 0) {
        log(`💾 Sauvegarde dans Supabase...`);
        await fetch('/api/leads/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify(emailData.data.map((l: any) => ({ ...l, statut: 'NOUVEAU' })))
        });
        log(`✅ ${emailData.count} leads sauvegardés`, 'success');
        await loadLeads();
      }

    } catch (err: any) {
      log(`❌ Erreur: ${err.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  const loadLeads = async () => {
    if (!apiKey) return;
    const res = await fetch('/api/leads/export?limit=50', {
      headers: { 'x-api-key': apiKey }
    });
    const data = await res.json();
    if (data.leads) {
      setLeads(data.leads);
      setStats({
        total: data.leads.length,
        withEmail: data.leads.filter((l: Lead) => l.email).length,
        sent: data.leads.filter((l: Lead) => l.statut === 'EMAIL_ENVOYE').length
      });
    }
  };

  const secteurLabel: Record<string, string> = {
    agence_marketing: 'Marketing', cabinet_comptable: 'Comptable',
    agence_immobiliere: 'Immobilier', formation: 'Formation',
    cabinet_juridique: 'Juridique', agence_web: 'Web',
    consultant_b2b: 'Conseil B2B', microfinance: 'Microfinance',
    immobilier: 'Immobilier', ecole_privee: 'Éducation'
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>⚡ TGM</div>
          <div style={styles.logoSub}>LEAD SCRAPER</div>
        </div>
        <div style={styles.headerStats}>
          <StatBadge label="LEADS" value={stats.total} color="#7c3aed" />
          <StatBadge label="EMAILS" value={stats.withEmail} color="#059669" />
          <StatBadge label="ENVOYÉS" value={stats.sent} color="#d97706" />
        </div>
      </header>

      <div style={styles.main}>
        {/* Panel gauche - contrôles */}
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔑 CONFIGURATION</div>
            <input
              style={styles.input}
              type="password"
              placeholder="Clé API secrète"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <button style={styles.btnSecondary} onClick={loadLeads}>
              Charger les leads
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>🎯 CIBLE DU SCAN</div>
            <select
              style={styles.select}
              value={selectedTarget}
              onChange={e => setSelectedTarget(Number(e.target.value))}
            >
              {TARGETS.map((t, i) => (
                <option key={i} value={i}>
                  {t.ville} — {secteurLabel[t.secteur] || t.secteur}
                </option>
              ))}
            </select>
            <div style={styles.fieldLabel}>Max résultats</div>
            <input
              style={styles.input}
              type="number"
              min={5} max={50}
              value={maxResults}
              onChange={e => setMaxResults(Number(e.target.value))}
            />
            <button
              style={{ ...styles.btnPrimary, opacity: running ? 0.6 : 1 }}
              onClick={runScraper}
              disabled={running}
            >
              {running ? '⏳ SCAN EN COURS...' : '🚀 LANCER LE SCAN'}
            </button>
          </div>

          {/* Logs */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>📋 LOGS</div>
            <div style={styles.logBox}>
              {logs.length === 0 && <div style={styles.logEmpty}>Aucun log</div>}
              {logs.map((l, i) => (
                <div key={i} style={{
                  ...styles.logLine,
                  color: l.type === 'error' ? '#f87171' : l.type === 'success' ? '#34d399' : '#a78bfa'
                }}>
                  <span style={styles.logTime}>{l.time}</span> {l.msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table leads */}
        <div style={styles.content}>
          <div style={styles.tableHeader}>
            <div style={styles.cardTitle}>📊 LEADS ({leads.length})</div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Entreprise', 'Email', 'Ville', 'Secteur', 'Note', 'Statut'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} style={styles.emptyRow}>
                      Lancez un scan pour trouver des leads
                    </td>
                  </tr>
                )}
                {leads.map((lead, i) => (
                  <tr key={lead.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(124,58,237,0.03)' }}>
                    <td style={styles.td}>
                      <a href={lead.site_web} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        {lead.nom_entreprise}
                      </a>
                    </td>
                    <td style={{ ...styles.td, fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>
                      {lead.email || <span style={{ color: '#6b7280' }}>—</span>}
                    </td>
                    <td style={styles.td}>{lead.ville}, {lead.pays}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{secteurLabel[lead.secteur] || lead.secteur}</span>
                    </td>
                    <td style={styles.td}>
                      {lead.note_google ? (
                        <span style={{ color: '#fbbf24' }}>★ {lead.note_google}</span>
                      ) : '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: lead.statut === 'EMAIL_ENVOYE' ? 'rgba(5,150,105,0.2)' :
                          lead.statut === 'NOUVEAU' ? 'rgba(124,58,237,0.2)' : 'rgba(107,114,128,0.2)',
                        color: lead.statut === 'EMAIL_ENVOYE' ? '#34d399' :
                          lead.statut === 'NOUVEAU' ? '#a78bfa' : '#9ca3af'
                      }}>
                        {lead.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '24px', fontWeight: 800, color, fontFamily: "'Space Mono', monospace" }}>
        {value}
      </div>
      <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 32px', borderBottom: '1px solid rgba(124,58,237,0.3)',
    background: 'rgba(124,58,237,0.05)'
  },
  headerLeft: { display: 'flex', alignItems: 'baseline', gap: '8px' },
  logo: { fontSize: '28px', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' },
  logoSub: { fontSize: '11px', color: '#6b7280', letterSpacing: '0.15em', fontFamily: "'Space Mono', monospace" },
  headerStats: { display: 'flex', gap: '32px' },
  main: { display: 'flex', gap: '0', height: 'calc(100vh - 80px)' },
  sidebar: {
    width: '300px', flexShrink: 0, padding: '20px', display: 'flex',
    flexDirection: 'column', gap: '16px', borderRight: '1px solid rgba(124,58,237,0.2)',
    overflowY: 'auto'
  },
  content: { flex: 1, padding: '20px', overflowY: 'auto' },
  card: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px'
  },
  cardTitle: {
    fontSize: '11px', fontWeight: 700, color: '#7c3aed',
    letterSpacing: '0.1em', fontFamily: "'Space Mono', monospace"
  },
  input: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '6px', padding: '8px 12px', color: '#e8e8f0', fontSize: '13px',
    outline: 'none', width: '100%', boxSizing: 'border-box' as const
  },
  select: {
    background: '#0f0f1a', border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '6px', padding: '8px 12px', color: '#e8e8f0', fontSize: '13px',
    outline: 'none', width: '100%'
  },
  fieldLabel: { fontSize: '11px', color: '#6b7280' },
  btnPrimary: {
    background: '#7c3aed', border: 'none', borderRadius: '6px',
    padding: '10px 16px', color: '#fff', fontSize: '12px', fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.05em', fontFamily: "'Space Mono', monospace"
  },
  btnSecondary: {
    background: 'transparent', border: '1px solid rgba(124,58,237,0.4)',
    borderRadius: '6px', padding: '8px 16px', color: '#a78bfa', fontSize: '12px',
    cursor: 'pointer'
  },
  logBox: {
    maxHeight: '200px', overflowY: 'auto', display: 'flex',
    flexDirection: 'column', gap: '4px'
  },
  logEmpty: { color: '#4b5563', fontSize: '12px', fontStyle: 'italic' },
  logLine: { fontSize: '11px', fontFamily: "'Space Mono', monospace", lineHeight: 1.5 },
  logTime: { color: '#4b5563' },
  tableHeader: { marginBottom: '16px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: {
    fontSize: '11px', color: '#7c3aed', fontFamily: "'Space Mono', monospace",
    letterSpacing: '0.08em', padding: '10px 12px', textAlign: 'left' as const,
    borderBottom: '1px solid rgba(124,58,237,0.3)'
  },
  td: { padding: '10px 12px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  emptyRow: { textAlign: 'center' as const, padding: '40px', color: '#4b5563' },
  link: { color: '#a78bfa', textDecoration: 'none' },
  badge: {
    background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
    padding: '2px 8px', borderRadius: '4px', fontSize: '11px'
  },
  statusBadge: { padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }
};

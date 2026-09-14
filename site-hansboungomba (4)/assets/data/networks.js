// SPDX-License-Identifier: LicenseRef-Donnees-Tierces
// Reconstructions dérivées de BACI-CEPII, UN Comtrade, DESTA, COFER-FMI,
// OECD TiVA, UNCTAD. NON couvert par la licence MIT du dépôt : chaque
// fournisseur a ses propres conditions. Voir LICENSES.md, section 4.
// ====================================================================
// TOME 3 — Données des réseaux décrits dans les chapitres
// Sources : reconstructions illustratives basées sur le plan détaillé
// (Findlay & O'Rourke 2007, BACI-CEPII, UN Comtrade, COW Trade)
// Les valeurs sont des estimations pédagogiques, pas des données brutes.
// ====================================================================

// --------------------------------------------------------------------
// CHAPITRE 1 — Réseaux commerciaux historiques (1600 → 2025)
// --------------------------------------------------------------------
// Chaque snapshot : nœuds (id, label, région, poids ≈ part commerce mondial)
// arêtes : (source, target, poids ≈ intensité flux normalisée 0-1)

const HISTORICAL_NETWORKS = {
  "1600": {
    period: "1600",
    title: "Réseau mercantile",
    caption: "Multipolaire. Méditerranée et Atlantique connectés par hubs marchands. Structure décentralisée, Q (modularité) ≈ 0,55.",
    metrics: { density: 0.18, modularity: 0.55, diameter: 4, hhi_avg: 0.22 },
    nodes: [
      { id: "VEN", label: "Venise", region: "med", x: 0.52, y: 0.42, w: 0.11 },
      { id: "GEN", label: "Gênes", region: "med", x: 0.48, y: 0.45, w: 0.08 },
      { id: "OTT", label: "Ottoman", region: "med", x: 0.62, y: 0.48, w: 0.13 },
      { id: "POR", label: "Portugal", region: "atl", x: 0.32, y: 0.50, w: 0.09 },
      { id: "ESP", label: "Espagne", region: "atl", x: 0.36, y: 0.48, w: 0.12 },
      { id: "NLD", label: "Prov.-Unies", region: "atl", x: 0.42, y: 0.32, w: 0.10 },
      { id: "ENG", label: "Angleterre", region: "atl", x: 0.40, y: 0.28, w: 0.06 },
      { id: "FRA", label: "France", region: "atl", x: 0.44, y: 0.38, w: 0.07 },
      { id: "MUG", label: "Moghol", region: "asia", x: 0.78, y: 0.55, w: 0.14 },
      { id: "MIN", label: "Ming/Qing", region: "asia", x: 0.86, y: 0.50, w: 0.16 },
      { id: "JPN", label: "Japon", region: "asia", x: 0.91, y: 0.45, w: 0.04 },
      { id: "PER", label: "Perse", region: "asia", x: 0.70, y: 0.52, w: 0.05 },
      { id: "BRZ", label: "Brésil col.", region: "ame", x: 0.22, y: 0.60, w: 0.02 },
      { id: "MEX", label: "N.-Espagne", region: "ame", x: 0.16, y: 0.50, w: 0.03 },
      { id: "WAF", label: "Côtes W.-Afr.", region: "afr", x: 0.40, y: 0.62, w: 0.02 }
    ],
    links: [
      ["VEN","OTT",0.7],["VEN","GEN",0.5],["VEN","FRA",0.4],["GEN","ESP",0.4],
      ["OTT","PER",0.6],["OTT","MUG",0.4],["PER","MUG",0.5],["MUG","MIN",0.5],
      ["MIN","JPN",0.6],["MIN","MUG",0.4],["NLD","ENG",0.5],["NLD","FRA",0.4],
      ["NLD","JPN",0.3],["NLD","MIN",0.4],["NLD","MUG",0.5],["POR","BRZ",0.7],
      ["POR","WAF",0.5],["POR","MUG",0.4],["POR","MIN",0.3],["ESP","MEX",0.8],
      ["ESP","BRZ",0.3],["ESP","WAF",0.3],["ENG","FRA",0.3],["ENG","NLD",0.4],
      ["MEX","WAF",0.2],["BRZ","WAF",0.3],["FRA","ESP",0.3],["VEN","MIN",0.2]
    ]
  },
  "1750": {
    period: "1750",
    title: "Émergence atlantique",
    caption: "Premier triangle atlantique. La VOC néerlandaise et l'EIC britannique recomposent les flux. Hub britannique en formation.",
    metrics: { density: 0.22, modularity: 0.48, diameter: 4, hhi_avg: 0.28 },
    nodes: [
      { id: "GBR", label: "Gr.-Bretagne", region: "atl", x: 0.40, y: 0.28, w: 0.15 },
      { id: "FRA", label: "France", region: "atl", x: 0.44, y: 0.38, w: 0.12 },
      { id: "NLD", label: "Prov.-Unies", region: "atl", x: 0.42, y: 0.32, w: 0.10 },
      { id: "ESP", label: "Espagne", region: "atl", x: 0.36, y: 0.48, w: 0.08 },
      { id: "POR", label: "Portugal", region: "atl", x: 0.32, y: 0.50, w: 0.05 },
      { id: "OTT", label: "Ottoman", region: "med", x: 0.62, y: 0.48, w: 0.07 },
      { id: "RUS", label: "Russie", region: "eur", x: 0.62, y: 0.25, w: 0.05 },
      { id: "QIN", label: "Empire Qing", region: "asia", x: 0.86, y: 0.50, w: 0.17 },
      { id: "MUG", label: "Moghol décl.", region: "asia", x: 0.78, y: 0.55, w: 0.08 },
      { id: "JPN", label: "Japon (Sakoku)", region: "asia", x: 0.91, y: 0.45, w: 0.03 },
      { id: "EIC", label: "EIC (Bengale)", region: "asia", x: 0.74, y: 0.52, w: 0.05 },
      { id: "BRZ", label: "Brésil", region: "ame", x: 0.22, y: 0.60, w: 0.03 },
      { id: "13C", label: "13 Colonies", region: "ame", x: 0.18, y: 0.40, w: 0.04 },
      { id: "WIN", label: "Antilles", region: "ame", x: 0.18, y: 0.55, w: 0.06 },
      { id: "MEX", label: "N.-Espagne", region: "ame", x: 0.16, y: 0.50, w: 0.04 },
      { id: "WAF", label: "Côtes W.-Afr.", region: "afr", x: 0.40, y: 0.62, w: 0.04 }
    ],
    links: [
      ["GBR","13C",0.8],["GBR","WIN",0.7],["GBR","EIC",0.6],["GBR","FRA",0.4],
      ["GBR","NLD",0.5],["GBR","RUS",0.3],["GBR","WAF",0.5],["FRA","WIN",0.6],
      ["FRA","WAF",0.5],["FRA","NLD",0.3],["FRA","ESP",0.3],["NLD","QIN",0.4],
      ["NLD","JPN",0.3],["NLD","EIC",0.3],["ESP","MEX",0.8],["ESP","WIN",0.4],
      ["POR","BRZ",0.8],["POR","WAF",0.4],["POR","QIN",0.2],["OTT","RUS",0.3],
      ["OTT","FRA",0.3],["EIC","QIN",0.5],["EIC","MUG",0.7],["QIN","MUG",0.3],
      ["QIN","JPN",0.4],["13C","WIN",0.4],["13C","WAF",0.3],["BRZ","WAF",0.4],
      ["WIN","WAF",0.5],["MEX","WAF",0.2],["GBR","ESP",0.2],["RUS","QIN",0.2]
    ]
  },
  "1900": {
    period: "1900",
    title: "Apogée colonial",
    caption: "Structure hub-and-spoke. Empires britannique, français, allemand, néerlandais. HHI moyen colonies > 0,7. Q ≈ 0,68.",
    metrics: { density: 0.14, modularity: 0.68, diameter: 4, hhi_avg: 0.62 },
    nodes: [
      { id: "GBR", label: "Royaume-Uni", region: "eur", x: 0.40, y: 0.28, w: 0.20 },
      { id: "DEU", label: "Allemagne", region: "eur", x: 0.48, y: 0.30, w: 0.13 },
      { id: "FRA", label: "France", region: "eur", x: 0.44, y: 0.38, w: 0.11 },
      { id: "NLD", label: "Pays-Bas", region: "eur", x: 0.42, y: 0.32, w: 0.05 },
      { id: "BEL", label: "Belgique", region: "eur", x: 0.43, y: 0.34, w: 0.04 },
      { id: "ITA", label: "Italie", region: "eur", x: 0.48, y: 0.42, w: 0.04 },
      { id: "RUS", label: "Russie", region: "eur", x: 0.62, y: 0.25, w: 0.06 },
      { id: "USA", label: "États-Unis", region: "ame", x: 0.18, y: 0.38, w: 0.11 },
      { id: "JPN", label: "Japon", region: "asia", x: 0.91, y: 0.45, w: 0.03 },
      { id: "CHN", label: "Chine (semi-col.)", region: "asia", x: 0.86, y: 0.50, w: 0.06 },
      { id: "IND", label: "Inde brit.", region: "asia", x: 0.76, y: 0.52, w: 0.05 },
      { id: "MAL", label: "Malaisie/Sing.", region: "asia", x: 0.82, y: 0.58, w: 0.02 },
      { id: "AUS", label: "Australie", region: "asia", x: 0.90, y: 0.72, w: 0.03 },
      { id: "ZAF", label: "Afr. du Sud", region: "afr", x: 0.52, y: 0.72, w: 0.02 },
      { id: "EGY", label: "Égypte", region: "afr", x: 0.56, y: 0.55, w: 0.02 },
      { id: "AFW", label: "AOF/AEF", region: "afr", x: 0.42, y: 0.60, w: 0.02 },
      { id: "CGO", label: "Congo belge", region: "afr", x: 0.50, y: 0.65, w: 0.01 },
      { id: "DEI", label: "Indes néerl.", region: "asia", x: 0.84, y: 0.62, w: 0.02 },
      { id: "ARG", label: "Argentine", region: "ame", x: 0.24, y: 0.72, w: 0.02 },
      { id: "BRZ", label: "Brésil", region: "ame", x: 0.26, y: 0.65, w: 0.02 },
      { id: "CAN", label: "Canada", region: "ame", x: 0.18, y: 0.28, w: 0.03 }
    ],
    links: [
      ["GBR","IND",0.9],["GBR","CAN",0.8],["GBR","AUS",0.85],["GBR","ZAF",0.8],
      ["GBR","EGY",0.7],["GBR","MAL",0.7],["GBR","USA",0.5],["GBR","DEU",0.4],
      ["GBR","FRA",0.4],["GBR","CHN",0.5],["GBR","ARG",0.5],["GBR","BRZ",0.3],
      ["FRA","AFW",0.9],["FRA","EGY",0.3],["FRA","DEU",0.4],["FRA","ITA",0.3],
      ["FRA","RUS",0.4],["FRA","GBR",0.0],["DEU","RUS",0.4],["DEU","USA",0.3],
      ["DEU","ITA",0.3],["DEU","CHN",0.3],["DEU","BEL",0.3],["NLD","DEI",0.9],
      ["NLD","DEU",0.3],["NLD","GBR",0.3],["BEL","CGO",0.95],["BEL","FRA",0.3],
      ["BEL","GBR",0.3],["USA","CAN",0.7],["USA","DEU",0.3],["USA","BRZ",0.4],
      ["USA","ARG",0.3],["USA","JPN",0.3],["USA","CHN",0.4],["JPN","CHN",0.5],
      ["ITA","AFW",0.1],["RUS","CHN",0.3],["IND","CHN",0.2],["IND","MAL",0.2]
    ]
  },
  "1960": {
    period: "1960",
    title: "Bretton Woods",
    caption: "Hub américain dominant, structure en étoile. Zones monétaires : dollar, sterling déclinant, franc. Q ≈ 0,45.",
    metrics: { density: 0.20, modularity: 0.45, diameter: 3, hhi_avg: 0.42 },
    nodes: [
      { id: "USA", label: "États-Unis", region: "ame", x: 0.18, y: 0.38, w: 0.23 },
      { id: "GBR", label: "Royaume-Uni", region: "eur", x: 0.40, y: 0.28, w: 0.10 },
      { id: "DEU", label: "RFA", region: "eur", x: 0.48, y: 0.30, w: 0.10 },
      { id: "FRA", label: "France", region: "eur", x: 0.44, y: 0.38, w: 0.07 },
      { id: "ITA", label: "Italie", region: "eur", x: 0.48, y: 0.42, w: 0.05 },
      { id: "NLD", label: "Pays-Bas", region: "eur", x: 0.42, y: 0.32, w: 0.04 },
      { id: "JPN", label: "Japon", region: "asia", x: 0.91, y: 0.45, w: 0.07 },
      { id: "URS", label: "URSS", region: "soc", x: 0.65, y: 0.25, w: 0.10 },
      { id: "DDR", label: "Bloc Est", region: "soc", x: 0.55, y: 0.30, w: 0.04 },
      { id: "CHN", label: "Chine (RPC)", region: "soc", x: 0.86, y: 0.50, w: 0.03 },
      { id: "CAN", label: "Canada", region: "ame", x: 0.18, y: 0.28, w: 0.05 },
      { id: "MEX", label: "Mexique", region: "ame", x: 0.16, y: 0.50, w: 0.02 },
      { id: "BRZ", label: "Brésil", region: "ame", x: 0.26, y: 0.65, w: 0.02 },
      { id: "ARG", label: "Argentine", region: "ame", x: 0.24, y: 0.72, w: 0.02 },
      { id: "AUS", label: "Australie", region: "asia", x: 0.90, y: 0.72, w: 0.02 },
      { id: "IND", label: "Inde", region: "asia", x: 0.76, y: 0.52, w: 0.02 },
      { id: "AFW", label: "Zone franc Afr.", region: "afr", x: 0.42, y: 0.60, w: 0.01 },
      { id: "NGA", label: "Nigeria", region: "afr", x: 0.46, y: 0.62, w: 0.01 },
      { id: "ZAF", label: "Afr. du Sud", region: "afr", x: 0.52, y: 0.72, w: 0.02 },
      { id: "EGY", label: "Égypte", region: "afr", x: 0.56, y: 0.55, w: 0.01 }
    ],
    links: [
      ["USA","CAN",0.85],["USA","MEX",0.7],["USA","JPN",0.7],["USA","DEU",0.7],
      ["USA","GBR",0.7],["USA","FRA",0.5],["USA","ITA",0.5],["USA","BRZ",0.5],
      ["USA","ARG",0.4],["USA","AUS",0.5],["USA","NLD",0.4],["USA","IND",0.3],
      ["GBR","AUS",0.6],["GBR","CAN",0.5],["GBR","NGA",0.6],["GBR","ZAF",0.5],
      ["GBR","IND",0.4],["GBR","DEU",0.5],["GBR","FRA",0.4],["DEU","FRA",0.7],
      ["DEU","ITA",0.6],["DEU","NLD",0.7],["DEU","GBR",0.0],["FRA","AFW",0.9],
      ["FRA","DEU",0.0],["FRA","ITA",0.5],["FRA","NLD",0.4],["JPN","AUS",0.4],
      ["JPN","IND",0.2],["URS","DDR",0.9],["URS","CHN",0.5],["URS","EGY",0.4],
      ["URS","IND",0.3],["DDR","DEU",0.1],["BRZ","ARG",0.4],["ZAF","GBR",0.0],
      ["NLD","DEU",0.0],["ITA","FRA",0.0]
    ]
  },
  "2000": {
    period: "2000",
    title: "Hypermondialisation",
    caption: "Triade USA-UE-Asie. Montée chinoise, chaînes de valeur mondiales. Q baisse à 0,32. Singapour, HK = plaques tournantes.",
    metrics: { density: 0.32, modularity: 0.32, diameter: 3, hhi_avg: 0.30 },
    nodes: [
      { id: "USA", label: "États-Unis", region: "ame", x: 0.18, y: 0.38, w: 0.16 },
      { id: "CHN", label: "Chine", region: "asia", x: 0.86, y: 0.50, w: 0.10 },
      { id: "DEU", label: "Allemagne", region: "eur", x: 0.48, y: 0.30, w: 0.10 },
      { id: "JPN", label: "Japon", region: "asia", x: 0.91, y: 0.45, w: 0.08 },
      { id: "FRA", label: "France", region: "eur", x: 0.44, y: 0.38, w: 0.06 },
      { id: "GBR", label: "Royaume-Uni", region: "eur", x: 0.40, y: 0.28, w: 0.06 },
      { id: "ITA", label: "Italie", region: "eur", x: 0.48, y: 0.42, w: 0.05 },
      { id: "NLD", label: "Pays-Bas", region: "eur", x: 0.42, y: 0.32, w: 0.04 },
      { id: "CAN", label: "Canada", region: "ame", x: 0.18, y: 0.28, w: 0.05 },
      { id: "MEX", label: "Mexique", region: "ame", x: 0.16, y: 0.50, w: 0.03 },
      { id: "BRZ", label: "Brésil", region: "ame", x: 0.26, y: 0.65, w: 0.03 },
      { id: "ARG", label: "Argentine", region: "ame", x: 0.24, y: 0.72, w: 0.02 },
      { id: "KOR", label: "Corée du Sud", region: "asia", x: 0.88, y: 0.43, w: 0.04 },
      { id: "SGP", label: "Singapour", region: "asia", x: 0.82, y: 0.60, w: 0.03 },
      { id: "HKG", label: "Hong Kong", region: "asia", x: 0.86, y: 0.54, w: 0.03 },
      { id: "TWN", label: "Taïwan", region: "asia", x: 0.88, y: 0.52, w: 0.03 },
      { id: "MYS", label: "Malaisie", region: "asia", x: 0.83, y: 0.61, w: 0.02 },
      { id: "THA", label: "Thaïlande", region: "asia", x: 0.81, y: 0.58, w: 0.02 },
      { id: "IDN", label: "Indonésie", region: "asia", x: 0.85, y: 0.64, w: 0.02 },
      { id: "IND", label: "Inde", region: "asia", x: 0.76, y: 0.52, w: 0.03 },
      { id: "RUS", label: "Russie", region: "eur", x: 0.62, y: 0.25, w: 0.03 },
      { id: "AUS", label: "Australie", region: "asia", x: 0.90, y: 0.72, w: 0.03 },
      { id: "SAU", label: "Arabie S.", region: "mna", x: 0.66, y: 0.55, w: 0.02 },
      { id: "ZAF", label: "Afr. du Sud", region: "afr", x: 0.52, y: 0.72, w: 0.02 },
      { id: "NGA", label: "Nigeria", region: "afr", x: 0.46, y: 0.62, w: 0.01 },
      { id: "EGY", label: "Égypte", region: "mna", x: 0.56, y: 0.55, w: 0.01 },
      { id: "TUR", label: "Turquie", region: "mna", x: 0.58, y: 0.45, w: 0.02 },
      { id: "POL", label: "Pologne", region: "eur", x: 0.52, y: 0.32, w: 0.02 }
    ],
    links: [
      ["USA","CAN",0.85],["USA","MEX",0.8],["USA","CHN",0.7],["USA","JPN",0.6],
      ["USA","DEU",0.5],["USA","GBR",0.5],["USA","KOR",0.5],["USA","BRZ",0.4],
      ["USA","FRA",0.4],["USA","TWN",0.4],["USA","SGP",0.3],["USA","IND",0.3],
      ["USA","SAU",0.4],["USA","NLD",0.4],["CHN","JPN",0.7],["CHN","KOR",0.7],
      ["CHN","HKG",0.85],["CHN","TWN",0.6],["CHN","SGP",0.5],["CHN","DEU",0.5],
      ["CHN","AUS",0.5],["CHN","RUS",0.4],["CHN","THA",0.4],["CHN","MYS",0.4],
      ["CHN","IDN",0.3],["CHN","IND",0.3],["CHN","ZAF",0.2],["DEU","FRA",0.8],
      ["DEU","ITA",0.7],["DEU","NLD",0.7],["DEU","POL",0.6],["DEU","GBR",0.6],
      ["DEU","CHN",0.0],["DEU","RUS",0.4],["DEU","TUR",0.3],["FRA","ITA",0.6],
      ["FRA","NLD",0.5],["FRA","DEU",0.0],["FRA","GBR",0.5],["FRA","NGA",0.2],
      ["GBR","NLD",0.4],["GBR","IND",0.3],["GBR","ZAF",0.3],["ITA","NLD",0.3],
      ["JPN","KOR",0.5],["JPN","TWN",0.4],["JPN","SGP",0.3],["JPN","THA",0.4],
      ["JPN","IDN",0.3],["JPN","AUS",0.5],["KOR","TWN",0.3],["SGP","MYS",0.6],
      ["SGP","IDN",0.4],["SGP","THA",0.4],["HKG","TWN",0.3],["TWN","KOR",0.0],
      ["MYS","THA",0.4],["MYS","IDN",0.3],["IND","SAU",0.3],["RUS","DEU",0.0],
      ["RUS","TUR",0.3],["BRZ","ARG",0.5],["BRZ","CHN",0.3],["MEX","CAN",0.4],
      ["ZAF","DEU",0.2],["NGA","CHN",0.2],["EGY","SAU",0.3],["TUR","DEU",0.0],
      ["POL","DEU",0.0],["AUS","KOR",0.3]
    ]
  },
  "2025": {
    period: "2025",
    title: "Multipolarité fragmentée",
    caption: "Trois hubs (Chine 1er, USA, UE). Belt & Road, RCEP, ZLECAf. Modularité remonte à 0,38. Fragmentation géopolitique.",
    metrics: { density: 0.30, modularity: 0.38, diameter: 3, hhi_avg: 0.32 },
    nodes: [
      { id: "CHN", label: "Chine", region: "asia", x: 0.86, y: 0.50, w: 0.16 },
      { id: "USA", label: "États-Unis", region: "ame", x: 0.18, y: 0.38, w: 0.13 },
      { id: "DEU", label: "Allemagne", region: "eur", x: 0.48, y: 0.30, w: 0.07 },
      { id: "JPN", label: "Japon", region: "asia", x: 0.91, y: 0.45, w: 0.04 },
      { id: "IND", label: "Inde", region: "asia", x: 0.76, y: 0.52, w: 0.05 },
      { id: "FRA", label: "France", region: "eur", x: 0.44, y: 0.38, w: 0.04 },
      { id: "GBR", label: "Royaume-Uni", region: "eur", x: 0.40, y: 0.28, w: 0.04 },
      { id: "ITA", label: "Italie", region: "eur", x: 0.48, y: 0.42, w: 0.03 },
      { id: "NLD", label: "Pays-Bas", region: "eur", x: 0.42, y: 0.32, w: 0.04 },
      { id: "POL", label: "Pologne", region: "eur", x: 0.52, y: 0.32, w: 0.02 },
      { id: "ESP", label: "Espagne", region: "eur", x: 0.40, y: 0.42, w: 0.02 },
      { id: "CAN", label: "Canada", region: "ame", x: 0.18, y: 0.28, w: 0.03 },
      { id: "MEX", label: "Mexique", region: "ame", x: 0.16, y: 0.50, w: 0.04 },
      { id: "BRZ", label: "Brésil", region: "ame", x: 0.26, y: 0.65, w: 0.03 },
      { id: "ARG", label: "Argentine", region: "ame", x: 0.24, y: 0.72, w: 0.01 },
      { id: "CHL", label: "Chili", region: "ame", x: 0.22, y: 0.72, w: 0.01 },
      { id: "KOR", label: "Corée du Sud", region: "asia", x: 0.89, y: 0.43, w: 0.04 },
      { id: "SGP", label: "Singapour", region: "asia", x: 0.82, y: 0.60, w: 0.04 },
      { id: "TWN", label: "Taïwan", region: "asia", x: 0.88, y: 0.52, w: 0.03 },
      { id: "VNM", label: "Vietnam", region: "asia", x: 0.83, y: 0.55, w: 0.03 },
      { id: "MYS", label: "Malaisie", region: "asia", x: 0.83, y: 0.61, w: 0.02 },
      { id: "THA", label: "Thaïlande", region: "asia", x: 0.81, y: 0.58, w: 0.02 },
      { id: "IDN", label: "Indonésie", region: "asia", x: 0.85, y: 0.64, w: 0.02 },
      { id: "PHL", label: "Philippines", region: "asia", x: 0.88, y: 0.58, w: 0.01 },
      { id: "PAK", label: "Pakistan", region: "asia", x: 0.74, y: 0.50, w: 0.01 },
      { id: "KAZ", label: "Kazakhstan", region: "asia", x: 0.72, y: 0.40, w: 0.01 },
      { id: "RUS", label: "Russie", region: "eur", x: 0.62, y: 0.25, w: 0.03 },
      { id: "TUR", label: "Turquie", region: "mna", x: 0.58, y: 0.45, w: 0.02 },
      { id: "SAU", label: "Arabie S.", region: "mna", x: 0.66, y: 0.55, w: 0.03 },
      { id: "ARE", label: "ÉAU", region: "mna", x: 0.68, y: 0.58, w: 0.02 },
      { id: "EGY", label: "Égypte", region: "mna", x: 0.56, y: 0.55, w: 0.01 },
      { id: "AUS", label: "Australie", region: "asia", x: 0.92, y: 0.72, w: 0.03 },
      { id: "ZAF", label: "Afr. du Sud", region: "afr", x: 0.52, y: 0.72, w: 0.02 },
      { id: "NGA", label: "Nigeria", region: "afr", x: 0.46, y: 0.62, w: 0.01 },
      { id: "KEN", label: "Kenya", region: "afr", x: 0.54, y: 0.65, w: 0.01 },
      { id: "ETH", label: "Éthiopie", region: "afr", x: 0.56, y: 0.62, w: 0.01 },
      { id: "ZMB", label: "Zambie", region: "afr", x: 0.50, y: 0.68, w: 0.005 }
    ],
    links: [
      ["CHN","USA",0.55],["CHN","JPN",0.65],["CHN","KOR",0.8],["CHN","DEU",0.55],
      ["CHN","VNM",0.7],["CHN","MYS",0.55],["CHN","THA",0.55],["CHN","IDN",0.5],
      ["CHN","PHL",0.45],["CHN","SGP",0.55],["CHN","TWN",0.6],["CHN","AUS",0.7],
      ["CHN","RUS",0.7],["CHN","IND",0.4],["CHN","PAK",0.65],["CHN","KAZ",0.65],
      ["CHN","SAU",0.55],["CHN","ARE",0.5],["CHN","ZAF",0.5],["CHN","NGA",0.45],
      ["CHN","KEN",0.5],["CHN","ETH",0.55],["CHN","ZMB",0.7],["CHN","BRZ",0.6],
      ["CHN","CHL",0.6],["CHN","TUR",0.3],["CHN","ITA",0.25],["USA","CAN",0.85],
      ["USA","MEX",0.85],["USA","JPN",0.55],["USA","KOR",0.55],["USA","DEU",0.45],
      ["USA","GBR",0.55],["USA","FRA",0.35],["USA","NLD",0.4],["USA","TWN",0.5],
      ["USA","IND",0.4],["USA","VNM",0.4],["USA","BRZ",0.35],["USA","SAU",0.35],
      ["USA","ARE",0.3],["USA","AUS",0.45],["USA","SGP",0.35],["DEU","FRA",0.75],
      ["DEU","ITA",0.7],["DEU","NLD",0.75],["DEU","POL",0.7],["DEU","GBR",0.55],
      ["DEU","ESP",0.55],["DEU","TUR",0.35],["DEU","RUS",0.1],["FRA","ITA",0.65],
      ["FRA","NLD",0.5],["FRA","ESP",0.6],["FRA","GBR",0.5],["FRA","NGA",0.15],
      ["FRA","DEU",0.0],["GBR","NLD",0.4],["GBR","IND",0.3],["GBR","ZAF",0.3],
      ["ITA","NLD",0.3],["ITA","ESP",0.4],["NLD","ESP",0.3],["POL","DEU",0.0],
      ["JPN","KOR",0.45],["JPN","TWN",0.4],["JPN","SGP",0.35],["JPN","THA",0.4],
      ["JPN","IDN",0.35],["JPN","VNM",0.35],["JPN","AUS",0.5],["KOR","TWN",0.4],
      ["KOR","VNM",0.45],["SGP","MYS",0.65],["SGP","IDN",0.5],["SGP","THA",0.5],
      ["SGP","VNM",0.45],["MYS","THA",0.45],["MYS","IDN",0.4],["THA","VNM",0.4],
      ["VNM","KOR",0.0],["IND","SAU",0.45],["IND","ARE",0.5],["IND","ZAF",0.3],
      ["IND","KEN",0.3],["RUS","TUR",0.4],["RUS","KAZ",0.7],["RUS","IND",0.45],
      ["RUS","BRZ",0.2],["SAU","ARE",0.5],["SAU","EGY",0.4],["ARE","EGY",0.3],
      ["TUR","EGY",0.25],["BRZ","ARG",0.5],["BRZ","CHL",0.3],["ARG","CHL",0.4],
      ["MEX","CAN",0.4],["AUS","KOR",0.45],["AUS","IDN",0.3],["ZAF","NGA",0.2],
      ["ZAF","KEN",0.25],["KEN","ETH",0.4],["KEN","ZMB",0.3],["NGA","KEN",0.15],
      ["ZMB","ZAF",0.4],["PAK","ARE",0.35],["PAK","SAU",0.4]
    ]
  }
};

// --------------------------------------------------------------------
// CHAPITRE 4 — Coalitions comme groupes algébriques
// --------------------------------------------------------------------
const COALITIONS = {
  BRICS: {
    name: "BRICS+",
    full: "Brésil, Russie, Inde, Chine, Afr. du Sud + extensions 2024",
    cardinality: "|BRICS+| = 10",
    cohesion: 0.32,
    symmetry: 0.18,
    outside: 0.62,
    stable: false,
    members: [
      { id:"CHN", label:"Chine", weight:0.50, role:"hégémon", sub:"asie" },
      { id:"IND", label:"Inde", weight:0.18, role:"contre-poids", sub:"asie" },
      { id:"RUS", label:"Russie", weight:0.08, role:"isolé", sub:"asie" },
      { id:"BRZ", label:"Brésil", weight:0.10, role:"porte-parole Sud", sub:"sud" },
      { id:"ZAF", label:"Afr. du Sud", weight:0.03, role:"porte-parole Sud", sub:"sud" },
      { id:"IRN", label:"Iran", weight:0.04, role:"sanctionné", sub:"mna" },
      { id:"EGY", label:"Égypte", weight:0.02, role:"nouveau", sub:"mna" },
      { id:"ARE", label:"ÉAU", weight:0.03, role:"nouveau", sub:"mna" },
      { id:"ETH", label:"Éthiopie", weight:0.01, role:"nouveau", sub:"afr" },
      { id:"SAU", label:"Arabie S.", weight:0.01, role:"observateur", sub:"mna" }
    ],
    subgroups: [
      { id:"asie", label:"Sous-groupe Asie", members:["CHN","IND","RUS"] },
      { id:"sud", label:"Sud global", members:["BRZ","ZAF"] },
      { id:"mna", label:"MENA élargi", members:["IRN","EGY","ARE","SAU"] }
    ],
    notes: [
      "|H|=3 (Asie) divise |G|=10 ? Non — instabilité de Lagrange.",
      "Brisure de symétrie : Chine pèse 50% du PIB collectif.",
      "Invariant unique : opposition à l'hégémonie occidentale."
    ]
  },
  ASEAN: {
    name: "ASEAN",
    full: "Association des Nations de l'Asie du Sud-Est (10 membres)",
    cardinality: "|ASEAN| = 10",
    cohesion: 0.58,
    symmetry: 0.62,
    outside: 0.45,
    stable: true,
    members: [
      { id:"SGP", label:"Singapour", weight:0.22, role:"hub financier", sub:"core" },
      { id:"THA", label:"Thaïlande", weight:0.14, role:"hub manufact.", sub:"core" },
      { id:"VNM", label:"Vietnam", weight:0.13, role:"hub manufact.", sub:"core" },
      { id:"MYS", label:"Malaisie", weight:0.13, role:"hub manufact.", sub:"core" },
      { id:"IDN", label:"Indonésie", weight:0.18, role:"poids démogr.", sub:"core" },
      { id:"PHL", label:"Philippines", weight:0.09, role:"périphérie", sub:"perif" },
      { id:"MMR", label:"Myanmar", weight:0.03, role:"périphérie", sub:"perif" },
      { id:"KHM", label:"Cambodge", weight:0.03, role:"périphérie", sub:"perif" },
      { id:"LAO", label:"Laos", weight:0.02, role:"périphérie", sub:"perif" },
      { id:"BRN", label:"Brunei", weight:0.03, role:"périphérie", sub:"perif" }
    ],
    subgroups: [
      { id:"core", label:"Cœur économique", members:["SGP","THA","VNM","MYS","IDN"] },
      { id:"perif", label:"Périphérie CLMV+", members:["PHL","MMR","KHM","LAO","BRN"] }
    ],
    notes: [
      "Symétrie élevée : 5 hubs aux rôles structurellement équivalents.",
      "Singapour = point fixe (centralité unique de finance/logistique).",
      "Rotation présidence : action du groupe cyclique Z₁₀."
    ]
  },
  ZLECAF: {
    name: "ZLECAf",
    full: "Zone de libre-échange continentale africaine",
    cardinality: "|ZLECAf| = 54 (48 ratifiés)",
    cohesion: 0.22,
    symmetry: 0.45,
    outside: 0.30,
    stable: false,
    members: [
      { id:"NGA", label:"Nigeria", weight:0.17, role:"poids démogr.", sub:"cedeao" },
      { id:"GHA", label:"Ghana", weight:0.05, role:"hub W.-Afr.", sub:"cedeao" },
      { id:"CIV", label:"Côte d'Ivoire", weight:0.05, role:"hub W.-Afr.", sub:"cedeao" },
      { id:"SEN", label:"Sénégal", weight:0.02, role:"membre", sub:"cedeao" },
      { id:"BFA", label:"Burkina F.", weight:0.01, role:"AES", sub:"aes" },
      { id:"MLI", label:"Mali", weight:0.01, role:"AES", sub:"aes" },
      { id:"NER", label:"Niger", weight:0.01, role:"AES", sub:"aes" },
      { id:"ZAF", label:"Afr. du Sud", weight:0.18, role:"hégémon austral", sub:"sadc" },
      { id:"AGO", label:"Angola", weight:0.05, role:"membre", sub:"sadc" },
      { id:"ZMB", label:"Zambie", weight:0.02, role:"membre", sub:"sadc" },
      { id:"ZWE", label:"Zimbabwe", weight:0.02, role:"membre", sub:"sadc" },
      { id:"KEN", label:"Kenya", weight:0.06, role:"hub E.-Afr.", sub:"eac" },
      { id:"TZA", label:"Tanzanie", weight:0.04, role:"membre", sub:"eac" },
      { id:"UGA", label:"Ouganda", weight:0.02, role:"membre", sub:"eac" },
      { id:"ETH", label:"Éthiopie", weight:0.06, role:"hub", sub:"eac" },
      { id:"EGY", label:"Égypte", weight:0.13, role:"hégémon N.", sub:"comesa" },
      { id:"MAR", label:"Maroc", weight:0.08, role:"hégémon N.", sub:"comesa" },
      { id:"DZA", label:"Algérie", weight:0.05, role:"membre", sub:"comesa" },
      { id:"CMR", label:"Cameroun", weight:0.02, role:"membre", sub:"cemac" },
      { id:"GAB", label:"Gabon", weight:0.01, role:"membre", sub:"cemac" }
    ],
    subgroups: [
      { id:"cedeao", label:"CEDEAO (Afrique Ouest)", members:["NGA","GHA","CIV","SEN"] },
      { id:"aes",    label:"AES (sortie 2024)",      members:["BFA","MLI","NER"] },
      { id:"sadc",   label:"SADC (Afrique australe)", members:["ZAF","AGO","ZMB","ZWE"] },
      { id:"eac",    label:"EAC (Afrique de l'Est)",  members:["KEN","TZA","UGA","ETH"] },
      { id:"comesa", label:"COMESA / Afrique N.",     members:["EGY","MAR","DZA"] },
      { id:"cemac",  label:"CEMAC (Afrique centrale)", members:["CMR","GAB"] }
    ],
    notes: [
      "5 sous-groupes (CER) hiérarchiquement emboîtés.",
      "Sortie AES (|H|=3) du sous-groupe CEDEAO (|H|=15 → 12).",
      "Cohésion faible : commerce intra-africain ≈ 15 % des exports."
    ]
  }
};

// --------------------------------------------------------------------
// CHAPITRE 5 — Cas pour le scatter IREX (validation rétrospective)
// --------------------------------------------------------------------
const IREX_CASES = [
  { id:"nankin",  label:"Nankin 1842",        alpha:0.85, theta:0.15, observed:0.95, era:"colonial" },
  { id:"capitul", label:"Capitulations 1838", alpha:0.78, theta:0.18, observed:0.88, era:"colonial" },
  { id:"berlin",  label:"Berlin 1885",        alpha:0.82, theta:0.12, observed:0.92, era:"colonial" },
  { id:"versail", label:"Versailles 1919",    alpha:0.70, theta:0.22, observed:0.78, era:"interwar" },
  { id:"bw_fr",   label:"Bretton W. (FR) 1944",alpha:0.60,theta:0.25, observed:0.70, era:"bw" },
  { id:"bw_uk",   label:"Bretton W. (UK) 1944",alpha:0.55,theta:0.30, observed:0.62, era:"bw" },
  { id:"cfa",     label:"Franc CFA 1945",     alpha:0.80, theta:0.18, observed:0.85, era:"bw" },
  { id:"emy",     label:"Plan Marshall 1948", alpha:0.45, theta:0.40, observed:0.48, era:"bw" },
  { id:"asean",   label:"ASEAN (Thaï.) 1967", alpha:0.30, theta:0.60, observed:0.15, era:"south" },
  { id:"merco",   label:"Mercosur (Arg.) 1991",alpha:0.42,theta:0.50, observed:0.35, era:"south" },
  { id:"nafta",   label:"ALENA (MEX) 1994",   alpha:0.65, theta:0.35, observed:0.62, era:"south" },
  { id:"apeg",    label:"APE Ghana-UE 2014",  alpha:0.75, theta:0.35, observed:0.75, era:"south" },
  { id:"rcep",    label:"RCEP (VN) 2022",     alpha:0.45, theta:0.50, observed:0.42, era:"rcep" },
  { id:"bri_pk",  label:"BRI (Pakistan) 2015",alpha:0.72, theta:0.28, observed:0.78, era:"bri" },
  { id:"bri_kz",  label:"BRI (Kazakh.) 2015", alpha:0.68, theta:0.32, observed:0.72, era:"bri" },
  { id:"bri_zm",  label:"BRI (Zambie) 2018",  alpha:0.80, theta:0.22, observed:0.85, era:"bri" },
  { id:"akrwa",   label:"Rwanda-UK 2022",     alpha:0.80, theta:0.30, observed:0.78, era:"rcep" },
  { id:"zlecaf",  label:"ZLECAf (Ghana) 2021",alpha:0.40, theta:0.55, observed:0.28, era:"zlecaf" }
];

// Régions et codes couleurs
const REGION_COLORS = {
  eur:  "#2e5d5d",  // bleu pétrole — Europe
  ame:  "#b85c3b",  // cuivre oxydé — Amériques
  asia: "#8a6d1f",  // ocre antique — Asie
  med:  "#7e3a4e",  // bordeaux — Méditerranée
  atl:  "#3a4a78",  // bleu encre — Atlantique
  afr:  "#5a6b2e",  // olive — Afrique
  mna:  "#a87024",  // safran — MENA
  soc:  "#5a4570"   // mauve — Bloc socialiste
};

const REGION_LABELS = {
  eur:"Europe", ame:"Amériques", asia:"Asie", med:"Méditerranée",
  atl:"Atlantique", afr:"Afrique", mna:"MENA", soc:"Bloc socialiste"
};

window.HISTORICAL_NETWORKS = HISTORICAL_NETWORKS;
window.COALITIONS = COALITIONS;
window.IREX_CASES = IREX_CASES;
window.REGION_COLORS = REGION_COLORS;
window.REGION_LABELS = REGION_LABELS;

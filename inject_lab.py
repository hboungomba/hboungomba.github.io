#!/usr/bin/env python3
"""Ajoute à chaque page du laboratoire une barre de retour identique et
les métadonnées manquantes. Idempotent : relançable sans dupliquer."""
import re, pathlib

ROOT = pathlib.Path("/home/claude/site/laboratoire")
DOMAIN = "https://hboungomba.github.io"
MARK = "data-labbar"

PAGES = {
    "jeu-commercial": (
        "Simulateur du jeu commercial — Tome 2",
        "Quatre modules interactifs de théorie des jeux : jeu séquentiel asymétrique, "
        "point de bascule, dilemme du prisonnier commercial, verrouillage par jeux répétés.",
        "La promesse et l'emprise · tome 2"),
    "atlas-reseaux": (
        "Atlas des réseaux de dépendance — Tome 3",
        "Cinq modèles interactifs : cartographie historique du commerce mondial, indices de "
        "centralité, propagation de chocs, coalitions algébriques, indice dynamique de dépendance.",
        "La promesse et l'emprise · tome 3"),
    "annexe-reseaux": (
        "Cinq autres réseaux de dépendance — Tome 3, annexe",
        "Monnaies de réserve, chaînes de valeur multicouches, cascade de défauts souverains, "
        "points d'étranglement maritimes et treillis de coalitions.",
        "La promesse et l'emprise · tome 3, annexe"),
    "revue-equilibre": (
        "Revue des systèmes en équilibre instable",
        "Définition formelle, typologie des équilibres, sources d'instabilité, modèles "
        "mathématiques et critères de stabilité.",
        "Équilibre instable · cadre théorique"),
    "perspective": (
        "La vie comme équilibre instable",
        "Le même schéma d'une échelle à l'autre : molécule, cellule, individu, société, "
        "biosphère, cosmos.",
        "Équilibre instable"),
}

BAR = """<div {mark} style="font-family:'Inter',system-ui,sans-serif;font-size:13px;
 display:flex;gap:18px;align-items:center;flex-wrap:wrap;
 padding:10px 22px;background:#1a1f2c;color:#dcd5c2;position:relative;z-index:999">
 <a href="/" style="color:#f1ede4;text-decoration:none;font-weight:500">Hans Boungomba</a>
 <a href="/laboratoire/" style="color:#dcd5c2;text-decoration:none">Laboratoire</a>
 <span style="color:#6a6f7a">{src}</span>
 <a href="{book}" style="margin-left:auto;color:#e8a07f;text-decoration:none">Le livre dont vient cette figure</a>
</div>
"""

BOOK = {"jeu-commercial": "/livres/la-promesse-et-lemprise/tome-2/", "atlas-reseaux": "/livres/la-promesse-et-lemprise/tome-3/",
        "annexe-reseaux": "/livres/la-promesse-et-lemprise/tome-3/", "revue-equilibre": "/livres/equilibre-instable/",
        "perspective": "/livres/equilibre-instable/"}

for slug, (title, desc, src) in PAGES.items():
    f = ROOT / slug / "index.html"
    html = f.read_text(encoding="utf-8")

    # barre de retour (retirée puis réinsérée pour rester idempotent)
    html = re.sub(r"<div " + MARK + r".*?</div>\n", "", html, flags=re.S)
    bar = BAR.format(mark=MARK, src=src, book=BOOK[slug])
    html = re.sub(r"(<body[^>]*>)", r"\1\n" + bar.replace("\\", "\\\\"), html, count=1)

    # titre et métadonnées
    html = re.sub(r"<title>.*?</title>",
                  f"<title>{title} — Hans Boungomba</title>", html, count=1, flags=re.S)
    html = re.sub(r'\s*<meta name="description".*?>', "", html, flags=re.S)
    html = re.sub(r'\s*<link rel="canonical".*?>', "", html, flags=re.S)
    html = re.sub(r'\s*<meta property="og:.*?>', "", html, flags=re.S)
    meta = (f'\n<meta name="description" content="{desc}">'
            f'\n<link rel="canonical" href="{DOMAIN}/laboratoire/{slug}/">'
            f'\n<meta property="og:type" content="article">'
            f'\n<meta property="og:title" content="{title}">'
            f'\n<meta property="og:description" content="{desc}">'
            f'\n<meta property="og:url" content="{DOMAIN}/laboratoire/{slug}/">'
            f'\n<meta property="og:locale" content="fr_FR">'
            f'\n<meta property="og:image" content="{DOMAIN}/assets/couvertures/collection-planche.jpg">'
            f'\n<meta name="twitter:card" content="summary_large_image">')
    html = html.replace("</title>", "</title>" + meta, 1)

    f.write_text(html, encoding="utf-8")
    print(f"ok  /laboratoire/{slug}/")

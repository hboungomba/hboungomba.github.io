#!/usr/bin/env python3
# Génère les pages du site. Relancer après toute modification : python3 build.py
import pathlib
import note1

ROOT = pathlib.Path("/home/claude/site")
# ADRESSE PUBLIQUE DU SITE — doit correspondre à l'adresse réellement servie.
# Une balise canonique pointant vers un domaine inexistant dit aux moteurs de
# ne pas indexer ces pages. Basculer sur https://hansboungomba.fr le jour où le
# domaine est acheté ET que le DNS pointe sur GitHub Pages, pas avant.
DOMAIN = "https://hboungomba.github.io"
AUTHOR = "Hans Boungomba"
CLAIM_SHORT = "On n'empêche plus un pays de se développer en le détruisant."
ISBN = "978-2-322-61272-7"          # Équilibre instable
EDITEUR_EI = "Éditions Horizon Intérieur (autoédition)"

COLLECTION = "La promesse et l'emprise"
COLLECTION_SS = "Accords commerciaux et dépendance"
COLLECTION_DEVISE = "Une collection pour penser le monde autrement."

# Accroches des quatrièmes de couverture — ce sont elles qui portent.
ACCROCHES = {
    0: "Ils promettent le commerce. Ils instaurent la dépendance.",
    1: "Ils promettent le commerce. Ils instaurent la dépendance.",
    2: "Chaque accord est un jeu. Tous les joueurs n'ont pas les mêmes règles.",
    3: "Dans un monde en réseau, la dépendance est une structure.",
}
COLLECTION_URL = "/livres/la-promesse-et-lemprise/"

# ISBN PROVISOIRES — ne pas publier tant que les tomes ne sont pas parus.
# Conservés ici pour mémoire ; aucune page ne les affiche.
TOMES_ISBN_PROVISOIRES = {1: "978-2-38427-001-1", 2: "978-2-38427-002-8",
                          3: "978-2-38427-003-5"}

# ═══════════════ À ÉDITER QUAND LES ÉLÉMENTS ARRIVENT ═══════════════
# Un seul endroit à modifier : relancer build.py et tout le site suit.

BUY_URL = ""   # ← URL BoD de commande. Vide = le bouton devient « bientôt disponible ».

# Profils externes. Une entrée vide n'est PAS affichée : mieux vaut trois liens
# que six dont la moitié ne mènent nulle part.
PROFILS = [
    ("LinkedIn",        ""),
    ("ORCID",           ""),
    ("HAL",             ""),
    ("Google Scholar",  ""),
]

# Couvertures : déposer les fichiers dans site/assets/couvertures/
# puis renseigner le nom ici. Vide = emplacement réservé, rien ne casse.
COVERS = {
    "equilibre-instable": "equilibre-instable.jpg",
    "tome-1":             "tome-1.jpg",
    "tome-2":             "tome-2.jpg",
    "tome-3":             "tome-3.jpg",
}
# ════════════════════════════════════════════════════════════════════


def cover(key, titre, grand=False):
    """Rend la couverture si le fichier est renseigné, sinon un emplacement neutre."""
    f = COVERS.get(key, "")
    cls = "cover big" if grand else "cover"
    if not f:
        return (f'<figure class="{cls} empty" aria-hidden="true">'
                f'<span>couverture<br>à venir</span></figure>')
    return (f'<figure class="{cls}"><img src="/assets/couvertures/{f}" '
            f'alt="Couverture de {titre}" loading="lazy" decoding="async"></figure>')


def buy_button(label="Commander le livre"):
    if BUY_URL:
        return (f'<a class="btn" href="{BUY_URL}" rel="noopener">{label}</a>')
    return ('<a class="btn disabled" aria-disabled="true" href="/contact/">'
            'Disponible sous peu — être prévenu</a>')

NAV = [("/livres/", "Livres"), ("/laboratoire/", "Laboratoire"),
       ("/notes/", "Notes"), ("/travaux/", "Travaux"),
       ("/parcours/", "Parcours"), ("/contact/", "Contact")]

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900&'
         'family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500&display=swap" rel="stylesheet">')

TODO = '<div class="note todo"><p><strong>À compléter.</strong> {}</p></div>'


def head(title, desc, path, schema="", og_image=""):
    nav = "\n        ".join(
        f'<a href="{h}"{" aria-current=\"page\"" if path.startswith(h) else ""}>{l}</a>'
        for h, l in NAV)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{DOMAIN}{path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{AUTHOR}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{DOMAIN}{path}">
<meta property="og:locale" content="fr_FR">
<meta property="og:image" content="{DOMAIN}/assets/couvertures/{og_image or 'equilibre-instable.jpg'}">
<meta name="twitter:card" content="summary_large_image">
{FONTS}
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icone-180.png">
<meta name="theme-color" content="#f1ede4">
{schema}</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="masthead">
  <div class="wrap">
    <a class="wordmark" href="/">Hans Boungomba <span>— équilibre instable</span></a>
    <nav class="nav" aria-label="Navigation principale">
        {nav}
    </nav>
  </div>
</header>
<main id="main">
"""


profils_html = "".join(
    f'<li><a href="{u}" rel="me noopener">{n}</a></li>' for n, u in PROFILS if u
) or '<li style="color:var(--ink-3)">Profils académiques à venir</li>'

FOOT = f"""</main>
<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div>
        <ul>
          <li><a href="/livres/equilibre-instable/">Équilibre instable</a></li>
          <li><a href="/livres/la-promesse-et-lemprise/">La promesse et l'emprise</a></li>
          <li><a href="/laboratoire/">Laboratoire interactif</a></li>
          <li><a href="/notes/">Notes</a></li>
        </ul>
      </div>
      <div>
        <ul>
          <li><a href="/parcours/">Parcours</a></li>
          <li><a href="/travaux/">Travaux et enseignement</a></li>
          <li><a href="/cv/">CV</a></li>
        </ul>
      </div>
      <div>
        <ul>
          <li><a href="/contact/">Contact</a></li>
          {profils_html}
        </ul>
      </div>
    </div>
    <p class="legal">© 2026 {AUTHOR}. {CLAIM_SHORT}<br>
      Textes sous <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr"
      rel="license noopener">CC BY-NC-SA 4.0</a> · code sous licence MIT ·
      couvertures et ouvrages, tous droits réservés.</p>
  </div>
</footer>
</body>
</html>
"""

PAGES = []


def page(path, title, desc, body, schema="", og_image=""):
    out = ROOT / "index.html" if path == "/" else ROOT / path.strip("/") / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(head(title, desc, path, schema, og_image) + body + FOOT, encoding="utf-8")
    PAGES.append(path)
    return path


def outline(parts):
    h = ""
    for titre, chaps in parts:
        if titre:
            h += f'<h3 style="margin-top:30px">{titre}</h3>'
        h += "<ul>" + "".join(f"<li>{c}</li>" for c in chaps) + "</ul>"
    return h


BOOK_SCHEMA = f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Book",
"name":"Équilibre instable",
"alternateName":"Perturber la respiration — Comment empêcher un pays de se développer sans le détruire",
"author":{{"@type":"Person","name":"{AUTHOR}"}},
"isbn":"{ISBN}","inLanguage":"fr","datePublished":"2026",
"publisher":{{"@type":"Organization","name":"Éditions Horizon Intérieur"}},
"url":"{DOMAIN}/livres/equilibre-instable/"}}
</script>
"""

# ═══════════════════════════════ accueil ═══════════════════════════════
page("/", f"{AUTHOR} — Équilibre instable",
     "Auteur d'« Équilibre instable : comment empêcher un pays de se développer sans le "
     "détruire ». Essais et modèles interactifs sur l'asphyxie institutionnelle et la "
     "dépendance commerciale.",
     f"""
<section class="thesis">
  <div class="wrap">
    <p class="claim">On n'empêche plus un pays de se développer en le détruisant.</p>
    <p class="gloss">On dérègle sa respiration. On l'installe dans l'urgence permanente,
      on épuise ses institutions, on rend chaque décision rationnelle à court terme et
      ruineuse à long terme. Le pays tient debout. Il ne respire plus.</p>
    <p class="gloss">C'est le sujet d'<em>Équilibre instable</em>, et la thèse que la trilogie
      <em>Accords commerciaux</em> démontre — par l'histoire, par la théorie des jeux, puis
      par les réseaux.</p>
    <p class="byline">Hans Boungomba — docteur en mécanique et métallurgie, ancien enseignant
      à l'INSA de Rennes. J'applique aux systèmes politiques les outils qui servent à décrire
      les structures sous contrainte : équilibres, seuils de rupture, irréversibilité.</p>
    <div class="btns">
      <a class="btn" href="/livres/equilibre-instable/">Le livre</a>
      <a class="btn ghost" href="/laboratoire/">Manipuler les modèles</a>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="split">
      <div class="aside">{cover("equilibre-instable", "Équilibre instable")}
        Paru en 2026<br>Éditions Horizon Intérieur<br>ISBN {ISBN}</div>
      <div>
        <h2>Équilibre instable</h2>
        <p class="lede"><em>Perturber la respiration</em> — comment empêcher un pays de se
          développer sans le détruire.</p>
        <p>Un être vivant tient debout parce qu'il régule son rythme en permanence. Une
          institution aussi. La domination contemporaine l'a compris : elle ne détruit plus,
          elle perturbe. Cinq niveaux de perturbation, trois origines de l'instabilité, des
          cas africains au cœur de la démonstration et des comparaisons mondiales pour en
          tester l'universalité. Le dernier chapitre porte sur la sortie : comment un pays
          retrouve son souffle.</p>
        <div class="btns">
          <a class="btn" href="/livres/equilibre-instable/">Sommaire et argument</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="split">
      <div class="aside">À paraître<br>Trois volumes</div>
      <div>
        <h2>La promesse et l'emprise</h2>
        <p class="accroche">Ils promettent le commerce. Ils instaurent la dépendance.</p>
        <p class="lede">Accords commerciaux et dépendance. Si l'asphyxie est un mécanisme,
          elle doit être démontrable : la collection la démontre trois fois, avec trois
          appareils qui ne se recouvrent pas.</p>
        <div class="grid three">
          <a class="item" href="/livres/la-promesse-et-lemprise/tome-1/"><span class="src">Tome 1</span>
            <h3>Accords commerciaux</h3>
            <p>De la promesse de commerce à la perte d'indépendance. Sept siècles, de Venise
               aux APE, où la même promesse produit le même résultat.</p>
            <span class="go">La fiche</span></a>
          <a class="item" href="/livres/la-promesse-et-lemprise/tome-2/"><span class="src">Tome 2</span>
            <h3>Théorie des jeux et dépendance commerciale</h3>
            <p>Coopérer, céder ou sortir du jeu. Pourquoi signer est rationnel à chaque
               période — et pourquoi l'accumulation est irréversible.</p>
            <span class="go">La fiche</span></a>
          <a class="item" href="/livres/la-promesse-et-lemprise/tome-3/"><span class="src">Tome 3</span>
            <h3>Graphes, groupes et systèmes de dépendance</h3>
            <p>Modéliser les réseaux de pouvoir, de flux et de verrouillage. Mesurer la
               dépendance plutôt que la dénoncer.</p>
            <span class="go">La fiche</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="split">
      <div class="aside">Sans inscription</div>
      <div>
        <h2>Vérifiez la démonstration vous-même</h2>
        <p class="lede">Les figures des livres ne sont pas des illustrations : ce sont des
          modèles paramétrables. Déplacez les curseurs, observez à quel moment le régime
          bascule — et à quel moment il ne revient plus en arrière.</p>
        <div class="grid two">
          <a class="item" href="/laboratoire/jeu-commercial/">
            <span class="src">Tome 2 · quatre modules</span>
            <h3>Le jeu commercial</h3>
            <p>Jeu séquentiel asymétrique, gain immédiat contre coût différé, dilemme du
               prisonnier commercial, verrouillage par jeux répétés.</p>
            <span class="go">Ouvrir le simulateur</span></a>
          <a class="item" href="/laboratoire/irex/">
            <span class="src">Tome 3 · chapitre 5</span>
            <h3>IREX — le risque de verrouillage avant signature</h3>
            <p>Un indice qui se calcule avant de signer, pas après. Sept questions, et une
               validation sur dix-huit accords historiques.</p>
            <span class="go">Ouvrir le calculateur</span></a>
          <a class="item" href="/laboratoire/atlas-reseaux/">
            <span class="src">Tome 3 · cinq modèles</span>
            <h3>Atlas des réseaux de dépendance</h3>
            <p>Six instantanés historiques du commerce mondial, centralités, propagation de
               chocs, coalitions, indice dynamique.</p>
            <span class="go">Ouvrir l'atlas</span></a>
        </div>
        <div class="btns"><a class="btn ghost" href="/laboratoire/">Les sept modèles</a></div>
      </div>
    </div>
  </div>
</section>

<section class="subscribe">
  <div class="wrap">
    <h2>Une analyse par mois</h2>
    <p>Un texte mensuel sur les systèmes qui tiennent debout jusqu'au moment où ils ne
      tiennent plus. Pas de relance, pas de publicité, désabonnement en un clic.</p>
    <form action="#" method="post">
      <label class="skip" for="email">Adresse e-mail</label>
      <input id="email" name="email" type="email" required placeholder="votre@email.fr">
      <button type="submit">S'inscrire</button>
    </form>
  </div>
</section>
""")

# ═══════════════════════════════ livres ═══════════════════════════════
page("/livres/", f"Livres — {AUTHOR}",
     "Équilibre instable (paru, BoD) et la trilogie Accords commerciaux : de la promesse "
     "de commerce à la perte d'indépendance.",
     f"""
<section class="band">
  <div class="wrap">
    <h1>Livres</h1>
    <p class="lede">Un essai paru, qui pose la thèse. Une trilogie en préparation, qui la
      démontre par trois méthodes distinctes.</p>
    <div class="grid two">
      <a class="item" href="/livres/equilibre-instable/">
        <span class="src">Paru en 2026 · BoD · ISBN {ISBN}</span>
        <h3>Équilibre instable</h3>
        <p><em>Perturber la respiration</em> — comment empêcher un pays de se développer sans
           le détruire. De la respiration
           individuelle à l'asphyxie des nations : sept chapitres, cinq niveaux de
           perturbation, et une sortie.</p>
        <span class="go">Sommaire et argument</span></a>
      <a class="item" href="/livres/la-promesse-et-lemprise/">
        <span class="src">Collection · trois volumes</span>
        <h3>La promesse et l'emprise</h3>
        <p>Accords commerciaux et dépendance. Trois volumes : l'archive historique, le modèle
           stratégique, le graphe. Une collection pour penser le monde autrement.</p>
        <span class="go">La collection</span></a>
    </div>
  </div>
</section>
""")

# ─────────────────────── Équilibre instable ───────────────────────
page("/livres/equilibre-instable/",
     f"Équilibre instable — {AUTHOR}",
     "Comment empêcher un pays de se développer sans le détruire. Essai paru chez BoD, "
     f"ISBN {ISBN}. Sommaire, argument et modèles associés.",
     f"""
<section class="band">
  <div class="wrap">
    <div class="split">
      <div class="aside">{cover("equilibre-instable", "Équilibre instable", grand=True)}
        Essai · paru en 2026<br>Éditions Horizon Intérieur<br>ISBN {ISBN}</div>
      <div>
        <h1>Équilibre instable</h1>
        <p class="lede"><em>Perturber la respiration</em> — comment empêcher un pays de se
          développer sans le détruire.</p>
        <div class="btns">
          {buy_button()}
          <a class="btn ghost" href="/laboratoire/perspective/">Le modèle associé</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2>L'argument</h2>
    <p>Un organisme vivant ne tient pas debout par stabilité, mais par régulation permanente :
      il respire. Une institution fonctionne de la même manière — elle absorbe les chocs à
      condition de disposer de temps, de mémoire et de rythme.</p>
    <p>Détruire un pays est coûteux, visible et politiquement condamnable. Le perturber ne
      l'est pas. Il suffit de le priver de temps long : urgence permanente, réformes
      incessantes, dépendances vitales, capture du récit. Les institutions restent en place,
      les élections ont lieu, les indicateurs existent — mais plus rien ne se construit sur
      la durée.</p>
    <p>L'essai distingue la domination par destruction de la domination par perturbation,
      identifie cinq niveaux de perturbation et trois origines de l'instabilité — endogène,
      exploitée, entretenue — et refuse la facilité de la théorie du complot : une instabilité
      entretenue n'exige aucun chef d'orchestre, seulement des acteurs qui ont intérêt à ce
      que rien ne se stabilise. Les cas africains forment le cœur de la démonstration, les
      comparaisons mondiales en testent l'universalité.</p>
    <p>Le dernier chapitre est le plus important, et le moins attendu : il porte sur la sortie.
      Reprendre le contrôle du temps est une opération politique concrète, pas un slogan.</p>

    <h2 style="margin-top:44px">Sommaire</h2>
    {outline([
        (None, ["Introduction — le rythme comme condition de la vie"]),
        (None, ["1. Respirer pour penser",
                "2. La vie comme système en équilibre instable",
                "3. Les institutions comme systèmes respirants",
                "4. Perturber la respiration : anatomie d'une stratégie",
                "5. L'asphyxie des nations : une logique mondiale",
                "6. Retrouver le souffle",
                "Conclusion — respirer ensemble : du souffle individuel au souffle historique"]),
    ])}

    <div class="note"><p>L'essai consacre une section entière à ce qu'il ne démontre pas.
      C'est délibéré : une thèse qui explique tout n'explique rien.</p></div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <h2>Les modèles de ce livre</h2>
    <div class="grid two">
      <a class="item" href="/laboratoire/perspective/"><span class="src">Perspective</span>
        <h3>La vie comme équilibre instable</h3>
        <p>Le même schéma d'une échelle à l'autre : molécule, cellule, individu, société,
           biosphère, cosmos.</p><span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/revue-equilibre/"><span class="src">Cadre théorique</span>
        <h3>Revue des équilibres instables</h3>
        <p>Définition formelle, typologie, sources d'instabilité, modèles mathématiques et
           critères de stabilité.</p><span class="go">Ouvrir</span></a>
    </div>
  </div>
</section>
""", schema=BOOK_SCHEMA, og_image=COVERS.get("equilibre-instable", ""))

# ─────────────────────── série Accords commerciaux ───────────────────────
SERIES_SCHEMA = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BookSeries",
"name":"La promesse et l'emprise","alternateName":"Accords commerciaux et dépendance",
"author":{"@type":"Person","name":"Hans Boungomba"},"inLanguage":"fr",
"hasPart":[
 {"@type":"Book","name":"Accords commerciaux","position":1},
 {"@type":"Book","name":"Théorie des jeux et dépendance commerciale","position":2},
 {"@type":"Book","name":"Graphes, groupes et systèmes de dépendance","position":3}]}
</script>
"""

page("/livres/la-promesse-et-lemprise/",
     f"La promesse et l'emprise — {AUTHOR}",
     "Ils promettent le commerce. Ils instaurent la dépendance. Une collection en trois "
     "volumes : histoire, théorie des jeux et modélisation en réseaux.",
     """
<section class="band">
  <div class="wrap">
    <h1>La promesse et l'emprise</h1>
    <p class="accroche">Ils promettent le commerce. Ils instaurent la dépendance.</p>
    <p class="lede">Accords commerciaux et dépendance — une collection en trois volumes.</p>

    <figure class="planche">
      <a href="/assets/couvertures/collection-planche-large.jpg"
         title="Voir la planche en grand">
        <img src="/assets/couvertures/collection-planche.jpg"
             alt="Planche de la collection La promesse et l'emprise : les premières de
                  couverture des trois tomes — Accords commerciaux, Théorie des jeux et
                  dépendance commerciale, Graphes, groupes et systèmes de dépendance."
             width="1400" height="1306" loading="lazy" decoding="async"></a>
      <figcaption>Les trois volumes de la collection. Cliquez pour agrandir.</figcaption>
    </figure>
    <p>Depuis sept siècles, la même promesse revient : ouvrez vos marchés, la prospérité
      suivra. Depuis sept siècles, elle produit des positions asymétriques durables. Ni
      accident répété, ni complot — un mécanisme. La collection l'établit trois fois, avec
      trois appareils qui ne se recouvrent pas : l'archive, le modèle stratégique, le graphe.</p>
    <div class="note"><p><strong>À paraître.</strong> Les trois volumes sont en cours de
      finalisation éditoriale. Les modèles interactifs qui les accompagnent sont, eux,
      déjà accessibles dans le <a href="/laboratoire/">laboratoire</a> — et l'essai
      <a href="/livres/equilibre-instable/">Équilibre instable</a>, qui pose la thèse,
      est paru.</p></div>
    """ + TODO.format("Statut d'avancement et date de parution prévisionnelle par volume, "
                      "éditeur, et formulaire d'alerte de parution.") + """
    <div class="grid three">
      <a class="item" href="/livres/la-promesse-et-lemprise/tome-1/">
        <span class="src">Tome 1 · à paraître</span>
        <h3>Accords commerciaux</h3>
        <p>De la promesse de commerce à la perte d'indépendance. Venise et la Hanse, les
           compagnies à charte, les traités inégaux, Berlin 1885, Bretton Woods, les plans
           d'ajustement, les APE.</p>
        <span class="go">La fiche</span></a>
      <a class="item" href="/livres/la-promesse-et-lemprise/tome-2/">
        <span class="src">Tome 2 · à paraître</span>
        <h3>Théorie des jeux et dépendance commerciale</h3>
        <p>Coopérer, céder ou sortir du jeu. Asymétries structurelles, coût différé, dilemme
           asymétrique, jeux répétés, dépendance de sentier, stratégies de réouverture.</p>
        <span class="go">La fiche</span></a>
      <a class="item" href="/livres/la-promesse-et-lemprise/tome-3/">
        <span class="src">Tome 3 · à paraître</span>
        <h3>Graphes, groupes et systèmes de dépendance</h3>
        <p>Modéliser les réseaux de pouvoir, de flux et de verrouillage. Centralité,
           périphérie, propagation des chocs, reconfiguration.</p>
        <span class="go">La fiche</span></a>
    </div>
    <p class="devise">Une collection pour penser le monde autrement.</p>
  </div>
</section>
""", schema=SERIES_SCHEMA, og_image="collection-planche.jpg")


def tome(num, titre, sous_titre, desc, argument, parts, labs, statut):
    lab_html = "".join(
        f'<a class="item" href="{u}"><span class="src">{s}</span><h3>{t}</h3><p>{d}</p>'
        f'<span class="go">Ouvrir</span></a>' for u, s, t, d in labs)
    lab_block = (f'<h2>Les modèles de ce tome</h2><div class="grid two">{lab_html}</div>'
                 if labs else "<h2>Les modèles de ce tome</h2>"
                 + TODO.format("Aucun modèle interactif n'est encore rattaché à ce volume. "
                               "Le tome 1 se prêterait à une chronologie interactive des "
                               "accords majeurs, de Venise aux APE — c'est le format qui "
                               "circule le mieux."))
    return page(f"/livres/la-promesse-et-lemprise/tome-{num}/",
                f"{titre} — tome {num} — {AUTHOR}", desc, f"""
<section class="band">
  <div class="wrap">
    <div class="split">
      <div class="aside">{cover(f"tome-{num}", titre)}
        {COLLECTION}<br>{COLLECTION_SS}<br>Tome {num} sur 3<br>{statut}</div>
      <div>
        <h1>{titre}</h1>
        <p class="accroche">{ACCROCHES[num]}</p>
        <p class="lede">{sous_titre}</p>
        <div class="btns">
          <a class="btn disabled" aria-disabled="true" href="/contact/">À paraître — être prévenu</a>
          <a class="btn ghost" href="/livres/la-promesse-et-lemprise/">La collection</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2>L'argument</h2>
    {argument}
    <h2 style="margin-top:44px">Sommaire</h2>
    {outline(parts)}
  </div>
</section>

<section class="band">
  <div class="wrap">
    {lab_block}
  </div>
</section>
""", og_image=COVERS.get(f"tome-{num}", ""))


tome(1, "Accords commerciaux",
     "De la promesse de commerce à la perte d'indépendance",
     "Sept siècles d'accords commerciaux, de Venise aux Accords de partenariat économique : "
     "la dépendance comme mécanisme endogène plutôt que comme accident.",
     """<p>L'énigme est transhistorique : pourquoi des accords conclus librement, entre
     parties souveraines, produisent-ils si régulièrement des positions asymétriques durables ?</p>
     <p>La réponse orthodoxe traite la dépendance comme un accident — mauvaise négociation,
     institutions faibles, conjoncture. La réponse critique en fait un mécanisme endogène.
     Ce volume montre pourquoi la première est insuffisante, et pourquoi la seconde reste
     imprécise tant qu'on ne distingue pas rigoureusement trois niveaux d'analyse.</p>
     <p>Suit l'archive : Venise, Gênes et la Hanse ; les compagnies à charte en Asie ; les
     traités inégaux du XIX<sup>e</sup> siècle ; l'Acte de Berlin de 1885, qui articule
     libre-échange et partition coloniale ; Bretton Woods ; les plans d'ajustement structurel ;
     les Accords de partenariat économique UE-ACP, remarquables par leur résilience adaptative.
     Le dernier temps du volume porte sur les sorties — décolonisations et continuités,
     ruptures avec le FMI — et sur ce qu'elles coûtent.</p>""",
     [("Genèse historique de la promesse commerciale",
       ["1. La promesse et la séduction du commerce"]),
      ("Mécanismes structurels de la dépendance",
       ["2. Les mécanismes de la dépendance — asymétrie de pouvoir, contrats incomplets et "
        "verrouillage institutionnel, hégémonie culturelle et violence symbolique"]),
      ("Sorties, ruptures et reconfigurations",
       ["3. Les dynamiques de sortie de la dépendance"]),
      ("Bilan et prolongements",
       ["Conclusion générale",
        "Acronymes, annexes, chronologie comparée des accords majeurs, bibliographie"])],
     [("/laboratoire/chronologie/", "Quatorze accords · sept siècles",
       "Chronologie des accords commerciaux",
       "De Venise aux APE : pour chaque accord, la promesse annoncée, le mécanisme réel et "
       "le résultat observé une génération plus tard.")],
     "À paraître")

tome(2, "Théorie des jeux et dépendance commerciale",
     "Coopérer, céder ou sortir du jeu",
     "Pourquoi accepter l'accord est la décision rationnelle à chaque période, et pourquoi "
     "l'accumulation de ces décisions rend la sortie impossible.",
     """<p>Le résultat central est contre-intuitif : le verrouillage ne suppose ni coercition,
     ni erreur de jugement. À chaque période, accepter l'accord est la meilleure réponse pour
     la partie dépendante. Le coût de sortie, lui, croît à chaque période. Le point de bascule
     survient donc alors que chaque décision prise reste défendable.</p>
     <p>Le volume établit d'abord que l'accord commercial est une situation de jeu et non un
     acte de coopération, puis recense quatre asymétries structurelles : ressources,
     alternatives, information, capacité d'attente. Il montre ensuite comment le gain immédiat
     et le coût différé se dissocient sous actualisation asymétrique, puis comment le dilemme
     du prisonnier commercial se coordonne tacitement sur un équilibre défavorable — notamment
     par fragmentation interne et capture politique.</p>
     <p>La partie sur le verrouillage démonte cinq mécanismes microéconomiques qui se
     multiplient au lieu de s'additionner : rendements croissants et externalités de réseau,
     coûts irrécupérables et actifs spécifiques, obsolescence des savoir-faire, verrouillage
     spatial des infrastructures, coalitions de rente domestiques. Le dernier temps est
     stratégique : renégocier, transformer ou sortir, et à quelles conditions les coalitions
     Sud-Sud résistent à la tentation de défection.</p>""",
     [("Cadre théorique du jeu commercial",
       ["1. L'accord commercial comme situation de jeu",
        "2. Les asymétries structurelles du jeu commercial"]),
      ("Transformation progressive de la coopération en dépendance",
       ["3. Le gain immédiat contre le coût différé",
        "4. Le dilemme du prisonnier commercial",
        "5. Jeux répétés et dépendance progressive"]),
      ("Verrouillage de la dépendance",
       ["6. L'accumulation silencieuse : comment les gains à court terme créent des "
        "contraintes à long terme",
        "7. Dépendance de sentier et spécialisation forcée : les fondements "
        "microéconomiques de l'irréversibilité productive"]),
      ("Stratégies de réouverture du jeu",
       ["8. Renégocier, transformer ou sortir du jeu",
        "9. Coopération Sud-Sud, coalitions et contre-stratégies"])],
     [("/laboratoire/jeu-commercial/", "Quatre modules · chapitres 1 à 7",
       "Simulateur du jeu commercial",
       "Induction à rebours, point de bascule T* et seuil critique, matrice asymétrique, "
       "théorème folk et simulation du verrouillage sur vingt périodes.")],
     "À paraître")

tome(3, "Graphes, groupes et systèmes de dépendance",
     "Modéliser les réseaux de pouvoir, de flux et de verrouillage",
     "Cartographier, mesurer et prédire la dépendance : théorie des graphes, théorie des "
     "groupes, indice d'interdépendance économique et indice de risque ex-ante.",
     """<p>Si la dépendance est une structure, elle a une topologie — et une topologie se
     mesure. Ce volume quitte le récit et le modèle à deux joueurs pour le graphe mondial.</p>
     <p>Il reconstruit six instantanés historiques du commerce mondial à partir de sources
     publiques, identifie les pôles par les indices de centralité, simule la propagation des
     chocs le long des arêtes, formalise les coalitions par la théorie des groupes, et propose
     un indice dynamique de dépendance. Les annexes étendent la méthode à quatre autres
     réseaux : monnaies de réserve, chaînes de valeur multicouches, dette souveraine et
     cascades de défaut, points d'étranglement maritimes.</p>
     <p>Deux instruments en sortent : l'indice d'interdépendance économique (IIE), qui mesure
     l'asymétrie d'une relation bilatérale, et l'indice de risque ex-ante (IREX), calibré sur
     données historiques, qui évalue le risque de verrouillage d'un accord <em>avant</em>
     signature. Le volume s'achève sur la gouvernance : principes d'accords équilibrés et
     scénarios 2025-2050.</p>
     <p>L'enjeu est de rendre la dépendance discutable sur pièces plutôt que sur positions.
     Un indice réfutable vaut mieux qu'une dénonciation juste.</p>""",
     [(None, ["Introduction générale — pourquoi les graphes et les groupes pour penser "
              "la dépendance",
              "1. Cartographier les dépendances : graphes historiques des échanges, de la "
              "période mercantile à l'émergence multipolaire",
              "2. Détecter les pôles de puissance : centralités, concentration, indice "
              "d'interdépendance économique (IIE), communautés et hubs critiques",
              "3. Propagation des chocs : modèles épidémiologiques, chaînes de valeur, "
              "contagion financière, ruptures logistiques, endiguement",
              "4. Coalitions et symétries : coalitions comme groupes algébriques, "
              "sous-groupes régionaux, équivalences structurelles, critères de stabilité",
              "5. Modélisation dynamique et prédiction : équation dynamique de dépendance, "
              "calibration historique, indice de risque ex-ante (IREX), scénarios",
              "6. Vers une gouvernance mondiale repensée : principes d'accords équilibrés, "
              "scénarios 2025-2050, recommandations",
              "Conclusion générale — synthèse des trois tomes, limites reconnues, agenda "
              "de recherche",
              "Annexes : monnaies de réserve, chaînes de valeur multicouches, cascade de "
              "défauts souverains, points d'étranglement maritimes, treillis de coalitions"])],
     [("/laboratoire/irex/", "Chapitre 5 · calculateur", "IREX — indice de risque ex-ante",
       "Sept questions sur l'asymétrie de l'accord et l'option extérieure, un indice, et "
       "la comparaison avec dix-huit accords historiques."),
      ("/laboratoire/atlas-reseaux/", "Atlas principal · 5 modèles",
       "Atlas des réseaux de dépendance",
       "Graphes historiques, centralités, propagation, coalitions algébriques, équation "
       "dynamique."),
      ("/laboratoire/annexe-reseaux/", "Annexe · 5 figures", "Cinq autres réseaux",
       "Monnaies de réserve, chaînes de valeur multicouches, cascade de défauts souverains, "
       "points d'étranglement maritimes, treillis de coalitions.")],
     "À paraître")

# ═══════════════════════════════ laboratoire ═══════════════════════════════
page("/laboratoire/", f"Laboratoire — {AUTHOR}",
     "Sept modèles interactifs adossés aux livres : théorie des jeux, réseaux de dépendance, "
     "propagation de chocs, équilibres instables.",
     """
<section class="band">
  <div class="wrap">
    <h1>Laboratoire</h1>
    <p class="lede">Sept modèles ouverts, sans inscription. Ils ne remplacent pas
      l'argumentation des livres : ils permettent de la tester. Déplacez les paramètres,
      observez à quel moment le régime bascule.</p>
    <div class="note"><p><strong>Statut des figures.</strong> Certaines reposent sur des
      données publiques (BACI-CEPII, UN Comtrade, DESTA, COFER-FMI, OECD TiVA), d'autres sur
      des reconstructions ou des simulations exploratoires. Chaque figure indique son statut.</p></div>
    <div class="grid two">
      <a class="item" href="/laboratoire/irex/">
        <span class="src">La promesse et l'emprise · tome 3, chapitre 5</span>
        <h3>IREX — le risque de verrouillage avant signature</h3>
        <p>Sept questions, un indice. Estimez la dépendance vers laquelle un accord tend à
           l'équilibre, et comparez-la à dix-huit accords historiques.</p>
        <span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/chronologie/">
        <span class="src">La promesse et l'emprise · tome 1</span>
        <h3>Chronologie des accords commerciaux</h3>
        <p>Quatorze accords majeurs, de l'expansion vénitienne aux Accords de partenariat
           économique. Pour chacun : la promesse annoncée, le mécanisme réel, le résultat.
           Filtrable par mécanisme.</p>
        <span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/jeu-commercial/">
        <span class="src">La promesse et l'emprise · tome 2</span>
        <h3>Le jeu commercial</h3>
        <p>Quatre modules paramétrables : jeu séquentiel asymétrique, gain immédiat contre
           coût différé, dilemme du prisonnier commercial, jeux répétés et verrouillage.</p>
        <span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/atlas-reseaux/">
        <span class="src">La promesse et l'emprise · tome 3</span>
        <h3>Atlas des réseaux de dépendance</h3>
        <p>Cartographie historique, indices de centralité, propagation de chocs, coalitions
           algébriques, équation dynamique de la dépendance.</p>
        <span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/annexe-reseaux/">
        <span class="src">La promesse et l'emprise · tome 3, annexe</span>
        <h3>Cinq autres réseaux</h3>
        <p>Monnaies de réserve, chaînes de valeur multicouches, cascade de défauts souverains,
           points d'étranglement maritimes, treillis de coalitions.</p>
        <span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/revue-equilibre/">
        <span class="src">Équilibre instable · cadre théorique</span>
        <h3>Revue des équilibres instables</h3>
        <p>Définition formelle, typologie des équilibres, sources d'instabilité, modèles
           mathématiques et critères de stabilité.</p>
        <span class="go">Ouvrir</span></a>
      <a class="item" href="/laboratoire/perspective/">
        <span class="src">Équilibre instable · perspective</span>
        <h3>La vie comme équilibre instable</h3>
        <p>Le même schéma d'une échelle à l'autre : molécule, cellule, individu, société,
           biosphère, cosmos.</p>
        <span class="go">Ouvrir</span></a>
    </div>
  </div>
</section>
""")

# ═══════════════════════════════ parcours ═══════════════════════════════
page("/parcours/", f"Parcours — {AUTHOR}",
     "Docteur en mécanique et métallurgie, ancien enseignant à l'INSA de Rennes, "
     "auteur d'Équilibre instable.",
     """
<section class="band">
  <div class="wrap narrow">
    <h1>Parcours</h1>
    <p class="lede">J'ai passé des années à étudier comment les matériaux cèdent. J'écris
      aujourd'hui sur la manière dont les pays cèdent. Ce n'est pas une reconversion, c'est
      la même question.</p>
    <p>Doctorat en mécanique et métallurgie, travaux en tribologie et fabrication additive,
      enseignement à l'INSA de Rennes. Une pièce sous contrainte ne rompt pas au moment où la
      charge est la plus forte. Elle rompt quand une accumulation de micro-déformations,
      chacune insignifiante, a rendu la rupture inévitable. La charge n'a pas changé. La
      structure, si.</p>
    <p>Cette description s'applique mot pour mot à une institution privée de temps long. C'est
      ce transfert d'outils — équilibres, seuils, irréversibilité, dépendance de sentier — qui
      fait la particularité de mes essais, et qui explique pourquoi ils sont accompagnés de
      modèles plutôt que d'exemples.</p>
    """ + TODO.format("Ajouter deux paragraphes sur le rapport au Gabon — Libreville, Moanda. "
                      "Les cas africains sont le cœur de la démonstration d'Équilibre instable : "
                      "le lecteur doit savoir d'où parle l'auteur.") + """
    <div class="btns">
      <a class="btn ghost" href="/cv/">Le CV détaillé</a>
      <a class="btn ghost" href="/travaux/">Travaux et enseignement</a>
    </div>
  </div>
</section>
""")

# ═══════════════════════════════ cv ═══════════════════════════════
# Adresse postale et numéro de téléphone volontairement absents :
# un CV en ligne se consulte, il ne diffuse pas de coordonnées privées.

def poste(annees, titre, lieu, lignes):
    li = "".join(f"<li>{l}</li>" for l in lignes)
    return f'''<div class="entry"><div class="when">{annees}</div>
      <div><h3>{titre}</h3><p class="where">{lieu}</p><ul>{li}</ul></div></div>'''


page("/cv/", f"CV — {AUTHOR}",
     "Docteur en mécanique et métallurgie, qualifié CNU section 60. Enseignement à l'INSA "
     "de Rennes, recherche en tribologie, fabrication additive et caractérisation "
     "métallurgique.",
     f"""
<section class="band">
  <div class="wrap narrow">
    <h1>Curriculum vitæ</h1>
    <p class="lede">Docteur en mécanique et métallurgie, qualifié aux fonctions de maître de
      conférences (CNU section 60). Enseignement en école d'ingénieurs, recherche en
      tribologie, fabrication additive métallique et caractérisation des matériaux.</p>
    <div class="btns">
      <a class="btn" href="/contact/">Demander le CV en PDF</a>
      <a class="btn ghost" href="/travaux/">Publications</a>
    </div>
    {TODO.format("Redéposer les deux CV en PDF dans /assets/cv/ — les fichiers précédents "
                 "n'étaient pas de vrais PDF et ont été retirés. Puis remplacer le premier "
                 "bouton par un lien de téléchargement.")}
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2>Expérience professionnelle</h2>
    <div class="entries">
      {poste("2025 – 2026", "Enseignant contractuel en génie mécanique et automatique",
             "INSA de Rennes",
             ["Enseignement du génie mécanique et automatique en CM, TD et TP — 400 heures",
              "Suivi pédagogique des apprentis",
              "Encadrement de projets avec des partenaires industriels"])}
      {poste("2022 – 2025", "Post-doctorat",
             "LAMIH UMR CNRS 8201, UPHF / INSA Hauts-de-France, Valenciennes",
             ["Solutions hybrides de réparation d'outils par fabrication additive métallique",
              "Analyse multi-échelle, morpho-mécanique et métallurgique des pièces réparées",
              "Méthodes hybrides d'optimisation de la réparation des outils de mise en forme"])}
      {poste("2018 – 2022", "Thèse CIFRE — ingénieur R&amp;D, expert matériaux",
             "LAMIH UMR CNRS 8201 / Sogefi, Douai",
             ["Caractérisation métallurgique d'aciers spéciaux de suspension",
              "Base de données pour le diagnostic des défaillances matériaux",
              "Modèle de défauts à visée qualitative"])}
      {poste("2017 – 2018", "Ingénieur d'études",
             "LAMIH UMR CNRS 8201, Valenciennes",
             ["Modélisation numérique des procédés de mise en forme",
              "Développement de lois de rhéologie complexes",
              "Participation à des projets de recherche collaborative"])}
      {poste("2016 – 2017", "Ingénieur calcul mécanique", "Cimag International, Paris",
             ["Analyse de cahiers des charges et études de faisabilité",
              "Notes de calcul techniques et accompagnement client"])}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2>Formation</h2>
    <div class="entries">
      <div class="entry"><div class="when">2018 – 2022</div>
        <div><h3>Doctorat en mécanique et métallurgie</h3>
        <p class="where">Université Polytechnique Hauts-de-France</p></div></div>
      <div class="entry"><div class="when">2012 – 2016</div>
        <div><h3>Master en génie mécanique, option aéronautique</h3>
        <p class="where">Université de Bordeaux</p></div></div>
      <div class="entry"><div class="when">2011 – 2012</div>
        <div><h3>Classe préparatoire sciences pour l'ingénieur</h3>
        <p class="where">Lycée Marie Curie</p></div></div>
      <div class="entry"><div class="when">2009 – 2011</div>
        <div><h3>DUT génie mécanique et productique</h3>
        <p class="where">Université de Picardie Jules Verne</p></div></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2>Enseignement</h2>
    <p><strong>2025 – 2026, INSA de Rennes — 400 HETD.</strong> CM, TD et TP de la première
      à la cinquième année : procédés de mise en œuvre industrielle, usinage, systèmes
      automatisés, CAO, résistance des matériaux, mécanique des fluides, mécanique du solide.</p>
    <p><strong>2018 – 2025, IUT Hauts-de-France (BUT GIM 1 et 2) et INSA Hauts-de-France
      (L1) — 200 HETD.</strong> Résistance des matériaux en CM, chimie des matériaux en TD,
      thermodynamique en TP. Promotions de 60 à 200 étudiants par an.</p>
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2>Compétences expérimentales et numériques</h2>
    <dl class="skills">
      <dt>Essais mécaniques</dt>
      <dd>Traction et compression (Syntech) · fatigue (Gleeble 3500)</dd>
      <dt>Caractérisation métallurgique</dt>
      <dd>MEB, EDS, EBSD (JEOL JSM-7100F) · DRX (X-Ray Bot)</dd>
      <dt>Fabrication mécanique</dt>
      <dd>Usinage MOCN — fraisage Haas UMC 500 et 750, Minimil · tournage Haas ST10 et CMZ ·
        fabrication additive métallique DED (Meltio M450)</dd>
      <dt>Modélisation et outils</dt>
      <dd>Abaqus, HyperStudy, Python, Matlab · conception SolidWorks et Catia V5</dd>
      <dt>Langues</dt>
      <dd>Français, langue maternelle · anglais courant — lecture, rédaction scientifique,
        présentation orale</dd>
    </dl>
  </div>
</section>
""")

# ═══════════════════════════════ travaux ═══════════════════════════════
page("/travaux/", f"Travaux et enseignement — {AUTHOR}",
     "Publications en tribologie, usure et transferts thermiques ; communications "
     "internationales ; enseignement en école d'ingénieurs.",
     """
<section class="band">
  <div class="wrap narrow">
    <h1>Travaux</h1>
    <p class="lede">Recherche en tribologie, usure, fabrication additive métallique et
      caractérisation des matériaux. Les essais qui suivent portent sur des structures
      soumises à des contraintes répétées — c'est le même objet que les essais d'économie
      politique, à une autre échelle.</p>

    <h2 style="margin-top:40px">Publications</h2>
    <div class="entries">
      <div class="entry"><div class="when">2025</div>
        <div><h3><a href="https://doi.org/10.1016/j.ijheatmasstransfer.2025.127893"
             rel="noopener">International Journal of Heat and Mass Transfer</a></h3>
        <p>DOI&nbsp;: 10.1016/j.ijheatmasstransfer.2025.127893</p></div></div>
      <div class="entry"><div class="when">2024</div>
        <div><h3><a href="https://doi.org/10.1016/j.wear.2024.205272"
             rel="noopener">Wear</a></h3>
        <p>DOI&nbsp;: 10.1016/j.wear.2024.205272</p></div></div>
      <div class="entry"><div class="when">2023</div>
        <div><h3><a href="https://doi.org/10.1016/j.triboint.2022.108164"
             rel="noopener">Tribology International</a></h3>
        <p>DOI&nbsp;: 10.1016/j.triboint.2022.108164</p></div></div>
    </div>
    """ + TODO.format("Ajouter les titres exacts des trois articles et la liste des "
                      "co-auteurs : un DOI seul ne dit pas au lecteur de quoi traite "
                      "l'article, et le titre est ce que les moteurs indexent.") + """

    <h2 style="margin-top:40px">Communications</h2>
    <div class="entries">
      <div class="entry"><div class="when">2025</div>
        <div><h3>WoM — Wear of Materials</h3><p>Sitges, Espagne.</p></div></div>
      <div class="entry"><div class="when">2024</div>
        <div><h3>AMS — Additive Manufacturing Symposium</h3><p>Senlis, France.</p></div></div>
      <div class="entry"><div class="when">2021</div>
        <div><h3>ICTP — International Conference on Technology of Plasticity</h3>
        <p>Ohio, États-Unis.</p></div></div>
    </div>

    <h2 style="margin-top:40px">Essais</h2>
    <p>Deux ouvrages d'économie politique : <a href="/livres/equilibre-instable/">Équilibre
      instable</a>, paru en 2026, et la collection
      <a href="/livres/la-promesse-et-lemprise/">La promesse et l'emprise</a>, à paraître
      en trois volumes.</p>

    <div class="btns">
      <a class="btn ghost" href="/cv/">Le CV complet</a>
    </div>
  </div>
</section>
""")

# ═══════════════════════════════ notes ═══════════════════════════════
# Pour ajouter une note : un dict de plus dans NOTES, puis python3 build.py.
# `corps` est du HTML ; `date_iso` sert au tri et au balisage.

NOTES = []


def note(slug, titre, chapo, date_iso, date_lisible, desc, corps, suite=""):
    NOTES.append({"slug": slug, "titre": titre, "chapo": chapo,
                  "date_iso": date_iso, "date": date_lisible})
    schema = f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Article","headline":"{titre}",
"datePublished":"{date_iso}","inLanguage":"fr",
"author":{{"@type":"Person","name":"{AUTHOR}"}},
"publisher":{{"@type":"Person","name":"{AUTHOR}"}},
"url":"{DOMAIN}/notes/{slug}/"}}
</script>
"""
    return page(f"/notes/{slug}/", f"{titre} — {AUTHOR}", desc, f"""
<article>
<section class="band">
  <div class="wrap narrow">
    <p class="dateline"><time datetime="{date_iso}">{date_lisible}</time> · Note</p>
    <h1>{titre}</h1>
    <p class="lede">{chapo}</p>
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    {corps}
  </div>
</section>
</article>

<section class="band">
  <div class="wrap narrow">
    {suite}
  </div>
</section>
""", schema=schema)
note1_page = note(note1.SLUG, note1.TITRE, note1.CHAPO, note1.DATE_ISO, note1.DATE,
                  note1.DESC, note1.CORPS, note1.SUITE)

entries = "".join(
    f'''<div class="entry"><div class="when"><time datetime="{n["date_iso"]}">{n["date"]}</time></div>
        <div><h3><a href="/notes/{n["slug"]}/">{n["titre"]}</a></h3>
        <p>{n["chapo"]}</p></div></div>''' for n in NOTES)

page("/notes/", f"Notes — {AUTHOR}",
     "Une analyse par mois sur les systèmes en équilibre instable : asphyxie "
     "institutionnelle, dépendance, seuils et irréversibilité.",
     f"""
<section class="band">
  <div class="wrap narrow">
    <h1>Notes</h1>
    <p class="lede">Une analyse par mois. Un mécanisme à la fois, souvent accompagnée d'une
      figure manipulable.</p>
    <div class="entries">
      {entries}
    </div>
  </div>
</section>
""")

# ═══════════════════════════════ contact ═══════════════════════════════
page("/contact/", f"Contact — {AUTHOR}",
     "Contact pour la presse, les interventions, les collaborations de recherche et l'édition.",
     """
<section class="band">
  <div class="wrap narrow">
    <h1>Contact</h1>
    <p class="lede">Presse, interventions, collaborations de recherche, questions sur les
      modèles.</p>
    <p id="mail-contact">Adresse de contact à venir. En attendant, passez par
      <a href="https://github.com/hboungomba" rel="noopener">GitHub</a>.</p>
    """ + TODO.format("Créer contact@hansboungomba.fr — une redirection suffit — puis "
                      "remplacer ce paragraphe par le lien mailto. Une adresse annoncée "
                      "qui rebondit est pire que pas d'adresse du tout.") + """
  </div>
</section>
""")

# ═══════════════════════════════ 404 ═══════════════════════════════
(ROOT / "404.html").write_text(
    head("Page introuvable", "Cette page n'existe pas.", "/404.html") + """
<section class="band">
  <div class="wrap narrow">
    <h1>Cette page n'existe pas</h1>
    <p class="lede">Le lien est peut-être ancien. Les modèles sont rassemblés dans le
      laboratoire, les essais dans la section des livres.</p>
    <div class="btns">
      <a class="btn" href="/laboratoire/">Laboratoire</a>
      <a class="btn ghost" href="/">Accueil</a>
    </div>
  </div>
</section>
""" + FOOT, encoding="utf-8")

# ═══════════════════════════ robots + sitemap ═══════════════════════════
(ROOT / "robots.txt").write_text(
    f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n", encoding="utf-8")

LAB = ["/laboratoire/irex/", "/laboratoire/chronologie/", "/laboratoire/jeu-commercial/", "/laboratoire/atlas-reseaux/",
       "/laboratoire/annexe-reseaux/", "/laboratoire/revue-equilibre/",
       "/laboratoire/perspective/"]
(ROOT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{DOMAIN}{p}</loc></url>\n" for p in PAGES + LAB)
    + "</urlset>\n", encoding="utf-8")

print(f"{len(PAGES)} pages générées + 404, robots.txt, sitemap.xml")

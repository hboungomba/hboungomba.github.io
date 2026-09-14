# Site personnel — Hans Boungomba

Site statique, sans outil de compilation. On ouvre un fichier, on l'édite, on pousse.

**Thèse du site :** on n'empêche plus un pays de se développer en le détruisant — on dérègle
sa respiration. C'est le sous-titre du livre paru, et le fil des trois tomes.

**Deux œuvres distinctes, à ne pas confondre dans les communications :**

| | Titre | ISBN |
|---|---|---|
| Essai | *Équilibre instable — Perturber la respiration : comment empêcher un pays de se développer sans le détruire* — Éditions Horizon Intérieur (autoédition), 2026 | 978-2-322-61272-7 |
| Collection | *La promesse et l'emprise — Accords commerciaux et dépendance*, devise : « Une collection pour penser le monde autrement. » | — |
| — tome 1 | *Accords commerciaux — De la promesse de commerce à la perte d'indépendance* | à paraître |
| — tome 2 | *Théorie des jeux et dépendance commerciale — Coopérer, céder ou sortir du jeu* | à paraître |
| — tome 3 | *Graphes, groupes et systèmes de dépendance — Modéliser les réseaux de pouvoir, de flux et de verrouillage* | à paraître |

L'URL de la collection est `/livres/la-promesse-et-lemprise/`.

**Les ISBN des trois tomes sont provisoires et ne sont publiés nulle part.** Ils figurent
uniquement dans `build.py`, sous `TOMES_ISBN_PROVISOIRES`, pour mémoire. Un ISBN provisoire
mis en ligne est repris par les agrégateurs et les catalogues de bibliothèque, et reste
ensuite attaché au livre même après changement. Ne les republier qu'une fois définitifs —
et, à ce moment-là, les remettre dans le bloc `SERIES_SCHEMA` et sur les fiches.

Les couvertures des trois tomes portent les ISBN provisoires en code-barres. Si les
numéros changent, il faudra régénérer les fichiers de couverture avant parution.

---

## Licences

Trois régimes distincts, détaillés dans [LICENSES.md](LICENSES.md) :

| Contenu | Licence |
|---|---|
| Code (`build.py`, `assets/js/`, JS embarqué, CSS) | MIT |
| Textes et figures des pages | CC BY-NC-SA 4.0 |
| Couvertures et texte des ouvrages | tous droits réservés |
| `assets/data/networks.js` | données de tiers, non relicenciables |

GitHub affiche « MIT » en haut du dépôt parce qu'il ne lit que `LICENSE`. Ce badge ne vaut
que pour le code : c'est précisément pourquoi `LICENSE` se termine par un renvoi explicite
vers `LICENSES.md`, et pourquoi chaque script porte un en-tête SPDX.

## 1. Les modèles, tous opérationnels

Les six pages du laboratoire fonctionnent sans dépendance externe (hors polices Google).
Aucune bibliothèque tierce : tout est du SVG et du JavaScript natif.

Les scripts des deux atlas sont partagés, en un seul exemplaire :

```text
assets/data/networks.js    6 réseaux historiques (1600 → 2025), COALITIONS, IREX_CASES
assets/js/graph-utils.js   projection, adjacence, centralités (degré, intermédiarité,
                           vecteur propre, proximité), HHI par nœud
assets/js/chapter1..5.js   les 5 modèles de l'atlas principal
assets/js/annex1..5-*.js   les 5 figures de l'annexe
```

`graph-utils.js` est chargé en premier par les deux pages : il déclare les fonctions que
les autres scripts utilisent. Ne pas changer l'ordre des balises `<script>`.

Données effectivement présentes :

| Période | Nœuds | Liens |
|---|---|---|
| 1600 | 15 | 28 |
| 1750 | 16 | 32 |
| 1900 | 21 | 40 |
| 1960 | 20 | 38 |
| 2000 | 28 | 70 |
| 2025 | 37 | 107 |

## 2. Ce qui a été assaini

- Doublons supprimés : `Atlas_des_re_seaux_du_Tome_3.html`, `perspective_ultime.html`,
  `equilibre_instable_revue.html` et `Atlas_-_Annexe_autres_re_seaux.html` étaient
  identiques octet pour octet à leurs équivalents en kebab-case (seule différence :
  un lien cassé vers un nom de fichier accentué).
- Plus aucun nom de fichier avec espace ou accent.
- URLs propres : `/laboratoire/atlas-reseaux/` plutôt que `atlas-tome3.html`.
- Une seule feuille de style pour le site (`assets/css/site.css`), une pour les pages
  du laboratoire (`assets/css/lab.css`, ex-`styles.css`). `style.css` v2 est abandonnée.
- Barre de retour identique en haut des cinq pages du laboratoire.
- `robots.txt`, `sitemap.xml`, `404.html`, balises `description`, `canonical` et
  Open Graph sur chaque page.

## 3. Arborescence

```text
/                        accueil — la thèse, les modèles, les tomes
/livres/                 index des deux œuvres
  equilibre-instable/    le livre paru (données schema.org Book)
  accords-commerciaux/   la trilogie + tome-1/ tome-2/ tome-3/
/laboratoire/            index + les 7 modèles
/parcours/               récit professionnel
/cv/                     CV HTML + 2 PDF
/travaux/                publications et enseignement
/notes/                  carnet mensuel
/contact/
/assets/css/             site.css, lab.css
/assets/cv/              les deux PDF
```

## 4. Modifier le site

Les pages de contenu sont générées par `build.py` (fourni à côté du dossier `site/`).
Deux façons de travailler :

- **Simple** — éditer directement les fichiers `index.html`. Ne plus relancer `build.py`,
  qui les écraserait.
- **Propre** — éditer le texte dans `build.py`, puis `python3 build.py`. C'est ce qui
  garde la navigation et le pied de page cohérents sur toutes les pages.

`inject_lab.py` applique la barre de retour et les métadonnées aux pages du laboratoire.
Il est idempotent : on peut le relancer sans créer de doublon.

## 5. À renseigner avant ou juste après la mise en ligne

Tout est regroupé dans le bloc `À ÉDITER` en tête de `build.py`. Après chaque
modification : `python3 build.py`.

```python
BUY_URL = ""                # URL BoD de commande d'Équilibre instable
PROFILS = [("LinkedIn",""), ("ORCID",""), ("HAL",""), ("Google Scholar","")]
COVERS  = {...}             # déjà renseigné
```

Une entrée vide de `PROFILS` n'est pas affichée : le pied de page montre « Profils
académiques à venir » plutôt que des liens morts.

Tant que `BUY_URL` est vide, le bouton affiche « Disponible sous peu — être prévenu » et
renvoie vers la page de contact.

### Les CV en PDF ont été retirés

Les deux fichiers `CV_*.pdf` fournis n'étaient pas des PDF : c'étaient des archives ZIP
contenant des images de pages et du texte extrait. Ils ne se seraient ouverts chez aucun
visiteur. Ils ont été supprimés.

Le contenu a été récupéré et la page `/cv/` est un vrai CV en HTML — mieux indexé qu'un
PDF et lisible sur mobile. L'adresse postale et le numéro de téléphone en ont été retirés
volontairement : un CV public se consulte, il ne diffuse pas de coordonnées privées.

Pour remettre de vrais PDF : les déposer dans `assets/cv/`, puis remplacer le premier
bouton de la page `/cv/` dans `build.py`.

## 5. Couverture et lien de commande

Tout se règle dans le bloc `À ÉDITER` en tête de `build.py`, puis `python3 build.py` :

```python
BUY_URL = ""                       # URL BoD de commande
COVERS = {"equilibre-instable": "", "tome-1": "", "tome-2": "", "tome-3": ""}
```

Tant que `BUY_URL` est vide, le bouton affiche « Disponible sous peu — être prévenu » et
renvoie vers la page de contact : la page reste utile au lieu de proposer un lien mort.
Dès qu'elle est renseignée, le bouton devient un vrai bouton de commande.

Tant qu'une couverture n'est pas renseignée, un emplacement pointillé neutre s'affiche.
Les fichiers vont dans `assets/couvertures/` — voir `LISEZMOI.txt` pour les spécifications
(JPEG, 1200 px de large, moins de 250 Ko, pas de marge blanche ajoutée).

La couverture d'*Équilibre instable* sert aussi de `og:image` sur la page du livre :
c'est la vignette du partage social.

## 6. Chercher `À compléter`

Chaque bloc encadré en vert dans les pages signale une information manquante :

```bash
grep -rn "À compléter" site/
```

Les plus urgents : **l'URL BoD de commande** et la couverture d'*Équilibre instable*, les liens
LinkedIn / ORCID / HAL dans le pied de page, l'adresse de contact sur le domaine, et
**la première note** — publiée, voir ci-dessous.

## 7. Publier une note

Les notes vivent dans `NOTES` / la fonction `note()` de `build.py`. La première est dans
un fichier séparé, `note1.py`, pour que le corps du texte ne se mélange pas au gabarit.

Pour la suivante : copier `note1.py` en `note2.py`, écrire le contenu, puis dans `build.py`
ajouter `import note2` et un second appel à `note()`. L'index `/notes/` et le `sitemap.xml`
se mettent à jour seuls, et chaque note reçoit son balisage `schema.org/Article`.

## 8. Mise en ligne

### Dépôt : `hboungomba.github.io` — et pas l'autre

GitHub ne sert un site personnel que depuis un dépôt dont le nom correspond **exactement**
au pseudo du compte. Pour le compte `hboungomba`, c'est donc `hboungomba.github.io`.

Le dépôt `hansboungomba.github.io` ne peut pas servir de site personnel : GitHub le traite
comme un dépôt de projet ordinaire et le publierait à l'adresse
`hboungomba.github.io/hansboungomba.github.io/`. À archiver ou supprimer pour éviter la
confusion.

### Remplacer le contenu actuel

`hboungomba.github.io` contient la version 2 du site. Ce paquet la remplace intégralement.
L'ancienne version reste dans l'historique git, donc rien n'est perdu.

```bash
git clone https://github.com/hboungomba/hboungomba.github.io.git
cd hboungomba.github.io

# retirer l'ancien contenu, garder l'historique et la config git
git rm -r --quiet index.html style.css robots.txt README.md assets equilibre-instable

# copier le contenu de ce paquet à la racine (fichiers cachés compris)
cp -r /chemin/vers/site-hansboungomba/. .

git add -A
git commit -m "Site v3 : livres, laboratoire, notes, CV"
git push
```

`Settings > Pages` → Source : *Deploy from a branch*, Branch : `main`, Folder : `/root`.

### Domaine personnalisé — ou pas

Le paquet contient un fichier `CNAME` avec `hansboungomba.fr`.

**Si le domaine n'est pas encore acheté, supprimez ce fichier avant de pousser**, sinon
GitHub Pages tentera de servir un domaine qui ne pointe nulle part et le site sera
inaccessible. Dans ce cas, ouvrez aussi `build.py` et remplacez :

```python
DOMAIN = "https://hansboungomba.fr"
```

par `https://hboungomba.github.io`, puis relancez `python3 build.py` : les balises
canoniques, le sitemap et les images de partage pointeront vers la bonne adresse.

Quand le domaine est acheté, faites l'inverse : remettez `CNAME`, remettez `DOMAIN`,
régénérez, et créez chez le registrar :

| Type | Nom | Valeur |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | hboungomba.github.io |

Cochez *Enforce HTTPS* une fois le certificat émis (quelques minutes à quelques heures).

### Redirections depuis l'ancienne version

Les anciennes URLs (`equilibre-instable/atlas-tome3.html`, etc.) n'existent plus. Si elles
ont été partagées, ajoutez des fichiers de redirection — sinon, la page 404 du site oriente
déjà vers le laboratoire.

### Alternative

Netlify ou Cloudflare Pages : glisser le dossier `site/`, brancher le domaine. Aucun
réglage supplémentaire, le site est statique.

## 9. Formulaire d'inscription

Le formulaire de la page d'accueil a `action="#"` : il ne fait rien pour l'instant.
Le brancher sur un service qui laisse exporter la liste — Buttondown, Kit ou Substack
avec domaine personnalisé. Remplacer l'attribut `action` par l'URL fournie par le service.

## 10. À ne pas faire

- Ne pas déplacer les pages du laboratoire hors de ce site : ce sont les seuls contenus
  que personne d'autre ne peut reproduire.
- Ne pas remettre de noms de fichiers accentués : c'est ce qui avait cassé le lien de
  l'annexe vers l'atlas.
- Ne pas publier la page `/notes/` vide.

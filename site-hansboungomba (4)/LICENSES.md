# Licences

Ce dépôt contient trois natures de contenu, soumises à trois régimes distincts.
Le fichier `LICENSE` à la racine ne couvre **que le code** — GitHub affiche
« MIT » en haut de la page du dépôt, ce qui ne vaut pas pour le reste.

## 1. Code — MIT

Couvre :

```
build.py · inject_lab.py · note1.py
assets/js/*.js                      (graph-utils, chapter1–5, annex1–5)
assets/css/*.css
le JavaScript et le CSS embarqués dans les pages du laboratoire
```

Réutilisation libre, y compris commerciale, à condition de conserver la mention
de paternité. Si vous reprenez l'implémentation de l'indice de risque ex-ante
(IREX) ou les calculs de centralité, la citation de la source est appréciée mais
n'est pas une obligation légale.

## 2. Textes et figures — CC BY-NC-SA 4.0

Couvre le contenu rédactionnel des pages : argumentaires des livres, notes,
chronologie des accords commerciaux, notices méthodologiques, page IREX, CV.

Vous pouvez citer, reproduire, traduire et adapter ces textes à condition de :

- **créditer** l'auteur et renvoyer à la page d'origine ;
- ne pas en faire un **usage commercial** ;
- diffuser vos adaptations sous la **même licence**.

Texte complet : <https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr>

Un usage pédagogique, universitaire, journalistique ou associatif relève de
l'usage non commercial. En cas de doute, ou pour un usage commercial, écrivez
plutôt que de supposer.

## 3. Œuvres publiées et couvertures — tous droits réservés

Couvre :

```
assets/couvertures/*.jpg
tout extrait du texte des ouvrages
```

- *Équilibre instable — Perturber la respiration : comment empêcher un pays de
  se développer sans le détruire*, Éditions Horizon Intérieur, 2026.
  ISBN 978-2-322-61272-7.
- *La promesse et l'emprise — Accords commerciaux et dépendance*, trois volumes
  à paraître.

Aucune reproduction sans autorisation écrite. Les couvertures peuvent être
utilisées telles quelles, sans modification, dans un article de presse ou une
recension.

## 4. Données de tiers — non relicenciables

`assets/data/networks.js` contient des reconstructions et des estimations
dérivées de sources publiques :

| Source | Nature |
|---|---|
| BACI — CEPII | flux commerciaux bilatéraux |
| UN Comtrade | statistiques douanières |
| DESTA | corpus d'accords commerciaux |
| COFER — FMI | composition des réserves de change |
| OECD TiVA | échanges en valeur ajoutée |
| UNCTAD Eora, UNCTAD MTRANS | chaînes de valeur, transport maritime |

**Ces données ne sont pas licenciées par ce dépôt et ne peuvent pas l'être.**
Chaque fournisseur a ses propres conditions d'utilisation — celles d'UN Comtrade
en particulier restreignent la redistribution. Ce qui est mis à disposition sous
MIT, ce sont les **traitements** : le code qui calcule les centralités, propage
les chocs ou estime l'indice. Pas les flux eux-mêmes.

Plusieurs séries sont par ailleurs des **reconstructions à visée pédagogique**,
non des séries statistiques validées. Chaque figure indique son statut. Ne les
citez pas comme des données primaires.

## En résumé

| Vous voulez… | Licence | Autorisation nécessaire |
|---|---|---|
| Réutiliser le code de l'IREX | MIT | non |
| Citer un passage d'une note | CC BY-NC-SA | non, créditer |
| Traduire la chronologie | CC BY-NC-SA | non, même licence |
| Vendre un recueil des notes | — | oui |
| Reproduire une couverture en recension | tous droits réservés | non, sans modification |
| Republier les données du tome 3 | — | voir chaque fournisseur |

Contact : <contact@hansboungomba.fr>

*Ce document décrit l'intention de l'auteur ; il ne constitue pas un avis
juridique.*

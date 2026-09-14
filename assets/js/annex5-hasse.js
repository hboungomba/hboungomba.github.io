// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// =====================================================================
// A5 — Treillis des sous-groupes (Hasse). G ⊃ H avec test de Lagrange
//      (|H| divise |G| ?) comme heuristique de stabilité algébrique.
//      Quand le rapport est entier, l'emboîtement est "propre" ; sinon,
//      la partition est cassée et flagged → instabilité prédite.
// =====================================================================

(function () {
  const { el, clearSVG } = window.GraphUtils;

  // 16 coalitions / blocs. cardinality = nombre de membres effectifs 2025.
  const NODES = [
    // Niveau 1 — méga-coalitions
    { id: "G77",    label: "G77",        n: 134, layer: 1, x: 0.35 },
    { id: "NAM",    label: "Non-Alignés",n: 120, layer: 1, x: 0.72 },
    // Niveau 2 — grands ensembles régionaux
    { id: "AU",     label: "Union Africaine",  n: 55, layer: 2, x: 0.18 },
    { id: "ZLECAf", label: "ZLECAf",     n: 54, layer: 2, x: 0.45 },
    { id: "CELAC",  label: "CELAC",      n: 33, layer: 2, x: 0.83 },
    // Niveau 3 — moyens
    { id: "ARAB",   label: "Ligue arabe", n: 22, layer: 3, x: 0.06 },
    { id: "SADC",   label: "SADC",        n: 16, layer: 3, x: 0.22 },
    { id: "RCEP",   label: "RCEP",        n: 15, layer: 3, x: 0.40 },
    { id: "CEDEAO", label: "CEDEAO",      n: 12, layer: 3, x: 0.57 },
    { id: "ASEAN",  label: "ASEAN",       n: 10, layer: 3, x: 0.74 },
    { id: "BRICS",  label: "BRICS+",      n: 10, layer: 3, x: 0.91 },
    // Niveau 4 — sous-coalitions
    { id: "GCC",    label: "CCG",         n: 6,  layer: 4, x: 0.10 },
    { id: "EAC",    label: "EAC",         n: 8,  layer: 4, x: 0.30 },
    { id: "CEMAC",  label: "CEMAC",       n: 6,  layer: 4, x: 0.50 },
    { id: "MERCO",  label: "Mercosur",    n: 5,  layer: 4, x: 0.70 },
    { id: "AES",    label: "AES",         n: 3,  layer: 4, x: 0.88 },
  ];

  // Edges (H ⊂ G), drawn G (top) → H (bottom)
  const EDGES = [
    ["G77",    "AU"],
    ["G77",    "CELAC"],
    ["G77",    "ARAB"],
    ["G77",    "ASEAN"],
    ["NAM",    "ARAB"],
    ["NAM",    "ASEAN"],
    ["NAM",    "CELAC"],
    ["AU",     "ZLECAf"],
    ["AU",     "SADC"],
    ["AU",     "CEDEAO"],
    ["AU",     "EAC"],
    ["AU",     "CEMAC"],
    ["ZLECAf", "CEDEAO"],
    ["ZLECAf", "CEMAC"],
    ["ZLECAf", "SADC"],
    ["ZLECAf", "EAC"],
    ["CELAC",  "MERCO"],
    ["ARAB",   "GCC"],
    ["RCEP",   "ASEAN"],
    ["CEDEAO", "AES"],
  ];

  function render() {
    const svg = document.getElementById("a5-svg");
    const sidebar = document.getElementById("a5-sidebar");
    const stage = document.getElementById("a5-stage");
    const canvasEl = stage.querySelector(".canvas-pure");
    const W = 940, H = 580;
    canvasEl.style.minHeight = "580px";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    clearSVG(svg);

    // Layer y positions
    const layerY = {
      1: 80,
      2: 220,
      3: 380,
      4: 520,
    };
    const padX = 50;
    const innerW = W - padX * 2;

    // Position dict
    const pos = {};
    NODES.forEach(n => {
      pos[n.id] = { ...n, x: padX + n.x * innerW, y: layerY[n.layer] };
    });

    // Layer bands (faint horizontal guides)
    const bandsLayer = el("g", { class: "bands", opacity: 0.55 }, svg);
    Object.entries(layerY).forEach(([k, y]) => {
      el("line", { x1: 20, y1: y, x2: W - 20, y2: y, stroke: "var(--rule-soft)", "stroke-dasharray": "2 5" }, bandsLayer);
      el("text", {
        x: 20, y: y - 8,
        "font-family": "var(--mono)", "font-size": 10, "letter-spacing": ".18em",
        "text-transform": "uppercase", fill: "var(--ink-3)"
      }, bandsLayer).textContent = "L" + k + " " + (
        k === "1" ? "· méga-coalition" :
        k === "2" ? "· grand ensemble régional" :
        k === "3" ? "· coalition intermédiaire" :
                    "· sous-groupe régional"
      );
    });

    // ---- Edges ----
    const edgeLayer = el("g", { class: "edges" }, svg);
    EDGES.forEach(([from, to]) => {
      const a = pos[from], b = pos[to];
      if (!a || !b) return;
      const ratio = a.n / b.n;
      const isDivisor = Number.isInteger(ratio);
      // Curve : straight-ish but slight bend so concurrent lines are distinguishable
      const dx = b.x - a.x;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      // small bend perpendicular to direction proportional to dx
      const bend = Math.min(Math.abs(dx) * 0.04, 12) * Math.sign(dx);
      const d = `M${a.x},${a.y + 22} Q${mx + bend},${my} ${b.x},${b.y - 22}`;
      el("path", {
        class: "hasse-edge " + (isDivisor ? "lagrange-ok" : "lagrange-fail"),
        d: d
      }, edgeLayer);

      // ratio annotation at midpoint, with white box
      const tx = mx + bend * 0.5;
      const ty = my;
      const ratioStr = isDivisor
        ? `|G|/|H| = ${ratio}`
        : `${a.n}/${b.n} ≈ ${ratio.toFixed(2)}`;
      const w = ratioStr.length * 5.4 + 8;
      el("rect", {
        x: tx - w / 2, y: ty - 7, width: w, height: 13, rx: 1,
        fill: "var(--paper)", "fill-opacity": 0.92
      }, edgeLayer);
      el("text", {
        class: "ratio-tag" + (isDivisor ? "" : " fail"),
        x: tx, y: ty + 3
      }, edgeLayer).textContent = ratioStr;
    });

    // ---- Nodes ----
    const nodeLayer = el("g", { class: "nodes" }, svg);
    NODES.forEach(n => {
      const p = pos[n.id];
      const labelW = Math.max(64, n.label.length * 7 + 18);
      const labelH = 38;
      const isTop = n.layer === 1;
      const g = el("g", { class: "hasse-node" + (isTop ? " top" : ""), transform: `translate(${p.x},${p.y})` }, nodeLayer);
      el("rect", {
        x: -labelW / 2, y: -labelH / 2,
        width: labelW, height: labelH,
        rx: 1
      }, g);
      el("text", { class: "nm", x: 0, y: -4 }, g).textContent = n.label;
      el("text", { class: "card", x: 0, y: 11 }, g).textContent = "|G| = " + n.n;
    });

    // ---- Sidebar ----
    sidebar.innerHTML = "";

    const block1 = document.createElement("div");
    block1.className = "s-block";
    block1.innerHTML = `
      <div class="s-title">Test de Lagrange</div>
      <div style="font-size: 12.5px; color: var(--ink-2); line-height: 1.5; margin-bottom: 4px;">
        Pour qu'<em>H</em> soit un sous-groupe au sens strict de <em>G</em>, il faut que <span class="mono">|H| | |G|</span>. La condition est rarement vérifiée par les coalitions politiques réelles — la plupart des inclusions échouent au test (rouge en pointillé).
      </div>
      <div style="font-size: 12.5px; color: var(--ink-2); line-height: 1.5;">
        Les rares emboîtements <em>propres</em> (vert) prédisent une <em>partition stable</em> ; les emboîtements <em>cassés</em> annoncent recompositions et fissions.
      </div>
    `;
    sidebar.appendChild(block1);

    const block2 = document.createElement("div");
    block2.className = "s-block";
    // Compute Lagrange-OK edges
    const okEdges = EDGES.filter(([f, t]) => {
      const r = pos[f].n / pos[t].n;
      return Number.isInteger(r);
    });
    block2.innerHTML = `
      <div class="s-title">Emboîtements propres détectés</div>
      <div class="s-rank">
        ${okEdges.map(([f, t]) => {
          const r = pos[f].n / pos[t].n;
          return `
            <div class="row">
              <span class="rk">✓</span>
              <span class="nm">${pos[f].label} ⊃ ${pos[t].label}</span>
              <span class="vl" style="color:var(--teal-d)">×${r}</span>
            </div>
          `;
        }).join("")}
      </div>
      <div style="font-size: 11.5px; color: var(--ink-3); font-style: italic; margin-top: 6px; line-height: 1.4;">
        Lecture : la ZLECAf se partitionne <em>exactement</em> en 9 blocs de la taille du CEMAC ; la CEDEAO en 4 blocs de la taille de l'AES.
      </div>
    `;
    sidebar.appendChild(block2);

    const block3 = document.createElement("div");
    block3.className = "s-block";
    block3.innerHTML = `
      <div class="s-title">Fissions historiques</div>
      <div class="s-stat"><span class="lbl">AES sort CEDEAO (2024)</span><span class="val" style="color:var(--crit)">15 → 12</span></div>
      <div class="s-stat"><span class="lbl">Brexit (2020)</span><span class="val" style="color:var(--crit)">28 → 27</span></div>
      <div class="s-stat"><span class="lbl">URSS implose (1991)</span><span class="val" style="color:var(--crit)">15 → 1+14</span></div>
      <div style="font-size: 11.5px; color: var(--ink-3); font-style: italic; margin-top: 6px; line-height: 1.4;">
        Chaque sortie modifie la cardinalité et déclenche un re-test du treillis. La sortie de l'AES rend, paradoxalement, le sous-treillis CEDEAO/AES <em>plus stable</em> au sens de Lagrange.
      </div>
    `;
    sidebar.appendChild(block3);

    const block4 = document.createElement("div");
    block4.className = "s-block";
    block4.innerHTML = `
      <div class="s-title">Légende</div>
      <div class="s-legend">
        <span class="swatch"><span style="display:inline-block; width:18px; height:2px; background:var(--teal-d)"></span>Lagrange ✓</span>
        <span class="swatch"><span style="display:inline-block; width:18px; height:1.5px; background:repeating-linear-gradient(90deg, var(--crit) 0 3px, transparent 3px 6px)"></span>Lagrange ✗</span>
      </div>
    `;
    sidebar.appendChild(block4);

    // Caption
    let cap = stage.querySelector(".__cap");
    if (!cap) {
      cap = document.createElement("div");
      cap.className = "__cap";
      cap.style.cssText = "position:absolute; bottom:10px; left:18px; right:18px; font-family:var(--serif); font-style:italic; font-size:12.5px; color:var(--ink-3); pointer-events:none;";
      stage.querySelector(".canvas-pure").appendChild(cap);
    }
    cap.textContent = "Fig. A5 — Treillis de coalitions. Niveau y = taille décroissante. Lignes : H ⊂ G. Solide vert = |H| divise |G| (sous-groupe propre) ; tireté rouge = ratio non entier (instabilité algébrique).";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
  window.addEventListener("resize", () => { clearTimeout(window.__a5t); window.__a5t = setTimeout(render, 200); });
})();

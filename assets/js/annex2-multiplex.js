// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// =====================================================================
// A2 — Graphe multiplex : intrants critiques (couche haute) → biens
//                        finaux (couche basse). Sources stylisées :
//                        OECD TiVA, UNCTAD-Eora, USGS Mineral Survey.
// =====================================================================

(function () {
  const { el, clearSVG } = window.GraphUtils;

  // ---- Couche supérieure : intrants critiques ----
  // Chaque intrant porte son top producteur (1-2 pays) et sa concentration HHI
  const UPPER = [
    { id: "SEMI", label: "Semi-cond.",   sub: "TWN · KOR", hhi: 0.62, x: 0.06 },
    { id: "REE",  label: "Terres rares", sub: "CHN · MMR", hhi: 0.71, x: 0.20 },
    { id: "LI",   label: "Lithium",      sub: "AUS · CHL", hhi: 0.58, x: 0.34 },
    { id: "CO",   label: "Cobalt",       sub: "COD",       hhi: 0.74, x: 0.46 },
    { id: "ENRG", label: "Pétrole / gaz", sub: "SAU · RUS · USA", hhi: 0.32, x: 0.60 },
    { id: "AG",   label: "Céréales",     sub: "USA · RUS · UKR", hhi: 0.40, x: 0.74 },
    { id: "PHARM",label: "Princ. actifs",sub: "CHN · IND", hhi: 0.52, x: 0.86 },
    { id: "STEEL",label: "Acier brut",   sub: "CHN",       hhi: 0.55, x: 0.96 },
  ];

  // ---- Couche inférieure : secteurs de biens finaux ----
  const LOWER = [
    { id: "AUTO",  label: "Automobile",     sub: "DEU · JPN · CHN", x: 0.10 },
    { id: "ELEC",  label: "Électronique",   sub: "CHN · KOR · USA", x: 0.24 },
    { id: "AERO",  label: "Aérospatial",    sub: "USA · FRA",       x: 0.38 },
    { id: "MED",   label: "Équip. médical", sub: "DEU · USA",       x: 0.50 },
    { id: "DEF",   label: "Défense",        sub: "USA · FRA · RUS", x: 0.62 },
    { id: "ENR",   label: "Énergie verte",  sub: "CHN · USA",       x: 0.76 },
    { id: "AGRO",  label: "Agro-alimentaire",sub: "USA · UE",       x: 0.88 },
  ];

  // Flux verticaux : upper.id → lower.id avec intensité 0-1
  // 'critical' = true quand cet intrant a une concentration HHI > 0.6
  //              et un poids majeur dans le secteur final
  const FLOWS = [
    // SEMI → ELEC, AUTO, AERO, DEF, MED
    ["SEMI",  "ELEC", 0.95, true],
    ["SEMI",  "AUTO", 0.75, true],
    ["SEMI",  "AERO", 0.65, true],
    ["SEMI",  "DEF",  0.70, true],
    ["SEMI",  "MED",  0.45],
    // REE → ENR, ELEC, DEF, AUTO
    ["REE",   "ENR",  0.85, true],
    ["REE",   "DEF",  0.75, true],
    ["REE",   "AUTO", 0.55],
    ["REE",   "ELEC", 0.50],
    // LI → ENR, AUTO, ELEC
    ["LI",    "ENR",  0.90, true],
    ["LI",    "AUTO", 0.70, true],
    ["LI",    "ELEC", 0.45],
    // CO → AUTO, ENR
    ["CO",    "AUTO", 0.65, true],
    ["CO",    "ENR",  0.55, true],
    // ENRG → AUTO, AERO, AGRO, AGRO, ENR, MED
    ["ENRG",  "AUTO", 0.65],
    ["ENRG",  "AERO", 0.85],
    ["ENRG",  "AGRO", 0.50],
    ["ENRG",  "MED",  0.30],
    // AG → AGRO
    ["AG",    "AGRO", 0.95],
    // PHARM → MED
    ["PHARM", "MED",  0.92, true],
    // STEEL → AUTO, AERO, DEF
    ["STEEL", "AUTO", 0.60],
    ["STEEL", "AERO", 0.55],
    ["STEEL", "DEF",  0.65],
    ["STEEL", "ENR",  0.45],
  ];

  function render() {
    const svg = document.getElementById("a2-svg");
    const sidebar = document.getElementById("a2-sidebar");
    const stage = document.getElementById("a2-stage");
    const canvasEl = stage.querySelector(".canvas-pure");
    const W = 940, H = 560;
    canvasEl.style.minHeight = "560px";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    clearSVG(svg);

    const padX = 70;
    const innerW = W - padX * 2;
    const yUpper = 110;
    const yLower = 430;
    const bandPad = 24;

    // ---- Bands ----
    const bandsLayer = el("g", { class: "bands" }, svg);
    el("rect", {
      class: "layer-band upper",
      x: padX - 20, y: yUpper - bandPad - 22, width: innerW + 40, height: bandPad * 2 + 8,
      rx: 1
    }, bandsLayer);
    el("rect", {
      class: "layer-band",
      x: padX - 20, y: yLower - bandPad + 6, width: innerW + 40, height: bandPad * 2 + 8,
      rx: 1
    }, bandsLayer);

    // Layer tags
    el("text", { class: "layer-tag", x: padX - 20, y: yUpper - bandPad - 32 }, bandsLayer)
      .textContent = "Couche 1 — Intrants critiques (HHI géographique)";
    el("text", { class: "layer-tag", x: padX - 20, y: yLower + bandPad + 32 }, bandsLayer)
      .textContent = "Couche 2 — Biens finaux (assemblage / consommation)";

    // ---- Positions ----
    const posUpper = {};
    UPPER.forEach(n => posUpper[n.id] = { x: padX + n.x * innerW, y: yUpper });
    const posLower = {};
    LOWER.forEach(n => posLower[n.id] = { x: padX + n.x * innerW, y: yLower });

    // ---- Vertical flows ----
    const flowsLayer = el("g", { class: "flows" }, svg);
    FLOWS.forEach(([u, l, w, critical]) => {
      const a = posUpper[u], b = posLower[l];
      if (!a || !b) return;
      // Curve: route through middle vertical
      const midY = (a.y + b.y) / 2;
      const d = `M${a.x},${a.y + 14} C${a.x},${midY} ${b.x},${midY} ${b.x},${b.y - 14}`;
      el("path", {
        class: "mux-flow" + (critical ? " hot" : ""),
        d: d,
        stroke: critical ? "var(--copper-d)" : "var(--ink-2)",
        "stroke-width": (0.6 + w * 3.0).toFixed(2),
        "stroke-opacity": critical ? (0.30 + w * 0.30).toFixed(2) : (0.18 + w * 0.20).toFixed(2)
      }, flowsLayer);
    });

    // ---- Upper nodes ----
    const upperLayer = el("g", { class: "upper-nodes" }, svg);
    UPPER.forEach(n => {
      const p = posUpper[n.id];
      const g = el("g", { class: "mux-node", transform: `translate(${p.x},${p.y})` }, upperLayer);
      // Concentration ring : darker = more concentrated
      const dotR = 9;
      const fill = n.hhi >= 0.6 ? "#b85c3b" : n.hhi >= 0.45 ? "#c98760" : "#d8cba8";
      el("circle", { r: dotR + 5, fill: "none", stroke: fill, "stroke-opacity": 0.30 }, g);
      el("circle", { r: dotR, fill: fill }, g);
      // Label above
      el("text", { y: -22 }, g).textContent = n.label;
      // Sub label
      el("text", { y: -10, "font-size": 8.5, fill: "var(--ink-3)" }, g).textContent = n.sub;
      // HHI badge below
      el("text", { y: 22, "font-size": 9.5, fill: n.hhi >= 0.6 ? "var(--copper-d)" : "var(--ink-3)", "font-weight": 500 }, g)
        .textContent = "HHI " + n.hhi.toFixed(2);
    });

    // ---- Lower nodes ----
    const lowerLayer = el("g", { class: "lower-nodes" }, svg);
    LOWER.forEach(n => {
      const p = posLower[n.id];
      const g = el("g", { class: "mux-node", transform: `translate(${p.x},${p.y})` }, lowerLayer);
      const dotR = 10;
      el("circle", { r: dotR + 5, fill: "none", stroke: "var(--ink-2)", "stroke-opacity": 0.25 }, g);
      el("circle", { r: dotR, fill: "#3a3f4a" }, g);
      el("text", { y: 24, fill: "var(--ink)" }, g).textContent = n.label;
      el("text", { y: 36, "font-size": 8.5, fill: "var(--ink-3)" }, g).textContent = n.sub;
    });

    // ---- Annotation : critical paths ----
    const annot = el("g", { class: "annot" }, svg);
    const annotY = (yUpper + yLower) / 2;
    el("text", {
      x: padX - 30, y: annotY,
      "font-family": "var(--mono)", "font-size": 10, "letter-spacing": ".12em",
      "text-transform": "uppercase", fill: "var(--copper-d)",
      transform: `rotate(-90 ${padX - 30} ${annotY})`,
      "text-anchor": "middle"
    }, annot).textContent = "Liens critiques en cuivre — HHI > 0,60 amont";

    // ---- Sidebar ----
    sidebar.innerHTML = "";

    const block1 = document.createElement("div");
    block1.className = "s-block";
    block1.innerHTML = `
      <div class="s-title">Lecture multiplex</div>
      <div style="font-size: 12.5px; color: var(--ink-2); line-height: 1.5;">
        Couche 1 = nœuds <em>amont</em> (intrant fortement concentré). Couche 2 = nœuds <em>aval</em> (secteur final). Un arc en cuivre signale un canal vertical critique — concentration amont élevée combinée à un poids majeur dans le secteur aval.
      </div>
    `;
    sidebar.appendChild(block1);

    const block2 = document.createElement("div");
    block2.className = "s-block";
    const tops = UPPER.slice().sort((a, b) => b.hhi - a.hhi).slice(0, 5);
    block2.innerHTML = `
      <div class="s-title">Top 5 — concentration amont</div>
      <div class="s-rank">
        ${tops.map((n, i) => `
          <div class="row">
            <span class="rk">${String(i + 1).padStart(2, "0")}</span>
            <span class="nm">${n.label} <span style="color:var(--ink-3); font-size:11px">· ${n.sub}</span></span>
            <span class="vl">${n.hhi.toFixed(2)}</span>
          </div>
        `).join("")}
      </div>
    `;
    sidebar.appendChild(block2);

    const block3 = document.createElement("div");
    block3.className = "s-block";
    block3.innerHTML = `
      <div class="s-title">Propagation verticale</div>
      <div style="font-size: 12.5px; color: var(--ink-2); line-height: 1.5;">
        Un choc -30 % sur les semi-conducteurs taïwanais touche directement <strong>5 secteurs aval</strong> (électronique, auto, aéro, défense, médical) avant tout effet horizontal commerce-pays. Le multiplicateur de Leontief sectoriel donne <span class="mono">≈ 1,8</span> à l'horizon 4 trimestres.
      </div>
    `;
    sidebar.appendChild(block3);

    const block4 = document.createElement("div");
    block4.className = "s-block";
    block4.innerHTML = `
      <div class="s-title">Légende</div>
      <div class="s-legend">
        <span class="swatch"><span class="dot" style="background:#b85c3b"></span>HHI ≥ 0,60</span>
        <span class="swatch"><span class="dot" style="background:#c98760"></span>0,45 ≤ HHI &lt; 0,60</span>
        <span class="swatch"><span class="dot" style="background:#d8cba8"></span>HHI &lt; 0,45</span>
        <span class="swatch"><span class="dot" style="background:#3a3f4a"></span>Secteur aval</span>
      </div>
    `;
    sidebar.appendChild(block4);

    // Caption
    const cap = document.createElement("div");
    cap.style.cssText = "position:absolute; bottom:12px; left:18px; right:18px; font-family:var(--serif); font-style:italic; font-size:12.5px; color:var(--ink-3); pointer-events:none;";
    cap.textContent = "Fig. A2 — Graphe à deux couches. Verticale = transformation production. Épaisseur de l'arc = part de l'intrant dans le secteur aval ; teinte cuivre = canal critique (HHI amont > 0,60).";
    stage.querySelector(".canvas-pure").appendChild(cap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
  window.addEventListener("resize", () => { clearTimeout(window.__a2t); window.__a2t = setTimeout(render, 200); });
})();

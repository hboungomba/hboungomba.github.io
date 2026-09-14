// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// =====================================================================
// A4 — Points d'étranglement maritimes. Carte schématique : continents
//      stylisés, lignes maritimes principales, 7 goulets surdimensionnés
//      à proportion du tonnage mondial transitant. Source stylisée :
//      UNCTAD Review of Maritime Transport 2024, IEA.
// =====================================================================

(function () {
  const { el, clearSVG } = window.GraphUtils;

  // Continents : paths stylisés (non géographiquement exacts)
  const CONTINENTS = [
    { id: "NA", label: "Amérique du Nord", lx: 165, ly: 165,
      path: "M 70,85 C 110,72 200,78 270,95 C 305,115 310,170 285,215 C 250,260 200,275 175,290 C 145,300 110,275 90,235 C 65,190 55,120 70,85 Z" },
    { id: "SA", label: "Amérique du Sud", lx: 265, ly: 365,
      path: "M 195,295 C 245,275 305,280 335,320 C 350,370 320,425 285,450 C 250,460 220,440 205,390 C 190,345 180,315 195,295 Z" },
    { id: "EU", label: "Europe", lx: 510, ly: 140,
      path: "M 425,90 C 475,75 555,80 595,105 C 615,135 605,175 575,195 C 535,210 480,205 450,190 C 420,170 410,135 425,90 Z" },
    { id: "AF", label: "Afrique", lx: 555, ly: 340,
      path: "M 470,215 C 540,205 605,225 645,265 C 665,320 650,385 615,430 C 580,460 535,465 505,440 C 480,405 465,355 466,295 C 466,260 460,225 470,215 Z" },
    { id: "ME", label: "M.-Orient", lx: 685, ly: 260,
      path: "M 625,225 C 665,225 710,240 730,270 C 720,295 680,300 645,290 C 625,275 615,250 625,225 Z" },
    { id: "AS", label: "Asie", lx: 845, ly: 155,
      path: "M 600,85 C 700,72 830,76 950,90 C 1010,105 1045,140 1035,190 C 1015,235 950,250 870,255 C 800,255 730,245 685,225 C 645,205 615,175 600,140 C 595,115 595,95 600,85 Z" },
    { id: "ID", label: "Asie SE", lx: 895, ly: 320,
      path: "M 820,295 C 870,285 940,295 975,315 C 985,345 950,365 895,365 C 845,365 820,345 820,295 Z" },
    { id: "AU", label: "Australie", lx: 935, ly: 430,
      path: "M 870,395 C 935,388 1005,400 1025,425 C 1015,465 950,478 895,470 C 860,460 855,425 870,395 Z" },
    // small islands
    { id: "JP", label: "Japon", lx: 990, ly: 165, isle: true,
      path: "M 980,140 C 1000,138 1015,150 1010,175 C 1000,195 980,195 975,170 C 972,155 975,142 980,140 Z" },
    { id: "GB", label: "G.-B.", lx: 430, ly: 105, isle: true,
      path: "M 418,90 C 430,85 442,95 440,108 C 432,118 420,115 415,105 C 414,98 414,92 418,90 Z" },
  ];

  // Ports (légers, secondaires)
  const PORTS = [
    { id: "NY",  label: "NY",        x: 260, y: 145 },
    { id: "LA",  label: "Los A.",    x: 175, y: 195 },
    { id: "RIO", label: "Santos",    x: 308, y: 360 },
    { id: "ROT", label: "Rotterdam", x: 488, y: 130 },
    { id: "GIB", label: "Gibraltar", x: 472, y: 215 },
    { id: "DBX", label: "Dubaï",     x: 705, y: 265 },
    { id: "SGP", label: "Singapour", x: 850, y: 318 },
    { id: "SHA", label: "Shanghai",  x: 945, y: 175 },
    { id: "TKY", label: "Tokyo",     x: 1000, y: 165 },
    { id: "SYD", label: "Sydney",    x: 970, y: 440 },
  ];

  // Chokepoints
  const CHOKES = [
    { id: "PAN", label: "Panama",        x: 256, y: 280, share: 5,  desc: "Atlantique ↔ Pacifique" },
    { id: "BOS", label: "Bosphore",      x: 545, y: 165, share: 3,  desc: "Mer Noire ↔ Méd." },
    { id: "SUE", label: "Suez",          x: 605, y: 215, share: 12, desc: "Asie ↔ Europe" },
    { id: "BAB", label: "Bab-el-Mandeb", x: 658, y: 295, share: 9,  desc: "Mer Rouge ↔ Océan ind." },
    { id: "HOR", label: "Hormuz",        x: 725, y: 248, share: 20, desc: "Pétrole du Golfe" },
    { id: "MAL", label: "Malacca",       x: 845, y: 305, share: 25, desc: "Asie Est ↔ Océan ind." },
    { id: "CAP", label: "Cap de B.-E.",  x: 555, y: 470, share: 5,  desc: "Contournement Suez" },
  ];

  // Sea lanes : list of waypoints, traffic weight
  const LANES = [
    // Asia – Europe via Suez (main route)
    { name: "Asie–Europe (Suez)", w: 0.95,
      waypoints: ["SHA", "MAL", "BAB", "SUE", "GIB", "ROT"] },
    // Hormuz oil to Asia
    { name: "Pétrole Golfe → Asie", w: 0.80,
      waypoints: ["DBX", "HOR", "MAL", "SHA"] },
    // Hormuz oil to Europe
    { name: "Pétrole Golfe → Europe", w: 0.50,
      waypoints: ["DBX", "HOR", "BAB", "SUE", "ROT"] },
    // Transpacific
    { name: "Transpacifique", w: 0.75,
      waypoints: ["SHA", "TKY", "LA"] },
    // Transatlantic
    { name: "Transatlantique", w: 0.55,
      waypoints: ["NY", "ROT"] },
    // Panama route NY → LA (Pacific access)
    { name: "Côte Est ↔ Côte Ouest (Panama)", w: 0.40,
      waypoints: ["NY", "PAN", "LA"] },
    // Cape of Good Hope alternative
    { name: "Asie–Europe (Cap, alt.)", w: 0.35,
      waypoints: ["MAL", "CAP", "GIB", "ROT"] },
    // Sub-Saharan: Asia → Africa (rerouted via Cape on Suez closure)
    { name: "Asie–Amérique du Sud", w: 0.25,
      waypoints: ["MAL", "CAP", "RIO"] },
    // Australia trade
    { name: "Australie–Asie", w: 0.30,
      waypoints: ["SYD", "MAL", "SHA"] },
  ];

  function render() {
    const svg = document.getElementById("a4-svg");
    const sidebar = document.getElementById("a4-sidebar");
    const stage = document.getElementById("a4-stage");
    const W = 1100;
    const H = 520;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    clearSVG(svg);

    // Background ocean
    el("rect", { x: 0, y: 0, width: W, height: H, fill: "#eee7d3" }, svg);

    // Subtle ocean grain (latitude lines)
    const gridLayer = el("g", { opacity: 0.18 }, svg);
    for (let y = 60; y < H; y += 60) {
      el("line", { x1: 0, y1: y, x2: W, y2: y, stroke: "var(--rule-soft)", "stroke-dasharray": "1 4" }, gridLayer);
    }
    for (let x = 100; x < W; x += 100) {
      el("line", { x1: x, y1: 0, x2: x, y2: H, stroke: "var(--rule-soft)", "stroke-dasharray": "1 4" }, gridLayer);
    }

    // ---- Continents ----
    const landLayer = el("g", { class: "lands" }, svg);
    CONTINENTS.forEach(c => {
      el("path", { class: "land", d: c.path }, landLayer);
    });
    // Continent labels
    CONTINENTS.forEach(c => {
      if (c.isle) return;
      el("text", {
        class: "region-label",
        x: c.lx, y: c.ly,
        "text-anchor": "middle",
      }, landLayer).textContent = c.label;
    });

    // Build position dict
    const allPos = {};
    PORTS.forEach(p => allPos[p.id] = { x: p.x, y: p.y });
    CHOKES.forEach(c => allPos[c.id] = { x: c.x, y: c.y });

    // ---- Sea lanes ----
    const lanesLayer = el("g", { class: "lanes" }, svg);
    LANES.forEach(lane => {
      const pts = lane.waypoints.map(id => allPos[id]).filter(Boolean);
      if (pts.length < 2) return;
      // Build smoothed path
      let d = `M${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        // Curvature: slight perpendicular offset for sea-feel
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const px = -dy / len, py = dx / len;
        const k = 0.08;
        const qx = mx + px * len * k;
        const qy = my + py * len * k;
        d += ` Q${qx},${qy} ${b.x},${b.y}`;
      }
      el("path", {
        class: "sea-arc",
        d: d,
        "stroke-width": (0.8 + lane.w * 3.2).toFixed(2),
        "stroke-opacity": (0.30 + lane.w * 0.30).toFixed(2)
      }, lanesLayer);
    });

    // ---- Ports ----
    const portsLayer = el("g", { class: "ports" }, svg);
    PORTS.forEach(p => {
      const g = el("g", { transform: `translate(${p.x},${p.y})` }, portsLayer);
      el("circle", { r: 2.5, fill: "var(--ink-2)" }, g);
      el("text", { class: "port-label", x: 6, y: 2 }, g).textContent = p.label;
    });

    // ---- Chokepoints (top layer) ----
    const chokesLayer = el("g", { class: "chokes" }, svg);
    CHOKES.forEach(c => {
      const g = el("g", { transform: `translate(${c.x},${c.y})` }, chokesLayer);
      const r = 4 + Math.sqrt(c.share) * 2.6;
      // Halo ring
      el("circle", { r: r + 5, fill: "none", stroke: "var(--copper)", "stroke-opacity": 0.30 }, g);
      el("circle", { r: r + 9, fill: "none", stroke: "var(--copper)", "stroke-opacity": 0.15 }, g);
      // Diamond marker
      el("path", {
        d: `M0,${-r} L${r},0 L0,${r} L${-r},0 Z`,
        class: "choke",
      }, g);
      // Label below
      el("text", {
        class: "choke-label",
        x: 0, y: r + 14,
        "text-anchor": "middle"
      }, g).textContent = c.label;
      // Share badge
      el("text", {
        x: 0, y: r + 26,
        "font-family": "var(--mono)", "font-size": 9, fill: "var(--ink-2)",
        "text-anchor": "middle"
      }, g).textContent = c.share + " % trafic mond.";
    });

    // Caption
    let cap = stage.querySelector(".__cap");
    if (!cap) {
      cap = document.createElement("div");
      cap.className = "__cap";
      cap.style.cssText = "position:absolute; bottom:10px; left:18px; right:18px; font-family:var(--serif); font-style:italic; font-size:12.5px; color:var(--ink-3); pointer-events:none;";
      stage.querySelector(".canvas-pure").appendChild(cap);
    }
    cap.textContent = "Fig. A4 — Sept goulets et leur part du tonnage mondial. Diamants cuivrés : chokepoints (taille ∝ √share). Arcs : lignes maritimes principales (épaisseur ∝ trafic).";

    // ---- Sidebar ----
    sidebar.innerHTML = "";

    const block1 = document.createElement("div");
    block1.className = "s-block";
    block1.innerHTML = `
      <div class="s-title">Sept goulets</div>
      <div class="s-rank">
        ${CHOKES.slice().sort((a, b) => b.share - a.share).map((c, i) => `
          <div class="row">
            <span class="rk">${String(i + 1).padStart(2, "0")}</span>
            <span class="nm">${c.label} <span style="color:var(--ink-3); font-size:10.5px; display:block; margin-top:1px;">${c.desc}</span></span>
            <span class="vl">${c.share} %</span>
          </div>
        `).join("")}
      </div>
    `;
    sidebar.appendChild(block1);

    const block2 = document.createElement("div");
    block2.className = "s-block";
    block2.innerHTML = `
      <div class="s-title">Effet de bord</div>
      <div style="font-size: 12.5px; color: var(--ink-2); line-height: 1.5;">
        La <em>betweenness</em> géographique cumule celles des nœuds qui la franchissent. Sur l'Asie–Europe, Suez + Bab-el-Mandeb forment un goulet sériel : leur fermeture force le détour par le Cap (+10 à 14 jours, +20 % fret).
      </div>
    `;
    sidebar.appendChild(block2);

    const block3 = document.createElement("div");
    block3.className = "s-block";
    block3.innerHTML = `
      <div class="s-title">Précédents</div>
      <div class="s-stat"><span class="lbl">Ever Given (2021)</span><span class="val">6 j · ≈ 10 G$</span></div>
      <div class="s-stat"><span class="lbl">Houthis (2024–)</span><span class="val">-50 % Suez</span></div>
      <div class="s-stat"><span class="lbl">Sécheresse Panama 2023</span><span class="val">-36 % transits</span></div>
    `;
    sidebar.appendChild(block3);

    const block4 = document.createElement("div");
    block4.className = "s-block";
    block4.innerHTML = `
      <div class="s-title">Légende</div>
      <div class="s-legend">
        <span class="swatch"><span class="dot" style="background:var(--copper); transform: rotate(45deg)"></span>chokepoint</span>
        <span class="swatch"><span style="display:inline-block; width:18px; height:2px; background:var(--teal); opacity:.6"></span>ligne mar.</span>
        <span class="swatch"><span class="dot" style="background:var(--ink-2); width:5px; height:5px;"></span>port</span>
      </div>
    `;
    sidebar.appendChild(block4);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
  window.addEventListener("resize", () => { clearTimeout(window.__a4t); window.__a4t = setTimeout(render, 200); });
})();

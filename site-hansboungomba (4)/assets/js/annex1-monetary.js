// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// =====================================================================
// A1 — Réseaux monétaires : pays → devise(s) d'ancrage / réserve
// Source stylisée : COFER-FMI, BIS Triennial Survey
// =====================================================================

(function () {
  const { el, clearSVG } = window.GraphUtils;

  // 5 devises ancres
  const CURRENCIES = [
    { id: "USD", name: "Dollar US",    share: 58, color: "#2e5d5d" },
    { id: "EUR", name: "Euro",         share: 20, color: "#b85c3b" },
    { id: "CNY", name: "Yuan",         share:  3, color: "#8a6d1f" },
    { id: "JPY", name: "Yen",          share:  5, color: "#7e3a4e" },
    { id: "GBP", name: "Sterling",     share:  5, color: "#5a6b2e" },
  ];

  // Pays sélectionnés, avec parts d'ancrage stylisées (réserves + facturation)
  // Pour chaque pays : ancres = [{cur, w}, ...]   avec ∑w ≤ 1 (le reliquat = autres)
  const COUNTRIES = [
    // Dollarisation forte / peg dollar
    { id: "PAN", name: "Panama",    anchors: [["USD", 1.00]] },
    { id: "ECU", name: "Équateur",  anchors: [["USD", 1.00]] },
    { id: "SLV", name: "Salvador",  anchors: [["USD", 0.95]] },
    { id: "SAU", name: "A. saoudite", anchors: [["USD", 0.92]] },
    { id: "ARE", name: "Émirats",   anchors: [["USD", 0.88]] },
    { id: "HKG", name: "Hong Kong", anchors: [["USD", 0.85]] },
    // Soft USD anchor (LatAm, Asia)
    { id: "MEX", name: "Mexique",   anchors: [["USD", 0.72], ["EUR", 0.08]] },
    { id: "BRA", name: "Brésil",    anchors: [["USD", 0.70], ["EUR", 0.12], ["CNY", 0.05]] },
    { id: "ARG", name: "Argentine", anchors: [["USD", 0.75], ["EUR", 0.05]] },
    { id: "KOR", name: "Corée S.",  anchors: [["USD", 0.65], ["EUR", 0.10], ["JPY", 0.06], ["CNY", 0.04]] },
    { id: "PHL", name: "Philipp.",  anchors: [["USD", 0.78], ["JPY", 0.05]] },
    { id: "VNM", name: "Viêt-Nam",  anchors: [["USD", 0.62], ["CNY", 0.12], ["JPY", 0.06]] },
    { id: "IDN", name: "Indonésie", anchors: [["USD", 0.68], ["EUR", 0.09], ["CNY", 0.07], ["JPY", 0.07]] },
    // Eurozone hard pegs / euroisation
    { id: "BGR", name: "Bulgarie",  anchors: [["EUR", 0.97]] },
    { id: "BIH", name: "Bosnie",    anchors: [["EUR", 0.92]] },
    { id: "MNE", name: "Monténégro",anchors: [["EUR", 1.00]] },
    { id: "XKX", name: "Kosovo",    anchors: [["EUR", 1.00]] },
    // Zone franc CFA
    { id: "SEN", name: "Sénégal",   anchors: [["EUR", 1.00]] },
    { id: "CIV", name: "Côte d'Iv.",anchors: [["EUR", 1.00]] },
    { id: "CMR", name: "Cameroun",  anchors: [["EUR", 1.00]] },
    { id: "GAB", name: "Gabon",     anchors: [["EUR", 1.00]] },
    // CNY-aligned (BRI, sanctioned)
    { id: "RUS", name: "Russie",    anchors: [["CNY", 0.45], ["EUR", 0.18], ["USD", 0.10]] },
    { id: "IRN", name: "Iran",      anchors: [["CNY", 0.40], ["EUR", 0.15], ["USD", 0.05]] },
    { id: "PAK", name: "Pakistan",  anchors: [["USD", 0.55], ["CNY", 0.22]] },
    { id: "KAZ", name: "Kazakhstan",anchors: [["USD", 0.48], ["CNY", 0.20], ["EUR", 0.08]] },
    { id: "KHM", name: "Cambodge",  anchors: [["USD", 0.72], ["CNY", 0.15]] },
    { id: "LAO", name: "Laos",      anchors: [["USD", 0.50], ["CNY", 0.30]] },
    // GBP-linked / Commonwealth residual
    { id: "GIB", name: "Gibraltar", anchors: [["GBP", 1.00]] },
    { id: "FLK", name: "Falklands", anchors: [["GBP", 1.00]] },
    // Multi-currency floaters
    { id: "TUR", name: "Türkiye",   anchors: [["USD", 0.55], ["EUR", 0.30], ["CNY", 0.04]] },
    { id: "IND", name: "Inde",      anchors: [["USD", 0.55], ["EUR", 0.18], ["GBP", 0.07], ["JPY", 0.05]] },
    { id: "ZAF", name: "Afr. du Sud",anchors: [["USD", 0.48], ["EUR", 0.22], ["GBP", 0.08], ["CNY", 0.05]] },
    { id: "EGY", name: "Égypte",    anchors: [["USD", 0.60], ["EUR", 0.20]] },
    { id: "NGA", name: "Nigeria",   anchors: [["USD", 0.62], ["EUR", 0.15], ["GBP", 0.05], ["CNY", 0.05]] },
    { id: "AUS", name: "Australie", anchors: [["USD", 0.55], ["EUR", 0.20], ["CNY", 0.08], ["JPY", 0.10]] },
    { id: "CAN", name: "Canada",    anchors: [["USD", 0.78], ["EUR", 0.10]] },
    { id: "CHE", name: "Suisse",    anchors: [["EUR", 0.45], ["USD", 0.35], ["GBP", 0.05], ["JPY", 0.05]] },
    { id: "NOR", name: "Norvège",   anchors: [["EUR", 0.42], ["USD", 0.38], ["GBP", 0.06]] },
  ];

  function render() {
    const svg = document.getElementById("a1-svg");
    const sidebar = document.getElementById("a1-sidebar");
    const stage = document.getElementById("a1-stage");
    const canvasEl = stage.querySelector(".canvas-pure");
    // Fixed virtual canvas — scales via preserveAspectRatio
    const W = 920, H = 620;
    canvasEl.style.minHeight = "600px";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    clearSVG(svg);

    const cx = W / 2, cy = H / 2;
    const Rcountries = 230;
    const Rcurrencies = 110;

    // Place currency cores in a pentagon at radius Rcurrencies
    const curPos = {};
    CURRENCIES.forEach((c, i) => {
      const a = (-Math.PI / 2) + (i * 2 * Math.PI / CURRENCIES.length);
      curPos[c.id] = { x: cx + Math.cos(a) * Rcurrencies,
                       y: cy + Math.sin(a) * Rcurrencies,
                       a, color: c.color, name: c.name, share: c.share };
    });

    // Place countries on outer ring, grouped by primary anchor
    // Order: sort by (primary anchor angle, then by secondary mix purity)
    const ordered = COUNTRIES.map(c => {
      const primary = c.anchors[0][0];
      return { ...c, primary, primaryW: c.anchors[0][1] };
    });
    // Group by primary, place each group as an arc around its primary's angle
    const groups = {};
    CURRENCIES.forEach(c => groups[c.id] = []);
    ordered.forEach(c => groups[c.primary].push(c));
    // Order each group by descending purity
    Object.values(groups).forEach(g => g.sort((a, b) => b.primaryW - a.primaryW));

    // Determine angular span per group
    const totalCountries = ordered.length;
    const slotAngles = {};
    let cursor = -Math.PI / 2; // start top
    CURRENCIES.forEach(cur => {
      const g = groups[cur.id];
      const fraction = g.length / totalCountries;
      const span = fraction * 2 * Math.PI;
      // Place around the group's "preferred" center = currency angle, but use cursor for even distribution
      const groupCenter = curPos[cur.id].a;
      const gap = 0.04; // gap between groups
      const usable = span - gap;
      g.forEach((c, j) => {
        const t = (j + 0.5) / g.length; // 0..1
        c.angle = groupCenter - usable / 2 + t * usable;
      });
    });

    const ctryPos = {};
    ordered.forEach(c => {
      const a = c.angle;
      ctryPos[c.id] = {
        x: cx + Math.cos(a) * Rcountries,
        y: cy + Math.sin(a) * Rcountries,
        a, name: c.name, anchors: c.anchors
      };
    });

    // Draw links (under)
    const linksLayer = el("g", { class: "links" }, svg);
    ordered.forEach(c => {
      const cp = ctryPos[c.id];
      c.anchors.forEach(([curId, w]) => {
        const cur = curPos[curId];
        // Quadratic curve toward center bias
        const mx = (cp.x + cur.x) / 2;
        const my = (cp.y + cur.y) / 2;
        // Pull toward center
        const px = cx - mx, py = cy - my;
        const k = 0.18;
        const qx = mx + px * k;
        const qy = my + py * k;
        el("path", {
          class: "cur-link",
          d: `M${cp.x},${cp.y} Q${qx},${qy} ${cur.x},${cur.y}`,
          stroke: cur.color,
          "stroke-opacity": 0.18 + w * 0.55,
          "stroke-width": (0.4 + w * 3.2).toFixed(2)
        }, linksLayer);
      });
    });

    // (currencies placed earlier via curPos)

    // Draw currency cores (over links, under country nodes' labels)
    const coresLayer = el("g", { class: "cores" }, svg);
    CURRENCIES.forEach(c => {
      const p = curPos[c.id];
      const g = el("g", { class: "cur-core", transform: `translate(${p.x},${p.y})` }, coresLayer);
      // Log-scaled radius — keeps minor currencies (GBP, JPY, CNY) legible
      const r = 13 + Math.log2(1 + c.share) * 2.6;
      el("circle", { r: r + 5, fill: "var(--paper)", opacity: 0.9 }, g);
      el("circle", { r: r, fill: c.color, opacity: 0.94 }, g);
      el("circle", { r: r + 4, fill: "none", stroke: c.color, "stroke-opacity": 0.35 }, g);
      el("text", { class: "symbol", y: 0, "font-size": 12, fill: "#fbf8f0" }, g).textContent = c.id;
      el("text", { class: "label", y: r + 13 }, g).textContent = c.name;
      el("text", { class: "label", y: r + 25, fill: c.color, "font-weight": 500 }, g).textContent = c.share + "% rés.";
    });

    // Draw country nodes
    const nodesLayer = el("g", { class: "ctries" }, svg);
    ordered.forEach(c => {
      const p = ctryPos[c.id];
      const primaryColor = curPos[c.anchors[0][0]].color;
      const purity = c.anchors[0][1];
      const g = el("g", { class: "cur-node", transform: `translate(${p.x},${p.y})` }, nodesLayer);
      const r = 3.5 + purity * 4;
      el("circle", { r: r, fill: primaryColor, "fill-opacity": 0.85 }, g);

      // Label offset radially outward
      const ang = p.a;
      const lx = Math.cos(ang) * 12;
      const ly = Math.sin(ang) * 12;
      // Rotate text to be tangential, readable side up
      let rotate = (ang * 180 / Math.PI);
      let anchor = "start";
      if (Math.cos(ang) < 0) { rotate += 180; anchor = "end"; }
      el("text", {
        x: lx, y: ly,
        transform: `rotate(${rotate} ${lx} ${ly})`,
        "text-anchor": anchor,
        "dominant-baseline": "central"
      }, g).textContent = c.name;
    });

    // ----- Sidebar -----
    sidebar.innerHTML = "";
    const block1 = document.createElement("div");
    block1.className = "s-block";
    block1.innerHTML = `
      <div class="s-title">Cinq ancres</div>
      <div class="s-legend">
        ${CURRENCIES.map(c => `
          <span class="swatch"><span class="dot" style="background:${c.color}"></span>${c.id} · ${c.share}%</span>
        `).join("")}
      </div>
      <div style="font-size: 12px; color: var(--ink-3); font-style: italic; margin-top: 4px;">
        Part dans les réserves officielles mondiales (COFER, T4 2024). Le reste (~9 %) se répartit entre CAD, AUD, CHF et autres.
      </div>
    `;
    sidebar.appendChild(block1);

    const block2 = document.createElement("div");
    block2.className = "s-block";
    const monoZones = [
      { lbl: "Dollarisation intégrale", val: "PAN · ECU · MNE*" },
      { lbl: "Pegs dollar", val: "SAU · ARE · HKG" },
      { lbl: "Pegs euro (CFA inclus)", val: "BGR · BIH · 14 États CFA" },
      { lbl: "Yuanisation partielle", val: "RUS · IRN · LAO" },
      { lbl: "Flotteurs multidev.", val: "TUR · IND · ZAF · CHE" },
    ];
    block2.innerHTML = `
      <div class="s-title">Lecture du graphe</div>
      ${monoZones.map(z => `
        <div class="s-stat"><span class="lbl">${z.lbl}</span><span class="val">${z.val}</span></div>
      `).join("")}
    `;
    sidebar.appendChild(block2);

    const block3 = document.createElement("div");
    block3.className = "s-block";
    block3.innerHTML = `
      <div class="s-title">Mesure d'asymétrie</div>
      <div style="font-size: 12.5px; color: var(--ink-2); line-height: 1.5;">
        Un pays dont 90 %+ des réserves reposent sur une seule devise hérite mécaniquement de son cycle monétaire : remontée des taux Fed → tension sur tout le ring dollar. L'<span class="mono">HHI monétaire</span> de Sec. 2.2 transposé à ce graphe donne un indicateur de <em>souveraineté monétaire effective</em>.
      </div>
    `;
    sidebar.appendChild(block3);

    // Caption
    const cap = document.createElement("div");
    cap.style.cssText = "position:absolute; bottom:12px; left:18px; right:18px; font-family:var(--serif); font-style:italic; font-size:12.5px; color:var(--ink-3); pointer-events:none;";
    cap.textContent = "Fig. A1 — Réseau d'ancrage monétaire. Épaisseur du fil = part de la devise dans les réserves / facturation du pays. Disposition radiale par devise primaire.";
    stage.querySelector(".canvas-pure").appendChild(cap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
  window.addEventListener("resize", () => { clearTimeout(window.__a1t); window.__a1t = setTimeout(render, 200); });
})();

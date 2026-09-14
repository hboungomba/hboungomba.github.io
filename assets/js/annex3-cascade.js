// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// =====================================================================
// A3 — Cascade de défauts sur le graphe de dette souveraine européenne
//      (stylisation 2010–2012). 4 vignettes : T0 déclenchement Grèce
//      → T3 stabilisation après intervention BCE.
// =====================================================================

(function () {
  const { el, clearSVG } = window.GraphUtils;

  // Nœuds : pays + grandes institutions créancières
  // capacity = κ (capacité d'absorption en % PIB)
  const NODES = [
    { id: "GRC", label: "GRC", x: 0.18, y: 0.78, cap: 0.05 },
    { id: "PRT", label: "PRT", x: 0.30, y: 0.85, cap: 0.07 },
    { id: "IRL", label: "IRL", x: 0.42, y: 0.20, cap: 0.10 },
    { id: "ESP", label: "ESP", x: 0.55, y: 0.85, cap: 0.12 },
    { id: "ITA", label: "ITA", x: 0.72, y: 0.78, cap: 0.14 },
    { id: "FRA", label: "FRA", x: 0.45, y: 0.45, cap: 0.22 },
    { id: "DEU", label: "DEU", x: 0.62, y: 0.30, cap: 0.28 },
    { id: "NLD", label: "NLD", x: 0.72, y: 0.55, cap: 0.18 },
    { id: "BEL", label: "BEL", x: 0.30, y: 0.42, cap: 0.13 },
    { id: "AUT", label: "AUT", x: 0.85, y: 0.45, cap: 0.13 },
    { id: "ECB", label: "BCE", x: 0.18, y: 0.32, cap: 0.50 },
  ];

  // Arêtes : créancier → débiteur, w = % PIB créancier exposé au débiteur
  // (chiffres stylisés calibrés sur BIS Consolidated Banking Stats 2010)
  const EDGES = [
    ["FRA", "GRC", 0.04],
    ["DEU", "GRC", 0.02],
    ["ECB", "GRC", 0.06],
    ["NLD", "GRC", 0.01],
    ["FRA", "PRT", 0.03],
    ["DEU", "PRT", 0.02],
    ["ECB", "PRT", 0.04],
    ["FRA", "ESP", 0.06],
    ["DEU", "ESP", 0.05],
    ["NLD", "ESP", 0.03],
    ["BEL", "ESP", 0.02],
    ["ECB", "ESP", 0.05],
    ["FRA", "ITA", 0.09],
    ["DEU", "ITA", 0.06],
    ["NLD", "ITA", 0.03],
    ["ECB", "ITA", 0.07],
    ["DEU", "IRL", 0.04],
    ["FRA", "IRL", 0.02],
    ["DEU", "FRA", 0.05],
    ["NLD", "FRA", 0.03],
    ["AUT", "ITA", 0.04],
    ["BEL", "FRA", 0.04],
  ];

  // 4 états successifs : map nodeId → "solv" | "stress" | "def"
  // T0 : déclenchement Grèce (défaut probable, FRA & ECB sous tension)
  // T1 : Grèce confirmée, Portugal & Irlande sous tension, ESP/ITA proches du seuil
  // T2 : Portugal + Irlande défauts, Espagne sous tension forte, Italie en alerte
  // T3 : Intervention BCE (OMT) : seuils relevés, contagion endiguée
  const STATES = [
    {
      title: "T₀", subtitle: "Mai 2010 — déclenchement",
      note: "Grèce demande l'assistance UE/FMI. Premiers signaux de stress sur le périphérique.",
      state: {
        GRC: "stress", PRT: "solv", IRL: "solv", ESP: "solv", ITA: "solv",
        FRA: "solv", DEU: "solv", NLD: "solv", BEL: "solv", AUT: "solv", ECB: "solv"
      },
      activeEdges: []
    },
    {
      title: "T₁", subtitle: "Nov. 2010 — premier choc",
      note: "Défaut technique partiel Grèce → pertes France, BCE. Portugal et Irlande basculent en tension.",
      state: {
        GRC: "def", PRT: "stress", IRL: "stress", ESP: "solv", ITA: "solv",
        FRA: "stress", DEU: "solv", NLD: "solv", BEL: "solv", AUT: "solv", ECB: "stress"
      },
      activeEdges: [["FRA", "GRC"], ["ECB", "GRC"], ["DEU", "GRC"]]
    },
    {
      title: "T₂", subtitle: "2011 — contagion ouverte",
      note: "Cascade : Portugal et Irlande en défaut. Espagne et Italie passent la barre 5 % PIB d'exposition cumulée. France sous tension.",
      state: {
        GRC: "def", PRT: "def", IRL: "def", ESP: "stress", ITA: "stress",
        FRA: "stress", DEU: "stress", NLD: "stress", BEL: "stress", AUT: "stress", ECB: "stress"
      },
      activeEdges: [
        ["FRA", "PRT"], ["ECB", "PRT"], ["DEU", "PRT"],
        ["DEU", "IRL"], ["FRA", "IRL"],
        ["FRA", "ESP"], ["DEU", "ESP"], ["NLD", "ESP"], ["ECB", "ESP"],
        ["FRA", "ITA"], ["DEU", "ITA"], ["ECB", "ITA"], ["AUT", "ITA"]
      ]
    },
    {
      title: "T₃", subtitle: "2012 — endiguement OMT",
      note: "Annonce du « whatever it takes ». La capacité d'absorption de la BCE est relevée. La cascade s'éteint avant d'atteindre Italie.",
      state: {
        GRC: "def", PRT: "def", IRL: "def", ESP: "stress", ITA: "stress",
        FRA: "solv", DEU: "solv", NLD: "solv", BEL: "solv", AUT: "solv", ECB: "solv"
      },
      activeEdges: [["ECB", "ITA"], ["ECB", "ESP"]]
    },
  ];

  function render() {
    const grid = document.getElementById("a3-grid");
    grid.innerHTML = "";

    // Fixed per-panel viewBox; CSS handles fit
    const W = 280;
    const H = 420;

    STATES.forEach((stateDef, idx) => {
      const panel = document.createElement("div");
      panel.className = "panel";
      grid.appendChild(panel);

      const t = document.createElement("div");
      t.className = "title";
      t.innerHTML = `<strong>${stateDef.title}</strong> · ${stateDef.subtitle}`;
      panel.appendChild(t);

      const n = document.createElement("div");
      n.className = "note";
      n.textContent = stateDef.note;
      panel.appendChild(n);

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.style.width = "100%";
      svg.style.height = "100%";
      panel.appendChild(svg);

      // Positions
      const padX = 30, padY = 60;
      const innerW = W - padX * 2;
      const innerH = H - padY - 80;
      const pos = {};
      NODES.forEach(node => {
        pos[node.id] = { x: padX + node.x * innerW, y: padY + node.y * innerH };
      });

      // Active edge set
      const activeSet = new Set(stateDef.activeEdges.map(([a, b]) => a + "→" + b));

      // Draw edges (orient creditor → debtor)
      const edgeLayer = el("g", { class: "edges" }, svg);
      EDGES.forEach(([from, to, w]) => {
        const a = pos[from], b = pos[to];
        if (!a || !b) return;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const px = -dy / len, py = dx / len;
        const curve = 0.10;
        const cx = mx + px * len * curve;
        const cy = my + py * len * curve;
        const active = activeSet.has(from + "→" + to);
        el("path", {
          class: "casc-edge" + (active ? " active" : ""),
          d: `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`,
          "stroke-width": (0.5 + w * 18).toFixed(1)
        }, edgeLayer);
      });

      // Draw nodes
      const nodeLayer = el("g", { class: "nodes" }, svg);
      NODES.forEach(node => {
        const p = pos[node.id];
        const state = stateDef.state[node.id] || "solv";
        const g = el("g", { class: "casc-node " + state, transform: `translate(${p.x},${p.y})` }, nodeLayer);
        const r = node.id === "ECB" ? 16 : 12;
        el("circle", { r: r }, g);
        el("text", { y: 1, "font-size": node.id === "ECB" ? 10 : 9.5 }, g).textContent = node.label;
      });

      // Round indicator on top right
      el("text", {
        x: W - 20, y: 30,
        "font-family": "var(--mono)", "font-size": 32, "font-weight": 500,
        fill: "var(--rule)",
        "text-anchor": "end"
      }, svg).textContent = String(idx);
    });

    // Add a legend across the bottom of the cascade strip
    const sidebar = document.getElementById("a3-sidebar");
    if (sidebar) sidebar.remove(); // not used (full stage)

    // Insert legend underneath the cascade
    let legend = document.getElementById("a3-legend");
    if (!legend) {
      legend = document.createElement("div");
      legend.id = "a3-legend";
      legend.style.cssText = `
        max-width: var(--maxw); margin: 14px auto 0; padding: 14px 18px;
        background: var(--paper); border: 1px solid var(--rule);
        display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 32px;
        font-size: 12.5px;
      `;
      legend.innerHTML = `
        <div>
          <div class="s-title" style="margin-bottom:6px">Lecture du diagramme</div>
          <div style="color: var(--ink-2); line-height: 1.5;">
            Arêtes : exposition créancier → débiteur, épaisseur proportionnelle à la dette en % PIB du créancier. Le rouge marque les arêtes qui transmettent activement une perte au tour t.
          </div>
        </div>
        <div>
          <div class="s-title" style="margin-bottom:6px">États des nœuds</div>
          <div class="s-legend">
            <span class="swatch"><span class="dot" style="background:#c8d2b8"></span>solvable</span>
            <span class="swatch"><span class="dot" style="background:#e8c98c"></span>sous tension</span>
            <span class="swatch"><span class="dot" style="background:var(--crit)"></span>défaut</span>
          </div>
        </div>
        <div>
          <div class="s-title" style="margin-bottom:6px">Seuil de bascule</div>
          <div style="color: var(--ink-2); line-height: 1.5;">
            Bascule lorsque les pertes cumulées <span class="mono">L<sub>i</sub></span> dépassent κ<sub>i</sub> · PIB<sub>i</sub>. La BCE (κ ≈ 0,50) ne bascule jamais ; sa relèvement de κ en T₃ éteint la cascade.
          </div>
        </div>
      `;
      document.getElementById("a3").appendChild(legend);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
  window.addEventListener("resize", () => { clearTimeout(window.__a3t); window.__a3t = setTimeout(render, 200); });
})();

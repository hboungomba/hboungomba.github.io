// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// ====================================================================
// CHAPITRE 1 — Graphe historique avec scrubber temporel
// ====================================================================
(function () {
  const { project, clearSVG, el, curvePath, createTooltip } = window.GraphUtils;
  const PERIODS = ["1600", "1750", "1900", "1960", "2000", "2025"];
  let currentIdx = 5; // start at 2025

  const stage = document.getElementById("c1-stage");
  const canvas = stage.querySelector(".canvas");
  const svg = canvas.querySelector("svg");
  const sidebar = stage.querySelector(".sidebar");
  const captionEl = canvas.querySelector(".caption");
  const tip = createTooltip(canvas);

  // Build scrubber UI
  const scrubber = document.getElementById("c1-scrubber");
  scrubber.innerHTML = `
    <div class="period mono">${PERIODS[currentIdx]}</div>
    <div style="flex:1">
      <input type="range" min="0" max="${PERIODS.length - 1}" value="${currentIdx}" step="1" />
      <div class="ticks">${PERIODS.map(p => `<span>${p}</span>`).join("")}</div>
    </div>
  `;
  const rangeIn = scrubber.querySelector("input");
  const periodOut = scrubber.querySelector(".period");
  rangeIn.addEventListener("input", () => {
    currentIdx = +rangeIn.value;
    periodOut.textContent = PERIODS[currentIdx];
    render();
  });

  function bbox() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function render() {
    const { w, h } = bbox();
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    clearSVG(svg);

    const data = HISTORICAL_NETWORKS[PERIODS[currentIdx]];

    // background continent guides (very subtle)
    drawContinentGuides(svg, w, h);

    // Compute positions
    const pos = {};
    data.nodes.forEach(n => {
      const [x, y] = project(n.x, n.y, w, h, 70);
      pos[n.id] = { x, y, n };
    });

    // Edges layer
    const gEdges = el("g", { class: "edges" }, svg);
    data.links.forEach(([s, t, w0]) => {
      if (!pos[s] || !pos[t] || w0 <= 0) return;
      const p1 = pos[s], p2 = pos[t];
      const path = el("path", {
        class: "edge",
        d: curvePath(p1.x, p1.y, p2.x, p2.y, 0.08),
        "stroke-width": 0.6 + w0 * 2.4
      }, gEdges);
      // No interaction on edges for c1
    });

    // Nodes layer
    const gNodes = el("g", { class: "nodes" }, svg);
    data.nodes.forEach(n => {
      const p = pos[n.id];
      const r = 4 + Math.sqrt(n.w) * 36;
      const g = el("g", { class: "node", transform: `translate(${p.x},${p.y})` }, gNodes);
      el("circle", {
        r,
        fill: REGION_COLORS[n.region] || "#888",
        "fill-opacity": 0.88
      }, g);
      el("text", {
        y: r + 11,
        "font-size": 10
      }, g).textContent = n.label;

      g.addEventListener("mouseenter", (e) => {
        const rect = canvas.getBoundingClientRect();
        tip.show(
          e.clientX - rect.left,
          e.clientY - rect.top,
          `<div class="nm">${n.label}</div>
           <div class="stat">région : <span>${REGION_LABELS[n.region]}</span></div>
           <div class="stat">poids : <span>${(n.w*100).toFixed(1)} % comm. mondial</span></div>`
        );
        // highlight
        g.classList.add("hl");
        gEdges.querySelectorAll(".edge").forEach((p, i) => {
          const link = data.links[i];
          if (!link) return;
          if (link[0] === n.id || link[1] === n.id) p.classList.add("hl");
          else p.classList.add("dim");
        });
        gNodes.querySelectorAll(".node").forEach(nn => {
          if (nn !== g) nn.classList.add("dim");
        });
      });
      g.addEventListener("mouseleave", () => {
        tip.hide();
        g.classList.remove("hl");
        gEdges.querySelectorAll(".edge").forEach(p => p.classList.remove("hl", "dim"));
        gNodes.querySelectorAll(".node").forEach(nn => nn.classList.remove("dim"));
      });
    });

    captionEl.textContent = `${data.title} — ${data.caption}`;
    renderSidebar(data);
  }

  function renderSidebar(data) {
    const regions = [...new Set(data.nodes.map(n => n.region))];
    sidebar.innerHTML = `
      <div class="s-block">
        <div class="s-title">Métriques structurelles</div>
        <div class="s-stat"><span class="lbl">Densité</span><span class="val">${data.metrics.density.toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">Modularité Q</span><span class="val">${data.metrics.modularity.toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">Diamètre</span><span class="val">${data.metrics.diameter}</span></div>
        <div class="s-stat"><span class="lbl">HHI moyen</span><span class="val">${data.metrics.hhi_avg.toFixed(2)}</span></div>
      </div>
      <div class="s-block">
        <div class="s-title">Régions</div>
        <div class="s-legend">
          ${regions.map(r => `
            <span class="swatch">
              <span class="dot" style="background:${REGION_COLORS[r]}"></span>
              ${REGION_LABELS[r]}
            </span>
          `).join("")}
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Top centralité (degré)</div>
        <div class="s-rank">
          ${[...data.nodes].sort((a,b)=>b.w-a.w).slice(0,8).map((n,i)=>`
            <div class="row">
              <span class="rk">${(i+1).toString().padStart(2,"0")}</span>
              <span class="nm">${n.label}</span>
              <span class="vl">${(n.w*100).toFixed(1)}%</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Lecture</div>
        <div style="font-size:12px; color:var(--ink-2); font-style:italic; line-height:1.5">
          ${interpretation(data.period)}
        </div>
      </div>
    `;
  }

  function interpretation(period) {
    return {
      "1600": "Structure multipolaire : Venise, Gênes, Empire ottoman et hubs asiatiques (Moghol, Ming) coexistent. Le réseau atlantique est encore embryonnaire. HHI relativement bas.",
      "1750": "Le triangle atlantique (UK, Antilles, 13 Colonies, W.-Afrique) se densifie. La VOC et l'EIC déplacent le centre de gravité commercial vers l'Europe du Nord.",
      "1900": "Hub-and-spoke colonial : chaque métropole européenne contrôle des colonies périphériques quasi mono-connectées (HHI > 0,7). La modularité Q est maximale.",
      "1960": "Étoile américaine. Les USA polarisent le bloc capitaliste ; l'URSS forme un sous-graphe séparé. La zone franc maintient FRA → Afrique de l'Ouest.",
      "2000": "Triade USA/UE/Asie. La Chine émerge comme hub. Singapour et Hong Kong deviennent des plaques tournantes (betweenness très élevée). Q baisse.",
      "2025": "Multipolarité fragmentée. La Chine devance les USA en centralité de degré. Les Belt & Road, RCEP et ZLECAf recomposent les modules régionaux."
    }[period];
  }

  function drawContinentGuides(svg, w, h) {
    // Three pale bands : Amériques, Europe-Afrique, Asie-Pacifique
    const g = el("g", { class: "guides" }, svg);
    const bands = [
      { x:0.04, w:0.28, label:"AMÉRIQUES" },
      { x:0.32, w:0.32, label:"EUROPE · AFRIQUE" },
      { x:0.64, w:0.32, label:"ASIE · PACIFIQUE" }
    ];
    bands.forEach(b => {
      el("rect", {
        x: b.x * w, y: 14, width: b.w * w, height: h - 28,
        fill: "rgba(120, 100, 70, 0.025)",
        stroke: "rgba(120, 100, 70, 0.08)",
        "stroke-dasharray": "2 3"
      }, g);
      el("text", {
        x: (b.x + b.w / 2) * w, y: 26,
        "text-anchor": "middle",
        "font-family": "JetBrains Mono, monospace",
        "font-size": 9, "letter-spacing": "0.18em",
        fill: "rgba(60,40,20,0.25)"
      }, g).textContent = b.label;
    });
  }

  // Initial render + resize handling
  function init() { render(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("resize", () => requestAnimationFrame(render));
})();

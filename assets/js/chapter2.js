// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// ====================================================================
// CHAPITRE 2 — Détecter les pôles : indices de centralité interactifs
// ====================================================================
(function () {
  const { rankMetric, project, clearSVG, el, curvePath, createTooltip } = window.GraphUtils;
  const METRICS = [
    { id: "degree",      label: "Degré (pondéré)",  formula: "C_deg(i) = Σⱼ wᵢⱼ", desc: "Somme des intensités d'arêtes incidentes. Mesure brute du volume d'échange." },
    { id: "betweenness", label: "Intermédiarité",   formula: "C_bet(i) = Σ σ_st(i)/σ_st", desc: "Fraction des plus courts chemins passant par i. Identifie les passages obligés (Singapour, Hong Kong, UK XIXe)." },
    { id: "eigenvector", label: "Eigenvector",      formula: "x = (1/λ) A x", desc: "Importance des voisins. Un nœud est central s'il est connecté à d'autres nœuds centraux (PageRank simplifié)." },
    { id: "closeness",   label: "Proximité",        formula: "C_close(i) = (n-1)/Σⱼdᵢⱼ", desc: "Inverse de la distance moyenne aux autres nœuds. Mesure la facilité d'accès aux marchés." },
    { id: "hhi",         label: "HHI (concentration)", formula: "HHI_i = Σⱼ sᵢⱼ²", desc: "Concentration géographique des partenaires. HHI > 0,25 indique une forte dépendance." }
  ];

  let currentMetric = "degree";

  const stage = document.getElementById("c2-stage");
  const canvas = stage.querySelector(".canvas");
  const svg = canvas.querySelector("svg");
  const sidebar = stage.querySelector(".sidebar");
  const captionEl = canvas.querySelector(".caption");
  const tip = createTooltip(canvas);

  // Controls
  const controls = document.getElementById("c2-controls");
  controls.innerHTML = METRICS.map(m =>
    `<button class="btn ${m.id === currentMetric ? "active" : ""}" data-m="${m.id}">${m.label}</button>`
  ).join("");
  controls.querySelectorAll(".btn").forEach(b => {
    b.addEventListener("click", () => {
      currentMetric = b.dataset.m;
      controls.querySelectorAll(".btn").forEach(x => x.classList.toggle("active", x.dataset.m === currentMetric));
      render();
    });
  });

  function bbox() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function render() {
    const { w, h } = bbox();
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    clearSVG(svg);

    const data = HISTORICAL_NETWORKS["2025"];
    const metric = METRICS.find(m => m.id === currentMetric);
    const { valueById, sortedIds, maxVal } = rankMetric(data.nodes, data.links, currentMetric);

    // Positions
    const pos = {};
    data.nodes.forEach(n => {
      const [x, y] = project(n.x, n.y, w, h, 70);
      pos[n.id] = { x, y, n };
    });

    // Continent bands
    const guides = el("g", {}, svg);
    [
      { x:0.04, w:0.28 }, { x:0.32, w:0.32 }, { x:0.64, w:0.32 }
    ].forEach(b => {
      el("rect", {
        x: b.x * w, y: 14, width: b.w * w, height: h - 28,
        fill: "rgba(120,100,70,0.022)",
        stroke: "rgba(120,100,70,0.07)",
        "stroke-dasharray": "2 3"
      }, guides);
    });

    // Edges
    const gEdges = el("g", {}, svg);
    data.links.forEach(([s, t, w0]) => {
      if (!pos[s] || !pos[t] || w0 <= 0) return;
      const vs = valueById[s] || 0, vt = valueById[t] || 0;
      // Dim edges not connected to top-N
      const topN = new Set(sortedIds.slice(0, 5));
      const involves = topN.has(s) || topN.has(t);
      el("path", {
        class: "edge",
        d: curvePath(pos[s].x, pos[s].y, pos[t].x, pos[t].y, 0.08),
        "stroke-width": 0.5 + w0 * 2,
        "stroke-opacity": involves ? 0.32 : 0.12
      }, gEdges);
    });

    // Nodes — colored by metric value (sequential ramp), labels for top 8
    const gNodes = el("g", {}, svg);
    const topLabels = new Set(sortedIds.slice(0, 12));

    data.nodes.forEach(n => {
      const p = pos[n.id];
      const v = valueById[n.id];
      const t = maxVal > 0 ? v / maxVal : 0;
      const r = 4 + Math.sqrt(n.w) * 36;

      const g = el("g", { class: "node", transform: `translate(${p.x},${p.y})` }, gNodes);
      const fill = rampColor(t, currentMetric);
      el("circle", {
        r,
        fill,
        "fill-opacity": 0.5 + t * 0.45,
        stroke: t > 0.7 ? "var(--ink)" : "var(--paper)",
        "stroke-width": t > 0.7 ? 1.5 : 1
      }, g);
      if (topLabels.has(n.id)) {
        el("text", { y: r + 11 }, g).textContent = n.label;
      }

      g.addEventListener("mouseenter", (e) => {
        const rect = canvas.getBoundingClientRect();
        tip.show(
          e.clientX - rect.left,
          e.clientY - rect.top,
          `<div class="nm">${n.label}</div>
           <div class="stat">${metric.label} : <span>${formatVal(v, currentMetric)}</span></div>
           <div class="stat">rang : <span>#${sortedIds.indexOf(n.id) + 1} / ${data.nodes.length}</span></div>`
        );
      });
      g.addEventListener("mouseleave", () => tip.hide());
    });

    captionEl.textContent = `${metric.label} sur le réseau 2025 — ${metric.desc}`;
    renderSidebar(metric, valueById, sortedIds, maxVal, data.nodes);
  }

  function renderSidebar(metric, valueById, sortedIds, maxVal, nodes) {
    const labelById = Object.fromEntries(nodes.map(n => [n.id, n.label]));
    sidebar.innerHTML = `
      <div class="s-block">
        <div class="s-title">${metric.label}</div>
        <div class="equation" style="font-size:14px; padding:10px 14px; margin:0">
          ${metric.formula}
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Classement (top 12)</div>
        <div class="s-rank">
          ${sortedIds.slice(0, 12).map((id, i) => `
            <div class="row ${i >= 5 ? "dim" : ""}">
              <span class="rk">${(i+1).toString().padStart(2,"0")}</span>
              <span class="nm">${labelById[id]}</span>
              <span class="vl">${formatVal(valueById[id], currentMetric)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Hubs critiques</div>
        <div style="font-size:12px; color:var(--ink-2); font-style:italic; line-height:1.5">
          ${criticality(metric, sortedIds, labelById)}
        </div>
      </div>
    `;
  }

  function formatVal(v, metricId) {
    if (v === undefined || v === null) return "—";
    if (metricId === "degree") return v.toFixed(2);
    if (metricId === "betweenness") return v.toFixed(3);
    if (metricId === "eigenvector") return v.toFixed(3);
    if (metricId === "closeness") return v.toFixed(3);
    if (metricId === "hhi") return v.toFixed(3);
    return v.toFixed(3);
  }

  function rampColor(t, metricId) {
    // HHI : inversion (forte concentration = rouge ≈ vulnérabilité)
    if (metricId === "hhi") {
      const r = 184 + (200 - 184) * t;
      const g = 92 - 60 * t;
      const b = 59 - 39 * t;
      return `rgb(${r}, ${g}, ${b})`;
    }
    // Autres : ramp ink → copper
    const r = 46 + (184 - 46) * t;
    const g = 93 - 1 * t;
    const b = 93 - 34 * t;
    return `rgb(${r}, ${g}, ${b})`;
  }

  function criticality(metric, sortedIds, labelById) {
    const top3 = sortedIds.slice(0, 3).map(id => labelById[id]).join(", ");
    const map = {
      degree:      `Volume brut : ${top3} concentrent l'essentiel des flux mondiaux. Suppression de Chine ⇒ efficacité E réduite ≈ 15 %.`,
      betweenness: `Passages obligés : ${top3} contrôlent la connectivité. Fermer un détroit ou sanctionner un de ces hubs déstabilise tout le réseau.`,
      eigenvector: `Importance par voisinage : ${top3} sont connectés aux autres centres. Effet PageRank — visibilité structurelle plutôt que volume.`,
      closeness:   `Accès aux marchés : ${top3} atteignent rapidement tous les nœuds. Avantage logistique majeur.`,
      hhi:         `Concentration : ${top3} ont les plus fortes dépendances mono-partenaires. Vulnérabilité aux chocs commerciaux ciblés.`
    };
    return map[metric.id];
  }

  function init() { render(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("resize", () => requestAnimationFrame(render));
})();

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// ====================================================================
// CHAPITRE 4 — Coalitions comme groupes algébriques (BRICS, ASEAN, ZLECAf)
// ====================================================================
(function () {
  const { clearSVG, el, createTooltip } = window.GraphUtils;
  let current = "BRICS";

  const stage = document.getElementById("c4-stage");
  const canvas = stage.querySelector(".canvas");
  const svg = canvas.querySelector("svg");
  const sidebar = stage.querySelector(".sidebar");
  const captionEl = canvas.querySelector(".caption");
  const tip = createTooltip(canvas);
  const switcher = document.getElementById("c4-switch");

  switcher.innerHTML = `
    <button class="btn ${current==='BRICS'?'active':''}" data-c="BRICS">BRICS+</button>
    <button class="btn ${current==='ASEAN'?'active':''}" data-c="ASEAN">ASEAN</button>
    <button class="btn ${current==='ZLECAF'?'active':''}" data-c="ZLECAF">ZLECAf</button>
  `;
  switcher.querySelectorAll(".btn").forEach(b => {
    b.addEventListener("click", () => {
      current = b.dataset.c;
      switcher.querySelectorAll(".btn").forEach(x => x.classList.toggle("active", x.dataset.c === current));
      render();
    });
  });

  function bbox() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function layoutSubgroups(coalition, W, H) {
    // Each subgroup gets a region, arranged around a central "G" point
    const subs = coalition.subgroups;
    const cx = W / 2, cy = H / 2;
    const Rring = Math.min(W, H) * 0.30;

    const out = {};
    subs.forEach((sg, idx) => {
      const angle = (idx / subs.length) * Math.PI * 2 - Math.PI / 2;
      const sgCx = cx + Math.cos(angle) * Rring;
      const sgCy = cy + Math.sin(angle) * Rring;
      const m = sg.members.map(id => coalition.members.find(x => x.id === id)).filter(Boolean);
      // Cluster radius scaled by member count
      const clusterR = 30 + Math.sqrt(m.length) * 14;
      const positions = m.map((mem, j) => {
        const a = (j / m.length) * Math.PI * 2 - Math.PI / 2 + idx * 0.3;
        return {
          id: mem.id,
          x: sgCx + Math.cos(a) * (clusterR - 18),
          y: sgCy + Math.sin(a) * (clusterR - 18),
          mem
        };
      });
      // If only 1 member, place at cluster center
      if (m.length === 1) {
        positions[0].x = sgCx;
        positions[0].y = sgCy;
      }
      out[sg.id] = { cx: sgCx, cy: sgCy, r: clusterR, members: positions, label: sg.label };
    });
    return out;
  }

  function render() {
    const { w, h } = bbox();
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    clearSVG(svg);

    const coalition = COALITIONS[current];
    const layout = layoutSubgroups(coalition, w, h);

    // Central G "identity" marker (the group)
    const gCenter = el("g", { transform: `translate(${w/2},${h/2})` }, svg);
    el("circle", { r: 26, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 1.2 }, gCenter);
    el("text", {
      "text-anchor":"middle", y: -2,
      "font-family":"Source Serif 4, serif", "font-style":"italic",
      "font-size": 18, fill: "var(--ink)"
    }, gCenter).textContent = "G";
    el("text", {
      "text-anchor":"middle", y: 12,
      "font-family":"JetBrains Mono", "font-size":8.5,
      "letter-spacing":"0.1em", fill:"var(--ink-3)"
    }, gCenter).textContent = coalition.name;

    // Connections from G to each subgroup (the inclusion arrows)
    const gLinks = el("g", {}, svg);
    Object.values(layout).forEach(sg => {
      el("line", {
        x1: w/2, y1: h/2, x2: sg.cx, y2: sg.cy,
        stroke: "var(--ink-3)", "stroke-width": 0.6,
        "stroke-dasharray": "3 4",
        "stroke-opacity": 0.5
      }, gLinks);
    });

    // Sub-group rings
    const gRings = el("g", {}, svg);
    Object.entries(layout).forEach(([sgId, sg]) => {
      const isAES = sgId === "aes";
      el("circle", {
        cx: sg.cx, cy: sg.cy, r: sg.r,
        class: `subgroup-ring${isAES ? " aes" : ""}`
      }, gRings);
      el("text", {
        x: sg.cx, y: sg.cy - sg.r - 8,
        class: "subgroup-label",
        "text-anchor": "middle"
      }, gRings).textContent = `H = ${sg.label} (|H|=${sg.members.length})`;
    });

    // Member nodes
    const gMembers = el("g", {}, svg);
    Object.values(layout).forEach(sg => {
      sg.members.forEach(p => {
        const mem = p.mem;
        const r = 9 + Math.sqrt(mem.weight) * 32;
        const ng = el("g", { transform: `translate(${p.x},${p.y})`, class: "node" }, gMembers);
        const isHegemon = mem.role.includes("hégémon") || mem.role.includes("hub financier");
        el("circle", {
          r,
          fill: isHegemon ? "var(--copper-d)" : "var(--teal)",
          "fill-opacity": 0.82,
          stroke: "var(--paper)",
          "stroke-width": 1.2
        }, ng);
        el("text", {
          y: r + 11,
          "font-family":"JetBrains Mono", "font-size": 9.5,
          fill: "var(--ink-2)", "text-anchor":"middle",
          "paint-order": "stroke",
          stroke: "rgba(251,248,240,0.85)", "stroke-width": 3
        }, ng).textContent = mem.label;

        ng.addEventListener("mouseenter", (e) => {
          const rect = canvas.getBoundingClientRect();
          tip.show(
            e.clientX - rect.left, e.clientY - rect.top,
            `<div class="nm">${mem.label}</div>
             <div class="stat">rôle : <span>${mem.role}</span></div>
             <div class="stat">poids dans coalition : <span>${(mem.weight*100).toFixed(0)}%</span></div>`
          );
        });
        ng.addEventListener("mouseleave", () => tip.hide());
      });
    });

    captionEl.textContent = `${coalition.full}. Diagramme de Hasse simplifié : G se décompose en sous-groupes H₁, …, Hₖ.`;
    renderSidebar(coalition);
  }

  function renderSidebar(coalition) {
    const stable = coalition.stable;
    sidebar.innerHTML = `
      <div class="s-block">
        <div class="s-title">${coalition.name}</div>
        <div class="s-stat"><span class="lbl">Cardinalité</span><span class="val">${coalition.cardinality}</span></div>
        <div class="s-stat"><span class="lbl">Cohésion</span><span class="val">${coalition.cohesion.toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">Symétrie</span><span class="val">${coalition.symmetry.toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">Outside option</span><span class="val">${coalition.outside.toFixed(2)}</span></div>
      </div>
      <div class="s-block">
        <div class="s-title">Stabilité de la coalition</div>
        <div class="coalition-meta">
          <dd>
            <span class="stamp ${stable ? "good" : "bad"}">${stable ? "STABLE" : "INSTABLE"}</span>
          </dd>
          <dt>Critères de stabilité</dt>
          <dd>
            Cohésion > 0,50 :
            <span class="mono" style="color:${coalition.cohesion>0.5?'var(--teal-d)':'var(--crit)'}">${coalition.cohesion>0.5?'✓':'✗'}</span>
            &nbsp;·&nbsp;
            Symétrie > 0,50 :
            <span class="mono" style="color:${coalition.symmetry>0.5?'var(--teal-d)':'var(--crit)'}">${coalition.symmetry>0.5?'✓':'✗'}</span>
            &nbsp;·&nbsp;
            Outside faible (< 0,50) :
            <span class="mono" style="color:${coalition.outside<0.5?'var(--teal-d)':'var(--crit)'}">${coalition.outside<0.5?'✓':'✗'}</span>
          </dd>
          <dt>Analyse de groupe</dt>
          <dd>
            <ul>${coalition.notes.map(n => `<li>${n}</li>`).join("")}</ul>
          </dd>
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Légende</div>
        <div class="s-legend">
          <span class="swatch"><span class="dot" style="background:var(--copper-d)"></span>Hégémon / hub</span>
          <span class="swatch"><span class="dot" style="background:var(--teal)"></span>Membre standard</span>
          <span class="swatch"><span class="dot" style="background:transparent; border:1px dashed var(--crit)"></span>Sortie / instabilité</span>
        </div>
      </div>
    `;
  }

  function init() { render(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("resize", () => requestAnimationFrame(render));
})();

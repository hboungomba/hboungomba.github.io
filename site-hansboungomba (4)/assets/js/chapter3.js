// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// ====================================================================
// CHAPITRE 3 — Propagation des chocs (SIR sur réseau 2025)
// ====================================================================
(function () {
  const { project, clearSVG, el, curvePath, createTooltip, buildAdj } = window.GraphUtils;
  const stage = document.getElementById("c3-stage");
  const canvas = stage.querySelector(".canvas");
  const svg = canvas.querySelector("svg");
  const sidebar = stage.querySelector(".sidebar");
  const captionEl = canvas.querySelector(".caption");
  const tip = createTooltip(canvas);
  const controls = document.getElementById("c3-controls");

  // SIR state
  const data = HISTORICAL_NETWORKS["2025"];
  const adjInfo = buildAdj(data.nodes, data.links);

  let state = []; // 'S'|'I'|'R' per node index
  let history = []; // [{S,I,R}]
  let time = 0;
  let running = false;
  let interval = null;
  let infectionStart = null;

  // Parameters (β réduit pour calibrer ≈ propagation crise 2008 sur réseau dense)
  let beta = 0.28;
  let gamma = 0.20;

  function reset(startId = "USA") {
    state = data.nodes.map(() => "S");
    const idx = data.nodes.findIndex(n => n.id === startId);
    if (idx >= 0) state[idx] = "I";
    history = [snapshot()];
    time = 0;
    infectionStart = startId;
    stop();
    render();
    renderSidebar();
  }

  function snapshot() {
    let S = 0, I = 0, R = 0;
    for (const s of state) { if (s === "S") S++; else if (s === "I") I++; else R++; }
    return { S, I, R };
  }

  function step() {
    const n = data.nodes.length;
    const newState = state.slice();
    for (let i = 0; i < n; i++) {
      if (state[i] === "I") {
        // Recovery
        if (Math.random() < gamma) newState[i] = "R";
        // Infect neighbors
        for (const [j, w] of adjInfo.adjW[i]) {
          if (state[j] === "S" && newState[j] === "S") {
            const p = beta * w;
            if (Math.random() < p) newState[j] = "I";
          }
        }
      }
    }
    state = newState;
    time++;
    history.push(snapshot());
    if (history.length > 60) history.shift();
    const s = snapshot();
    if (s.I === 0) stop();
    render();
    renderSidebar();
  }

  function play() {
    if (running) return;
    running = true;
    interval = setInterval(step, 380);
    document.getElementById("c3-play").textContent = "PAUSE";
  }
  function stop() {
    running = false;
    if (interval) clearInterval(interval);
    interval = null;
    const b = document.getElementById("c3-play");
    if (b) b.textContent = "▶  PROPAGER";
  }

  // Build controls
  controls.innerHTML = `
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; width:100%">
      <span style="font-family:var(--mono); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-3)">Épicentre :</span>
      <select id="c3-origin" class="btn" style="text-transform:none; letter-spacing:0; font-family:var(--mono); font-size:11px"></select>
      <button id="c3-play"  class="btn copper active">▶  PROPAGER</button>
      <button id="c3-step"  class="btn">+1 PÉRIODE</button>
      <button id="c3-reset" class="btn">RESET</button>
      <span style="flex:1"></span>
      <span class="mono" style="font-size:11px; color:var(--ink-3)">
        β = <span id="c3-beta">${beta.toFixed(2)}</span>
        <input type="range" id="c3-beta-in" min="0.1" max="1" step="0.05" value="${beta}" style="vertical-align:middle; width:80px">
        γ = <span id="c3-gamma">${gamma.toFixed(2)}</span>
        <input type="range" id="c3-gamma-in" min="0.05" max="0.5" step="0.01" value="${gamma}" style="vertical-align:middle; width:80px">
      </span>
    </div>
  `;
  const origSel = document.getElementById("c3-origin");
  ["USA","CHN","DEU","RUS","SAU","TWN","SGP","ZMB","BRZ"].forEach(id => {
    const n = data.nodes.find(x => x.id === id);
    if (!n) return;
    const opt = document.createElement("option");
    opt.value = id; opt.textContent = n.label;
    origSel.appendChild(opt);
  });
  origSel.value = "USA";
  origSel.addEventListener("change", () => reset(origSel.value));

  document.getElementById("c3-play").addEventListener("click", () => {
    if (running) stop(); else play();
  });
  document.getElementById("c3-step").addEventListener("click", () => { stop(); step(); });
  document.getElementById("c3-reset").addEventListener("click", () => reset(origSel.value));
  document.getElementById("c3-beta-in").addEventListener("input", (e) => {
    beta = +e.target.value;
    document.getElementById("c3-beta").textContent = beta.toFixed(2);
    renderSidebar();
  });
  document.getElementById("c3-gamma-in").addEventListener("input", (e) => {
    gamma = +e.target.value;
    document.getElementById("c3-gamma").textContent = gamma.toFixed(2);
    renderSidebar();
  });

  function bbox() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function render() {
    const { w, h } = bbox();
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    clearSVG(svg);

    // continent guides
    const guides = el("g", {}, svg);
    [{ x:0.04, w:0.28 }, { x:0.32, w:0.32 }, { x:0.64, w:0.32 }].forEach(b => {
      el("rect", {
        x: b.x * w, y: 14, width: b.w * w, height: h - 28,
        fill: "rgba(120,100,70,0.022)",
        stroke: "rgba(120,100,70,0.07)", "stroke-dasharray": "2 3"
      }, guides);
    });

    const pos = {};
    data.nodes.forEach((n, i) => {
      const [x, y] = project(n.x, n.y, w, h, 70);
      pos[n.id] = { x, y, i };
    });

    // Edges with infection-aware coloring
    const gEdges = el("g", {}, svg);
    data.links.forEach(([s, t, w0]) => {
      if (!pos[s] || !pos[t] || w0 <= 0) return;
      const si = pos[s].i, ti = pos[t].i;
      const active = (state[si] === "I" && state[ti] === "S") || (state[ti] === "I" && state[si] === "S");
      el("path", {
        class: "edge",
        d: curvePath(pos[s].x, pos[s].y, pos[t].x, pos[t].y, 0.08),
        "stroke-width": 0.4 + w0 * 1.8,
        stroke: active ? "var(--copper-d)" : "var(--ink-2)",
        "stroke-opacity": active ? 0.5 : 0.18
      }, gEdges);
    });

    // Nodes
    const gNodes = el("g", {}, svg);
    data.nodes.forEach((n, i) => {
      const p = pos[n.id];
      const r = 4 + Math.sqrt(n.w) * 36;
      const status = state[i];

      const colors = {
        S: "#dcd5c2",  // paper-3 / pale
        I: "#b03020",  // crit red
        R: "#2e5d5d"   // teal — recovered/immune
      };
      const g = el("g", { class: "node", transform: `translate(${p.x},${p.y})` }, gNodes);

      // Halo for currently infected
      if (status === "I") {
        el("circle", {
          r: r + 6,
          fill: "none",
          stroke: "#b03020",
          "stroke-opacity": 0.4,
          "stroke-width": 1.2
        }, g);
      }
      el("circle", {
        r,
        fill: colors[status],
        "fill-opacity": status === "S" ? 0.7 : 0.9,
        stroke: status === "S" ? "#8a8a82" : "#1a1f2c",
        "stroke-width": status === "S" ? 0.8 : 1.4
      }, g);
      if (n.w > 0.025 || status === "I") {
        el("text", { y: r + 11 }, g).textContent = n.label;
      }

      g.addEventListener("click", () => {
        stop();
        reset(n.id);
        origSel.value = n.id in {USA:1,CHN:1,DEU:1,RUS:1,SAU:1,TWN:1,SGP:1,ZMB:1,BRZ:1} ? n.id : origSel.value;
      });
      g.addEventListener("mouseenter", (e) => {
        const rect = canvas.getBoundingClientRect();
        tip.show(
          e.clientX - rect.left, e.clientY - rect.top,
          `<div class="nm">${n.label}</div>
           <div class="stat">statut : <span>${ {S:"susceptible",I:"infecté",R:"sorti de crise"}[status] }</span></div>
           <div class="stat">cliquer = redémarrer ici</div>`
        );
      });
      g.addEventListener("mouseleave", () => tip.hide());
    });

    captionEl.textContent = `Modèle SIR — épicentre : ${data.nodes.find(n=>n.id===infectionStart)?.label || infectionStart}. β·wᵢⱼ par arête, γ taux de récupération. t = ${time}.`;
  }

  function renderSidebar() {
    const s = snapshot();
    const n = data.nodes.length;
    const R0 = (beta * meanDegree()) / gamma;

    sidebar.innerHTML = `
      <div class="s-block">
        <div class="s-title">Équation SIR</div>
        <div class="equation" style="font-size:13px; padding:10px 14px; margin:0; line-height:1.7">
          dS/dt = −β·S·I/N<br/>
          dI/dt = β·S·I/N − γ·I<br/>
          dR/dt = γ·I
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">État courant (t = ${time})</div>
        <div class="s-stat"><span class="lbl">Susceptibles S</span><span class="val">${s.S} / ${n}</span></div>
        <div class="s-stat"><span class="lbl">Infectés I</span><span class="val" style="color:var(--crit)">${s.I} / ${n}</span></div>
        <div class="s-stat"><span class="lbl">Sortis R</span><span class="val" style="color:var(--teal-d)">${s.R} / ${n}</span></div>
      </div>
      <div class="s-block">
        <div class="s-title">R₀ effectif</div>
        <div style="display:flex; align-items:baseline; gap:8px">
          <span class="val mono" style="font-size:28px; color:${R0>1?'var(--crit)':'var(--teal-d)'}">${R0.toFixed(2)}</span>
          <span style="font-size:12px; font-style:italic; color:var(--ink-2)">${R0 > 1 ? "épidémie" : "extinction"}</span>
        </div>
        <div style="font-size:11.5px; color:var(--ink-3); margin-top:4px">R₀ = β·⟨k⟩ / γ</div>
      </div>
      <div class="s-block">
        <div class="s-title">Trajectoire S/I/R</div>
        <svg id="c3-trajectory" viewBox="0 0 240 110" style="width:100%; height:110px"></svg>
      </div>
      <div class="s-block">
        <div class="s-title">Lecture</div>
        <div style="font-size:11.5px; color:var(--ink-2); font-style:italic; line-height:1.5">
          ${R0 > 1.5
            ? "Contagion rapide. Réduire β (diversification, réduction HHI) ou augmenter γ (filets de sécurité, swap monétaires) sont les seuls leviers."
            : R0 > 1
            ? "Épidémie modérée. Endiguement possible par interventions ciblées sur les hubs critiques."
            : "Sous-critique. Le choc reste local — robustesse du réseau."}
        </div>
      </div>
    `;
    drawTrajectory();
  }

  function meanDegree() {
    // Mean WEIGHTED degree — chaque arête contribue son poids w (0–1),
    // ce qui donne un R₀ effectif réaliste sur ce réseau (densité élevée).
    let sum = 0;
    for (let i = 0; i < adjInfo.n; i++) {
      for (const [, w] of adjInfo.adjW[i]) sum += w;
    }
    return sum / adjInfo.n;
  }

  function drawTrajectory() {
    const tsvg = document.getElementById("c3-trajectory");
    if (!tsvg) return;
    clearSVG(tsvg);
    const W = 240, H = 110, padL = 24, padR = 6, padT = 6, padB = 18;
    const n = data.nodes.length;
    const tmax = Math.max(20, history.length);
    const x = t => padL + (t / (tmax - 1 || 1)) * (W - padL - padR);
    const y = v => padT + (1 - v / n) * (H - padT - padB);

    // axes
    el("line", { x1: padL, y1: H-padB, x2: W-padR, y2: H-padB, stroke: "#6a6f7a", "stroke-width": 0.6 }, tsvg);
    el("line", { x1: padL, y1: padT, x2: padL, y2: H-padB, stroke: "#6a6f7a", "stroke-width": 0.6 }, tsvg);
    el("text", { x: 4, y: padT + 6, "font-family":"JetBrains Mono", "font-size":8, fill:"#6a6f7a" }, tsvg).textContent = n;
    el("text", { x: 4, y: H-padB+2, "font-family":"JetBrains Mono", "font-size":8, fill:"#6a6f7a" }, tsvg).textContent = "0";
    el("text", { x: padL, y: H-4, "font-family":"JetBrains Mono", "font-size":8, fill:"#6a6f7a" }, tsvg).textContent = "t=0";
    el("text", { x: W-padR-18, y: H-4, "font-family":"JetBrains Mono", "font-size":8, fill:"#6a6f7a" }, tsvg).textContent = `t=${tmax-1}`;

    const series = [
      { key:"S", cls:"s" }, { key:"I", cls:"i" }, { key:"R", cls:"r" }
    ];
    series.forEach(({key, cls}) => {
      const pts = history.map((h, i) => `${x(i)},${y(h[key])}`).join(" ");
      el("polyline", {
        points: pts,
        class: `curve ${cls}`,
        fill: "none",
        stroke: cls === "s" ? "#2e5d5d" : cls === "i" ? "#b03020" : "#5a6b2e",
        "stroke-width": 1.5
      }, tsvg);
    });
    // legend
    const lg = el("g", { transform: `translate(${W-padR-86},${padT+2})` }, tsvg);
    ["S","I","R"].forEach((k, i) => {
      const col = i===0?"#2e5d5d":i===1?"#b03020":"#5a6b2e";
      el("line", { x1: i*28, x2: i*28+10, y1:6, y2:6, stroke: col, "stroke-width":1.8 }, lg);
      el("text", { x: i*28+13, y:9, "font-family":"JetBrains Mono", "font-size":8.5, fill:"#6a6f7a" }, lg).textContent = k;
    });
  }

  function init() { reset("USA"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("resize", () => requestAnimationFrame(render));
})();

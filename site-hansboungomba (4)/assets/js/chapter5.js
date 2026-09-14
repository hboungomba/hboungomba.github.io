// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// ====================================================================
// CHAPITRE 5 — Modélisation dynamique D(t) et indice IREX
// Équation :  D_{t+1} = β·D_t + γ·α_eff − δ·θ + ε_t
// Équilibre : D* = (γ·α_eff − δ·θ) / (1 − β)
// IREX     : normalisation de D* sur [0, 1]
// ====================================================================
(function () {
  const { clearSVG, el, createTooltip } = window.GraphUtils;
  // Calibrated estimates (illustratifs, cf. plan détaillé §5.2.2)
  let params = {
    beta:  0.82,  // persistence (path dependency)
    gamma: 0.45,  // conversion asymétrie → dépendance
    delta: 0.30,  // réduction par outside option
    alpha: 0.65,  // asymétrie effective de l'accord testé
    theta: 0.35,  // qualité outside option
    D0:    0.20,  // condition initiale
    T:     30     // horizon
  };

  const stage = document.getElementById("c5-stage");
  const dynCanvas = document.getElementById("c5-dynamic");
  const irexCanvas = document.getElementById("c5-irex");
  const sidebar = stage.querySelector(".sidebar");
  const controls = document.getElementById("c5-controls");
  const tipDyn = createTooltip(dynCanvas.parentElement);
  const tipIrex = createTooltip(irexCanvas.parentElement);

  function computeTrajectory() {
    const traj = [params.D0];
    for (let t = 1; t <= params.T; t++) {
      const prev = traj[t-1];
      const next = params.beta * prev + params.gamma * params.alpha - params.delta * params.theta;
      traj.push(Math.max(0, Math.min(1.5, next)));
    }
    return traj;
  }

  function computeIREX(alpha, theta) {
    // D* = (γα − δθ) / (1 − β)
    const Dstar = (params.gamma * alpha - params.delta * theta) / (1 - params.beta);
    // Normalize using a sigmoid-ish clipping
    if (Dstar <= 0) return 0;
    // Use the heuristic from the plan: IREX = clip(D*, 0, 1), where D* values are roughly in 0–2
    return Math.min(1, Math.max(0, Dstar / 1.4));
  }

  function buildControls() {
    controls.innerHTML = `
      <div class="equation" style="margin-bottom: 12px">
        <span class="var">D</span><span class="sub">t+1</span> =
        <span class="greek">β</span>·<span class="var">D</span><span class="sub">t</span>
        + <span class="greek">γ</span>·α<span class="sub">eff</span>
        − <span class="greek">δ</span>·θ
        + ε<span class="sub">t</span>
        &nbsp;&nbsp;⟹&nbsp;&nbsp;
        <span class="var">D</span>* =
        (<span class="greek">γ</span>α − <span class="greek">δ</span>θ) / (1 − <span class="greek">β</span>)
      </div>
      <div class="formula-row">
        <div class="formula"><strong>Paramètres calibrés :</strong> β̂ = 0,82 · γ̂ = 0,45 · δ̂ = 0,30 &nbsp;(MCO, n ≈ 400 obs, R² ≈ 0,65)</div>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0 28px">
        ${slider("beta", "β", "persistence", 0, 0.98, 0.01)}
        ${slider("alpha", "α_eff", "asymétrie", 0, 1, 0.01)}
        ${slider("gamma", "γ", "génération", 0, 1, 0.01)}
        ${slider("theta", "θ", "outside option", 0, 1, 0.01)}
        ${slider("delta", "δ", "atténuation", 0, 0.6, 0.01)}
        ${slider("D0", "D₀", "condition init.", 0, 1, 0.01)}
      </div>
    `;
    controls.querySelectorAll("input[type=range]").forEach(inp => {
      inp.addEventListener("input", () => {
        params[inp.dataset.key] = +inp.value;
        controls.querySelector(`#val-${inp.dataset.key}`).textContent = (+inp.value).toFixed(2);
        renderAll();
      });
    });
  }

  function slider(key, greek, lbl, min, max, step) {
    return `
      <div class="slider-row">
        <span class="lbl"><span class="greek">${greek}</span> · ${lbl}</span>
        <input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${params[key]}" />
        <span class="val" id="val-${key}">${params[key].toFixed(2)}</span>
      </div>
    `;
  }

  // ---------- DYNAMIC CHART (D(t)) ----------
  function renderDynamic() {
    const svg = dynCanvas;
    const W = svg.clientWidth || 560;
    const H = svg.clientHeight || 320;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    clearSVG(svg);

    const padL = 50, padR = 22, padT = 26, padB = 36;
    const traj = computeTrajectory();
    const Dstar = (params.gamma * params.alpha - params.delta * params.theta) / (1 - params.beta);

    const xScale = t => padL + (t / params.T) * (W - padL - padR);
    const yScale = v => padT + (1 - Math.min(1, Math.max(0, v))) * (H - padT - padB);

    // Title
    el("text", {
      x: padL, y: 16,
      "font-family":"JetBrains Mono", "font-size": 10,
      "letter-spacing":"0.16em", "text-transform":"uppercase",
      fill: "var(--ink-3)"
    }, svg).textContent = "TRAJECTOIRE D(t)";

    // Background risk zones
    const zones = [
      { y0: 0, y1: 0.30, color: "rgba(94, 128, 87, 0.06)", label: "RISQUE FAIBLE" },
      { y0: 0.30, y1: 0.60, color: "rgba(184, 142, 70, 0.08)", label: "RISQUE MODÉRÉ" },
      { y0: 0.60, y1: 1.00, color: "rgba(176, 48, 32, 0.08)", label: "RISQUE ÉLEVÉ" }
    ];
    zones.forEach(z => {
      el("rect", {
        x: padL, y: yScale(z.y1), width: W - padL - padR,
        height: yScale(z.y0) - yScale(z.y1),
        fill: z.color
      }, svg);
      el("text", {
        x: W - padR - 6, y: (yScale(z.y0) + yScale(z.y1)) / 2 + 3,
        "text-anchor":"end",
        "font-family":"JetBrains Mono", "font-size": 8.5,
        "letter-spacing":"0.12em",
        fill:"var(--ink-3)"
      }, svg).textContent = z.label;
    });

    // Gridlines
    for (let v = 0; v <= 1.01; v += 0.2) {
      el("line", {
        x1: padL, x2: W - padR, y1: yScale(v), y2: yScale(v),
        stroke: "var(--rule-soft)", "stroke-width": 0.6, "stroke-dasharray": "2 3"
      }, svg);
      el("text", {
        x: padL - 6, y: yScale(v) + 3,
        "text-anchor":"end",
        "font-family":"JetBrains Mono", "font-size": 9, fill:"var(--ink-3)"
      }, svg).textContent = v.toFixed(1);
    }

    // Axes
    el("line", { x1: padL, x2: padL, y1: padT, y2: H - padB, stroke:"var(--ink-3)", "stroke-width": 0.8 }, svg);
    el("line", { x1: padL, x2: W - padR, y1: H - padB, y2: H - padB, stroke:"var(--ink-3)", "stroke-width": 0.8 }, svg);
    for (let t = 0; t <= params.T; t += 5) {
      el("line", {
        x1: xScale(t), x2: xScale(t), y1: H - padB, y2: H - padB + 4,
        stroke: "var(--ink-3)", "stroke-width": 0.6
      }, svg);
      el("text", {
        x: xScale(t), y: H - padB + 16,
        "text-anchor":"middle",
        "font-family":"JetBrains Mono", "font-size": 9, fill:"var(--ink-3)"
      }, svg).textContent = "t" + (t > 0 ? "+"+t : "");
    }

    el("text", {
      x: padL - 38, y: padT + (H-padT-padB)/2,
      transform: `rotate(-90, ${padL-38}, ${padT + (H-padT-padB)/2})`,
      "text-anchor":"middle",
      "font-family":"JetBrains Mono", "font-size": 9,
      "letter-spacing":"0.12em", fill:"var(--ink-3)"
    }, svg).textContent = "D(t) — dépendance";

    // Equilibrium line
    if (Dstar > 0 && Dstar < 1.2) {
      el("line", {
        x1: padL, x2: W - padR,
        y1: yScale(Math.min(1, Dstar)), y2: yScale(Math.min(1, Dstar)),
        stroke: "var(--copper-d)", "stroke-width": 1.2,
        "stroke-dasharray": "4 3"
      }, svg);
      el("text", {
        x: W - padR - 6, y: yScale(Math.min(1, Dstar)) - 5,
        "text-anchor":"end",
        "font-family":"JetBrains Mono", "font-size": 10.5,
        fill: "var(--copper-d)"
      }, svg).textContent = `D* = ${Dstar.toFixed(2)}`;
    }

    // Trajectory path
    const pathD = traj.map((v, i) => `${i===0?"M":"L"}${xScale(i)},${yScale(v)}`).join(" ");
    el("path", { d: pathD, class: "curve d", stroke: "var(--ink)", "stroke-width": 2, fill: "none" }, svg);
    // Points
    traj.forEach((v, i) => {
      if (i % 2 === 0)
        el("circle", { cx: xScale(i), cy: yScale(v), r: 2.5, fill:"var(--ink)" }, svg);
    });
  }

  // ---------- IREX SCATTER ----------
  function renderIrex() {
    const svg = irexCanvas;
    const W = svg.clientWidth || 560;
    const H = svg.clientHeight || 360;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    clearSVG(svg);

    const padL = 50, padR = 22, padT = 26, padB = 42;

    // Title
    el("text", {
      x: padL, y: 16,
      "font-family":"JetBrains Mono", "font-size": 10,
      "letter-spacing":"0.16em", "text-transform":"uppercase",
      fill: "var(--ink-3)"
    }, svg).textContent = "VALIDATION RÉTROSPECTIVE  ·  IREX EX-ANTE  vs.  D OBSERVÉ EX-POST";

    const xScale = a => padL + a * (W - padL - padR);
    const yScale = t => padT + (1 - t) * (H - padT - padB);

    // Background IREX isocontours — IREX depends on α and θ
    // For each grid cell, compute IREX and color
    const res = 28;
    const cellW = (W - padL - padR) / res;
    const cellH = (H - padT - padB) / res;
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const a = (i + 0.5) / res;
        const t = (j + 0.5) / res;
        const irex = computeIREX(a, t);
        const col = irexColor(irex);
        el("rect", {
          x: padL + i * cellW,
          y: padT + (res - 1 - j) * cellH,
          width: cellW + 0.5, height: cellH + 0.5,
          fill: col, "fill-opacity": 0.55
        }, svg);
      }
    }

    // Iso-contour lines at IREX = 0.3, 0.6
    [0.3, 0.6].forEach(lvl => {
      const segs = [];
      // Marching along α, find θ such that IREX = lvl
      for (let a = 0; a <= 1.001; a += 0.02) {
        // IREX = (γα − δθ)/(1−β) / 1.4 = lvl
        // θ = (γα − lvl·1.4·(1−β)) / δ
        const theta = (params.gamma * a - lvl * 1.4 * (1 - params.beta)) / params.delta;
        if (theta >= 0 && theta <= 1) segs.push([a, theta]);
      }
      if (segs.length > 1) {
        const d = segs.map((p, i) => `${i===0?"M":"L"}${xScale(p[0])},${yScale(p[1])}`).join(" ");
        el("path", {
          d,
          fill: "none",
          stroke: "var(--ink-2)",
          "stroke-width": 0.8,
          "stroke-dasharray": "3 2"
        }, svg);
        const mid = segs[Math.floor(segs.length / 2)];
        el("text", {
          x: xScale(mid[0]) + 4, y: yScale(mid[1]) - 4,
          "font-family":"JetBrains Mono", "font-size": 8.5,
          fill:"var(--ink-2)"
        }, svg).textContent = `IREX = ${lvl}`;
      }
    });

    // Axes
    el("line", { x1: padL, x2: padL, y1: padT, y2: H - padB, stroke:"var(--ink-3)", "stroke-width": 0.8 }, svg);
    el("line", { x1: padL, x2: W - padR, y1: H - padB, y2: H - padB, stroke:"var(--ink-3)", "stroke-width": 0.8 }, svg);
    for (let v = 0; v <= 1.01; v += 0.2) {
      el("text", { x: padL - 6, y: yScale(v) + 3, "text-anchor":"end", "font-family":"JetBrains Mono", "font-size":9, fill:"var(--ink-3)" }, svg).textContent = v.toFixed(1);
      el("text", { x: xScale(v), y: H - padB + 14, "text-anchor":"middle", "font-family":"JetBrains Mono", "font-size":9, fill:"var(--ink-3)" }, svg).textContent = v.toFixed(1);
    }
    el("text", {
      x: (padL + W - padR)/2, y: H - 8, "text-anchor":"middle",
      "font-family":"JetBrains Mono", "font-size":9.5,
      "letter-spacing":"0.14em", "text-transform":"uppercase",
      fill:"var(--ink-3)"
    }, svg).textContent = "α_eff — asymétrie effective";
    el("text", {
      x: 14, y: padT + (H-padT-padB)/2,
      transform: `rotate(-90, 14, ${padT + (H-padT-padB)/2})`,
      "text-anchor":"middle",
      "font-family":"JetBrains Mono", "font-size":9.5,
      "letter-spacing":"0.14em", "text-transform":"uppercase",
      fill:"var(--ink-3)"
    }, svg).textContent = "θ — outside option";

    // Plot cases — labels with greedy collision avoidance + leader lines
    const eraColors = {
      colonial: "#7e3a4e", interwar: "#5a4570",
      bw: "#3a4a78", south: "#5a6b2e",
      bri: "#b85c3b", rcep: "#8a6d1f", zlecaf: "#2e5d5d"
    };

    // Pre-compute target positions and find non-overlapping label placements
    const placed = []; // {x, y, w, h}
    const points = IREX_CASES.map(c => ({
      c, x: xScale(c.alpha), y: yScale(c.theta)
    }));

    // Candidate label offsets (x, y, textAnchor) — many radial positions for crowded scatter
    const offsets = [];
    // Inner ring (close to point)
    [
      [14, 3, "start"], [-14, 3, "end"],
      [14, -9, "start"], [-14, -9, "end"],
      [14, 14, "start"], [-14, 14, "end"]
    ].forEach(o => offsets.push(o));
    // Outer ring (radial, further out)
    for (let ang = 0; ang < 360; ang += 30) {
      const rad = ang * Math.PI / 180;
      const r = 32;
      const dx = Math.cos(rad) * r, dy = Math.sin(rad) * r + 3;
      const anchor = dx >= 0 ? "start" : "end";
      offsets.push([dx, dy, anchor]);
    }
    // Even further ring
    for (let ang = 0; ang < 360; ang += 36) {
      const rad = ang * Math.PI / 180;
      const r = 56;
      const dx = Math.cos(rad) * r, dy = Math.sin(rad) * r + 3;
      const anchor = dx >= 0 ? "start" : "end";
      offsets.push([dx, dy, anchor]);
    }

    function rectsOverlap(a, b) {
      return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
    }

    // Plot all circles first (so circles draw under labels)
    points.forEach(p => {
      const g = el("g", { transform: `translate(${p.x},${p.y})`, style: "cursor:pointer", "data-case": p.c.id }, svg);
      el("circle", {
        r: 6,
        fill: eraColors[p.c.era] || "var(--ink)",
        "fill-opacity": 0.85,
        stroke: "var(--paper)", "stroke-width": 1.4
      }, g);
      p._g = g;
    });

    // Place labels (greedy, in order of distance from chart center for visual stability)
    const sortedPoints = points.slice().sort((a, b) => {
      const dxa = a.x - (padL + W - padR) / 2, dya = a.y - (padT + H - padB) / 2;
      const dxb = b.x - (padL + W - padR) / 2, dyb = b.y - (padT + H - padB) / 2;
      return (dxb*dxb + dyb*dyb) - (dxa*dxa + dya*dya); // farthest first
    });

    sortedPoints.forEach(p => {
      const labelW = p.c.label.length * 5.8 + 4;
      const labelH = 12;
      let chosen = offsets[0];
      let chosenRect = null;
      for (const off of offsets) {
        const [ox, oy, anchor] = off;
        const rect = {
          x: anchor === "end" ? p.x + ox - labelW : p.x + ox,
          y: p.y + oy - labelH + 2,
          w: labelW, h: labelH
        };
        // Also check bounds
        if (rect.x < padL || rect.x + rect.w > W - padR) continue;
        if (rect.y < padT || rect.y + rect.h > H - padB) continue;
        let collides = false;
        for (const placedR of placed) {
          if (rectsOverlap(rect, placedR)) { collides = true; break; }
        }
        if (!collides) {
          chosen = off;
          chosenRect = rect;
          break;
        }
      }
      const [ox, oy, anchor] = chosen;
      if (!chosenRect) {
        chosenRect = {
          x: anchor === "end" ? p.x + ox - labelW : p.x + ox,
          y: p.y + oy - labelH + 2,
          w: labelW, h: labelH
        };
      }
      placed.push(chosenRect);

      // Leader line if label is far from point
      const dist = Math.sqrt(ox * ox + oy * oy);
      if (dist > 14) {
        // From edge of circle (r=6) to anchor side of label
        const lx2 = anchor === "end" ? chosenRect.x + chosenRect.w : chosenRect.x;
        const ly2 = chosenRect.y + chosenRect.h - 3;
        const dx = lx2 - p.x, dy = ly2 - p.y;
        const len = Math.sqrt(dx*dx + dy*dy) || 1;
        const sx = p.x + (dx/len) * 6.5;
        const sy = p.y + (dy/len) * 6.5;
        el("line", {
          x1: sx, y1: sy, x2: lx2, y2: ly2,
          stroke: "var(--ink-3)", "stroke-width": 0.5, "stroke-opacity": 0.6
        }, svg);
      }

      // Label background for legibility
      el("rect", {
        x: chosenRect.x - 1.5, y: chosenRect.y,
        width: chosenRect.w, height: chosenRect.h,
        fill: "rgba(251,248,240,0.78)",
        rx: 1
      }, svg);
      el("text", {
        x: p.x + ox, y: p.y + oy,
        "text-anchor": anchor,
        "font-family":"Source Serif 4, serif",
        "font-style":"italic", "font-size": 10.5,
        fill: "var(--ink)"
      }, svg).textContent = p.c.label;

      // Tooltip handlers on the circle group
      const predicted = computeIREX(p.c.alpha, p.c.theta);
      const error = Math.abs(predicted - p.c.observed);
      p._g.addEventListener("mouseenter", () => {
        const rect = irexCanvas.parentElement.getBoundingClientRect();
        const rcs = p._g.getBoundingClientRect();
        tipIrex.show(
          rcs.left - rect.left + 4, rcs.top - rect.top,
          `<div class="nm">${p.c.label}</div>
           <div class="stat">α = <span>${p.c.alpha}</span>, θ = <span>${p.c.theta}</span></div>
           <div class="stat">IREX prédit : <span>${predicted.toFixed(2)}</span></div>
           <div class="stat">D observé   : <span>${p.c.observed.toFixed(2)}</span></div>
           <div class="stat">Erreur      : <span>${error.toFixed(2)}</span></div>`
        );
      });
      p._g.addEventListener("mouseleave", () => tipIrex.hide());
    });

    // Legend (eras)
    const eraEntries = [
      ["colonial","Colonial"], ["interwar","Entre-deux-g."],
      ["bw","Bretton Woods"], ["south","Sud-Sud / régional"],
      ["bri","Belt & Road"], ["rcep","RCEP / post-2020"], ["zlecaf","ZLECAf"]
    ];
    const lg = el("g", { transform: `translate(${padL + 6}, ${padT + 10})` }, svg);
    el("rect", { x:-6, y:-12, width: 150, height: eraEntries.length * 14 + 16, fill:"rgba(251,248,240,0.9)", stroke:"var(--rule)" }, lg);
    el("text", { y: 0, "font-family":"JetBrains Mono", "font-size":9, "letter-spacing":"0.12em", fill:"var(--ink-3)" }, lg).textContent = "ÉPOQUES";
    eraEntries.forEach(([k, lbl], i) => {
      const y = 14 + i * 13;
      el("circle", { cx: 4, cy: y, r: 4, fill: eraColors[k] }, lg);
      el("text", { x: 12, y: y + 3, "font-family":"Source Serif 4, serif", "font-style":"italic", "font-size": 11, fill:"var(--ink-2)" }, lg).textContent = lbl;
    });
  }

  function irexColor(t) {
    // 0 — vert pâle (faible risque), 0.5 — beige/cuivre, 1 — rouge profond
    if (t < 0.3)      return `rgb(${190 - 30*t/0.3}, ${200 - 20*t/0.3}, ${170 - 40*t/0.3})`;
    if (t < 0.6)      return `rgb(${220 + 10*(t-0.3)/0.3}, ${170 - 50*(t-0.3)/0.3}, ${110 - 20*(t-0.3)/0.3})`;
    return `rgb(${220 - 60*(t-0.6)/0.4}, ${100 - 50*(t-0.6)/0.4}, ${70 - 30*(t-0.6)/0.4})`;
  }

  function renderSidebar() {
    const Dstar = (params.gamma * params.alpha - params.delta * params.theta) / (1 - params.beta);
    const traj = computeTrajectory();
    const halfLife = params.beta > 0 ? Math.log(0.5) / Math.log(params.beta) : 0;
    const irex = computeIREX(params.alpha, params.theta);
    const reach99 = halfLife * 7; // rough horizon for ~99% convergence
    const riskBand = irex < 0.3 ? "FAIBLE" : irex < 0.6 ? "MODÉRÉ" : "ÉLEVÉ";
    const riskColor = irex < 0.3 ? "var(--olive)" : irex < 0.6 ? "var(--gold)" : "var(--crit)";

    sidebar.innerHTML = `
      <div class="s-block">
        <div class="s-title">Indice IREX (accord testé)</div>
        <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:4px">
          <span class="val mono" style="font-size:38px; color:${riskColor}">${irex.toFixed(2)}</span>
          <span style="font-family:var(--mono); font-size:11px; letter-spacing:0.12em; color:${riskColor}; padding:3px 8px; border:1px solid ${riskColor}">${riskBand}</span>
        </div>
        <div style="font-size:11.5px; color:var(--ink-3); font-style:italic">
          α_eff = ${params.alpha.toFixed(2)} · θ = ${params.theta.toFixed(2)}
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Équilibre théorique</div>
        <div class="s-stat"><span class="lbl">D* (équilibre)</span><span class="val">${Dstar.toFixed(3)}</span></div>
        <div class="s-stat"><span class="lbl">Demi-vie</span><span class="val">${isFinite(halfLife)?halfLife.toFixed(1):'∞'} périodes</span></div>
        <div class="s-stat"><span class="lbl">D à t=${params.T}</span><span class="val">${traj[params.T].toFixed(3)}</span></div>
        <div class="s-stat"><span class="lbl">Convergence ~</span><span class="val">${reach99.toFixed(0)} pér.</span></div>
      </div>
      <div class="s-block">
        <div class="s-title">Diagnostic</div>
        <div style="font-size:12px; color:var(--ink-2); font-style:italic; line-height:1.55">
          ${diagnostic(irex, Dstar, params)}
        </div>
      </div>
      <div class="s-block">
        <div class="s-title">Sensibilité (∂D*/∂x)</div>
        <div class="s-stat"><span class="lbl">∂D*/∂β</span><span class="val">${(Dstar/(1-params.beta)).toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">∂D*/∂γ</span><span class="val">+${(params.alpha/(1-params.beta)).toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">∂D*/∂δ</span><span class="val">−${(params.theta/(1-params.beta)).toFixed(2)}</span></div>
        <div class="s-stat"><span class="lbl">∂D*/∂θ</span><span class="val">−${(params.delta/(1-params.beta)).toFixed(2)}</span></div>
      </div>
    `;
  }

  function diagnostic(irex, Dstar, p) {
    if (irex >= 0.6) {
      return `Accord à <strong>risque élevé</strong>. La forte persistence β = ${p.beta.toFixed(2)} verrouille l'asymétrie une fois installée. Recommandation : exiger des clauses de révision et négocier des outside options renforcées avant signature.`;
    }
    if (irex >= 0.3) {
      return `Risque <strong>modéré</strong>. Surveillance nécessaire. Diversifier les partenaires (réduire α) ou renforcer les coalitions régionales (augmenter θ) peut basculer l'accord vers la zone de risque faible.`;
    }
    return `Risque <strong>faible</strong>. Équilibre D* dans la zone bénigne. Configuration typique des accords régionaux symétriques (ASEAN, Mercosur) ou des intégrations Sud-Sud (ZLECAf).`;
  }

  function renderAll() {
    renderDynamic();
    renderIrex();
    renderSidebar();
  }

  function init() {
    buildControls();
    renderAll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("resize", () => requestAnimationFrame(renderAll));
})();

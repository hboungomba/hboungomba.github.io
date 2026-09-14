// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Hans Boungomba — voir LICENSES.md
// ====================================================================
// TOME 3 — Utilitaires : calculs de graphes, projections, helpers SVG
// ====================================================================

// Coordonnées normalisées (0-1) → coordonnées canvas
function project(x, y, W, H, pad = 60) {
  return [pad + x * (W - 2 * pad), pad + y * (H - 2 * pad)];
}

// ---------- INDICES DE CENTRALITÉ ----------

// Construit listes d'adjacence à partir des liens
function buildAdj(nodes, links) {
  const ids = nodes.map(n => n.id);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const n = nodes.length;
  const adjW = Array.from({ length: n }, () => new Map()); // weighted adj
  const adj = Array.from({ length: n }, () => new Set());  // unweighted (undirected)
  for (const [s, t, w] of links) {
    if (!idx.has(s) || !idx.has(t)) continue;
    if (w <= 0) continue;
    const i = idx.get(s), j = idx.get(t);
    // Treat as undirected (symmetric) — use max if both directions exist
    adjW[i].set(j, Math.max(adjW[i].get(j) || 0, w));
    adjW[j].set(i, Math.max(adjW[j].get(i) || 0, w));
    adj[i].add(j); adj[j].add(i);
  }
  return { idx, adj, adjW, n };
}

// Degré pondéré (somme des poids des arêtes incidentes)
function degreeWeighted(nodes, links) {
  const { idx, adjW, n } = buildAdj(nodes, links);
  const deg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (const [, w] of adjW[i]) deg[i] += w;
  }
  return deg;
}

// Centralité d'intermédiarité (Brandes, non pondérée pour simplicité)
function betweenness(nodes, links) {
  const { adj, n } = buildAdj(nodes, links);
  const CB = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const S = [];
    const P = Array.from({ length: n }, () => []);
    const sigma = new Array(n).fill(0); sigma[s] = 1;
    const d = new Array(n).fill(-1); d[s] = 0;
    const Q = [s];
    while (Q.length) {
      const v = Q.shift();
      S.push(v);
      for (const w of adj[v]) {
        if (d[w] < 0) { d[w] = d[v] + 1; Q.push(w); }
        if (d[w] === d[v] + 1) {
          sigma[w] += sigma[v];
          P[w].push(v);
        }
      }
    }
    const delta = new Array(n).fill(0);
    while (S.length) {
      const w = S.pop();
      for (const v of P[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      if (w !== s) CB[w] += delta[w];
    }
  }
  // Normalize for undirected
  const norm = (n - 1) * (n - 2);
  if (norm > 0) for (let i = 0; i < n; i++) CB[i] /= norm;
  return CB;
}

// Eigenvector centrality (power iteration sur matrice pondérée)
function eigenvector(nodes, links, iter = 80) {
  const { adjW, n } = buildAdj(nodes, links);
  let x = new Array(n).fill(1 / Math.sqrt(n));
  for (let k = 0; k < iter; k++) {
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (const [j, w] of adjW[i]) y[i] += w * x[j];
    }
    const norm = Math.sqrt(y.reduce((s, v) => s + v * v, 0)) || 1;
    x = y.map(v => v / norm);
  }
  return x;
}

// HHI par nœud (concentration de ses arêtes : ∑(part_i)²)
function hhiPerNode(nodes, links) {
  const { adjW, n } = buildAdj(nodes, links);
  const hhi = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let total = 0;
    for (const [, w] of adjW[i]) total += w;
    if (total === 0) continue;
    for (const [, w] of adjW[i]) {
      const s = w / total;
      hhi[i] += s * s;
    }
  }
  return hhi;
}

// Centralité de proximité (closeness)
function closeness(nodes, links) {
  const { adj, n } = buildAdj(nodes, links);
  const C = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const d = new Array(n).fill(-1); d[s] = 0;
    const Q = [s];
    while (Q.length) {
      const v = Q.shift();
      for (const w of adj[v]) {
        if (d[w] < 0) { d[w] = d[v] + 1; Q.push(w); }
      }
    }
    let sum = 0, reach = 0;
    for (let i = 0; i < n; i++) if (d[i] > 0) { sum += d[i]; reach++; }
    C[s] = reach > 0 ? reach / sum : 0;
  }
  return C;
}

// Renvoie {valueById: {id->val}, sortedIds: [id...], maxVal}
function rankMetric(nodes, links, metric) {
  const fn = {
    degree: degreeWeighted,
    betweenness,
    eigenvector,
    closeness,
    hhi: hhiPerNode
  }[metric];
  const vals = fn(nodes, links);
  const valueById = {};
  nodes.forEach((n, i) => valueById[n.id] = vals[i]);
  const sortedIds = nodes.map(n => n.id).sort((a, b) => valueById[b] - valueById[a]);
  const maxVal = Math.max(...vals);
  return { valueById, sortedIds, maxVal };
}

// ---------- HELPERS SVG ----------

function clearSVG(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function el(tag, attrs = {}, parent = null) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined && v !== null) e.setAttribute(k, v);
  }
  if (parent) parent.appendChild(e);
  return e;
}

// Quadratic bezier between two points, with curvature
function curvePath(x1, y1, x2, y2, curvature = 0.12) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  // Perpendicular offset
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len, py = dx / len;
  const cx = mx + px * len * curvature;
  const cy = my + py * len * curvature;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

// ---------- TOOLTIP ----------

function createTooltip(container) {
  const t = document.createElement("div");
  t.className = "tooltip";
  container.appendChild(t);
  return {
    show(x, y, html) { t.innerHTML = html; t.style.left = x + "px"; t.style.top = y + "px"; t.classList.add("show"); },
    hide() { t.classList.remove("show"); }
  };
}

window.GraphUtils = {
  project, buildAdj, degreeWeighted, betweenness, eigenvector, hhiPerNode,
  closeness, rankMetric, clearSVG, el, curvePath, createTooltip
};

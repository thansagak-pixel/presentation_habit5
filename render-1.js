/* ==========================================================================
   render-1.js — renderers for: title, map, intent, signals, ears, perception
   ========================================================================== */

/* --- 1. TITLE ------------------------------------------------------------ */
RENDERERS.title = function () {
  const m = DECK.meta;
  return `
  <div class="title-slide">
    <div class="title-grid">
      <div>
        <div ${A(60, "title-habit")}>${esc(m.habit)}</div>
        <h1 ${A(140, "title-main")}>${esc(m.title)}</h1>
        <div ${A(320, "title-rule")}></div>
        <p ${A(400, "title-tag")}>${esc(m.tagline)}</p>
        <div ${A(480, "title-meta")}>
          <div>Based on <b>${esc(m.book)}</b> — ${esc(m.author)}</div>
          <div>${esc(m.basedOn)}</div>
        </div>
        <blockquote ${A(560, "title-epi")}>
          “${esc(m.epigraph)}”
          <span>${esc(m.epigraphSrc)}</span>
        </blockquote>
      </div>
      <div ${A(300, "wave-wrap")}>
        <span class="wave-ring"></span>
        <span class="wave-ring"></span>
        <span class="wave-ring"></span>
        <div class="wave-core">${ICON_WAVE}</div>
        <div class="wave-label">seek first to understand</div>
      </div>
    </div>
  </div>`;
};

/* --- 2. HABIT MAP -------------------------------------------------------- */
RENDERERS.map = function () {
  const W = 1144;
  const H = 320;
  const x0 = 62;
  const x1 = W - 62;
  const pts = DECK.habits.map((h, i) => {
    const t = i / (DECK.habits.length - 1);
    return {
      x: x0 + t * (x1 - x0),
      y: 236 - 92 * t - 26 * Math.sin(Math.PI * t),
      h,
    };
  });

  const path = smoothPath(pts);

  const nodes = pts
    .map((p, i) => {
      const hero = p.h.hero;
      const r = hero ? 25 : 15;
      const fill = hero ? "var(--accent)" : "var(--ink-700)";
      const stroke = hero ? "var(--accent-hover)" : "var(--line-strong)";
      const numFill = hero ? "var(--accent-ink)" : "var(--text-dim)";
      const label = hero ? "Habit 5" : p.h.name.length > 26 ? p.h.name.slice(0, 25) + "…" : p.h.name;
      const above = i % 2 === 0;
      const ly = above ? p.y - 34 : p.y + 44;
      const tsize = hero ? 14 : 12.5;
      const tcol = hero ? "var(--text-hi)" : "var(--text-dim)";
      const tweight = hero ? 700 : 500;
      return `
      <g class="map-node">
        ${hero ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="40" fill="none" stroke="rgba(232,100,42,0.4)" stroke-width="1.5" style="animation:glowPulse 3.2s ease-in-out infinite;transform-origin:${p.x.toFixed(1)}px ${p.y.toFixed(1)}px"/>` : ""}
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="${p.x.toFixed(1)}" y="${(p.y + (hero ? 5 : 4)).toFixed(1)}" text-anchor="middle" font-size="${hero ? 15 : 12.5}" font-weight="700" fill="${numFill}">${p.h.n}</text>
        <text x="${p.x.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${tsize}" font-weight="${tweight}" fill="${tcol}">${esc(label)}</text>
      </g>`;
    })
    .join("");

  const legend = DECK.groups
    .map(
      (g, i) => `
      <div ${A(620 + i * 90, "legend-item")}>
        <i style="background:${g.key === "bridge" ? "var(--accent)" : "var(--olive)"}"></i>
        <span><b>${esc(g.label)}</b> · ${esc(g.range)} — ${esc(g.note)}</span>
      </div>`
    )
    .join("");

  return `
  <div class="map-wrap" style="position:relative">
    <div ${A(60, "kicker")}>The map</div>
    <h2 ${A(120, "slide-title wide")}>Habit 5 is the hinge of the whole system</h2>
    <svg class="map-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" ${A(260)}>
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8A9663"/>
          <stop offset="42%" stop-color="#8A9663"/>
          <stop offset="54%" stop-color="#E8642A"/>
          <stop offset="78%" stop-color="#E8642A"/>
          <stop offset="90%" stop-color="#8A9663"/>
          <stop offset="100%" stop-color="#8A9663"/>
        </linearGradient>
        <filter id="pathGlow" x="-20%" y="-60%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="${path}" fill="none" stroke="url(#pathGrad)" stroke-width="3.5" stroke-linecap="round" filter="url(#pathGlow)" style="--len:1600;stroke-dasharray:1600;stroke-dashoffset:1600;animation:drawLine 1.8s var(--ease-out) 400ms both"/>
      ${nodes}
    </svg>
    <div class="map-bottom" ${A(560)}>
      <div class="map-callout">
        <h4>Seek First to Understand, Then to Be Understood</h4>
        <p>The bridge between habits you do alone (1–3) and habits that only work with other people (6–7). Get this one wrong and the wins get smaller on both sides of it.</p>
      </div>
      <div class="map-legend">${legend}</div>
    </div>
  </div>`;
};

/* --- 3. INTENT ----------------------------------------------------------- */
RENDERERS.intent = function () {
  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>The core shift</div>
    <h2 ${A(120, "slide-title wide")}>Most of us listen with the intent to <em class="accent" style="font-style:normal">reply</em></h2>
    <p ${A(200, "lede")}>Not to understand. Our reply is already written while they're still talking — and we filter everything they say through it. Habit 5 is the switch from <b class="hi">reply</b> to <b class="hi">understand</b>.</p>

    <div class="intent-grid">
      <div ${A(320, "card intent-card bad accent-top")}>
        <h3><span class="tag">Intent to reply</span></h3>
        <div class="bubble">Them: <em>“Honestly I'm just tired of trying with this group.”</em></div>
        <div class="bubble">You: <em>“Yeah, groups are annoying — just find better people.”</em></div>
        <p style="margin-top:12px;font-size:14px;color:var(--text-dim)">You replied. You did not hear them.</p>
      </div>
      <div ${A(420, "card intent-card good olive-top")}>
        <h3><span class="tag olive">Intent to understand</span></h3>
        <div class="bubble">Them: <em>“Honestly I'm just tired of trying with this group.”</em></div>
        <div class="bubble">You: <em>“As I get it, you're tired of putting in more than you get back.”</em></div>
        <p style="margin-top:12px;font-size:14px;color:var(--text-dim)">You mirrored it back. Now they keep talking — and you know what to fix.</p>
      </div>
    </div>

    <div class="intent-foot" ${A(540)}>
      <span class="tag">Covey</span>
      <span>“When I can explain your point of view as well as you can, then I focus on communicating my point of view to you.”</span>
    </div>
  </div>`;
};

/* --- 4. SIGNALS 7 / 38 / 55 ---------------------------------------------- */
RENDERERS.signals = function () {
  const rows = [
    { k: "Words", v: 7, c: "rgba(232,100,42,0.35)", note: "What you said. The smallest slice of the message — and the only one you can edit afterwards." },
    { k: "Tone of voice", v: 38, c: "rgba(232,100,42,0.6)", note: "How you said it. Pace, pitch, sigh, sharpness." },
    { k: "Body language", v: 55, c: "rgba(232,100,42,0.85)", note: "Shoulders, face, hands, distance, stillness." },
  ];

  return `
  <div class="signals-wrap">
    <div>
      <div ${A(60, "kicker")}>What people actually receive</div>
      <h2 ${A(120, "slide-title wide")}>Words are the <em class="accent" style="font-style:normal">smallest</em> part of the message</h2>
      <div ${A(280, "signal-bar")}>
        <div class="signal-seg sg-words"><b>7%</b><span>Words</span></div>
        <div class="signal-seg sg-tone"><b>38%</b><span>Tone of voice</span></div>
        <div class="signal-seg sg-body"><b>55%</b><span>Body language</span></div>
      </div>
      <div class="signal-legend">
        ${rows
          .map(
            (r, i) => `
          <div class="signal-row" ${A(420 + i * 110)}>
            <i style="background:${r.c}"></i>
            <div>
              <b>${esc(r.k)} — ${r.v}%</b>
              <span>${esc(r.note)}</span>
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div ${A(760, "signal-note")}>
        Mehrabian's research on communicating feelings, as cited by Covey. The exact figures are debated —
        the teaching point is not: if you only watch the words, you are watching a seventh of the conversation.
      </div>
    </div>

    <div class="meter-stack">
      <div ${A(340, "meter")}>
        <div class="meter-head"><b>Are you listening to the words?</b><span>7%</span></div>
        <div class="meter-track"><div class="meter-fill" style="--w:7%"></div></div>
        <p>Easiest to measure — and the least of it.</p>
      </div>
      <div ${A(460, "meter")}>
        <div class="meter-head"><b>Are you listening to the tone?</b><span>38%</span></div>
        <div class="meter-track"><div class="meter-fill" style="--w:38%"></div></div>
        <p>“Fine” in three different tones is three different sentences.</p>
      </div>
      <div ${A(580, "meter")}>
        <div class="meter-head"><b>Are you reading the body?</b><span>55%</span></div>
        <div class="meter-track"><div class="meter-fill" style="--w:55%"></div></div>
        <p>Most of the honest information arrives before a word is spoken.</p>
      </div>
    </div>
  </div>`;
};

/* --- 5. TWO EARS, ONE MOUTH --------------------------------------------- */
RENDERERS.ears = function () {
  const facts = [
    { n: "1", b: "Listen twice as much as you talk", s: "Two ears, one mouth. If you want to be heard more, the lever is not talking louder — it is listening longer." },
    { n: "2", b: "Listening is not waiting", s: "Waiting for your turn is not listening. Waiting means your reply is already forming." },
    { n: "3", b: "Silence is a tool", s: "Most conversations get interesting three seconds after you would have spoken. Hold that beat." },
  ];

  return `
  <div class="ears-wrap">
    <div>
      <div ${A(60, "kicker")}>The simplest rule in the habit</div>
      <h2 ${A(120, "slide-title wide")}>Two ears, one mouth</h2>
      <div class="ratio" ${A(260)}>
        <div class="ratio-unit ears">
          <div class="glyph">${ICON_EAR}</div>
          <b>Ear × 2</b>
        </div>
        <div class="ratio-eq">:</div>
        <div class="ratio-unit mouth">
          <div class="glyph">${ICON_MOUTH}</div>
          <b>Mouth × 1</b>
        </div>
      </div>
      <p ${A(420, "lede")}>The ratio is the whole philosophy. Understanding is not a warm-up before the real part — it <em class="accent" style="font-style:normal">is</em> the real part. Everything else is you talking.</p>
    </div>

    <div class="ears-facts">
      ${facts
        .map(
          (f, i) => `
        <div class="fact-row" ${A(360 + i * 120)}>
          <div class="n">${f.n}</div>
          <div><b>${esc(f.b)}</b><span>${esc(f.s)}</span></div>
        </div>`
        )
        .join("")}
    </div>
  </div>`;
};

/* --- 6. OTHERS' PERCEPTION ------------------------------------------------ */
RENDERERS.perception = function () {
  return `
  <div class="perception-wrap">
    <div ${A(60, "kicker")}>The law of Others' Perception</div>
    <h2 ${A(120, "slide-title wide")}>The same moment, two completely different movies</h2>

    <div class="perception-stage" ${A(260)} style="--split:50%">
      <div class="perception-layer left">
        <div class="who">The parent's cut</div>
        <h3>“Loud, messy, unfocused.”</h3>
        <p>The shirt is wrong. The music is too loud. The friends are a bad influence. The report card is the last straw.</p>
        <p style="color:var(--text-dim);font-size:14.5px">A child who is spiralling out of control — and needs steering.</p>
      </div>
      <div class="perception-layer right">
        <div class="who">The teenager's cut</div>
        <h3>“Best night of the whole term.”</h3>
        <p>Three people who get it. Loud music is the point. The maths test is in the fridge, not the conversation.</p>
        <p style="color:var(--text-dim);font-size:14.5px">A good night with good people — and nobody asking how it was going.</p>
      </div>
      <div class="perception-split"></div>
    </div>

    <div class="perception-slider" ${A(420)}>
      <span class="lbl">Parent's view</span>
      <input type="range" min="12" max="88" value="50" data-act="split" aria-label="Blend between the two points of view">
      <span class="lbl">Teen's view</span>
    </div>

    <div class="perception-foot" ${A(520)}>
      <b>What you perceive is what you are</b> — and you cannot change how someone sees the world by trying to change them. Not your parents, not your group chat, not the person you argued with.
    </div>
  </div>`;
};

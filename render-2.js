/* ==========================================================================
   render-2.js — renderers for: styles, loop, mirror, auto, trap, understood
   ========================================================================== */

/* --- 7. FIVE POOR LISTENING STYLES --------------------------------------- */
RENDERERS.styles = function () {
  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Diagnose yourself</div>
    <h2 ${A(120, "slide-title wide")}>Five ways we fake listening</h2>
    <p ${A(200, "lede")}>Most of us are fluent in all five — and every one of them has a fix. Notice which one you are guilty of.</p>

    <div class="styles-grid">
      ${DECK.styles
        .map(
          (s, i) => `
        <div class="style-card" ${A(320 + i * 90)}>
          <div class="idx">${String(i + 1).padStart(2, "0")}</div>
          <h3>${esc(s.name)}</h3>
          <p class="sound">${esc(s.sound)}</p>
          <p class="tell">${esc(s.tell)}</p>
          <div class="fix">
            <span class="fix-label">The fix</span>
            ${esc(s.fix)}
          </div>
        </div>`
        )
        .join("")}
    </div>
  </div>`;
};

/* --- 8. PRACTICE LOOP ---------------------------------------------------- */
RENDERERS.loop = function () {
  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>The muscle</div>
    <h2 ${A(120, "slide-title wide")}>A five-step practice loop</h2>

    <div class="loop-grid">
      ${DECK.loop
        .map(
          (s, i) => `
        <div class="loop-step" ${A(300 + i * 100)}>
          <div class="n">${esc(s.step)}</div>
          <h3>${esc(s.name)}</h3>
          <p class="do">${esc(s.do)}</p>
          <p class="trap">${esc(s.trap)}</p>
        </div>`
        )
        .join("")}
    </div>

    <div class="loop-note" ${A(860)}>
      <span class="tag">Note</span>
      <span>This routine is a teaching aid built from Covey's principles — it is not a term from the book. The hard one is <b class="hi">Hold</b>: silence will feel like a failure, and it is the moment they keep talking.</span>
    </div>
  </div>`;
};

/* --- 9. MIRRORING -------------------------------------------------------- */
RENDERERS.mirror = function () {
  const chips = DECK.mirrors
    .map(
      (m, i) => `
      <button class="mirror-chip${i === 0 ? " active" : ""}" data-act="mirror" data-i="${i}">${esc(m.open)}</button>`
    )
    .join("");

  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>The single best tool</div>
    <h2 ${A(120, "slide-title wide")}>Mirroring: prove you understood, in their words</h2>

    <div class="mirror-layout">
      <div class="mirror-chips" ${A(280)}>${chips}</div>
      <div class="mirror-stage">
        <div ${A(360, "mirror-bubble")} id="mirror-bubble">${esc(DECK.mirrors[0].full)}</div>
        <div class="mirror-note" ${A(460)}>
          <span class="tag olive">Why it works</span>
          <span id="mirror-note">${esc(DECK.mirrors[0].note)}</span>
        </div>
        <div class="mirror-caveat" ${A(560)}>
          <b>Mirroring is not agreeing.</b> It is proof of attention. “As I get it, you feel like nobody is listening” can be followed by “...and I disagree, but I'm listening.” Do both, in that order.
        </div>
      </div>
    </div>
  </div>`;
};

/* --- 10. AUTOBIOGRAPHICAL vs EMPATHIC ------------------------------------ */
RENDERERS.auto = function () {
  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Two kinds of listening</div>
    <h2 ${A(120, "slide-title wide")}>Your autobiography is in the way</h2>

    <div class="auto-grid">
      <div class="auto-col" ${A(260)}>
        <header>
          <h3>Autobiographical listening</h3>
          <span class="tag">intent to reply</span>
        </header>
        <div class="auto-list">
          ${DECK.auto
            .map(
              (a) => `
            <div class="auto-item">
              <div class="dot"></div>
              <div><b>${esc(a.name)}</b><span>${esc(a.example)}</span></div>
            </div>`
            )
            .join("")}
        </div>
        <div class="strawberry">
          <b>One argument, two frames.</b> A husband and wife fight about a strawberry.
          <div class="duo">
            <div><i>Her frame</i>“It's a plant. The seeds are in it.”</div>
            <div><i>His frame</i>“It's a fruit. You eat it.”</div>
          </div>
          Both are true. The argument was never about fruit — it was about whose frame wins.
        </div>
      </div>

      <div class="auto-col empathic" ${A(340)}>
        <header>
          <h3>Empathic listening</h3>
          <span class="tag olive">intent to understand</span>
        </header>
        <div class="auto-list">
          ${DECK.empathic
            .map(
              (a) => `
            <div class="auto-item">
              <div class="dot"></div>
              <div><b>${esc(a.name)}</b><span>${esc(a.example)}</span></div>
            </div>`
            )
            .join("")}
        </div>
        <div class="strawberry">
          <b>Empathic is risky.</b> Covey warns that it is dangerous — because understanding someone completely means their pain becomes real to you, and now it can hurt you. Take the risk on purpose.
        </div>
      </div>
    </div>
  </div>`;
};

/* --- 11. TRAPS ----------------------------------------------------------- */
RENDERERS.trap = function () {
  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Three traps</div>
    <h2 ${A(120, "slide-title wide")}>Where this habit gets abused</h2>

    <div class="trap-grid">
      ${DECK.traps
        .map(
          (t, i) => `
        <div class="trap-card" ${A(300 + i * 120)}>
          <div class="warn">${ICON_WARN} Trap ${i + 1}</div>
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.body)}</p>
        </div>`
        )
        .join("")}
    </div>

    <div class="trap-foot" ${A(720)}>
      “I understand exactly why you did it — and I'm still not doing it again.”
    </div>
  </div>`;
};

/* --- 12. SEEK TO BE UNDERSTOOD ------------------------------------------ */
RENDERERS.understood = function () {
  const labels = ["Ask", "Listen", "Adjust"];
  const arcs = [];
  const labelMarkup = [];

  for (let i = 0; i < 3; i++) {
    const a1 = i * 120 - 18;
    const a2 = (i + 1) * 120 - 18;
    const stroke = i === 1 ? "#8A9663" : "#E8642A";
    arcs.push(
      `<path d="${arcPath(160, 160, 104, a1, a2)}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>`
    );
    const [ax, ay] = polar(160, 160, 104, a2 - 4);
    arcs.push(`<path d="M ${ax.toFixed(1)} ${ay.toFixed(1)} l 9 -5 l -1 11 Z" fill="${stroke}" opacity="0.95"/>`);

    /* Labels live OUTSIDE the spinning group so they stay readable, and
       sit inside the arc they describe. */
    const [tx, ty] = polar(160, 160, 132, i * 120 + 60);
    labelMarkup.push(
      `<text x="${tx.toFixed(1)}" y="${(ty + 5).toFixed(1)}" text-anchor="middle" font-size="15" font-weight="700" fill="#F2F4F1" letter-spacing="1.4">${labels[i].toUpperCase()}</text>`
    );
  }

  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>The second half of the habit</div>
    <h2 ${A(120, "slide-title wide")}>Then — and only then — seek to be understood</h2>

    <div class="understood-layout">
      <div class="understood-steps">
        ${DECK.understood
          .map(
            (u, i) => `
          <div class="ustep" ${A(280 + i * 130)}>
            <div class="n">${esc(u.step)}</div>
            <div><h3>${esc(u.name)}</h3><p>${esc(u.body)}</p></div>
          </div>`
          )
          .join("")}
        <div ${A(700, "mirror-caveat")} style="border-left-color:var(--accent)">
          <b>Being clear is not the same as being heard.</b> Say it once, then ask which version landed. The third version is the one they actually receive.
        </div>
      </div>

      <div class="loop-diagram" ${A(420)}>
        <svg viewBox="0 0 320 320" role="img" aria-label="Ask, Listen, Adjust loop">
          <g style="--len:700">${arcs.join("")}</g>
          <g>${labelMarkup.join("")}</g>
          <circle cx="160" cy="160" r="52" fill="rgba(11,13,12,0.72)" stroke="var(--line)"/>
          <text x="160" y="152" text-anchor="middle" font-size="13" fill="#9AA29A" letter-spacing="1.6">UNDERSTAND</text>
          <text x="160" y="174" text-anchor="middle" font-size="13" fill="#9AA29A" letter-spacing="1.6">THEN</text>
          <text x="160" y="196" text-anchor="middle" font-size="13" fill="#9AA29A" letter-spacing="1.6">BE UNDERSTOOD</text>
        </svg>
      </div>
    </div>
  </div>`;
};

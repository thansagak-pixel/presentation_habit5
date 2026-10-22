/* ==========================================================================
   render-3.js — renderers for: lab, timer, plan, recap, credits
   ========================================================================== */

/* --- 13. THE LISTENING LAB ---------------------------------------------- */
RENDERERS.lab = function () {
  const opts = DECK.lab[0]
    .options.map(
      (o, i) => `
      <button class="lab-opt" data-act="quiz" data-q="0" data-o="${i}">${esc(o.text)}</button>`
    )
    .join("");

  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Practice</div>
    <h2 ${A(120, "slide-title wide")}>The Listening Lab</h2>

    <div class="lab-wrap">
      <div>
        <div class="lab-scene" ${A(240)} id="lab-scene">${esc(DECK.lab[0].scene)}</div>
        <div class="lab-opts" ${A(320)} id="lab-opts">${opts}</div>
        <div class="lab-fb" ${A(380)} id="lab-fb">Pick the response you would actually use. Feedback appears instantly.</div>
      </div>

      <div class="lab-side">
        <div class="score-card" ${A(420)}>
          <div class="score-big"><b id="lab-score">0</b><span>/ ${DECK.lab.length} correct</span></div>
          <div class="streak" id="lab-streak">${DECK.lab.map(() => "<i></i>").join("")}</div>
          <div class="lab-progress" id="lab-progress">Question 1 of ${DECK.lab.length}</div>
        </div>
        <div class="lab-verdict" ${A(480)} id="lab-verdict">
          <b>How this works.</b> Every option is something real people say. One of them keeps the conversation alive; the others end it politely.
        </div>
        <div class="lab-nav">
          <button class="btn" data-act="quiz-reset">Reset</button>
          <button class="btn primary" data-act="quiz-next" id="lab-next" disabled>Next question</button>
        </div>
      </div>
    </div>
  </div>`;
};

/* --- 14. THE SILENCE CHALLENGE ------------------------------------------- */
RENDERERS.timer = function () {
  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Do it now</div>
    <h2 ${A(120, "slide-title wide")}>The silence challenge</h2>

    <div class="timer-wrap">
      <div>
        <div class="timer-dial" ${A(260)}>
          <svg viewBox="0 0 320 320">
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8A9663"/>
                <stop offset="100%" stop-color="#E8642A"/>
              </linearGradient>
            </defs>
            <circle class="timer-ring-bg" cx="160" cy="160" r="140"/>
            <circle class="timer-ring-fg" id="timer-ring" cx="160" cy="160" r="140"/>
          </svg>
          <div class="timer-time">
            <div>
              <b id="timer-digits">01:00</b>
              <span id="timer-state">ready</span>
            </div>
          </div>
        </div>
        <div class="timer-controls" ${A(340)}>
          <button class="btn primary" data-act="timer" data-mode="start" id="timer-start">Start</button>
          <button class="btn" data-act="timer" data-mode="reset">Reset</button>
          <button class="btn" data-act="timer" data-mode="60">60 sec</button>
          <button class="btn" data-act="timer" data-mode="180">3 min</button>
          <button class="btn" data-act="timer" data-mode="300">5 min</button>
        </div>
      </div>

      <div class="timer-side">
        <div class="timer-prompt" ${A(420)}>
          <b>Do this with the room.</b> Start the timer. For the whole minute: <b>no talking.</b>
          <ol>
            <li>Put phones face down.</li>
            <li>Listen to one conversation without joining it.</li>
            <li>Notice the tone, the pace, and who is doing the talking.</li>
            <li>At the end, share one thing you noticed that you would normally have interrupted.</li>
          </ol>
        </div>
        <div class="timer-tip" ${A(520)}>
          Most people can sit in genuine silence for about ten seconds before they start filling it. That discomfort is exactly the habit you're training.
        </div>
      </div>
    </div>
  </div>`;
};

/* --- 15. YOUR COMMITMENT ------------------------------------------------- */
RENDERERS.plan = function () {
  const fields = DECK.planPrompts
    .map(
      (p) => `
      <div class="field">
        <label for="plan-${esc(p.key)}">${esc(p.label)}</label>
        <input id="plan-${esc(p.key)}" type="text" data-plan="${esc(p.key)}" placeholder="${esc(p.placeholder)}" autocomplete="off">
      </div>`
    )
    .join("");

  const cardRows = DECK.planPrompts
    .map(
      (p) => `
      <div>
        <dt>${esc(p.label)}</dt>
        <dd class="empty" data-plan-view="${esc(p.key)}">—</dd>
      </div>`
    )
    .join("");

  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Your move</div>
    <h2 ${A(120, "slide-title wide")}>One conversation. One phrase. One habit.</h2>

    <div class="plan-grid">
      <div class="plan-fields" ${A(280)}>
        ${fields}
        <div class="plan-actions">
          <button class="btn primary" data-act="plan-save">Save my plan</button>
          <button class="btn ghost" data-act="plan-clear">Clear</button>
          <button class="btn ghost" data-act="print">Print this card</button>
        </div>
        <div class="plan-status" id="plan-status"></div>
      </div>

      <div class="plan-card" ${A(400)}>
        <span class="tag">Habit 5 commitment</span>
        <h3>Seek first to understand, then to be understood.</h3>
        <dl>${cardRows}</dl>
        <footer>Saved in this browser. Hand it to a friend who will ask you about it.</footer>
      </div>
    </div>
  </div>`;
};

/* --- 16. RECAP ----------------------------------------------------------- */
RENDERERS.recap = function () {
  const r = DECK.recap;
  return `
  <div class="recap-wrap">
    <div ${A(60, "kicker")}>Take it with you</div>
    <div ${A(140, "recap-head")}>${esc(r.headline)}</div>

    <div class="recap-points">
      ${r.points
        .map(
          (p, i) => `
        <div class="recap-point" ${A(320 + i * 110)}>
          <b>${esc(p.k)}</b>
          <span>${esc(p.v)}</span>
        </div>`
        )
        .join("")}
    </div>

    <div ${A(700, "recap-quote")}>
      “${esc(r.quote)}”
      <span>${esc(r.quoteSrc)}</span>
    </div>
  </div>`;
};

/* --- 17. CREDITS --------------------------------------------------------- */
RENDERERS.credits = function () {
  const c = DECK.credits;
  const shortcuts = [
    ["→ / Space", "Next slide"],
    ["←", "Previous slide"],
    ["O", "Overview of all slides"],
    ["S", "Speaker notes"],
    ["F", "Fullscreen"],
    ["?", "This help"],
    ["Home / End", "First / last slide"],
    ["Esc", "Close overlay"],
  ];

  return `
  <div class="slide-body">
    <div ${A(60, "kicker")}>Sources & how to drive this</div>
    <h2 ${A(120, "slide-title wide")}>Where this came from</h2>

    <div class="credits-grid">
      <div>
        <div class="credits-head" ${A(240)}>Books & research</div>
        <ul class="credits-list">
          ${c.books
            .map(
              (b, i) => `<li ${A(300 + i * 80)}>${esc(b)}</li>`
            )
            .join("")}
        </ul>
        <div class="credits-head" ${A(560)} style="margin-top:22px">House rules</div>
        ${c.notes
          .map((n, i) => `<div class="credits-note" ${A(600 + i * 80)}>${esc(n)}</div>`)
          .join("")}
      </div>

      <div>
        <div class="credits-head" ${A(240)}>Keyboard</div>
        <div class="shortcut-grid">
          ${shortcuts
            .map(
              (s, i) => `
            <div class="shortcut" ${A(300 + i * 50)}><span>${esc(s[0])}</span><kbd>${esc(s[1])}</kbd></div>`
            )
            .join("")}
        </div>
        <div class="credits-head" ${A(740)} style="margin-top:22px">Printing</div>
        <div class="credits-note" ${A(780)}>
          Ctrl/Cmd + P prints every slide, one per landscape page. Turn on “background graphics” in the print
          dialog to keep the dark theme.
        </div>
      </div>
    </div>
  </div>`;
};

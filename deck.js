/* ==========================================================================
   deck.js — the engine.

   Owns: rendering, navigation, keyboard control, the overview grid, the
   speaker-notes panel, and the three interactive widgets (Listening Lab,
   silence timer, commitment card).

   Everything is delegated from a single click handler so that cloned
   thumbnails in the overview never carry their own listeners.
   ========================================================================== */

const state = {
  index: 0,
  hintDimmed: false,
  overviewOpen: false,
  notesOpen: false,
  quiz: { q: 0, answers: {}, score: 0, streak: 0 },
  timer: { total: 60, left: 60, running: false, handle: null },
  plan: {},
};

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

/* --------------------------------------------------------------------------
   BUILD
   -------------------------------------------------------------------------- */

function buildDeck() {
  const slides = $("#slides");
  slides.innerHTML = SLIDES.map(
    (s, i) => `<section class="slide" data-index="${i}" data-id="${s.id}" aria-label="${esc(s.label)}">${RENDERERS[s.kind]()}</section>`
  ).join("");

  $("#rail-ticks").innerHTML = SLIDES.map(() => "<i></i>").join("");

  restorePlan();
  goto(0, true);
}

function goto(i, instant) {
  const slides = $$(".slide");
  if (!slides.length) return;
  const n = Math.max(0, Math.min(SLIDES.length - 1, i));
  const prev = state.index;

  if (n === prev && !instant) return;

  slides.forEach((el) => el.classList.remove("active", "leaving"));
  const target = slides[n];
  if (prev !== n && !instant) {
    const old = slides[prev];
    if (old) {
      old.classList.add("leaving");
      setTimeout(() => old.classList.remove("leaving"), 460);
    }
  }
  target.classList.add("active");
  state.index = n;

  const pct = ((n + 1) / SLIDES.length) * 100;
  $("#progress-fill").style.width = pct + "%";
  $("#counter-current").textContent = String(n + 1).padStart(2, "0");
  $("#counter-total").textContent = String(SLIDES.length).padStart(2, "0");

  updateNotes();
  if (state.index > 0) dimHint();

  if (SLIDES[n].id === "lab") renderQuiz();
  if (SLIDES[n].id === "timer") syncTimerUi();
  if (SLIDES[n].id === "plan") renderPlanCard();
}

const next = () => goto(state.index + 1);
const prev = () => goto(state.index - 1);

function dimHint() {
  if (state.hintDimmed) return;
  state.hintDimmed = true;
  const hint = $("#nav-hint");
  if (hint) hint.classList.add("dim");
}

/* --------------------------------------------------------------------------
   SCALE — fit the fixed 1280x720 stage into the viewport
   -------------------------------------------------------------------------- */

function fit() {
  const narrow = window.innerWidth < 760;
  const pad = narrow ? 0.98 : 0.96;
  /* Leave room for the speaker-notes panel when it is open. */
  const notes = state.notesOpen ? Math.min(400, window.innerWidth * 0.42) : 0;
  const availW = window.innerWidth - notes;
  const scale = Math.min(availW / 1280, window.innerHeight / 720) * pad;
  document.documentElement.style.setProperty("--scale", scale.toFixed(4));

  const frame = $("#stage-frame");
  if (frame) {
    frame.style.width = 1280 * scale + "px";
    frame.style.height = 720 * scale + "px";
  }
  document.body.classList.toggle("portrait", window.innerHeight > window.innerWidth * 1.15);
}

/* --------------------------------------------------------------------------
   OVERVIEW
   -------------------------------------------------------------------------- */

function openOverview() {
  const grid = $("#ov-grid");
  grid.innerHTML = "";

  $$(".slide").forEach((slide, i) => {
    /* A <div> rather than a <button>: buttons clip and collapse their
       block children in Chrome, which squashes the thumbnail. */
    const cell = document.createElement("div");
    cell.className = "ov-cell" + (i === state.index ? " current" : "");
    cell.setAttribute("data-act", "goto");
    cell.setAttribute("data-index", i);
    cell.setAttribute("role", "button");
    cell.setAttribute("tabindex", "0");

    const thumb = document.createElement("div");
    thumb.className = "ov-thumb";

    const clone = slide.cloneNode(true);
    clone.classList.remove("active", "leaving");
    clone.removeAttribute("id");
    thumb.appendChild(clone);

    const meta = document.createElement("div");
    meta.className = "ov-meta";
    meta.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b><span>${esc(SLIDES[i].label)}</span>`;

    cell.appendChild(thumb);
    cell.appendChild(meta);
    grid.appendChild(cell);
  });

  $("#overview").classList.add("open");
  state.overviewOpen = true;
  scaleThumbs();
}

function scaleThumbs() {
  /* Thumbnail size is fixed in CSS (260x146), so there is nothing to
     measure — kept as a hook for future tweaks. */
}

function closeOverview() {
  $("#overview").classList.remove("open");
  state.overviewOpen = false;
}

/* --------------------------------------------------------------------------
   SPEAKER NOTES
   -------------------------------------------------------------------------- */

function updateNotes() {
  const id = SLIDES[state.index].id;
  $("#notes-title").textContent = SLIDES[state.index].label;
  $("#notes-body").textContent = NOTES[id] || "No notes for this slide.";
}

function toggleNotes() {
  state.notesOpen = !state.notesOpen;
  $("#notes-panel").classList.toggle("open", state.notesOpen);
  document.body.classList.toggle("notes-open", state.notesOpen);
  fit();
}

/* --------------------------------------------------------------------------
   LISTENING LAB
   -------------------------------------------------------------------------- */

function renderQuiz() {
  const q = state.quiz.q;
  const item = DECK.lab[q];
  const answered = state.quiz.answers[q];

  $("#lab-scene").textContent = item.scene;
  $("#lab-opts").innerHTML = item.options
    .map(
      (o, i) => `
      <button class="lab-opt${answered ? (i === answered.choice ? (o.ok ? " correct" : " wrong") : " dim") : ""}"
        data-act="quiz" data-q="${q}" data-o="${i}" ${answered ? "disabled" : ""}>${esc(o.text)}</button>`
    )
    .join("");

  const fb = $("#lab-fb");
  if (answered) {
    const chosen = item.options[answered.choice];
    fb.className = "lab-fb " + (chosen.ok ? "good" : "bad");
    fb.innerHTML = `<b>${chosen.ok ? "Good call." : "Not this time."}</b> ${esc(chosen.fb)}`;
  } else {
    fb.className = "lab-fb";
    fb.textContent = "Pick the response you would actually use. Feedback appears instantly.";
  }

  $("#lab-score").textContent = String(state.quiz.score);
  $("#lab-streak").innerHTML = DECK.lab
    .map((_, i) => {
      const a = state.quiz.answers[i];
      if (!a) return "<i></i>";
      return a.ok ? '<i class="on"></i>' : '<i class="off"></i>';
    })
    .join("");
  $("#lab-progress").textContent = `Question ${q + 1} of ${DECK.lab.length}`;

  const nextBtn = $("#lab-next");
  nextBtn.disabled = !answered;
  nextBtn.textContent = q === DECK.lab.length - 1 ? "See results" : "Next question";

  if (Object.keys(state.quiz.answers).length === DECK.lab.length) {
    const s = state.quiz.score;
    const msg =
      s === DECK.lab.length
        ? "<b>Perfect run.</b> You chose understanding every single time. That instinct is rare — protect it."
        : s >= 4
          ? "<b>Strong.</b> You caught the pattern most of the time. Look again at the one you missed and ask why it sounded like the right answer."
          : "<b>Good first pass.</b> The wrong options were not evil — they were just faster. Go back through the feedback and try them again.";
    $("#lab-verdict").innerHTML = msg;
  }
}

function answerQuiz(q, o) {
  if (state.quiz.answers[q]) return;
  const item = DECK.lab[q];
  const ok = item.options[o].ok;
  state.quiz.answers[q] = { choice: o, ok };
  state.quiz.score += ok ? 1 : 0;
  renderQuiz();
}

function nextQuiz() {
  const total = DECK.lab.length;
  if (Object.keys(state.quiz.answers).length === total) {
    state.quiz = { q: 0, answers: {}, score: 0, streak: 0 };
    renderQuiz();
    return;
  }
  state.quiz.q = (state.quiz.q + 1) % total;
  renderQuiz();
}

/* --------------------------------------------------------------------------
   SILENCE TIMER
   -------------------------------------------------------------------------- */

const RING = 2 * Math.PI * 140;

function setTimer(seconds) {
  state.timer.total = seconds;
  state.timer.left = seconds;
  stopTimer();
  syncTimerUi();
}

function stopTimer() {
  if (state.timer.handle) {
    clearInterval(state.timer.handle);
    state.timer.handle = null;
  }
  state.timer.running = false;
}

function toggleTimer() {
  if (state.timer.running) {
    stopTimer();
  } else {
    if (state.timer.left <= 0) state.timer.left = state.timer.total;
    state.timer.running = true;
    state.timer.handle = setInterval(() => {
      state.timer.left -= 1;
      if (state.timer.left <= 0) {
        state.timer.left = 0;
        stopTimer();
      }
      syncTimerUi();
    }, 1000);
  }
  syncTimerUi();
}

function syncTimerUi() {
  const t = state.timer;
  const m = Math.floor(t.left / 60);
  const s = t.left % 60;
  const digits = $("#timer-digits");
  const label = $("#timer-state");
  const ring = $("#timer-ring");
  if (!digits) return;

  digits.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  if (t.running) label.textContent = "silence";
  else if (t.left === 0) label.textContent = "done — what did you notice?";
  else if (t.left === t.total) label.textContent = "ready";
  else label.textContent = "paused";

  ring.setAttribute("stroke-dasharray", RING);
  ring.setAttribute("stroke-dashoffset", RING * (1 - t.left / t.total));

  $("#timer-start").textContent = t.running ? "Pause" : t.left === t.total ? "Start" : "Resume";
}

/* --------------------------------------------------------------------------
   COMMITMENT CARD
   -------------------------------------------------------------------------- */

const PLAN_KEY = "habit5-deck-plan";

function restorePlan() {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) state.plan = JSON.parse(raw) || {};
  } catch (e) {
    state.plan = {};
  }
}

function savePlan() {
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify(state.plan));
    $("#plan-status").textContent = "Saved. It will be here next time you open this deck.";
  } catch (e) {
    $("#plan-status").textContent = "Could not save in this browser — the card still shows below.";
  }
  renderPlanCard();
}

function renderPlanCard() {
  DECK.planPrompts.forEach((p) => {
    const el = $(`[data-plan-view="${p.key}"]`);
    if (!el) return;
    const val = (state.plan[p.key] || "").trim();
    el.textContent = val || "—";
    el.classList.toggle("empty", !val);
  });

  DECK.planPrompts.forEach((p) => {
    const input = $(`[data-plan="${p.key}"]`);
    if (input && input.value !== (state.plan[p.key] || "")) input.value = state.plan[p.key] || "";
  });
}

function clearPlan() {
  state.plan = {};
  try {
    localStorage.removeItem(PLAN_KEY);
  } catch (e) {
    /* ignore */
  }
  renderPlanCard();
  $("#plan-status").textContent = "Cleared.";
}

/* --------------------------------------------------------------------------
   EVENTS
   -------------------------------------------------------------------------- */

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.getAttribute("data-act");

  switch (act) {
    case "next":
      next();
      break;
    case "prev":
      prev();
      break;
    case "goto":
      closeOverview();
      goto(Number(el.getAttribute("data-index")));
      break;
    case "overview":
      state.overviewOpen ? closeOverview() : openOverview();
      break;
    case "notes":
      toggleNotes();
      break;
    case "help":
      $("#help").classList.toggle("open");
      break;
    case "fullscreen":
      toggleFullscreen();
      break;
    case "close-overlay":
      closeOverview();
      $("#help").classList.remove("open");
      break;
    case "split": {
      const stage = $(".perception-stage");
      if (stage) stage.style.setProperty("--split", el.value + "%");
      break;
    }
    case "mirror": {
      const i = Number(el.getAttribute("data-i"));
      const m = DECK.mirrors[i];
      $$(".mirror-chip").forEach((c, ci) => c.classList.toggle("active", ci === i));
      const bubble = $("#mirror-bubble");
      bubble.innerHTML = `<span class="swap">${esc(m.full)}</span>`;
      $("#mirror-note").textContent = m.note;
      break;
    }
    case "quiz":
      answerQuiz(Number(el.getAttribute("data-q")), Number(el.getAttribute("data-o")));
      break;
    case "quiz-next":
      nextQuiz();
      break;
    case "quiz-reset":
      state.quiz = { q: 0, answers: {}, score: 0, streak: 0 };
      renderQuiz();
      break;
    case "timer": {
      const mode = el.getAttribute("data-mode");
      if (mode === "start") toggleTimer();
      else if (mode === "reset") setTimer(state.timer.total);
      else setTimer(Number(mode));
      break;
    }
    case "plan-save":
      savePlan();
      break;
    case "plan-clear":
      clearPlan();
      break;
    case "print":
      window.print();
      break;
    default:
      break;
  }
});

document.addEventListener("input", (e) => {
  const el = e.target.closest("[data-plan]");
  if (el) {
    state.plan[el.getAttribute("data-plan")] = el.value;
    renderPlanCard();
  }
});

document.addEventListener("keydown", (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);

  if (e.key === "Escape") {
    closeOverview();
    $("#help").classList.remove("open");
    if (state.notesOpen) toggleNotes();
    return;
  }

  if (typing) return;

  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
    case "PageDown":
    case " ":
      e.preventDefault();
      next();
      break;
    case "ArrowLeft":
    case "ArrowUp":
    case "PageUp":
      e.preventDefault();
      prev();
      break;
    case "Home":
      e.preventDefault();
      goto(0);
      break;
    case "End":
      e.preventDefault();
      goto(SLIDES.length - 1);
      break;
    case "o":
    case "O":
      state.overviewOpen ? closeOverview() : openOverview();
      break;
    case "s":
    case "S":
      toggleNotes();
      break;
    case "f":
    case "F":
      toggleFullscreen();
      break;
    case "?":
      $("#help").classList.toggle("open");
      break;
    default:
      break;
  }
});

/* click on the stage background advances */
$("#stage").addEventListener("click", (e) => {
  if (e.target.closest("button, input, a, [data-act]")) return;
  if (e.clientX < window.innerWidth * 0.28) prev();
  else next();
});

/* touch: swipe left / right */
let touchX = null;
$("#stage").addEventListener(
  "touchstart",
  (e) => {
    touchX = e.changedTouches[0].clientX;
  },
  { passive: true }
);
$("#stage").addEventListener(
  "touchend",
  (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    touchX = null;
  },
  { passive: true }
);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

window.addEventListener("resize", () => {
  fit();
  if (state.overviewOpen) scaleThumbs();
});

/* --------------------------------------------------------------------------
   GO
   -------------------------------------------------------------------------- */

fit();
buildDeck();
syncTimerUi();

// MathMaster engine. Backend: shared "Kids Games" Supabase, schemas `arcade`
// (accounts, feedback) and `math` (progress), via SECURITY DEFINER RPCs only.
// The anon key is public by design; tables are locked behind the RPCs.
//
// Mastery loop (server is the authority — see supabase/001_math.sql):
//   lesson → practice (10 q, ≥80% → ⭐ learned) → next-day review (5 q,
//   ≥80% → 🏆 mastered) → all topics mastered → grade quiz (2 q/topic,
//   ≥85% overall and no topic at zero → level up).

const SUPA_URL = "https://jdmjfwuugddkyzsazwzg.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbWpmd3V1Z2Rka3l6c2F6d3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODA4NTYsImV4cCI6MjA5MjM1Njg1Nn0.G1HPQabERHzyQdvX66_r8Rj71MsflfQavUE76UrBJS4";

async function rpc(schema, fn, args) {
  const res = await fetch(`${SUPA_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SUPA_ANON,
      Authorization: `Bearer ${SUPA_ANON}`,
      "Content-Type": "application/json",
      "Content-Profile": schema,
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Server error (${res.status})`);
  return res.json();
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const PLAYER_KEY = "mathmaster_player";
let player = null;          // { id, name, pin, admin }
let profile = null;         // { grade, completed_grades } or null until set up
let topicState = new Map(); // topic_id -> { state, best_score, review_ready, ... }
let session = null;         // current question-set state
let lessonCtx = null;       // { topic, slide }

const $ = (id) => document.getElementById(id);
function show(screenId) {
  document.querySelectorAll(".screen").forEach((s) => (s.hidden = true));
  $(screenId).hidden = false;
  window.scrollTo(0, 0);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function stripHtml(s) { const d = document.createElement("div"); d.innerHTML = s; return d.textContent.trim(); }

// ---------------------------------------------------------------------------
// Speech (same approach as SpellMaster: best available en voice)
// ---------------------------------------------------------------------------
const canSpeak = "speechSynthesis" in window;
let cachedVoice = null;
function voiceRank(v) {
  const n = v.name.toLowerCase();
  if (/natural|neural/.test(n)) return 0;
  if (/premium|enhanced/.test(n)) return 1;
  if (/\b(ava|zoe|allison|samantha|nicky|joelle)\b/.test(n)) return 2;
  if (/google us english/.test(n)) return 3;
  if (v.lang === "en-US") return 4;
  return 5;
}
function pickVoice() {
  const en = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  en.sort((a, b) => voiceRank(a) - voiceRank(b));
  return en[0] || null;
}
if (canSpeak) {
  cachedVoice = pickVoice();
  speechSynthesis.onvoiceschanged = () => { cachedVoice = pickVoice(); };
}
function say(text, rate = 0.95) {
  if (!canSpeak || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = rate;
  if (cachedVoice) u.voice = cachedVoice;
  speechSynthesis.speak(u);
}

// ---------------------------------------------------------------------------
// Answer equivalence: "6/8" matches "3/4", ".5" matches "0.5", "$7" matches
// "7". We canonicalize the kid's input to the expected string when the values
// match, so the server's per-item string check still does the scoring.
// ---------------------------------------------------------------------------
function parseRational(s) {
  s = normalizeAnswer(s).replace(/[¢°]/g, "");
  let m = s.match(/^(-?)(\d*)\.(\d+)$/);
  if (m) { const dec = m[3]; return { n: parseInt(m[1] + (m[2] || "0") + dec, 10), d: 10 ** dec.length }; }
  m = s.match(/^(-?\d+)$/);
  if (m) return { n: parseInt(m[1], 10), d: 1 };
  m = s.match(/^(-?\d+)\/(\d+)$/);
  if (m && +m[2] !== 0) return { n: parseInt(m[1], 10), d: parseInt(m[2], 10) };
  return null;
}
// Mixed numbers like "2 1/3" lose their space in normalizeAnswer, so parse raw
function parseMixed(raw) {
  const m = String(raw).trim().match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (m && +m[3] !== 0) {
    const w = parseInt(m[1], 10), n = parseInt(m[2], 10), d = parseInt(m[3], 10);
    return { n: (Math.abs(w) * d + n) * (w < 0 ? -1 : 1), d };
  }
  return parseRational(raw);
}
function sameValue(givenRaw, answer) {
  const a = parseMixed(givenRaw), b = parseMixed(answer);
  if (a && b) return a.n * b.d === b.n * a.d;
  return normalizeAnswer(givenRaw) === normalizeAnswer(answer);
}

// ---------------------------------------------------------------------------
// Auth — one form; unknown names need an explicit "create" confirmation.
// ---------------------------------------------------------------------------
let pendingCreate = false;
function resetAuthMode() {
  pendingCreate = false;
  $("auth-submit").textContent = "Let's Go";
  $("auth-notice").hidden = true;
  $("auth-error").hidden = true;
}
["auth-name", "auth-pin"].forEach((id) => $(id).addEventListener("input", resetAuthMode));

$("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("auth-name").value.trim();
  const pin = $("auth-pin").value.trim();
  const errEl = $("auth-error");
  errEl.hidden = true;
  $("auth-submit").disabled = true;
  try {
    const r = await rpc("arcade", "enter", { p_name: name, p_pin: pin, p_create: pendingCreate });
    if (r.ok) {
      player = { id: r.player_id, name: r.name, pin, admin: !!r.is_admin };
      localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
      resetAuthMode();
      await loadStateAndRoute();
      return;
    }
    if (r.status === "not_found") {
      pendingCreate = true;
      $("auth-notice").textContent = `We haven't met "${name}" yet! Press "Create my account" to join — or fix the spelling if that's not quite your name.`;
      $("auth-notice").hidden = false;
      $("auth-submit").textContent = "Create my account";
      return;
    }
    errEl.textContent = r.error;
    errEl.hidden = false;
  } catch {
    errEl.textContent = "Could not reach the game server. Check your internet and try again.";
    errEl.hidden = false;
  } finally {
    $("auth-submit").disabled = false;
  }
});

$("btn-signout").addEventListener("click", () => {
  localStorage.removeItem(PLAYER_KEY);
  player = null; profile = null; topicState = new Map();
  $("auth-name").value = ""; $("auth-pin").value = "";
  resetAuthMode();
  show("screen-auth");
});

function forceSignOut(message) {
  localStorage.removeItem(PLAYER_KEY);
  player = null; profile = null; session = null;
  $("auth-name").value = ""; $("auth-pin").value = "";
  resetAuthMode();
  $("auth-notice").textContent = message;
  $("auth-notice").hidden = false;
  show("screen-auth");
}

async function loadStateAndRoute() {
  const r = await rpc("math", "get_state", { p_player_id: player.id, p_pin: player.pin });
  if (!r.ok) { forceSignOut("Your sign-in is out of date. Please sign in again — sorry about that!"); return; }
  profile = r.profile;
  topicState = new Map((r.topics || []).map((t) => [t.topic_id, t]));
  if (!profile) enterSetup(false);
  else enterMap();
}

// ---------------------------------------------------------------------------
// Setup: pick a grade (+ optional warm-up)
// ---------------------------------------------------------------------------
let chosenGrade = null;

function enterSetup(allowBack) {
  $("setup-pick").hidden = false;
  $("setup-warmup").hidden = true;
  $("btn-setup-back").hidden = !allowBack;
  const grid = $("setup-grades");
  grid.innerHTML = "";
  for (let g = 1; g <= 8; g++) {
    const playable = gradeIsPlayable(g);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "grade-chip" + (profile && profile.grade === g ? " selected" : "");
    chip.innerHTML = `Grade ${g}<span class="cnt">${playable ? gradeTopics(g).length + " topics" : "soon"}</span>`;
    chip.addEventListener("click", () => pickGrade(g, playable));
    grid.appendChild(chip);
  }
  show("screen-setup");
}

async function pickGrade(g, playable) {
  $("setup-msg").hidden = true;
  if (!playable) {
    $("setup-msg").textContent = `Grade ${g} lessons are coming soon! You can still pick it to browse the topic list, but there's nothing to practice yet. Grades ${[1,2,3,4,5,6,7,8].filter(gradeIsPlayable).join(" and ")} are ready now.`;
    $("setup-msg").hidden = false;
  }
  try {
    const r = await rpc("math", "set_grade", { p_player_id: player.id, p_pin: player.pin, p_grade: g });
    if (!r.ok) { $("setup-msg").textContent = r.error; $("setup-msg").hidden = false; return; }
    profile = { ...(profile || { completed_grades: [] }), grade: g };
    chosenGrade = g;
    if (!playable) { enterMap(); return; }
    // offer the warm-up only when there's no progress in this grade yet
    const hasProgress = gradeTopics(g).some((t) => topicState.has(t.id));
    if (hasProgress) { enterMap(); return; }
    $("setup-pick").hidden = true;
    $("warmup-title").textContent = `Grade ${g} it is! 🎉`;
    $("setup-warmup").hidden = false;
  } catch {
    $("setup-msg").textContent = "Could not reach the game server — try again.";
    $("setup-msg").hidden = false;
  }
}

$("btn-skip-warmup").addEventListener("click", () => enterMap());
$("btn-warmup").addEventListener("click", () => startWarmup());
$("btn-setup-back").addEventListener("click", () => enterMap());
$("btn-change-grade").addEventListener("click", () => enterSetup(true));

// ---------------------------------------------------------------------------
// Topic map
// ---------------------------------------------------------------------------
function stateOf(topicId) {
  return topicState.get(topicId) || { state: "new", review_ready: false };
}

function enterMap(notice) {
  const g = profile.grade;
  $("map-name").textContent = player.name;
  $("map-grade-pill").textContent = `Grade ${g}`;
  $("btn-admin").hidden = !player.admin;
  $("map-msg").hidden = !notice;
  if (notice) $("map-msg").textContent = notice;

  const topics = gradeTopics(g);
  const playable = gradeIsPlayable(g);
  const mastered = topics.filter((t) => stateOf(t.id).state === "mastered").length;
  const done = (profile.completed_grades || []).includes(g);
  $("map-progress-text").textContent = `${mastered} of ${topics.length} topics mastered`;
  $("map-streak").textContent = (profile.completed_grades || []).length
    ? "🎓 " + profile.completed_grades.map((x) => `G${x}`).join(" ") : "";
  $("map-progress-bar").style.width = `${Math.round((100 * mastered) / topics.length)}%`;

  const wrap = $("map-domains");
  wrap.innerHTML = "";
  for (const dom of CURRICULUM[g].domains) {
    const head = document.createElement("div");
    head.className = "domain-head";
    head.innerHTML = `<span>${dom.icon}</span><span>${escapeHtml(dom.name)}</span>` +
      `<span class="codes">${g}.${dom.code}</span>`;
    wrap.appendChild(head);
    for (const t of dom.topics) {
      const st = stateOf(t.id);
      const card = document.createElement("button");
      card.type = "button";
      const ready = st.state === "learned" && st.review_ready;
      card.className = "topic-card" +
        (st.state === "mastered" ? " s-mastered" : ready ? " s-learned s-review-ready" : st.state === "learned" ? " s-learned" : "");
      const icon = st.state === "mastered" ? "🏆" : st.state === "learned" ? "⭐" : st.state === "learning" ? "📘" : "▶️";
      const stateTxt = !CONTENT[t.id] ? "soon"
        : st.state === "mastered" ? "Mastered"
        : ready ? "Review ready!"
        : st.state === "learned" ? "Review opens tomorrow"
        : st.state === "learning" ? (st.best_score != null ? `Best ${st.best_score}%` : "Keep going!")
        : "Start";
      card.innerHTML = `<span class="t-icon">${icon}</span>` +
        `<span class="t-body"><span class="t-title">${escapeHtml(t.title)}${t.nj ? '<span class="nj-badge">NJ</span>' : ""}</span>` +
        `<span class="t-sub">${escapeHtml(t.blurb)} · ${t.standards.join(", ")}</span></span>` +
        `<span class="t-state">${stateTxt}</span>`;
      if (CONTENT[t.id]) card.addEventListener("click", () => openLesson(t));
      else card.disabled = true;
      wrap.appendChild(card);
    }
  }

  const allMastered = playable && mastered === topics.length;
  $("btn-quiz").hidden = !allMastered || done;
  $("quiz-locked-text").textContent = done
    ? `You already conquered Grade ${g}! 🎉`
    : allMastered
      ? "Every topic mastered — you're ready! 2 questions on each topic. Score 85% or more to level up!"
      : playable
        ? `Master all ${topics.length} topics to unlock the quiz — ${topics.length - mastered} to go!`
        : `Grade ${g} lessons are coming soon. Browse the topics below to see what's covered.`;
  show("screen-map");
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------
function openLesson(topic) {
  lessonCtx = { topic, slide: 0 };
  $("lesson-topic-pill").textContent = topic.title;
  $("lesson-standards").innerHTML = topic.standards.join(", ") + (topic.nj ? ' <span class="nj-badge">NJ</span>' : "");
  renderSlide();
  show("screen-lesson");
}

function renderSlide() {
  const { topic, slide } = lessonCtx;
  const slides = CONTENT[topic.id].lesson;
  const s = slides[slide];
  $("lesson-slide-title").textContent = s.title;
  $("lesson-slide").innerHTML = s.html;
  $("btn-lesson-say").hidden = !canSpeak;
  $("lesson-dots").innerHTML = slides.map((_, i) => `<span class="${i === slide ? "on" : ""}"></span>`).join("");
  $("btn-slide-prev").disabled = slide === 0;
  $("btn-slide-next").hidden = slide === slides.length - 1;
  const st = stateOf(topic.id);
  const last = slide === slides.length - 1;
  $("btn-lesson-walk").hidden = !(last && hasWalkthrough(topic.id));
  $("btn-lesson-practice").hidden = !last;
  $("btn-lesson-review").hidden = !(last && st.state === "learned" && st.review_ready);
}

$("btn-slide-prev").addEventListener("click", () => { if (lessonCtx.slide > 0) { lessonCtx.slide--; renderSlide(); } });
$("btn-slide-next").addEventListener("click", () => { lessonCtx.slide++; renderSlide(); });
$("btn-lesson-say").addEventListener("click", () => say(CONTENT[lessonCtx.topic.id].lesson[lessonCtx.slide].say));
$("btn-lesson-back").addEventListener("click", () => { if (canSpeak) speechSynthesis.cancel(); enterMap(); });
$("btn-lesson-practice").addEventListener("click", () => startSet("practice", lessonCtx.topic));
$("btn-lesson-review").addEventListener("click", () => startSet("review", lessonCtx.topic));
$("btn-lesson-walk").addEventListener("click", () => startWalkthrough(lessonCtx.topic, () => show("screen-lesson")));

// ---------------------------------------------------------------------------
// Guided walkthrough (Tier A show-your-work): step the kid through the method,
// giving feedback on which step went wrong. Unscored — pure teaching/help.
// ---------------------------------------------------------------------------
let walk = null;

function startWalkthrough(topic, onDone) {
  if (canSpeak) speechSynthesis.cancel();
  const w = CONTENT[topic.id].walkthrough();
  walk = { topic, ...w, index: 0, onDone };
  $("walk-problem").textContent = w.problem;
  $("walk-viz").innerHTML = w.viz || "";
  show("screen-walk");
  renderWalkStep();
}

let walkAdvancing = false;
function renderWalkStep() {
  const s = walk.steps[walk.index];
  walkAdvancing = false;
  $("walk-progress").textContent = `Step ${walk.index + 1} of ${walk.steps.length}`;
  $("walk-step").innerHTML = s.prompt;
  $("walk-feedback").hidden = true;
  $("btn-walk-continue").hidden = true;
  const mcWrap = $("walk-mc");
  mcWrap.innerHTML = "";
  if (s.type === "mc") {
    $("walk-num-form").hidden = true;
    mcWrap.hidden = false;
    for (const choice of s.choices) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mc-btn";
      b.innerHTML = escapeHtml(String(choice));
      b.addEventListener("click", () => answerWalk(String(choice), b));
      mcWrap.appendChild(b);
    }
  } else {
    mcWrap.hidden = true;
    $("walk-num-form").hidden = false;
    $("walk-input").value = "";
    $("walk-input").disabled = false;
    $("walk-input").focus();
  }
}

$("walk-num-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("walk-input").value.trim();
  if (!v || walkAdvancing) return;
  answerWalk(v, null);
});

function answerWalk(givenRaw, btn) {
  if (walkAdvancing) return;
  walkAdvancing = true;
  const s = walk.steps[walk.index];
  const correct = sameValue(givenRaw, s.answer);
  const fb = $("walk-feedback");
  if (s.type === "mc") {
    $("walk-mc").querySelectorAll(".mc-btn").forEach((b) => {
      b.disabled = true;
      if (sameValue(b.textContent, s.answer)) b.classList.add(correct ? "picked-good" : "reveal");
    });
    if (btn && !correct) btn.classList.add("picked-bad");
  } else {
    $("walk-input").disabled = true;
  }
  if (correct) {
    fb.className = "feedback good";
    fb.innerHTML = `<span class="fb-head">✅ Yes!</span>`;
    fb.hidden = false;
    setTimeout(advanceWalk, 850);
  } else {
    fb.className = "feedback bad";
    fb.innerHTML = `<span class="fb-head">❌ This step is ${escapeHtml(String(s.answer))}</span>${escapeHtml(s.hint)}`;
    fb.hidden = false;
    $("btn-walk-continue").hidden = false;
    $("btn-walk-continue").focus();
  }
}

function advanceWalk() {
  if (!walk) return;
  walk.index++;
  if (walk.index < walk.steps.length) { renderWalkStep(); return; }
  // solved
  const fb = $("walk-feedback");
  $("walk-step").innerHTML = `<strong>${escapeHtml(walk.problem)} = ${escapeHtml(String(walk.answer))}</strong>`;
  $("walk-mc").hidden = true;
  $("walk-num-form").hidden = true;
  fb.className = "feedback good";
  fb.innerHTML = `<span class="fb-head">🎉 You solved it, step by step!</span>That's the method — try it yourself now.`;
  fb.hidden = false;
  $("walk-progress").textContent = "Done!";
  $("btn-walk-continue").hidden = false;
  $("btn-walk-continue").textContent = "Got it →";
  $("btn-walk-continue").focus();
}

$("btn-walk-continue").addEventListener("click", () => {
  if (walk && walk.index >= walk.steps.length) {
    const done = walk.onDone; walk = null;
    $("btn-walk-continue").textContent = "Continue →";
    if (done) done();
  } else {
    advanceWalk();
  }
});
$("btn-walk-exit").addEventListener("click", () => {
  const done = walk && walk.onDone; walk = null;
  $("btn-walk-continue").textContent = "Continue →";
  if (done) done(); else enterMap();
});

// ---------------------------------------------------------------------------
// Question sets
// ---------------------------------------------------------------------------
function genItems(topic, count, seen = new Set()) {
  const items = [];
  let guard = 0;
  while (items.length < count && guard < count * 40) {
    guard++;
    const it = CONTENT[topic.id].gen();
    const key = stripHtml(it.q) + "→" + it.answer;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ ...it, topic_id: topic.id });
  }
  return items;
}

const SET_LABELS = { practice: "✏️ Practice", review: "⭐ Review", warmup: "⚡ Warm-up", quiz: "🎓 Grade Quiz" };

function startSet(kind, topic) {
  let items;
  if (kind === "practice") items = genItems(topic, 10);
  else if (kind === "review") items = genItems(topic, 5);
  else items = []; // warmup/quiz build their own
  beginSession(kind, topic, items);
}

function startWarmup() {
  const g = profile.grade;
  // round-robin the domains so the warm-up touches everything
  const byDomain = CURRICULUM[g].domains.map((d) => shuffle([...d.topics]));
  const picked = [];
  let round = 0;
  while (picked.length < 8 && round < 10) {
    for (const list of byDomain) if (list.length && picked.length < 8) picked.push(list.shift());
    round++;
  }
  const seen = new Set();
  const items = picked.flatMap((t) => genItems(t, 1, seen));
  beginSession("warmup", null, shuffle(items));
}

function startQuiz() {
  const g = profile.grade;
  const seen = new Set();
  const items = gradeTopics(g).flatMap((t) => genItems(t, 2, seen));
  beginSession("quiz", null, shuffle(items));
}
$("btn-quiz").addEventListener("click", startQuiz);

function beginSession(kind, topic, items) {
  if (canSpeak) speechSynthesis.cancel();
  session = { kind, topic, items, index: 0, results: [], grade: profile.grade };
  $("set-pill").textContent = SET_LABELS[kind] + (topic ? ` — ${topic.title}` : "");
  show("screen-set");
  renderQuestion();
}

let advancing = false;
function renderQuestion() {
  const it = session.items[session.index];
  advancing = false;
  quitArmed = false;
  $("btn-set-exit").textContent = "🏠 Exit";
  $("set-progress").textContent = `Question ${session.index + 1} of ${session.items.length}`;
  $("set-viz").innerHTML = it.viz || "";
  $("set-q").innerHTML = it.q;
  $("set-feedback").hidden = true;
  $("btn-set-walk").hidden = true;
  $("btn-set-continue").hidden = true;
  const mcWrap = $("set-mc");
  mcWrap.innerHTML = "";
  if (it.type === "mc") {
    $("set-num-form").hidden = true;
    mcWrap.hidden = false;
    mcWrap.className = "mc-grid" + (it.choices.some((c) => String(c).length > 14) ? " wide" : "");
    for (const choice of it.choices) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mc-btn";
      b.innerHTML = escapeHtml(String(choice));
      b.addEventListener("click", () => answer(String(choice), b));
      mcWrap.appendChild(b);
    }
  } else {
    mcWrap.hidden = true;
    $("set-num-form").hidden = false;
    $("set-input").value = "";
    $("set-input").disabled = false;
    $("set-input").focus();
  }
}

$("set-num-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("set-input").value.trim();
  if (!v || advancing) return;
  answer(v, null);
});

function answer(givenRaw, btn) {
  if (advancing) return;
  advancing = true;
  const it = session.items[session.index];
  const correct = sameValue(givenRaw, it.answer);
  // canonicalize equivalent answers so the server's string compare agrees
  const given = correct ? String(it.answer) : String(givenRaw);
  session.results.push({ q: stripHtml(it.q), answer: String(it.answer), given, topic_id: it.topic_id });

  const fb = $("set-feedback");
  if (it.type === "mc") {
    $("set-mc").querySelectorAll(".mc-btn").forEach((b) => {
      b.disabled = true;
      if (sameValue(b.textContent, it.answer)) b.classList.add(correct ? "picked-good" : "reveal");
    });
    if (btn && !correct) btn.classList.add("picked-bad");
  } else {
    $("set-input").disabled = true;
  }

  if (correct) {
    fb.className = "feedback good";
    fb.innerHTML = `<span class="fb-head">${pick(["✅ Correct!", "✅ Yes!", "✅ Nailed it!", "✅ Great job!"])}</span>`;
    fb.hidden = false;
    setTimeout(advance, 900);
  } else {
    fb.className = "feedback bad";
    fb.innerHTML = `<span class="fb-head">❌ Not quite — it's ${escapeHtml(String(it.answer))}</span>${escapeHtml(it.explain)}`;
    fb.hidden = false;
    // Offer a step-by-step walkthrough on a fresh problem of the same skill —
    // only during practice/review (not warm-up or the graded quiz).
    const offerWalk = (session.kind === "practice" || session.kind === "review") && hasWalkthrough(it.topic_id);
    $("btn-set-walk").hidden = !offerWalk;
    $("btn-set-continue").hidden = false;
    $("btn-set-continue").focus();
  }
}

$("btn-set-walk").addEventListener("click", () => {
  const it = session.items[session.index];
  const topic = topicById(it.topic_id);
  // running a walkthrough leaves the set screen DOM intact; returning just
  // re-shows it with the feedback + Continue still in place.
  startWalkthrough(topic, () => { $("btn-set-walk").hidden = true; show("screen-set"); });
});

function advance() {
  if (!session) return;
  session.index++;
  if (session.index < session.items.length) renderQuestion();
  else finishSet();
}
$("btn-set-continue").addEventListener("click", advance);

// Exiting mid-set loses the set (sets are all-or-nothing) → two-tap confirm.
let quitArmed = false;
$("btn-set-exit").addEventListener("click", () => {
  if (session && !quitArmed) {
    quitArmed = true;
    $("btn-set-exit").textContent = "Tap again to exit — this set won't count";
    setTimeout(() => { quitArmed = false; $("btn-set-exit").textContent = "🏠 Exit"; }, 3000);
    return;
  }
  session = null;
  enterMap();
});

// ---------------------------------------------------------------------------
// Finishing a set: submit to the server, render results
// ---------------------------------------------------------------------------
async function finishSet() {
  const { kind, topic, results, grade } = session;
  const correct = results.filter((r) => r.given === r.answer).length;
  const total = results.length;
  session = null;

  $("res-event").hidden = true;
  $("res-save-error").hidden = true;
  $("res-topics-card").hidden = true;
  $("btn-res-again").hidden = true;
  $("res-summary").innerHTML = `You got <strong>${correct}</strong> of <strong>${total}</strong> right (${Math.round((100 * correct) / total)}%)`;

  const list = $("res-list");
  list.innerHTML = "";
  for (const r of results) {
    const li = document.createElement("li");
    const good = r.given === r.answer;
    li.innerHTML = `<span>${good ? "✅" : "❌"} ${escapeHtml(r.q)}</span>` +
      `<span class="ans">${good ? escapeHtml(r.answer) : `${escapeHtml(r.given)} → ${escapeHtml(r.answer)}`}</span>`;
    list.appendChild(li);
  }

  const titles = { practice: "✏️ Practice Complete!", review: "⭐ Review Complete!", warmup: "⚡ Warm-up Done!", quiz: "🎓 Quiz Finished!" };
  $("res-title").textContent = titles[kind];
  show("screen-results");

  try {
    if (kind === "quiz") {
      const r = await rpc("math", "submit_quiz", {
        p_player_id: player.id, p_pin: player.pin, p_grade: grade,
        p_items: results.map(({ q, answer, given, topic_id }) => ({ q, answer, given, topic_id })),
      });
      if (!r.ok) { showSaveError(r.error); return; }
      renderQuizOutcome(r);
    } else {
      const r = await rpc("math", "submit_set", {
        p_player_id: player.id, p_pin: player.pin, p_grade: grade,
        p_topic_id: topic ? topic.id : null, p_kind: kind,
        p_items: results.map(({ q, answer, given }) => ({ q, answer, given })),
      });
      if (!r.ok) { showSaveError(r.error); return; }
      renderSetOutcome(kind, topic, r);
    }
    // refresh authoritative state in the background
    const st = await rpc("math", "get_state", { p_player_id: player.id, p_pin: player.pin });
    if (st.ok) {
      profile = st.profile;
      topicState = new Map((st.topics || []).map((t) => [t.topic_id, t]));
    }
  } catch {
    showSaveError("Could not reach the game server — this set wasn't saved. Check your internet and try again.");
  }
}

function showSaveError(err) {
  const friendly = err === "review_not_ready"
    ? "This review isn't open yet — it unlocks the day after you learn a topic. Come back tomorrow!"
    : `⚠️ This set could not be saved: ${err}`;
  $("res-save-error").textContent = friendly;
  $("res-save-error").hidden = false;
}

function renderSetOutcome(kind, topic, r) {
  const ev = $("res-event");
  if (kind === "warmup") {
    ev.textContent = r.pct >= 80
      ? "Wow, strong start! 💪 Pick any topic and race to mastery."
      : "Good warm-up! Start with the topics marked ▶️ and build up your stars.";
    ev.hidden = false;
    return;
  }
  if (r.event === "learned") {
    ev.textContent = "⭐ Topic learned! The 5-question review unlocks tomorrow — pass it to make this 🏆 mastered.";
    ev.hidden = false;
    say("Topic learned! Come back tomorrow for the review.");
  } else if (r.event === "mastered") {
    ev.textContent = "🏆 MASTERED! This topic is locked in. On to the next one!";
    ev.hidden = false;
    say("Mastered! Amazing work!");
  } else if (r.event === "demoted") {
    ev.textContent = "Almost! Let's read the lesson once more and practice again — then a fresh review.";
    ev.hidden = false;
  } else if (kind === "practice" && r.pct < 80) {
    ev.textContent = `You need 80% to earn the ⭐ — so close! The lesson and another practice round are waiting.`;
    ev.hidden = false;
  }
  if (topic && CONTENT[topic.id]) {
    $("btn-res-again").textContent = "✏️ Practice this topic again";
    $("btn-res-again").hidden = false;
    $("btn-res-again").onclick = () => startSet("practice", topic);
  }
}

function renderQuizOutcome(r) {
  const ev = $("res-event");
  if (r.passed) {
    ev.textContent = r.finished_grade_8
      ? "🎉🎓 YOU FINISHED GRADE 8 — you've conquered ALL of MathMaster (for now)! Incredible!"
      : `🎉 LEVEL UP! Welcome to Grade ${r.new_grade}! New topics are waiting on your map.`;
    say(r.finished_grade_8 ? "Incredible! You finished everything!" : `Level up! Welcome to grade ${r.new_grade}!`);
  } else {
    ev.textContent = `Not this time — you scored ${r.pct}% (need 85%). The topics marked below went back to 📘 — re-learn them and try a brand-new quiz!`;
  }
  ev.hidden = false;
  const tbody = $("res-topics");
  tbody.innerHTML = "";
  for (const t of r.topics) {
    const info = topicById(t.topic_id);
    const tr = document.createElement("tr");
    if (t.demoted) tr.className = "bad";
    tr.innerHTML = `<td>${escapeHtml(info ? info.title : t.topic_id)}</td>` +
      `<td>${t.correct}/${t.total}</td><td>${t.demoted ? "📘 practice again" : "✅"}</td>`;
    tbody.appendChild(tr);
  }
  $("res-topics-card").hidden = false;
}

$("btn-res-map").addEventListener("click", () => enterMap());

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------
$("btn-feedback").addEventListener("click", () => {
  $("feedback-text").value = "";
  $("feedback-msg").hidden = true;
  show("screen-feedback");
  $("feedback-text").focus();
});
$("btn-feedback-back").addEventListener("click", () => enterMap());
$("btn-send-feedback").addEventListener("click", async () => {
  const msg = $("feedback-text").value.trim();
  if (!msg) return;
  $("btn-send-feedback").disabled = true;
  try {
    const r = await rpc("arcade", "submit_feedback", {
      p_player_id: player.id, p_pin: player.pin, p_game: "mathmaster", p_message: msg,
    });
    if (r.ok) enterMap("Thanks! Your feedback was sent. 💛");
    else { $("feedback-msg").textContent = r.error; $("feedback-msg").hidden = false; }
  } catch {
    $("feedback-msg").textContent = "Could not reach the game server — try again.";
    $("feedback-msg").hidden = false;
  } finally {
    $("btn-send-feedback").disabled = false;
  }
});

// ---------------------------------------------------------------------------
// Parent / admin panel
// ---------------------------------------------------------------------------
document.querySelectorAll("#screen-admin .tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#screen-admin .tab").forEach((b) => b.classList.toggle("active", b === btn));
    ["progress", "daily", "feedback"].forEach((t) => ($("atab-" + t).hidden = t !== btn.dataset.atab));
  });
});

$("btn-admin").addEventListener("click", async () => {
  show("screen-admin");
  $("admin-players").innerHTML = `<tr><td colspan="7">Loading…</td></tr>`;
  $("admin-daily").innerHTML = "";
  $("admin-feedback").innerHTML = "";
  try {
    const [stats, fb] = await Promise.all([
      rpc("math", "get_admin_stats", { p_player_id: player.id, p_pin: player.pin }),
      rpc("arcade", "get_feedback", { p_player_id: player.id, p_pin: player.pin }),
    ]);
    $("admin-players").innerHTML = "";
    if (!stats.ok) {
      $("admin-players").innerHTML = `<tr><td colspan="7">${escapeHtml(stats.error)}</td></tr>`;
    } else {
      $("admin-progress-empty").hidden = stats.players.length > 0;
      for (const p of stats.players) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${escapeHtml(p.name)}</td><td>${p.grade}${(p.completed_grades || []).length ? " 🎓" : ""}</td>` +
          `<td>${p.mastered}</td><td>${p.learned}</td><td>${p.learning}</td><td>${p.sets_done}</td><td>${p.last_active ?? "—"}</td>`;
        $("admin-players").appendChild(tr);
      }
      $("admin-daily-empty").hidden = stats.daily.length > 0;
      for (const d of stats.daily) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${d.day}</td><td>${escapeHtml(d.name)}</td><td>${d.sets}</td><td>${d.correct}/${d.total}</td>`;
        $("admin-daily").appendChild(tr);
      }
    }
    if (fb.ok) {
      $("admin-feedback-empty").hidden = fb.feedback.length > 0;
      for (const f of fb.feedback) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${new Date(f.created_at).toLocaleDateString()}</td><td>${escapeHtml(f.name)}</td>` +
          `<td>${escapeHtml(f.game)}</td><td>${escapeHtml(f.message)}</td>`;
        $("admin-feedback").appendChild(tr);
      }
    }
  } catch {
    $("admin-players").innerHTML = `<tr><td colspan="7">Couldn't load — check your internet.</td></tr>`;
  }
});
$("btn-admin-back").addEventListener("click", () => enterMap());

// ---------------------------------------------------------------------------
// PWA install: capture the Android/Chrome prompt when offered; always provide
// platform-specific manual steps (iOS never fires the event — you must use
// Share → Add to Home Screen).
// ---------------------------------------------------------------------------
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

$("btn-install").addEventListener("click", () => {
  const steps = $("install-steps");
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Mac/.test(ua) && "ontouchend" in document);
  const isAndroid = /Android/.test(ua);
  $("btn-install-now").hidden = !deferredInstall;
  if (isStandalone()) {
    steps.innerHTML = `<p class="notice">✅ You're already using the installed app — nice!</p>`;
    $("btn-install-now").hidden = true;
  } else if (isIOS) {
    steps.innerHTML = `<ol class="install-list">
      <li>Tap the <strong>Share</strong> button <span class="ikey">⬆️</span> at the bottom of Safari.</li>
      <li>Scroll down and tap <strong>Add to Home Screen</strong> <span class="ikey">➕</span>.</li>
      <li>Tap <strong>Add</strong> — the 🧮 MathMaster icon appears on your home screen!</li></ol>
      <p class="muted">On an iPhone or iPad this only works in <strong>Safari</strong>.</p>`;
  } else if (isAndroid) {
    steps.innerHTML = `<ol class="install-list">
      <li>Tap <strong>Install now</strong> above${deferredInstall ? "" : ", or open the <strong>⋮</strong> menu"}.</li>
      <li>If you used the menu, choose <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</li>
      <li>Confirm — the 🧮 icon lands on your home screen.</li></ol>`;
  } else {
    steps.innerHTML = `<ol class="install-list">
      <li>Click <strong>Install now</strong> above, or the <strong>install icon</strong> in your browser's address bar.</li>
      <li>Confirm to add MathMaster as an app.</li></ol>
      <p class="muted">Works in Chrome, Edge, and other Chromium browsers.</p>`;
  }
  show("screen-install");
});

$("btn-install-now").addEventListener("click", async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  $("btn-install-now").hidden = true;
});
$("btn-install-back").addEventListener("click", () => enterMap());

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
(async function boot() {
  const saved = localStorage.getItem(PLAYER_KEY);
  if (saved) {
    try { player = JSON.parse(saved); } catch { player = null; }
  }
  if (!player) { show("screen-auth"); return; }
  try {
    const r = await rpc("arcade", "enter", { p_name: player.name, p_pin: player.pin, p_create: false });
    if (!r.ok) {
      forceSignOut("You were signed out because your account changed on the server. Please sign in again — sorry about that!");
      return;
    }
    player.id = r.player_id;
    player.admin = !!r.is_admin;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
    await loadStateAndRoute();
  } catch {
    // offline: show auth with a gentle note rather than a broken map
    $("auth-notice").textContent = "Couldn't reach the server — check your internet and sign in again.";
    $("auth-notice").hidden = false;
    show("screen-auth");
  }
})();

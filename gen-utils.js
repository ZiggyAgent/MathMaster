// Shared helpers for question generators. A generator returns one item:
//   { q, viz, type: 'mc'|'num', choices?, answer, explain }
// `answer` and mc `choices` are strings; correctness is judged by comparing
// normalizeAnswer(given) to normalizeAnswer(answer) — keep answers in the
// canonical form the question asks for (e.g. "3/4", "7:30", "$12").

function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sampleN(arr, n) { return shuffle(arr).slice(0, n); }

// Multiple choice builder: dedupes distractors against the answer and each
// other, keeps up to 4 options, shuffles.
function mc(answer, distractors) {
  const seen = new Set([String(answer)]);
  const opts = [String(answer)];
  for (const d of distractors) {
    const s = String(d);
    if (!seen.has(s) && opts.length < 4) { seen.add(s); opts.push(s); }
  }
  return { type: "mc", choices: shuffle(opts), answer: String(answer) };
}

// Normalization applied to both the kid's input and the expected answer.
// Lowercase, strip spaces/commas, drop a leading $, unify minus signs.
function normalizeAnswer(s) {
  return String(s).toLowerCase().replace(/\s+/g, "").replace(/,/g, "")
    .replace(/^\$/, "").replace(/−/g, "-");
}

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function simplify(n, d) { const g = gcd(n, d); return [n / g, d / g]; }
function fracStr(n, d) {
  if (d === 0) return "?";
  [n, d] = simplify(n, d);
  if (d === 1) return String(n);
  return `${n}/${d}`;
}
// Mixed-number string like "2 1/3" for display in explanations
function mixedStr(n, d) {
  [n, d] = simplify(n, d);
  if (d === 1) return String(n);
  if (n < d) return `${n}/${d}`;
  const w = Math.floor(n / d), r = n % d;
  return r === 0 ? String(w) : `${w} ${r}/${d}`;
}
function fracHtml(n, d) { return `<span class="frac"><span>${n}</span><span>${d}</span></span>`; }

const KID_NAMES = ["Maya", "Leo", "Aria", "Noah", "Zoe", "Eli", "Luna", "Max", "Ivy", "Sam", "Mia", "Ben", "Nora", "Jack", "Ella", "Omar", "Ruby", "Theo"];
const SMALL_THINGS = [["apple", "🍎"], ["star", "⭐"], ["ball", "⚽"], ["cookie", "🍪"], ["flower", "🌸"], ["fish", "🐠"], ["book", "📕"], ["balloon", "🎈"], ["strawberry", "🍓"], ["duck", "🦆"], ["cupcake", "🧁"], ["rocket", "🚀"]];
function thing() { return pick(SMALL_THINGS); }
function plural(word, n) { return n === 1 ? word : word + "s"; }
function moneyStr(cents) {
  const d = Math.floor(cents / 100), c = cents % 100;
  if (c === 0) return `$${d}`;
  return `$${d}.${String(c).padStart(2, "0")}`;
}

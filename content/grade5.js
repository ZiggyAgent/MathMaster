// Grade 5 content — lessons + question generators for every Grade 5 topic in
// curriculum.js (2023 NJSLS-M). Same contract as content/grade1.js:
//   CONTENT[id] = { lesson: [slides], gen() -> { q, viz, type, choices?, answer, explain } }

// ---- local helpers (grade 5) ------------------------------------------------
// Exact decimal string for integer n shifted k places right (n / 10^k).
function g5dec(n, k) {
  let s = String(Math.abs(n));
  if (k > 0) {
    while (s.length <= k) s = "0" + s;
    s = s.slice(0, s.length - k) + "." + s.slice(s.length - k);
    s = s.replace(/0+$/, "").replace(/\.$/, "");
  }
  return (n < 0 ? "-" : "") + s;
}
function g5lcm(a, b) { return (a * b) / gcd(a, b); }
function g5pad(n, k) { return String(n).padStart(k, "0"); }
const G5_ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

registerContent({

  // ----------------------------------------------------------------- 5.OA.A.1
  "g5-expressions": {
    lesson: [
      { title: "Parentheses go first", say: "Parentheses are a fence: do the math inside them first. 3 times the quantity 4 plus 2 is 3 times 6, which is 18.",
        html: `<p><strong>Parentheses ( )</strong> are a fence — do what's <em>inside</em> first.</p>
               <p class="bigmath">3 × (4 + 2) = 3 × 6 = 18</p>
               <p>Without the fence, 3 × 4 + 2 would be 12 + 2 = 14. Parentheses change everything!</p>` },
      { title: "No parentheses? × and ÷ first", say: "When there are no parentheses, multiply and divide before you add and subtract. 5 plus 2 times 4 is 5 plus 8, which is 13.",
        html: `<p>No parentheses? Then <strong>× and ÷ go before + and −</strong>.</p>
               <p class="bigmath">5 + 2 × 4 = 5 + 8 = 13</p>
               <p>⚠️ It is NOT 7 × 4. The multiplication happens first, even if it's written second.</p>` },
      { title: "Brackets: work inside-out", say: "Brackets are just bigger parentheses. Work from the inside out: parentheses first, then brackets.",
        html: `<p><strong>Brackets [ ]</strong> are big parentheses. Work <strong>inside-out</strong>:</p>
               <p class="bigmath">2 × [10 − (3 + 1)] = 2 × [10 − 4] = 2 × 6 = 12</p>` },
    ],
    gen() {
      const kind = pick(["timesSum", "divPlus", "plusTimes", "brackets", "twoGroups"]);
      if (kind === "timesSum") {
        const a = ri(2, 6), b = ri(2, 9), c = ri(2, 9);
        return { q: `Evaluate: &nbsp;<strong>${a} × (${b} + ${c})</strong>`, viz: null, type: "num",
          answer: String(a * (b + c)),
          explain: `Parentheses first: ${b} + ${c} = ${b + c}. Then ${a} × ${b + c} = ${a * (b + c)}.` };
      }
      if (kind === "divPlus") {
        const c = ri(2, 5), k = ri(2, 6), b = ri(2, 9), d = ri(2, 9), a = b + c * k;
        return { q: `Evaluate: &nbsp;<strong>(${a} − ${b}) ÷ ${c} + ${d}</strong>`, viz: null, type: "num",
          answer: String(k + d),
          explain: `Parentheses first: ${a} − ${b} = ${c * k}. Then ${c * k} ÷ ${c} = ${k}, and ${k} + ${d} = ${k + d}.` };
      }
      if (kind === "plusTimes") {
        const a = ri(3, 20), b = ri(2, 9), c = ri(2, 9);
        return { q: `Evaluate: &nbsp;<strong>${a} + ${b} × ${c}</strong>`, viz: null, type: "num",
          answer: String(a + b * c),
          explain: `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} + ${b * c} = ${a + b * c}.` };
      }
      if (kind === "brackets") {
        const m = ri(2, 3), c = ri(2, 6), b = c + ri(2, 6), a = ri(2, 8);
        const inner = b - c, sum = a + inner;
        return { q: `Evaluate: &nbsp;<strong>${m} × [${a} + (${b} − ${c})]</strong>`, viz: null, type: "num",
          answer: String(m * sum),
          explain: `Inside-out: ${b} − ${c} = ${inner}, then ${a} + ${inner} = ${sum}, then ${m} × ${sum} = ${m * sum}.` };
      }
      const a = ri(2, 9), b = ri(2, 9), d = ri(2, 7), c = d + ri(2, 5);
      return { q: `Evaluate: &nbsp;<strong>(${a} + ${b}) × (${c} − ${d})</strong>`, viz: null, type: "num",
        answer: String((a + b) * (c - d)),
        explain: `Do each set of parentheses: ${a} + ${b} = ${a + b} and ${c} − ${d} = ${c - d}. Then ${a + b} × ${c - d} = ${(a + b) * (c - d)}.` };
    },
  },

  // ----------------------------------------------------------------- 5.OA.A.2
  "g5-write-expressions": {
    lesson: [
      { title: "Words into math", say: "You can turn words into an expression without solving anything. Add 8 and 7, then multiply by 2, becomes 2 times the quantity 8 plus 7.",
        html: `<p>Words can become math <em>without solving</em>:</p>
               <p>"<strong>Add 8 and 7, then multiply by 2</strong>"</p>
               <p class="bigmath">2 × (8 + 7)</p>
               <p>The parentheses keep "8 + 7" together so it happens first.</p>` },
      { title: "Parentheses matter", say: "2 times the quantity 8 plus 7 is 30. But 2 times 8, plus 7, is only 23. The parentheses change the meaning.",
        html: `<p>Compare:</p>
               <p class="bigmath">2 × (8 + 7) = 30 &nbsp;&nbsp;but&nbsp;&nbsp; 2 × 8 + 7 = 23</p>
               <p>Same numbers, different meaning — parentheses decide what happens first.</p>` },
      { title: "Compare without computing", say: "You can compare expressions without doing the math. 3 times the quantity 18 plus 2 is exactly 3 times as large as 18 plus 2. No calculating needed!",
        html: `<p>🕵️ You can reason about an expression <strong>without calculating</strong>:</p>
               <p class="bigmath">3 × (18 + 2)</p>
               <p>is exactly <strong>3 times as large</strong> as (18 + 2). You don't need to know that it's 60!</p>` },
    ],
    gen() {
      const kind = pick(["addThenMult", "subThenDiv", "compare", "productPlus", "double"]);
      if (kind === "addThenMult") {
        const a = ri(3, 12), b = ri(3, 12), c = ri(2, 6);
        return { q: `Which expression means: "add ${a} and ${b}, then multiply the sum by ${c}"?`, viz: null,
          ...mc(`${c} × (${a} + ${b})`, [`${c} × ${a} + ${b}`, `(${c} + ${a}) × ${b}`, `${a} + ${b} × ${c}`]),
          explain: `"Then multiply the sum" means the whole sum (${a} + ${b}) goes in parentheses, times ${c}.` };
      }
      if (kind === "subThenDiv") {
        const b = ri(3, 12), c = ri(2, 6), a = b + ri(4, 20);
        return { q: `Which expression means: "subtract ${b} from ${a}, then divide by ${c}"?`, viz: null,
          ...mc(`(${a} − ${b}) ÷ ${c}`, [`${a} − ${b} ÷ ${c}`, `(${b} − ${a}) ÷ ${c}`, `${a} ÷ ${c} − ${b}`]),
          explain: `Subtract first, so (${a} − ${b}) needs parentheses; then ÷ ${c}.` };
      }
      if (kind === "compare") {
        const n = ri(2, 9), a = ri(11, 39), b = ri(2, 9);
        return { q: `WITHOUT calculating: how does <strong>${n} × (${a} + ${b})</strong> compare to <strong>${a} + ${b}</strong>?`, viz: null,
          ...mc(`It is ${n} times as large`, [`It is ${n} more`, `It is the same`, `It is ${n} times smaller`]),
          explain: `Multiplying (${a} + ${b}) by ${n} makes it ${n} times as large — no arithmetic needed.` };
      }
      if (kind === "productPlus") {
        const a = ri(2, 9), b = ri(2, 9), c = ri(2, 12);
        return { q: `Which expression means: "the product of ${a} and ${b}, plus ${c}"?`, viz: null,
          ...mc(`${a} × ${b} + ${c}`, [`${a} × (${b} + ${c})`, `${a} + ${b} × ${c}`, `(${a} + ${b}) × ${c}`]),
          explain: `"Product of ${a} and ${b}" is ${a} × ${b}; then add ${c}.` };
      }
      const a = ri(4, 15), b = ri(4, 15);
      return { q: `Which expression means: "double the sum of ${a} and ${b}"?`, viz: null,
        ...mc(`2 × (${a} + ${b})`, [`2 × ${a} + ${b}`, `${a} + 2 × ${b}`, `2 + ${a} + ${b}`]),
        explain: `"The sum of ${a} and ${b}" is (${a} + ${b}); "double" means multiply the whole thing by 2.` };
    },
  },

  // ----------------------------------------------------------------- 5.OA.B.3
  "g5-patterns": {
    lesson: [
      { title: "Follow the rule", say: "A pattern starts at a number and follows a rule. Start at 0, add 3: 0, 3, 6, 9, 12.",
        html: `<p>A <strong>pattern</strong> = a starting number + a rule.</p>
               <p class="bigmath">Start at 0, rule "add 3": &nbsp;0, 3, 6, 9, 12, …</p>` },
      { title: "Two patterns at once", say: "Run two rules side by side. Add 3 gives 0, 3, 6, 9. Add 6 gives 0, 6, 12, 18. Every term in the second pattern is double the matching term in the first!",
        html: `<p>Run <strong>two rules</strong> side by side:</p>
               <p class="bigmath">A (add 3): 0, 3, 6, 9<br>B (add 6): 0, 6, 12, 18</p>
               <p>Each term in B is <strong>2 times</strong> the matching term in A — because the rule adds twice as much.</p>` },
      { title: "Graph the pairs", say: "Match the terms up as ordered pairs and plot them. The points from two patterns line up in a straight line.",
        html: `<p>Match terms into <strong>ordered pairs</strong> (A, B): (0,0), (1,2), (2,4), (3,6) — then plot them!</p>
               ${vizCoordPlane([{ x: 0, y: 0 }, { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }], { max: 8 })}
               <p>The points line up — the pattern shows on the graph.</p>` },
    ],
    gen() {
      const kind = pick(["next", "relate", "graph", "nextPair"]);
      if (kind === "next") {
        const s = pick([0, ri(1, 5)]), k = ri(2, 9);
        const terms = [s, s + k, s + 2 * k, s + 3 * k];
        return { q: `A pattern starts at ${s} with the rule "add ${k}": &nbsp;${terms.join(", ")}, ___. What is the next term?`,
          viz: null, type: "num", answer: String(s + 4 * k),
          explain: `Keep adding ${k}: ${s + 3 * k} + ${k} = ${s + 4 * k}.` };
      }
      if (kind === "relate") {
        const a = ri(1, 4), m = pick([2, 3]), b = a * m;
        const A = [0, a, 2 * a, 3 * a], B = [0, b, 2 * b, 3 * b];
        return { q: `Pattern A (add ${a}): ${A.join(", ")}<br>Pattern B (add ${b}): ${B.join(", ")}<br>How does each term in B compare to the matching term in A?`,
          viz: null, ...mc(`${m} times as big`, [`${m === 2 ? 3 : 2} times as big`, `${b - a} more`, `the same`]),
          explain: `B's rule adds ${b}, which is ${m} × ${a} — so every term in B is ${m} times the matching term in A.` };
      }
      if (kind === "graph") {
        const m = pick([2, 3]);
        const pts = [0, 1, 2, 3].map((n) => ({ x: n, y: n * m }));
        return { q: `The graph shows pairs from two patterns: x uses "add 1" and y uses "add ${m}". If the patterns continue, what is y when x = 4?`,
          viz: vizCoordPlane(pts, { max: 10 }), type: "num", answer: String(4 * m),
          explain: `y is always ${m} times x, so when x = 4, y = ${m} × 4 = ${4 * m}.` };
      }
      const a = ri(1, 3), m = pick([2, 3, 4]), b = a * m;
      const pairs = [0, 1, 2].map((n) => `(${n * a}, ${n * b})`);
      return { q: `Pattern A adds ${a}, Pattern B adds ${b}. The ordered pairs so far: ${pairs.join(", ")}. Which pair comes NEXT?`,
        viz: null, ...mc(`(${3 * a}, ${3 * b})`, [`(${3 * b}, ${3 * a})`, `(${3 * a}, ${2 * b + a})`, `(${4 * a}, ${4 * b})`]),
        explain: `Add ${a} to the first number and ${b} to the second: (${2 * a} + ${a}, ${2 * b} + ${b}) = (${3 * a}, ${3 * b}).` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.A.1
  "g5-place-value": {
    lesson: [
      { title: "Neighbors are ×10 apart", say: "In 5,555 every 5 means something different. Each place is worth ten times the place to its right.",
        html: `<p>In <strong>5,555</strong> each 5 has a different value:</p>
               <p class="bigmath">5,555 = 5,000 + 500 + 50 + 5</p>
               <p>Each place is <strong>10 times</strong> the place to its <strong>right</strong>: the 5 in the tens (50) is 10 × the 5 in the ones (5).</p>` },
      { title: "Going left ÷10", say: "Moving left, each place is ten times bigger. Moving right, each place is one tenth as big.",
        html: `<p>It works both ways:</p>
               <p class="bigmath">500 is 10 × 50 &nbsp;&nbsp;and&nbsp;&nbsp; 50 is 1/10 of 500</p>
               <p>Two places apart? That's 10 × 10 = <strong>100 times</strong>.</p>` },
      { title: "Quick ×10 and ÷10", say: "Multiplying by 10 slides every digit one place bigger: 10 times 3.4 is 34. One tenth of 250 is 25.",
        html: `<p>This makes ×10 and ÷10 instant:</p>
               <p class="bigmath">10 × 3.4 = 34 &nbsp;&nbsp;&nbsp; 1/10 of 250 = 25</p>
               <p>Every digit slides one place — no hard math!</p>` },
    ],
    gen() {
      const kind = pick(["timesRight", "fracLeft", "times10", "tenthOf", "digitValue"]);
      if (kind === "timesRight") {
        const d = ri(2, 9), gap = pick([1, 1, 2]);
        const places = ["ones", "tens", "hundreds", "thousands"];
        const lo = ri(0, 3 - gap), hi = lo + gap;
        const num = `${d},${d}${d}${d}`;
        const ans = gap === 1 ? "10 times" : "100 times";
        return { q: `In the number <strong>${num}</strong>, the ${d} in the ${places[hi]} place is how many times the value of the ${d} in the ${places[lo]} place?`,
          viz: null, ...mc(ans, ["10 times", "100 times", "1,000 times", "1/10 as much"].filter((s) => s !== ans)),
          explain: `Each step left is ×10. ${gap === 1 ? "One step" : "Two steps"} left = ${gap === 1 ? "10" : "10 × 10 = 100"} times as much.` };
      }
      if (kind === "fracLeft") {
        const d = ri(2, 9);
        const pairs = [["tens", "hundreds"], ["ones", "tens"], ["hundreds", "thousands"]];
        const [lo, hi] = pick(pairs);
        return { q: `In <strong>${d},${d}${d}${d}</strong>, the value of the ${d} in the ${lo} place is what fraction of the value of the ${d} in the ${hi} place?`,
          viz: null, ...mc("1/10", ["1/100", "10", "1/1,000"]),
          explain: `Each step right makes a digit worth 1/10 as much.` };
      }
      if (kind === "times10") {
        let B = ri(12, 98); if (B % 10 === 0) B += 1;
        return { q: `What is 10 × ${g5dec(B, 1)}? (Just the number)`, viz: null, type: "num", answer: String(B),
          explain: `×10 slides every digit one place left: ${g5dec(B, 1)} → ${B}.` };
      }
      if (kind === "tenthOf") {
        const t = ri(3, 98) * 10;
        return { q: `What is 1/10 of ${t}?`, viz: null, type: "num", answer: String(t / 10),
          explain: `1/10 slides every digit one place right: ${t} → ${t / 10}.` };
      }
      let digits = sampleN([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
      const num = digits.join("");
      const placeIdx = ri(0, 2), placeName = ["thousands", "hundreds", "tens"][placeIdx];
      const dg = digits[placeIdx], val = dg * [1000, 100, 10][placeIdx];
      return { q: `What is the VALUE of the digit ${dg} in <strong>${digits[0]},${digits[1]}${digits[2]}${digits[3]}</strong>? (Type the number, like 700)`,
        viz: null, type: "num", answer: String(val),
        explain: `The ${dg} sits in the ${placeName} place, so it is worth ${dg} × ${[1000, 100, 10][placeIdx]} = ${val}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.A.2
  "g5-powers-10": {
    lesson: [
      { title: "Multiplying by 10, 100, 1,000", say: "Multiplying by 10, 100, or 1,000 slides the digits left. The decimal point seems to jump right one place per zero.",
        html: `<p>Multiplying by 10, 100, or 1,000 slides digits <strong>left</strong> — the decimal point moves <strong>right</strong> one place per zero:</p>
               <p class="bigmath">2.5 × 100 = 250</p>
               <p>Two zeros in 100 → the point moves 2 places right.</p>` },
      { title: "Dividing by 10, 100, 1,000", say: "Dividing does the opposite: the decimal point moves left. 47 divided by 100 is 0.47.",
        html: `<p>Dividing moves the point <strong>left</strong>:</p>
               <p class="bigmath">47 ÷ 100 = 0.47</p>
               <p>Two zeros → 2 places left. The digits 4 and 7 never change, only their places.</p>` },
      { title: "Powers of 10", say: "10 to the third power means 10 times 10 times 10, which is 1,000. The little exponent counts the zeros.",
        html: `<p>A <strong>power of 10</strong> is a shorthand:</p>
               <p class="bigmath">10³ = 10 × 10 × 10 = 1,000</p>
               <p>💡 The exponent counts the zeros: 10² = 100, 10³ = 1,000.</p>` },
    ],
    gen() {
      const kind = pick(["mult", "div", "power", "rule"]);
      if (kind === "mult") {
        let B = ri(105, 999); if (B % 10 === 0) B += 3;
        const p = pick([1, 2, 3]);
        return { q: `${g5dec(B, 2)} × ${[10, 100, 1000][p - 1].toLocaleString()} = ? `, viz: null, type: "num",
          answer: g5dec(B * 10 ** p, 2),
          explain: `${p} zero${p > 1 ? "s" : ""} → the decimal point moves ${p} place${p > 1 ? "s" : ""} right: ${g5dec(B, 2)} → ${g5dec(B * 10 ** p, 2)}.` };
      }
      if (kind === "div") {
        let n = ri(12, 98); if (n % 10 === 0) n += 3;
        const p = pick([1, 2, 3]);
        return { q: `${n} ÷ ${[10, 100, 1000][p - 1].toLocaleString()} = ?`, viz: null, type: "num",
          answer: g5dec(n, p),
          explain: `Dividing by ${[10, 100, 1000][p - 1].toLocaleString()} moves the decimal point ${p} place${p > 1 ? "s" : ""} left: ${n} → ${g5dec(n, p)}.` };
      }
      if (kind === "power") {
        const k = pick([2, 3, 4]);
        const val = 10 ** k;
        return { q: `What is 10<sup>${k}</sup> written out as a number?`, viz: null,
          ...mc(val.toLocaleString(), [(10 * k).toLocaleString(), (10 ** (k - 1)).toLocaleString(), (10 ** (k + 1)).toLocaleString()]),
          explain: `10<sup>${k}</sup> means ${Array(k).fill("10").join(" × ")} = ${val.toLocaleString()} — the exponent counts the zeros.` };
      }
      const mult = Math.random() < 0.5, p = pick([1, 2, 3]);
      const ans = `${p} place${p > 1 ? "s" : ""} to the ${mult ? "right" : "left"}`;
      const wrong1 = `${p} place${p > 1 ? "s" : ""} to the ${mult ? "left" : "right"}`;
      const q2 = p === 1 ? 2 : p - 1;
      return { q: `When you ${mult ? "multiply" : "divide"} a number by ${[10, 100, 1000][p - 1].toLocaleString()}, the decimal point moves…`, viz: null,
        ...mc(ans, [wrong1, `${q2} place${q2 > 1 ? "s" : ""} to the ${mult ? "right" : "left"}`, "nowhere"]),
        explain: `${mult ? "Multiplying" : "Dividing"} by a power of 10 moves the point one place per zero — ${ans}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.A.3
  "g5-decimals-read": {
    lesson: [
      { title: "Tenths, hundredths, thousandths", say: "After the decimal point come tenths, hundredths, and thousandths. 3.475 is 3 plus 4 tenths plus 7 hundredths plus 5 thousandths.",
        html: `<p>Places after the point: <strong>tenths, hundredths, thousandths</strong>.</p>
               <p class="bigmath">3.475 = 3 + 0.4 + 0.07 + 0.005</p>
               <p>That's the <strong>expanded form</strong> — every digit shows its value.</p>` },
      { title: "Word form", say: "Read the decimal point as 'and'. 3.45 is three and forty-five hundredths.",
        html: `<p>Read the point as "<strong>and</strong>", and name the last place:</p>
               <p class="bigmath">3.45 = "three and forty-five hundredths"</p>
               <p>2.6 = "two and six tenths" &nbsp;·&nbsp; 4.045 = "four and forty-five thousandths"</p>` },
      { title: "Comparing decimals", say: "Compare place by place from the left. 0.45 is greater than 0.405, because 5 hundredths beats 0 hundredths.",
        html: `<p>Compare <strong>place by place</strong>, left to right:</p>
               <p class="bigmath">0.450 > 0.405</p>
               <p>Same tenths (4), then hundredths: 5 beats 0. ⚠️ Longer does NOT mean bigger!</p>` },
    ],
    gen() {
      const kind = pick(["compare", "expanded", "wordform", "digit"]);
      if (kind === "compare") {
        const w = ri(0, 5);
        const sub = pick(["sneaky", "equal", "random"]);
        let sA, sB, sign, why;
        if (sub === "sneaky") {
          const t = ri(1, 9), h = ri(1, 9);
          const A = `${w}.${t}${h}`, B = `${w}.${t}0${h}`;
          if (Math.random() < 0.5) { sA = A; sB = B; sign = ">"; } else { sA = B; sB = A; sign = "<"; }
          why = `Line up the places: ${A}0 vs ${B}. Tenths tie (${t}), then hundredths: ${h} beats 0.`;
        } else if (sub === "equal") {
          const t = ri(1, 9), h = ri(1, 9);
          sA = `${w}.${t}${h}0`; sB = `${w}.${t}${h}`; sign = "=";
          why = `A zero at the very end adds nothing: ${sA} and ${sB} are the same value.`;
        } else {
          let A = ri(101, 999), B = ri(101, 999);
          while (B === A) B = ri(101, 999);
          sA = `${w}.${g5pad(A, 3)}`; sB = `${w}.${g5pad(B, 3)}`;
          sign = A > B ? ">" : "<";
          why = `Compare place by place from the left until the digits differ.`;
        }
        return { q: `Which sign makes this true? &nbsp;<strong>${sA} ⬜ ${sB}</strong>`, viz: null,
          ...mc(sign, ["<", ">", "="].filter((s) => s !== sign)),
          explain: `${why} So ${sA} ${sign} ${sB}.` };
      }
      if (kind === "expanded") {
        const w = ri(1, 9), t = ri(1, 9), h = ri(1, 9);
        const deep = Math.random() < 0.5, m = ri(1, 9);
        const parts = deep ? `${w} + ${g5dec(t, 1)} + ${g5dec(h, 2)} + ${g5dec(m, 3)}` : `${w} + ${g5dec(t, 1)} + ${g5dec(h, 2)}`;
        const ans = deep ? `${w}.${t}${h}${m}` : `${w}.${t}${h}`;
        return { q: `Write this as one decimal number: &nbsp;<strong>${parts}</strong>`, viz: null, type: "num", answer: ans,
          explain: `Each piece fills one place: ${ans}.` };
      }
      if (kind === "wordform") {
        const w = ri(1, 9);
        const form = pick(["tenths", "hundredths", "thousandths"]);
        if (form === "tenths") {
          const n = ri(1, 9);
          return { q: `Write as a decimal: "<strong>${G5_ONES[w]} and ${G5_ONES[n]} tenths</strong>"`, viz: null, type: "num",
            answer: `${w}.${n}`, explain: `"And" is the decimal point; ${G5_ONES[n]} tenths fills the tenths place: ${w}.${n}.` };
        }
        if (form === "hundredths") {
          const [n, word] = pick([[7, "seven"], [35, "thirty-five"], [18, "eighteen"], [72, "seventy-two"], [41, "forty-one"], [9, "nine"]]);
          return { q: `Write as a decimal: "<strong>${G5_ONES[w]} and ${word} hundredths</strong>"`, viz: null, type: "num",
            answer: `${w}.${g5pad(n, 2)}`, explain: `${word} hundredths is ${g5dec(n, 2)}, so the number is ${w}.${g5pad(n, 2)}.` };
        }
        const [n, word] = pick([[125, "one hundred twenty-five"], [304, "three hundred four"], [45, "forty-five"], [7, "seven"], [209, "two hundred nine"]]);
        return { q: `Write as a decimal: "<strong>${G5_ONES[w]} and ${word} thousandths</strong>"`, viz: null, type: "num",
          answer: `${w}.${g5pad(n, 3)}`, explain: `${word} thousandths needs three decimal places: ${w}.${g5pad(n, 3)}.` };
      }
      const w = ri(1, 9);
      const [a, b, c] = sampleN([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
      const place = pick(["tenths", "hundredths", "thousandths"]);
      const dg = place === "tenths" ? a : place === "hundredths" ? b : c;
      return { q: `In the number <strong>${w}.${a}${b}${c}</strong>, which digit is in the <strong>${place}</strong> place?`,
        viz: null, type: "num", answer: String(dg),
        explain: `After the point the places go tenths (${a}), hundredths (${b}), thousandths (${c}).` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.A.4
  "g5-rounding": {
    lesson: [
      { title: "The rounding rule", say: "Find the place you're rounding to, then look at the digit right after it. Five or more, round up. Four or less, keep it.",
        html: `<p>To round: find the place, then peek at the <strong>next digit</strong>.</p>
               <p>5 or more → round <strong>up</strong>. &nbsp;4 or less → <strong>keep</strong> it.</p>
               <p class="bigmath">3.276 → nearest tenth → 3.3</p>
               <p>The 7 after the tenths place says "round up": 3.2 becomes 3.3.</p>` },
      { title: "Nearest whole", say: "Rounding 7.49 to the nearest whole number: the tenths digit is 4, so keep the 7. The answer is 7.",
        html: `<p>Nearest <strong>whole number</strong> — peek at the tenths:</p>
               <p class="bigmath">7.49 → 7</p>
               <p>The tenths digit is 4 (less than 5), so everything after the 7 drops away.</p>` },
      { title: "Nearest hundredth", say: "Rounding 2.348 to the nearest hundredth: the 8 says round up, so 2.34 becomes 2.35.",
        html: `<p>Nearest <strong>hundredth</strong> — peek at the thousandths:</p>
               <p class="bigmath">2.348 → 2.35</p>
               <p>The 8 says round up: the 4 hundredths become 5 hundredths.</p>` },
    ],
    gen() {
      const kind = pick(["whole", "tenth", "hundredth", "which"]);
      if (kind === "whole") {
        const ans = ri(3, 89);
        const delta = Math.random() < 0.5 ? ri(-499, -1) : ri(1, 499);
        const orig = g5dec(ans * 1000 + delta, 3);
        return { q: `Round <strong>${orig}</strong> to the nearest whole number.`, viz: null, type: "num", answer: String(ans),
          explain: `${orig} is closer to ${ans} than to ${delta > 0 ? ans + 1 : ans - 1} — check the tenths digit.` };
      }
      if (kind === "tenth") {
        const w = ri(1, 9), t = ri(1, 9), ansT = w * 10 + t;
        const delta = Math.random() < 0.5 ? ri(-49, -1) : ri(1, 49);
        const orig = g5dec(ansT * 100 + delta, 3);
        return { q: `Round <strong>${orig}</strong> to the nearest tenth.`, viz: null, type: "num", answer: g5dec(ansT, 1),
          explain: `Look at the hundredths digit of ${orig}: it tells you to ${delta > 0 ? "keep the tenths digit" : "round the tenths digit up"}… landing on ${g5dec(ansT, 1)}.` };
      }
      if (kind === "hundredth") {
        const w = ri(1, 9);
        let hh = ri(11, 99); if (hh % 10 === 0) hh += 3;
        const ans100 = w * 100 + hh;
        const delta = Math.random() < 0.5 ? ri(-4, -1) : ri(1, 4);
        const orig = g5dec(ans100 * 10 + delta, 3);
        return { q: `Round <strong>${orig}</strong> to the nearest hundredth.`, viz: null, type: "num", answer: g5dec(ans100, 2),
          explain: `The thousandths digit is ${Math.abs(delta) <= 4 && delta > 0 ? delta : 10 + delta} — ${delta > 0 ? "4 or less keeps" : "5 or more bumps up"} the hundredths: ${g5dec(ans100, 2)}.` };
      }
      const w = ri(1, 9), t = ri(1, 8), wt = w * 10 + t;
      const target = g5dec(wt, 1);
      const correct = g5dec(wt * 10 - 3, 2);
      return { q: `Which number rounds to <strong>${target}</strong> when rounded to the nearest tenth?`, viz: null,
        ...mc(correct, [g5dec(wt * 10 + 6, 2), g5dec(wt * 10 - 6, 2), g5dec(wt * 10 + 16, 2)]),
        explain: `${correct} is within 5 hundredths of ${target}, so it rounds to ${target}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.B.5
  "g5-multiply": {
    lesson: [
      { title: "Break it apart", say: "Big multiplication is just small multiplications added up. 34 times 56 is 34 times 50 plus 34 times 6.",
        html: `<p>Split one factor by place value:</p>
               <p class="bigmath">34 × 56 = 34 × 50 + 34 × 6</p>
               <p>Two easy products instead of one hard one!</p>` },
      { title: "Add the partial products", say: "34 times 50 is 1,700. 34 times 6 is 204. Add them: 1,904.",
        html: `<p>Work out each <strong>partial product</strong>, then add:</p>
               <p class="bigmath">34 × 50 = 1,700<br>34 × 6 = 204<br>1,700 + 204 = <strong>1,904</strong></p>` },
      { title: "Three digits, same idea", say: "123 times 45: 123 times 40 is 4,920, and 123 times 5 is 615. Together that's 5,535.",
        html: `<p>It scales up to bigger numbers:</p>
               <p class="bigmath">123 × 45 = 123 × 40 + 123 × 5<br>= 4,920 + 615 = <strong>5,535</strong></p>` },
    ],
    gen() {
      const kind = pick(["2x2", "3x2", "tens", "word"]);
      if (kind === "2x2") {
        const a = ri(13, 89), b = ri(12, 89);
        const bt = Math.floor(b / 10) * 10, bo = b % 10;
        return { q: `${a} × ${b} = ?`, viz: null, type: "num", answer: String(a * b),
          explain: `Break it up: ${a} × ${bt} = ${a * bt} and ${a} × ${bo} = ${a * bo}; together ${a * b}.` };
      }
      if (kind === "3x2") {
        const a = ri(112, 489), b = ri(12, 39);
        const bt = Math.floor(b / 10) * 10, bo = b % 10;
        return { q: `${a} × ${b} = ?`, viz: null, type: "num", answer: String(a * b),
          explain: `${a} × ${bt} = ${a * bt}, plus ${a} × ${bo} = ${a * bo} → ${a * b}.` };
      }
      if (kind === "tens") {
        const a = ri(12, 95) * 10, b = ri(2, 9) * 10;
        return { q: `${a} × ${b} = ?`, viz: null, type: "num", answer: String(a * b),
          explain: `Multiply the front digits, then attach the zeros: ${a / 10} × ${b / 10} = ${(a / 10) * (b / 10)}, plus two zeros → ${a * b}.` };
      }
      const rows = ri(14, 38), seats = ri(22, 48);
      const place = pick(["theater", "stadium", "auditorium"]);
      return { q: `A ${place} has ${rows} rows with ${seats} seats in each row. How many seats in all?`,
        viz: null, type: "num", answer: String(rows * seats),
        explain: `Equal rows means multiply: ${rows} × ${seats} = ${rows * seats}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.B.6
  "g5-divide": {
    lesson: [
      { title: "Division undoes multiplication", say: "Division asks: how many groups fit? 96 divided by 8 asks 8 times what is 96. The answer is 12.",
        html: `<p>Division asks "<strong>how many groups fit?</strong>"</p>
               <p class="bigmath">96 ÷ 8 = ? &nbsp;→&nbsp; 8 × ? = 96 &nbsp;→&nbsp; 12</p>
               <p>Check by multiplying back: 8 × 12 = 96 ✔</p>` },
      { title: "Chunk it down", say: "For big numbers, peel off easy chunks. 2,460 divided by 6: 6 goes into 2,400 four hundred times, and into 60 ten times. 410 total.",
        html: `<p>Peel off friendly chunks:</p>
               <p class="bigmath">2,460 ÷ 6 → 2,400 ÷ 6 = 400, &nbsp;60 ÷ 6 = 10 → <strong>410</strong></p>` },
      { title: "Two-digit divisors & remainders", say: "144 divided by 12 is 12. And when things don't divide evenly, the leftover is the remainder: 50 divided by 8 is 6 remainder 2.",
        html: `<p>Two-digit divisors work the same way: 144 ÷ 12 = <strong>12</strong>.</p>
               <p>Leftovers are the <strong>remainder</strong>:</p>
               <p class="bigmath">50 ÷ 8 = 6 R 2 &nbsp;(8 × 6 = 48, and 2 left over)</p>` },
    ],
    gen() {
      const kind = pick(["by1", "by2", "remainder", "word"]);
      if (kind === "by1") {
        const d = ri(3, 9), q = ri(120, 950);
        return { q: `${d * q} ÷ ${d} = ?`, viz: null, type: "num", answer: String(q),
          explain: `Check with multiplication: ${d} × ${q} = ${d * q}.` };
      }
      if (kind === "by2") {
        const d = ri(12, 25), q = ri(15, 80);
        return { q: `${d * q} ÷ ${d} = ?`, viz: null, type: "num", answer: String(q),
          explain: `${d} × ${q} = ${d * q}, so the quotient is ${q}.` };
      }
      if (kind === "remainder") {
        const d = ri(4, 9), q = ri(25, 160), r = ri(1, d - 1);
        return { q: `What is the REMAINDER when ${d * q + r} is divided by ${d}?`, viz: null, type: "num", answer: String(r),
          explain: `${d} × ${q} = ${d * q}, and ${d * q + r} − ${d * q} = ${r} left over.` };
      }
      const d = ri(12, 24), q = ri(15, 60);
      const item = pick(["pencils", "marbles", "stickers", "trading cards"]);
      return { q: `A factory packs ${d * q} ${item} into boxes of ${d}. How many boxes does it fill?`,
        viz: null, type: "num", answer: String(q),
        explain: `Divide into equal groups: ${d * q} ÷ ${d} = ${q} boxes.` };
    },
  },

  // ----------------------------------------------------------------- 5.NBT.B.7
  "g5-decimal-ops": {
    lesson: [
      { title: "Line up the point", say: "To add or subtract decimals, line up the decimal points so each place matches. 2.45 plus 1.3 is 3.75.",
        html: `<p>Adding or subtracting? <strong>Line up the decimal points</strong> so tenths sit under tenths:</p>
               <p class="bigmath">2.45 + 1.30 = 3.75</p>
               <p>💡 Write 1.3 as 1.30 — a zero on the end changes nothing.</p>` },
      { title: "Money is decimals", say: "Money problems are decimal problems. Ten dollars minus seven twenty-five leaves two seventy-five.",
        html: `<p>Money = decimals with a $ in front:</p>
               <p class="bigmath">$10.00 − $7.25 = $2.75</p>` },
      { title: "Multiplying small decimals", say: "Three tenths times four tenths is twelve hundredths: 0.3 times 0.4 equals 0.12.",
        html: `<p>Tenths × tenths = <strong>hundredths</strong>:</p>
               <p class="bigmath">0.3 × 0.4 = 0.12</p>
               <p>Multiply 3 × 4 = 12, then count decimal places: one + one = two places.</p>` },
      { title: "Dividing decimals", say: "1.2 divided by 3: think of 12 tenths shared 3 ways. Each share is 4 tenths, or 0.4.",
        html: `<p>Think in tenths:</p>
               <p class="bigmath">1.2 ÷ 3 → 12 tenths ÷ 3 = 4 tenths = <strong>0.4</strong></p>` },
    ],
    gen() {
      const kind = pick(["moneyAdd", "moneyChange", "decAddSub", "mult", "div"]);
      const name = pick(KID_NAMES);
      if (kind === "moneyAdd") {
        let a = ri(150, 749), b = ri(125, 749);
        if ((a + b) % 100 === 0) b += 7;
        return { q: `${name} buys a snack for ${moneyStr(a)} and a drink for ${moneyStr(b)}. What is the total? (Type it like $4.50)`,
          viz: null, type: "num", answer: moneyStr(a + b),
          explain: `Line up the decimal points and add: ${moneyStr(a)} + ${moneyStr(b)} = ${moneyStr(a + b)}.` };
      }
      if (kind === "moneyChange") {
        const have = pick([1000, 1500, 2000]);
        let price = ri(225, have - 150);
        if ((have - price) % 100 === 0) price += 7;
        return { q: `${name} pays for a ${moneyStr(price)} toy with ${moneyStr(have)}. How much change? (Like $2.75)`,
          viz: null, type: "num", answer: moneyStr(have - price),
          explain: `Subtract: ${moneyStr(have)} − ${moneyStr(price)} = ${moneyStr(have - price)}.` };
      }
      if (kind === "decAddSub") {
        const add = Math.random() < 0.5;
        let a = ri(120, 880), b = ri(110, 850);
        if (!add && b > a) [a, b] = [b, a];
        if (!add && a === b) a += 25;
        const res = add ? a + b : a - b;
        return { q: `${g5dec(a, 2)} ${add ? "+" : "−"} ${g5dec(b, 2)} = ?`, viz: null, type: "num", answer: g5dec(res, 2),
          explain: `Line up the decimal points, then ${add ? "add" : "subtract"} place by place: ${g5dec(res, 2)}.` };
      }
      if (kind === "mult") {
        const a = ri(2, 9), b = ri(2, 9);
        return { q: `${g5dec(a, 1)} × ${g5dec(b, 1)} = ?`, viz: null, type: "num", answer: g5dec(a * b, 2),
          explain: `${a} × ${b} = ${a * b}, and tenths × tenths = hundredths, so ${g5dec(a * b, 2)}.` };
      }
      const d = ri(2, 9), qt = ri(2, 9);
      return { q: `${g5dec(d * qt, 1)} ÷ ${d} = ?`, viz: null, type: "num", answer: g5dec(qt, 1),
        explain: `Think tenths: ${d * qt} tenths ÷ ${d} = ${qt} tenths = ${g5dec(qt, 1)}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.A.1
  "g5-frac-add": {
    lesson: [
      { title: "Same-size pieces only", say: "You can't add halves and thirds directly — the pieces are different sizes. First rename them as same-size pieces.",
        html: `<p>1/2 + 1/3 — the pieces are <strong>different sizes</strong>, so we can't just add tops!</p>
               ${vizFractionBars(1, 2, 1, 3)}
               <p>First, rename both as the <strong>same-size pieces</strong>.</p>` },
      { title: "Find a common denominator", say: "Sixths work for both: one half is three sixths, one third is two sixths. Three sixths plus two sixths is five sixths.",
        html: `<p>Sixths fit both halves and thirds:</p>
               <p class="bigmath">1/2 = 3/6 &nbsp;&nbsp; 1/3 = 2/6 &nbsp;&nbsp;→&nbsp;&nbsp; 3/6 + 2/6 = <strong>5/6</strong></p>
               <p>💡 Multiplying the denominators (2 × 3 = 6) always gives a denominator that works.</p>` },
      { title: "Subtracting works the same", say: "Rename, then subtract. Three fourths minus one third: nine twelfths minus four twelfths is five twelfths.",
        html: `<p>Subtraction: rename first, then subtract tops:</p>
               <p class="bigmath">3/4 − 1/3 = 9/12 − 4/12 = <strong>5/12</strong></p>` },
      { title: "Mixed numbers", say: "For mixed numbers, add the wholes, then add the fractions. One and a half plus two and a third is three and five sixths.",
        html: `<p>Mixed numbers: wholes with wholes, fractions with fractions.</p>
               <p class="bigmath">1 1/2 + 2 1/3 = 3 + (3/6 + 2/6) = <strong>3 5/6</strong></p>` },
    ],
    gen() {
      const pairs = [[2, 3], [2, 5], [3, 4], [2, 8], [3, 5], [4, 6], [2, 6], [4, 5], [2, 4], [3, 6], [4, 8]];
      const kind = pick(["add", "sub", "mixed"]);
      if (kind === "add") {
        let [d1, d2] = pick(pairs);
        if (Math.random() < 0.5) [d1, d2] = [d2, d1];
        let n1 = ri(1, d1 - 1);
        let maxN2 = Math.ceil((d2 * (d1 - n1)) / d1) - 1;
        if (maxN2 < 1) { n1 = 1; maxN2 = Math.ceil((d2 * (d1 - 1)) / d1) - 1; }
        const n2 = ri(1, maxN2);
        const L = g5lcm(d1, d2), num = (n1 * L) / d1 + (n2 * L) / d2;
        return { q: `${n1}/${d1} + ${n2}/${d2} = ? &nbsp;(simplest form, like 5/6)`, viz: null, type: "num",
          answer: fracStr(num, L),
          explain: `Use ${L}ths: ${n1}/${d1} = ${(n1 * L) / d1}/${L} and ${n2}/${d2} = ${(n2 * L) / d2}/${L}. Add tops: ${num}/${L}${fracStr(num, L) !== `${num}/${L}` ? ` = ${fracStr(num, L)}` : ""}.` };
      }
      if (kind === "sub") {
        let [d1, d2] = pick(pairs);
        if (Math.random() < 0.5) [d1, d2] = [d2, d1];
        let n1 = ri(1, d1 - 1);
        if (n1 * d2 <= d1) n1 = d1 - 1;
        const L = g5lcm(d1, d2), num = (n1 * L) / d1 - L / d2;
        return { q: `${n1}/${d1} − 1/${d2} = ? &nbsp;(simplest form)`, viz: null, type: "num",
          answer: fracStr(num, L),
          explain: `Rename with ${L}ths: ${(n1 * L) / d1}/${L} − ${L / d2}/${L} = ${num}/${L}${fracStr(num, L) !== `${num}/${L}` ? ` = ${fracStr(num, L)}` : ""}.` };
      }
      const [d1, d2] = pick([[2, 3], [3, 4], [2, 5], [2, 4], [3, 6]]);
      const w1 = ri(1, 3), w2 = ri(1, 4);
      const cands = [];
      for (let n = 1; n < d2; n++) if (gcd(n, d2) === 1) cands.push(n);
      const n2 = pick(cands);
      const L = g5lcm(d1, d2);
      const total = (w1 + w2) * L + L / d1 + (n2 * L) / d2;
      return { q: `${w1} 1/${d1} + ${w2} ${n2}/${d2} = ? &nbsp;(as a mixed number, like 2 1/3)`, viz: null, type: "num",
        answer: mixedStr(total, L),
        explain: `Wholes: ${w1} + ${w2} = ${w1 + w2}. Fractions in ${L}ths: ${L / d1}/${L} + ${(n2 * L) / d2}/${L} = ${L / d1 + (n2 * L) / d2}/${L}. Together: ${mixedStr(total, L)}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.A.2
  "g5-frac-word": {
    lesson: [
      { title: "Fraction stories", say: "Fraction word problems work like whole-number ones: decide whether to add or subtract, then find a common denominator.",
        html: `<p>Read the story, pick + or −, then use a common denominator.</p>
               <p>Maya used 1/2 cup of flour and 1/4 cup of sugar. Together?</p>
               <p class="bigmath">1/2 + 1/4 = 2/4 + 1/4 = <strong>3/4</strong> cup</p>` },
      { title: "Taking part away", say: "Seven eighths of a pizza was left, and Sam ate one fourth of the pizza. Seven eighths minus two eighths leaves five eighths.",
        html: `<p>Take-away stories subtract:</p>
               <p class="bigmath">7/8 − 1/4 = 7/8 − 2/8 = <strong>5/8</strong></p>` },
      { title: "Estimate to catch mistakes", say: "Use benchmarks like one half and one. Seven eighths plus one half must be more than one — so an answer like two fifths is impossible!",
        html: `<p>🕵️ Estimate with benchmarks (0, 1/2, 1):</p>
               <p class="bigmath">7/8 + 1/2 ≈ 1 + 1/2 → about 1 1/2</p>
               <p>So if someone says 1/2 + 1/3 = 2/5… that's <em>smaller</em> than 1/2. Impossible!</p>` },
    ],
    gen() {
      const name = pick(KID_NAMES);
      const kind = pick(["addStory", "subStory", "estimate", "reasonable"]);
      if (kind === "addStory") {
        const [d1, d2] = pick([[2, 3], [2, 4], [2, 8], [3, 6], [4, 8], [2, 6], [3, 4]]);
        const maxN2 = Math.ceil((d2 * (d1 - 1)) / d1) - 1;
        const n2 = ri(1, Math.max(1, maxN2));
        const L = g5lcm(d1, d2), num = L / d1 + (n2 * L) / d2;
        const [ctx1, ctx2, unit] = pick([["walked", "jogged", "mile"], ["poured", "added", "cup of juice"], ["painted", "painted another", "wall"]]);
        return { q: `${name} ${ctx1} 1/${d1} ${unit} and then ${ctx2} ${n2}/${d2} ${unit}. How much in all? (simplest form, like 5/6)`,
          viz: null, type: "num", answer: fracStr(num, L),
          explain: `Common denominator ${L}: ${L / d1}/${L} + ${(n2 * L) / d2}/${L} = ${num}/${L}${fracStr(num, L) !== `${num}/${L}` ? ` = ${fracStr(num, L)}` : ""}.` };
      }
      if (kind === "subStory") {
        const [d1, d2] = pick([[8, 4], [8, 2], [6, 3], [6, 2], [10, 5], [4, 2], [12, 4], [12, 3]]);
        const n1 = ri(Math.floor(d1 / 2) + 1, d1 - 1);
        const num = n1 - d1 / d2;
        const food = pick(["pizza", "pie", "pan of brownies", "sandwich tray"]);
        return { q: `There was ${n1}/${d1} of a ${food} left. ${name} ate 1/${d2} of the whole ${food}. What fraction is left now? (simplest form)`,
          viz: vizFractionBar(n1, d1), type: "num", answer: fracStr(num, d1),
          explain: `1/${d2} = ${d1 / d2}/${d1}, so ${n1}/${d1} − ${d1 / d2}/${d1} = ${num}/${d1}${fracStr(num, d1) !== `${num}/${d1}` ? ` = ${fracStr(num, d1)}` : ""}.` };
      }
      if (kind === "estimate") {
        const cases = [
          ["7/8", "1/2", "1 1/2", "7/8 is almost 1, plus 1/2 lands near 1 1/2"],
          ["1/2", "5/8", "1", "both are close to 1/2, and 1/2 + 1/2 = 1"],
          ["9/10", "1/5", "1", "9/10 is almost 1 and 1/5 is small"],
          ["3/4", "2/3", "1 1/2", "both are close to 3/4, and 3/4 + 3/4 = 1 1/2"],
          ["1 1/8", "3/4", "2", "1 1/8 is a bit over 1, and 3/4 is close to 1"],
          ["1 1/4", "5/8", "2", "1 1/4 plus a bit more than 1/2 lands near 2"],
        ];
        const [f1, f2, ans, why] = pick(cases);
        return { q: `ESTIMATE — don't compute exactly: ${f1} + ${f2} is closest to…`, viz: null,
          ...mc(ans, ["1", "1 1/2", "2"].filter((c) => c !== ans)),
          explain: `Use benchmarks: ${why}.` };
      }
      const cases = [
        ["1/2 + 1/3 = 2/5", "1/2", "5/6"],
        ["5/8 + 1/4 = 6/12", "5/8", "7/8"],
        ["2/3 + 1/4 = 3/7", "2/3", "11/12"],
      ];
      const [eq, big, real] = pick(cases);
      return { q: `${name} says: "${eq}". Is that reasonable?`, viz: null,
        ...mc(`No — the answer is smaller than ${big}, but a sum must be bigger`,
          ["Yes, it looks right", "No — the answer should be exactly 1"]),
        explain: `Adding a positive fraction makes the total grow, so it must be MORE than ${big}. The real sum is ${real}. (Never add tops and bottoms!)` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.B.3
  "g5-frac-division": {
    lesson: [
      { title: "A fraction IS division", say: "The fraction bar means divide. Three fourths is the same as 3 divided by 4.",
        html: `<p>The fraction bar is a <strong>division sign in disguise</strong>:</p>
               <p class="bigmath">3/4 = 3 ÷ 4</p>` },
      { title: "Sharing things equally", say: "Four kids share 3 sandwiches equally. Each kid gets 3 fourths of a sandwich — that's 3 divided by 4.",
        html: `<p>4 kids share <strong>3 sandwiches</strong> equally:</p>
               ${vizFractionCircle(3, 4)}
               <p class="bigmath">3 ÷ 4 = 3/4 of a sandwich each</p>
               <p>Each sandwich is cut into 4 parts; each kid takes one part of each.</p>` },
      { title: "More than one each", say: "Three kids share 7 brownies. 7 divided by 3 is seven thirds, which is 2 and one third each.",
        html: `<p>If there's more than enough to go around, the answer is a mixed number:</p>
               <p class="bigmath">7 ÷ 3 = 7/3 = <strong>2 1/3</strong> each</p>` },
    ],
    gen() {
      const name = pick(KID_NAMES);
      const kind = pick(["meaning", "shareProper", "shareMixed", "asFraction"]);
      if (kind === "meaning") {
        const d = ri(3, 9); let n = ri(2, 9);
        while (n === d) n = ri(2, 9);
        return { q: `The fraction ${n}/${d} means the same as which division?`, viz: null,
          ...mc(`${n} ÷ ${d}`, [`${d} ÷ ${n}`, `${n} × ${d}`, `${n} − ${d}`]),
          explain: `The fraction bar means divide: ${n}/${d} = ${n} ÷ ${d}.` };
      }
      if (kind === "shareProper") {
        const d = ri(3, 8), n = ri(2, d - 1);
        const item = pick(["sandwiches", "pizzas", "pancakes", "fruit bars"]);
        return { q: `${d} friends equally share ${n} ${item}. What fraction of a ${item.slice(0, -1)} does each friend get? (simplest form, like 3/4)`,
          viz: null, type: "num", answer: fracStr(n, d),
          explain: `Sharing is dividing: ${n} ÷ ${d} = ${n}/${d}${fracStr(n, d) !== `${n}/${d}` ? ` = ${fracStr(n, d)}` : ""}.` };
      }
      if (kind === "shareMixed") {
        const d = pick([2, 3, 4]), k = ri(1, 3), r = ri(1, d - 1), n = k * d + r;
        const item = pick(["brownies", "granola bars", "waffles"]);
        return { q: `${d} kids equally share ${n} ${item}. How many does EACH kid get? (as a mixed number, like 2 1/3)`,
          viz: null, type: "num", answer: mixedStr(n, d),
          explain: `${n} ÷ ${d} = ${n}/${d}. That's ${k} whole ones each with ${r} left to split: ${mixedStr(n, d)}.` };
      }
      const d = ri(3, 10), n = ri(2, d - 1);
      return { q: `Write ${n} ÷ ${d} as a fraction in simplest form.`, viz: null, type: "num", answer: fracStr(n, d),
        explain: `${n} ÷ ${d} = ${n}/${d}${fracStr(n, d) !== `${n}/${d}` ? `, which simplifies to ${fracStr(n, d)}` : ""}.` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.B.4
  "g5-frac-mult": {
    lesson: [
      { title: "Tops times tops, bottoms times bottoms", say: "To multiply fractions, multiply the numerators and multiply the denominators. Two thirds times four fifths is eight fifteenths.",
        html: `<p>Multiply <strong>across</strong>:</p>
               <p class="bigmath">2/3 × 4/5 = (2×4)/(3×5) = <strong>8/15</strong></p>` },
      { title: "'Of' means times", say: "One half OF three fourths means one half times three fourths, which is three eighths.",
        html: `<p>"<strong>of</strong>" is multiplication in disguise:</p>
               <p class="bigmath">1/2 of 3/4 = 1/2 × 3/4 = <strong>3/8</strong></p>
               ${vizFractionBar(3, 8, "#b45309")}` },
      { title: "Fraction of a whole number", say: "Three fourths of 12: split 12 into 4 groups of 3, then take 3 groups. That's 9.",
        html: `<p>Fraction × whole number:</p>
               <p class="bigmath">3/4 × 12 = (3 × 12)/4 = 36/4 = <strong>9</strong></p>
               <p>Or: 12 ÷ 4 = 3 per group, × 3 groups = 9.</p>` },
      { title: "Tiny rectangles", say: "A rectangle one half unit by one third unit has area one sixth of a square unit — multiply the side lengths.",
        html: `<p>Area still works: <strong>length × width</strong>.</p>
               ${vizAreaGrid(3, 2, { wLabel: "1/3", hLabel: "1/2" })}
               <p class="bigmath">1/2 × 1/3 = <strong>1/6</strong> of a square unit</p>` },
    ],
    gen() {
      const kind = pick(["fxf", "fOfWhole", "area", "wholeXf"]);
      if (kind === "fxf") {
        const d1 = pick([2, 3, 4, 5]), d2 = pick([2, 3, 4, 5]);
        const n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
        return { q: `${n1}/${d1} × ${n2}/${d2} = ? &nbsp;(simplest form, like 3/8)`, viz: null, type: "num",
          answer: fracStr(n1 * n2, d1 * d2),
          explain: `Multiply across: (${n1}×${n2})/(${d1}×${d2}) = ${n1 * n2}/${d1 * d2}${fracStr(n1 * n2, d1 * d2) !== `${n1 * n2}/${d1 * d2}` ? ` = ${fracStr(n1 * n2, d1 * d2)}` : ""}.` };
      }
      if (kind === "fOfWhole") {
        const d = pick([2, 3, 4, 5, 6, 8]), n = ri(1, d - 1), whole = d * ri(2, 6);
        return { q: `What is ${n}/${d} of ${whole}?`, viz: vizFractionBar(n, d), type: "num",
          answer: String((n * whole) / d),
          explain: `${whole} ÷ ${d} = ${whole / d} per part; ${n} parts make ${n} × ${whole / d} = ${(n * whole) / d}.` };
      }
      if (kind === "area") {
        const a = pick([2, 3, 4]), b = pick([2, 3, 5]);
        return { q: `A sticker is 1/${a} inch tall and 1/${b} inch wide. What is its area, as a fraction of a square inch? (like 1/6)`,
          viz: vizAreaGrid(b, a, { wLabel: `1/${b} in`, hLabel: `1/${a} in` }), type: "num",
          answer: fracStr(1, a * b),
          explain: `Area = length × width = 1/${a} × 1/${b} = 1/${a * b} square inch.` };
      }
      const d = pick([3, 4, 5]);
      let w = ri(2, 5);
      while (w % d === 0) w = ri(2, 5);
      const cands = [];
      for (let n = 1; n < d; n++) if (gcd(n, d) === 1) cands.push(n);
      const n = pick(cands);
      return { q: `${w} × ${n}/${d} = ? &nbsp;(as a fraction, like 8/3)`, viz: null, type: "num",
        answer: fracStr(w * n, d),
        explain: `${w} × ${n}/${d} = ${w * n}/${d} — multiply the top by the whole number.` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.B.5
  "g5-frac-scaling": {
    lesson: [
      { title: "Multiplying can shrink!", say: "Multiplying doesn't always make things bigger. One half times 8 is 4 — smaller than 8!",
        html: `<p>Surprise: multiplying can make numbers <strong>smaller</strong>.</p>
               <p class="bigmath">1/2 × 8 = 4</p>
               <p>Taking half OF something shrinks it.</p>` },
      { title: "The size of the multiplier decides", say: "A fraction greater than 1 grows the number. Less than 1 shrinks it. Equal to 1 keeps it the same.",
        html: `<p>Look at the multiplying fraction:</p>
               <p class="bigmath">3/2 × 8 = 12 &nbsp;(grows — 3/2 &gt; 1)<br>1/2 × 8 = 4 &nbsp;(shrinks — 1/2 &lt; 1)<br>4/4 × 8 = 8 &nbsp;(same — 4/4 = 1)</p>` },
      { title: "Predict without computing", say: "Compare the fraction to 1 and you can predict the answer's size without doing any multiplication.",
        html: `<p>🕵️ Is 7/8 × 24 bigger or smaller than 24?</p>
               <p>7/8 &lt; 1, so the product is <strong>smaller than 24</strong> — no computing needed!</p>` },
    ],
    gen() {
      const N = ri(6, 24);
      const kind = pick(["predict", "whichGreater", "concept", "equalOne", "whichFraction"]);
      if (kind === "predict") {
        const dir = pick(["less", "greater", "equal"]);
        const f = dir === "less" ? pick(["1/2", "2/3", "3/4", "4/5", "5/8"])
          : dir === "greater" ? pick(["3/2", "5/4", "5/3", "7/4", "9/8"])
          : pick(["2/2", "3/3", "4/4", "5/5"]);
        const ans = dir === "less" ? `less than ${N}` : dir === "greater" ? `greater than ${N}` : `equal to ${N}`;
        return { q: `WITHOUT multiplying: ${f} × ${N} is…`, viz: null,
          ...mc(ans, [`less than ${N}`, `greater than ${N}`, `equal to ${N}`].filter((c) => c !== ans)),
          explain: `${f} is ${dir === "less" ? "less than 1, so the product shrinks" : dir === "greater" ? "greater than 1, so the product grows" : "exactly 1, so the product stays the same"}.` };
      }
      if (kind === "whichGreater") {
        const d = pick([3, 4, 5]);
        const big = `${d + ri(1, 2)}/${d}`, small = `${ri(1, d - 1)}/${d}`;
        return { q: `WITHOUT computing: which product is greater — <strong>${big} × ${N}</strong> or <strong>${small} × ${N}</strong>?`, viz: null,
          ...mc(`${big} × ${N}`, [`${small} × ${N}`, "they are equal"]),
          explain: `${big} > 1 (it grows ${N}) while ${small} < 1 (it shrinks ${N}).` };
      }
      if (kind === "concept") {
        const less = Math.random() < 0.5;
        return { q: `Multiplying a number by a fraction ${less ? "LESS" : "GREATER"} than 1 gives a product that is…`, viz: null,
          ...mc(`${less ? "smaller" : "bigger"} than the number`, [`${less ? "bigger" : "smaller"} than the number`, "equal to the number"]),
          explain: `Multiplying by ${less ? "less than 1 takes only part of the number" : "more than 1 gives more than one whole copy"}.` };
      }
      if (kind === "equalOne") {
        const d = ri(2, 9);
        return { q: `WITHOUT multiplying: ${d}/${d} × ${N} is…`, viz: null,
          ...mc(`equal to ${N}`, [`greater than ${N}`, `less than ${N}`]),
          explain: `${d}/${d} = 1, and multiplying by 1 changes nothing.` };
      }
      return { q: `${pick(KID_NAMES)} multiplied ${N} by a fraction and got an answer BIGGER than ${N}. Which fraction could it have been?`, viz: null,
        ...mc(pick(["5/3", "3/2", "7/4"]), ["2/3", "1/2", "4/4"]),
        explain: `Only a fraction greater than 1 makes the product grow.` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.B.6
  "g5-frac-mult-word": {
    lesson: [
      { title: "Recipes", say: "A recipe needs three fourths cup of flour, and you make half the recipe. Half of three fourths is three eighths of a cup.",
        html: `<p>Making <strong>1/2 of a recipe</strong> that needs 3/4 cup of flour:</p>
               <p class="bigmath">1/2 × 3/4 = <strong>3/8</strong> cup</p>` },
      { title: "Distances", say: "A trail is 8 miles and Leo hiked three fourths of it. Three fourths of 8 is 6 miles.",
        html: `<p>A trail is 8 miles. Leo hiked <strong>3/4 of it</strong>:</p>
               <p class="bigmath">3/4 × 8 = 24/4 = <strong>6</strong> miles</p>` },
      { title: "Mixed numbers in stories", say: "Four bags that each weigh one and a half pounds: 4 times one and a half is 6 pounds.",
        html: `<p>Mixed numbers multiply too:</p>
               <p class="bigmath">4 × 1 1/2 = 4 + 4 × 1/2 = 4 + 2 = <strong>6</strong> pounds</p>` },
    ],
    gen() {
      const name = pick(KID_NAMES);
      const kind = pick(["recipe", "distance", "group", "mixed", "fracOfFrac"]);
      if (kind === "recipe") {
        const [n, d] = pick([[3, 4], [2, 3], [1, 2], [3, 8], [1, 3]]);
        const half = pick([[1, 2], [1, 3], [1, 4]]);
        const ing = pick(["flour", "sugar", "milk", "oats"]);
        return { q: `A recipe needs ${n}/${d} cup of ${ing}. ${name} makes ${half[0]}/${half[1]} of the recipe. How much ${ing} is needed? (simplest form, like 3/8)`,
          viz: null, type: "num", answer: fracStr(n * half[0], d * half[1]),
          explain: `${half[0]}/${half[1]} of ${n}/${d} = ${half[0]}/${half[1]} × ${n}/${d} = ${n * half[0]}/${d * half[1]}${fracStr(n * half[0], d * half[1]) !== `${n * half[0]}/${d * half[1]}` ? ` = ${fracStr(n * half[0], d * half[1])}` : ""}.` };
      }
      if (kind === "distance") {
        const d = pick([2, 3, 4, 5]), n = ri(1, d - 1), whole = d * ri(2, 5);
        return { q: `A bike trail is ${whole} miles long. ${name} rode ${n}/${d} of it. How many miles did ${name} ride?`,
          viz: vizFractionBar(n, d), type: "num", answer: String((n * whole) / d),
          explain: `${n}/${d} × ${whole} = ${n * whole}/${d} = ${(n * whole) / d} miles.` };
      }
      if (kind === "group") {
        const d = pick([2, 3, 4, 6]), n = ri(1, d - 1), total = d * ri(3, 6);
        const who = pick(["students", "books", "marbles", "stickers"]);
        return { q: `${n}/${d} of the ${total} ${who} in a classroom are new. How many are new?`,
          viz: null, type: "num", answer: String((n * total) / d),
          explain: `${total} ÷ ${d} = ${total / d} per part; ${n} parts = ${(n * total) / d}.` };
      }
      if (kind === "mixed") {
        const bags = pick([2, 4, 6]);
        const w = ri(1, 3);
        const lb = bags * w + (bags / 2);
        return { q: `${name} buys ${bags} bags of apples. Each bag weighs ${w} 1/2 pounds. What is the total weight in pounds?`,
          viz: null, type: "num", answer: String(lb),
          explain: `${bags} × ${w} = ${bags * w} pounds, plus ${bags} × 1/2 = ${bags / 2} pounds → ${lb} pounds.` };
      }
      const a = pick([2, 3]), b = pick([2, 3, 4]);
      return { q: `1/${a} of a garden is planted with flowers, and 1/${b} of the flower section is roses. What fraction of the WHOLE garden is roses? (like 1/6)`,
        viz: null, type: "num", answer: fracStr(1, a * b),
        explain: `1/${b} of 1/${a} = 1/${b} × 1/${a} = 1/${a * b} of the garden.` };
    },
  },

  // ----------------------------------------------------------------- 5.NF.B.7
  "g5-frac-div-unit": {
    lesson: [
      { title: "Splitting a piece", say: "Half a pan of brownies shared by 3 friends: each gets one sixth of the whole pan. One half divided by 3 is one sixth.",
        html: `<p>Share <strong>1/2</strong> of a pan among <strong>3</strong> friends:</p>
               ${vizFractionBar(1, 2)}
               <p class="bigmath">1/2 ÷ 3 = <strong>1/6</strong></p>
               <p>The half gets cut into 3 slivers — each is 1/6 of the whole pan.</p>` },
      { title: "How many pieces fit?", say: "4 divided by one half asks: how many halves are in 4? Every whole has 2 halves, so the answer is 8.",
        html: `<p><strong>4 ÷ 1/2</strong> asks: how many halves fit in 4?</p>
               <p class="bigmath">4 ÷ 1/2 = 8</p>
               <p>Each whole holds 2 halves; 4 wholes hold 8.</p>` },
      { title: "Check with multiplication", say: "Division and multiplication undo each other. 8 times one half is 4, so 4 divided by one half really is 8.",
        html: `<p>Always check by multiplying back:</p>
               <p class="bigmath">8 × 1/2 = 4 ✔ &nbsp;&nbsp; 1/6 × 3 = 1/2 ✔</p>` },
    ],
    gen() {
      const name = pick(KID_NAMES);
      const kind = pick(["unitDivWhole", "wholeDivUnit", "shareStory", "servings"]);
      if (kind === "unitDivWhole") {
        const b = pick([2, 3, 4, 5]), q = ri(2, 6);
        return { q: `1/${b} ÷ ${q} = ? &nbsp;(simplest form, like 1/8)`, viz: null, type: "num",
          answer: fracStr(1, b * q),
          explain: `Cutting 1/${b} into ${q} equal parts makes pieces of 1/${b * q}. Check: 1/${b * q} × ${q} = 1/${b}. ✔` };
      }
      if (kind === "wholeDivUnit") {
        const b = pick([2, 3, 4, 5]), q = ri(2, 6);
        return { q: `${q} ÷ 1/${b} = ?`, viz: null, type: "num", answer: String(q * b),
          explain: `Each whole holds ${b} pieces of size 1/${b}; ${q} wholes hold ${q} × ${b} = ${q * b}.` };
      }
      if (kind === "shareStory") {
        const b = pick([2, 3, 4]), q = ri(2, 4);
        const food = pick(["pan of brownies", "chocolate bar", "bag of trail mix"]);
        return { q: `${name} has 1/${b} of a ${food} and shares it equally among ${q} friends. What fraction of the WHOLE ${food} does each friend get? (like 1/6)`,
          viz: vizFractionBar(1, b), type: "num", answer: fracStr(1, b * q),
          explain: `1/${b} ÷ ${q} = 1/${b * q} — the piece is split ${q} ways.` };
      }
      const b = pick([2, 3, 4]), c = ri(2, 6);
      const stuff = pick(["yogurt", "rice", "lemonade", "trail mix"]);
      return { q: `How many 1/${b}-cup servings are in ${c} cups of ${stuff}?`, viz: null, type: "num",
        answer: String(c * b),
        explain: `${c} ÷ 1/${b}: each cup gives ${b} servings, so ${c} × ${b} = ${c * b} servings.` };
    },
  },

  // ----------------------------------------------------------------- 5.M.A.1
  "g5-convert": {
    lesson: [
      { title: "Big units to small units: multiply", say: "Going from a big unit to a small one, multiply. 3 meters is 300 centimeters.",
        html: `<p>Big → small unit: <strong>multiply</strong>.</p>
               <p class="bigmath">3 m = 3 × 100 = 300 cm</p>
               <p>1 m = 100 cm &nbsp;·&nbsp; 1 km = 1,000 m &nbsp;·&nbsp; 1 kg = 1,000 g &nbsp;·&nbsp; 1 L = 1,000 mL</p>` },
      { title: "Small units to big units: divide", say: "Going from a small unit to a big one, divide. 4,000 grams is 4 kilograms.",
        html: `<p>Small → big unit: <strong>divide</strong>.</p>
               <p class="bigmath">4,000 g = 4,000 ÷ 1,000 = 4 kg</p>` },
      { title: "Customary units & time", say: "One foot is 12 inches, one yard is 3 feet, one pound is 16 ounces, one hour is 60 minutes. A 2 hour 15 minute movie is 135 minutes.",
        html: `<p>Customary units to remember:</p>
               <p>1 ft = 12 in &nbsp;·&nbsp; 1 yd = 3 ft &nbsp;·&nbsp; 1 lb = 16 oz &nbsp;·&nbsp; 1 hr = 60 min</p>
               <p class="bigmath">2 hr 15 min = 120 + 15 = <strong>135 min</strong></p>` },
    ],
    gen() {
      const name = pick(KID_NAMES);
      const kind = pick(["metricDown", "metricUp", "customary", "time", "leftover"]);
      if (kind === "metricDown") {
        const [big, small, f] = pick([["meters", "centimeters", 100], ["kilometers", "meters", 1000], ["kilograms", "grams", 1000], ["liters", "milliliters", 1000]]);
        const n2 = ri(4, 18);
        const val = n2 % 2 ? `${(n2 - 1) / 2}.5` : String(n2 / 2);
        const ans = (n2 * f) / 2;
        const obj = pick(["rope", "trail", "bag of flour", "water jug"]);
        return { q: `${name}'s ${obj} measures ${val} ${big}. How many ${small} is that? (Just the number)`,
          viz: null, type: "num", answer: String(ans),
          explain: `1 ${big.slice(0, -1)} = ${f.toLocaleString()} ${small}, so multiply: ${val} × ${f.toLocaleString()} = ${ans.toLocaleString()}.` };
      }
      if (kind === "metricUp") {
        const [small, big, f] = pick([["grams", "kilograms", 1000], ["milliliters", "liters", 1000], ["centimeters", "meters", 100], ["meters", "kilometers", 1000]]);
        const k = ri(2, 9);
        return { q: `A package is labeled ${(k * f).toLocaleString()} ${small}. How many ${big} is that? (Just the number)`,
          viz: null, type: "num", answer: String(k),
          explain: `${f.toLocaleString()} ${small} make 1 ${big.slice(0, -1)}, so divide: ${(k * f).toLocaleString()} ÷ ${f.toLocaleString()} = ${k}.` };
      }
      if (kind === "customary") {
        const [big, small, f] = pick([["feet", "inches", 12], ["yards", "feet", 3], ["pounds", "ounces", 16], ["hours", "minutes", 60]]);
        const k = ri(2, 9);
        return { q: `${name} needs ${k} ${big} of ribbon — but the store measures in ${small}. How many ${small} is ${k} ${big}? (1 ${big.slice(0, -1)} = ${f} ${small})`,
          viz: null, type: "num", answer: String(k * f),
          explain: `Multiply: ${k} × ${f} = ${k * f} ${small}.` };
      }
      if (kind === "time") {
        const h = ri(1, 3), m = pick([10, 15, 20, 30, 40, 45]);
        return { q: `A movie lasts ${h} hour${h > 1 ? "s" : ""} ${m} minutes. How many minutes is that in all?`,
          viz: null, type: "num", answer: String(h * 60 + m),
          explain: `${h} × 60 = ${h * 60} minutes, plus ${m} more = ${h * 60 + m}.` };
      }
      const L = ri(1, 3), out = pick([250, 400, 500, 750].filter((v) => v < L * 1000));
      return { q: `A jug holds ${L} liter${L > 1 ? "s" : ""} of juice. ${name} pours out ${out} milliliters. How many milliliters are LEFT?`,
        viz: null, type: "num", answer: String(L * 1000 - out),
        explain: `${L} L = ${(L * 1000).toLocaleString()} mL; ${(L * 1000).toLocaleString()} − ${out} = ${L * 1000 - out}.` };
    },
  },

  // ----------------------------------------------------------------- 5.M.B.2-3
  "g5-volume": {
    lesson: [
      { title: "Volume is the space inside", say: "Volume measures how much space a solid shape takes up. We fill the shape with unit cubes and count them.",
        html: `<p><strong>Volume</strong> = how much space a solid takes up.</p>
               ${vizCubes(3, 2, 2)}
               <p>Fill it with <strong>unit cubes</strong> — no gaps, no overlaps — and count. This box holds 12 cubes.</p>` },
      { title: "Count by layers", say: "Don't count cubes one by one. Count one layer, then multiply by the number of layers. A 3 by 2 layer has 6 cubes; 2 layers make 12.",
        html: `<p>Count one <strong>layer</strong>, then multiply:</p>
               <p class="bigmath">layer = 3 × 2 = 6 cubes, &nbsp;2 layers → 6 × 2 = <strong>12</strong></p>` },
      { title: "Cubic units", say: "Volume is measured in cubic units, like cubic centimeters or cubic inches — little cubes, not flat squares.",
        html: `<p>Volume is measured in <strong>cubic units</strong>: cm³, in³, ft³…</p>
               <p>📏 length → units &nbsp;·&nbsp; ⬛ area → square units &nbsp;·&nbsp; 🧊 volume → <strong>cubic units</strong></p>` },
    ],
    gen() {
      const kind = pick(["count", "layers", "conceptUnit", "unitChoice"]);
      if (kind === "count") {
        const l = ri(2, 5), w = ri(2, 4), h = ri(2, 4);
        return { q: `This box is built from unit cubes. What is its volume, in cubic units? (Just the number)`,
          viz: vizCubes(l, w, h), type: "num", answer: String(l * w * h),
          explain: `Each layer has ${l} × ${w} = ${l * w} cubes, and there are ${h} layers: ${l * w} × ${h} = ${l * w * h}.` };
      }
      if (kind === "layers") {
        const l = ri(2, 6), w = ri(2, 4), h = ri(2, 5);
        return { q: `Each layer of a box holds ${l} × ${w} = ${l * w} unit cubes, and the box is ${h} layers tall. What is its volume in cubic units?`,
          viz: vizCubes(Math.min(l, 5), Math.min(w, 4), Math.min(h, 4)), type: "num", answer: String(l * w * h),
          explain: `${l * w} cubes per layer × ${h} layers = ${l * w * h} cubic units.` };
      }
      if (kind === "conceptUnit") {
        return { q: `Volume measures the space inside a solid figure. What kind of units measure volume?`, viz: null,
          ...mc("cubic units", ["square units", "flat units", "long units"]),
          explain: `Volume is filled with little cubes, so we count CUBIC units.` };
      }
      const obj = pick([["cereal box", "centimeters"], ["moving box", "inches"], ["toy chest", "inches"]]);
      return { q: `Which unit makes sense for the VOLUME of a ${obj[0]}?`, viz: null,
        ...mc(`cubic ${obj[1]}`, [obj[1], `square ${obj[1]}`, "degrees"]),
        explain: `Volume always uses cubic units — plain ${obj[1]} measure length, square ${obj[1]} measure area.` };
    },
  },

  // ----------------------------------------------------------------- 5.M.B.4
  "g5-volume-formula": {
    lesson: [
      { title: "The volume formula", say: "Instead of counting cubes, multiply: volume equals length times width times height. 4 times 3 times 2 is 24.",
        html: `<p>Skip the counting — use the formula:</p>
               <p class="bigmath">V = l × w × h</p>
               ${vizCubes(4, 3, 2)}
               <p class="bigmath">V = 4 × 3 × 2 = <strong>24</strong> cubic units</p>` },
      { title: "Finding a missing side", say: "If you know the volume and two sides, divide to find the third. Volume 60, base 5 by 4: 60 divided by 20 is 3.",
        html: `<p>Know V but missing a side? <strong>Divide</strong>:</p>
               <p class="bigmath">V = 60, l = 5, w = 4 → h = 60 ÷ (5 × 4) = <strong>3</strong></p>` },
      { title: "Two boxes stuck together", say: "An L-shaped figure is just two boxes. Find each volume, then add them.",
        html: `<p>Weird solid? Split it into <strong>two boxes</strong> and add:</p>
               <p class="bigmath">V = (3 × 2 × 2) + (4 × 2 × 1) = 12 + 8 = <strong>20</strong></p>` },
    ],
    gen() {
      const kind = pick(["compute", "missing", "additive", "word"]);
      if (kind === "compute") {
        const l = ri(3, 9), w = ri(2, 8), h = ri(2, 8);
        return { q: `A box is ${l} units long, ${w} units wide, and ${h} units tall. What is its volume in cubic units?`,
          viz: null, type: "num", answer: String(l * w * h),
          explain: `V = l × w × h = ${l} × ${w} × ${h} = ${l * w * h}.` };
      }
      if (kind === "missing") {
        const l = ri(3, 8), w = ri(2, 6), h = ri(2, 9), V = l * w * h;
        return { q: `A box has volume ${V} cubic feet. Its base is ${l} feet by ${w} feet. How tall is it, in feet?`,
          viz: null, type: "num", answer: String(h),
          explain: `Base area = ${l} × ${w} = ${l * w}; height = ${V} ÷ ${l * w} = ${h}.` };
      }
      if (kind === "additive") {
        const l1 = ri(2, 5), w1 = ri(2, 4), h1 = ri(2, 4);
        const l2 = ri(2, 6), w2 = ri(2, 4), h2 = ri(2, 4);
        const v1 = l1 * w1 * h1, v2 = l2 * w2 * h2;
        return { q: `An L-shaped figure is made of two boxes: one is ${l1} × ${w1} × ${h1} and the other is ${l2} × ${w2} × ${h2}. What is the TOTAL volume in cubic units?`,
          viz: null, type: "num", answer: String(v1 + v2),
          explain: `Box 1: ${v1}. Box 2: ${v2}. Add: ${v1} + ${v2} = ${v1 + v2}.` };
      }
      const l = ri(3, 6), w = ri(2, 5), h = ri(2, 4);
      const [obj, unit] = pick([["toy chest", "feet"], ["aquarium", "inches"], ["storage bin", "inches"], ["planter box", "feet"]]);
      return { q: `${obj[0] === "a" ? "An" : "A"} ${obj} measures ${l} ${unit} by ${w} ${unit} by ${h} ${unit}. How many cubic ${unit} does it hold?`,
        viz: vizCubes(l, w, h), type: "num", answer: String(l * w * h),
        explain: `V = ${l} × ${w} × ${h} = ${l * w * h} cubic ${unit}.` };
    },
  },

  // ----------------------------------------------------------------- 5.DL.A.1-4 (NJ)
  "g5-data-viz": {
    lesson: [
      { title: "Reading a bar graph", say: "A bar graph compares amounts. The height of each bar tells the value — read it off the scale on the left.",
        html: `<p>Each bar's <strong>height</strong> is its value — check the scale:</p>
               ${vizBarChart([{ label: "Maya", value: 8 }, { label: "Leo", value: 5 }, { label: "Ivy", value: 11 }])}
               <p>Maya read 8 books, Leo 5, Ivy 11.</p>` },
      { title: "Comparing and combining", say: "Graphs answer comparison questions. Ivy read 11 minus 5, that is 6 more books than Leo, and the three together read 24.",
        html: `<p>Use the values to compare and combine:</p>
               <p class="bigmath">11 − 5 = 6 more &nbsp;·&nbsp; 8 + 5 + 11 = 24 total</p>` },
      { title: "What a graph can't tell you", say: "A graph only knows what it shows. This one can't say WHY Ivy read the most, or which book was her favorite.",
        html: `<p>🕵️ A graph only answers questions about <strong>its own data</strong>.</p>
               <p>It can say <em>who read most</em> — it can NOT say <em>why</em>, or <em>which book they liked best</em>.</p>` },
    ],
    gen() {
      const kids = sampleN(KID_NAMES, 4);
      const [theme, noun, emoji] = pick([["books read in March", "books", "📕"], ["goals scored this season", "goals", "⚽"], ["laps swum at practice", "laps", "🐠"], ["cans collected for recycling", "cans", "⭐"]]);
      const vals = sampleN([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 4);
      const viz = vizBarChart(kids.map((k, i) => ({ label: k, value: vals[i] })));
      const kind = pick(["read", "compare", "total", "cant", "picto"]);
      if (kind === "read") {
        const i = ri(0, 3);
        return { q: `The bar graph shows ${theme}. How many ${noun} does ${kids[i]} have?`, viz,
          type: "num", answer: String(vals[i]),
          explain: `Find ${kids[i]}'s bar and read its height on the scale: ${vals[i]}.` };
      }
      if (kind === "compare") {
        const max = Math.max(...vals), min = Math.min(...vals);
        const hi = kids[vals.indexOf(max)], lo = kids[vals.indexOf(min)];
        if (Math.random() < 0.5) {
          return { q: `The graph shows ${theme}. How many MORE ${noun} does ${hi} have than ${lo}?`, viz,
            type: "num", answer: String(max - min),
            explain: `${hi} has ${max} and ${lo} has ${min}: ${max} − ${min} = ${max - min}.` };
        }
        return { q: `The graph shows ${theme}. Who has the MOST ${noun}?`, viz,
          ...mc(hi, kids.filter((k) => k !== hi)),
          explain: `The tallest bar belongs to ${hi} (${max}).` };
      }
      if (kind === "total") {
        const sum = vals.reduce((s, v) => s + v, 0);
        return { q: `The graph shows ${theme}. How many ${noun} did the four kids collect in ALL?`, viz,
          type: "num", answer: String(sum),
          explain: `Add all four bars: ${vals.join(" + ")} = ${sum}.` };
      }
      if (kind === "cant") {
        const cant = pick([`WHY does ${kids[0]} have the most ${noun}?`, `What will the numbers be next month?`, `Which ${noun.slice(0, -1)} did ${kids[1]} like best?`]);
        return { q: `The graph shows ${theme}. Which question can NOT be answered using the graph?`, viz,
          ...mc(cant, [`Who has the most ${noun}?`, `How many ${noun} does ${kids[2]} have?`, `How many ${noun} are there in all?`]),
          explain: `The graph only shows the counts — it can't explain reasons, predict the future, or show favorites.` };
      }
      const three = kids.slice(0, 3);
      const pvals = sampleN([4, 6, 8, 10, 12], 3);
      const rows = three.map((k, i) => ({ label: k, emoji, value: pvals[i] }));
      const i = ri(0, 2);
      return { q: `The picture graph shows ${theme}. How many ${noun} does ${three[i]} have? (Remember the key!)`,
        viz: vizPicto(rows, 2), type: "num", answer: String(pvals[i]),
        explain: `${three[i]} has ${pvals[i] / 2} symbols, and each symbol = 2, so ${pvals[i] / 2} × 2 = ${pvals[i]}.` };
    },
  },

  // ----------------------------------------------------------------- 5.DL.B.5
  "g5-line-plots": {
    lesson: [
      { title: "Line plots with fractions", say: "A line plot stacks an X for each measurement above a number line. Here the line is marked in fourths of an inch.",
        html: `<p>A <strong>line plot</strong> stacks an ✕ for every measurement:</p>
               ${vizLinePlot([0.5, 0.75, 0.75, 1, 1, 1, 1.25], 0, 2, { step: 0.25, fracDen: 4 })}
               <p>Three ribbons measured exactly 1 inch — three ✕s above the 1.</p>` },
      { title: "Reading the stacks", say: "Count the X marks to answer questions: how many at each value, which value is most common, how many in all.",
        html: `<p>The stacks answer questions:</p>
               <ul><li>How many at 3/4? → count that column</li>
               <li>Most common length? → tallest stack</li>
               <li>How many measured in all? → count every ✕</li></ul>` },
      { title: "Math from the plot", say: "You can also compute with the values. The longest minus the shortest gives the range — subtract the fractions.",
        html: `<p>Use fraction skills on the plot's values:</p>
               <p class="bigmath">longest − shortest = 1 1/4 − 1/2 = 5/4 − 2/4 = <strong>3/4</strong> inch</p>` },
    ],
    gen() {
      const den = pick([4, 8]);
      const max = den === 4 ? 2 : 1;
      const idxs = sampleN([1, 2, 3, 4, 5, 6, 7, 8], 4).sort((a, b) => a - b);
      const modeIdx = pick(idxs);
      const counts = {};
      for (const i of idxs) counts[i] = i === modeIdx ? 4 : ri(1, 3);
      const values = [];
      for (const i of idxs) for (let k = 0; k < counts[i]; k++) values.push(i / den);
      const viz = vizLinePlot(values, 0, max, { step: 1 / den, fracDen: den });
      const item = pick([["ribbon pieces", "inch"], ["caterpillars", "inch"], ["bean sprouts", "inch"]]);
      const intro = `Students measured ${item[0]} to the nearest 1/${den} ${item[1]} and made this line plot.`;
      const kind = pick(["countAt", "total", "mode", "range", "diffCounts"]);
      if (kind === "countAt") {
        const i = pick(idxs);
        return { q: `${intro} How many ${item[0]} measured exactly ${fracStr(i, den)} ${item[1]}?`, viz,
          type: "num", answer: String(counts[i]),
          explain: `Count the ✕ marks stacked above ${fracStr(i, den)}: there are ${counts[i]}.` };
      }
      if (kind === "total") {
        return { q: `${intro} How many ${item[0]} were measured in ALL?`, viz,
          type: "num", answer: String(values.length),
          explain: `Every ✕ is one measurement — count them all: ${idxs.map((i) => counts[i]).join(" + ")} = ${values.length}.` };
      }
      if (kind === "mode") {
        return { q: `${intro} Which length appears MOST often?`, viz,
          ...mc(`${fracStr(modeIdx, den)} ${item[1]}`, idxs.filter((i) => i !== modeIdx).map((i) => `${fracStr(i, den)} ${item[1]}`)),
          explain: `The tallest stack (4 ✕s) sits above ${fracStr(modeIdx, den)}.` };
      }
      if (kind === "range") {
        const lo = idxs[0], hi = idxs[idxs.length - 1];
        return { q: `${intro} How much longer is the LONGEST measurement than the SHORTEST? (simplest form — a fraction like 3/4, or a whole number)`, viz,
          type: "num", answer: fracStr(hi - lo, den),
          explain: `Longest ${fracStr(hi, den)} − shortest ${fracStr(lo, den)} = ${hi - lo}/${den}${fracStr(hi - lo, den) !== `${hi - lo}/${den}` ? ` = ${fracStr(hi - lo, den)}` : ""} ${item[1]}.` };
      }
      const others = idxs.filter((i) => i !== modeIdx && counts[i] < 4);
      const b = pick(others);
      return { q: `${intro} How many MORE ${item[0]} measured ${fracStr(modeIdx, den)} ${item[1]} than ${fracStr(b, den)} ${item[1]}?`, viz,
        type: "num", answer: String(4 - counts[b]),
        explain: `${fracStr(modeIdx, den)} has 4 ✕s and ${fracStr(b, den)} has ${counts[b]}: 4 − ${counts[b]} = ${4 - counts[b]}.` };
    },
  },

  // ----------------------------------------------------------------- 5.G.A.1-2
  "g5-coord": {
    lesson: [
      { title: "The coordinate plane", say: "Two number lines make a coordinate plane. A point's address is x comma y: first go across, then go up.",
        html: `<p>A point's address is <strong>(x, y)</strong>: go <strong>across x</strong>, then <strong>up y</strong>.</p>
               ${vizCoordPlane([{ x: 3, y: 2, label: "(3, 2)" }], { max: 6 })}
               <p class="bigmath">(3, 2): right 3, up 2</p>
               <p>⚠️ Order matters — (3, 2) and (2, 3) are different points!</p>` },
      { title: "Start at the origin", say: "Every trip starts at the origin, the point zero zero, where the two axes cross.",
        html: `<p>The <strong>origin</strong> is (0, 0) — where the axes cross. Every address starts there:</p>
               <p class="bigmath">right 4, up 2 → (4, 2)</p>` },
      { title: "Graphs tell stories", say: "Real-world graphs use coordinates too. If x is hours and y is miles, the point 2 comma 6 means six miles after two hours.",
        html: `<p>Coordinates can mean real things: x = hours, y = miles.</p>
               ${vizCoordPlane([{ x: 1, y: 3 }, { x: 2, y: 6 }, { x: 3, y: 9 }], { max: 10 })}
               <p>(2, 6) means: after 2 hours, 6 miles. The graph tells the story.</p>` },
    ],
    gen() {
      const kind = pick(["readPoint", "whichPoint", "directions", "realWorld"]);
      if (kind === "readPoint" || kind === "whichPoint") {
        const xs = sampleN([1, 2, 3, 4, 5, 6, 7, 8], 3), ys = sampleN([1, 2, 3, 4, 5, 6, 7, 8], 3);
        const labels = ["A", "B", "C"];
        const pts = labels.map((label, i) => ({ x: xs[i], y: ys[i], label }));
        const t = ri(0, 2), p = pts[t];
        const viz = vizCoordPlane(pts, { max: 9 });
        if (kind === "readPoint") {
          return { q: `What are the coordinates of point ${p.label}?`, viz,
            ...mc(`(${p.x}, ${p.y})`, [`(${p.y}, ${p.x})`, ...pts.filter((_, i) => i !== t).map((o) => `(${o.x}, ${o.y})`)]),
            explain: `From the origin, point ${p.label} is ${p.x} across and ${p.y} up: (${p.x}, ${p.y}).` };
        }
        return { q: `Which point is located at (${p.x}, ${p.y})?`, viz,
          ...mc(p.label, labels.filter((l) => l !== p.label)),
          explain: `Go right ${p.x}, then up ${p.y} — you land on point ${p.label}.` };
      }
      if (kind === "directions") {
        let r = ri(1, 8), u = ri(1, 8);
        while (u === r) u = ri(1, 8);
        return { q: `Start at the origin (0, 0). Go RIGHT ${r} and UP ${u}. Where are you?`,
          viz: vizCoordPlane([{ x: r, y: u }], { max: 9 }),
          ...mc(`(${r}, ${u})`, [`(${u}, ${r})`, `(${r}, 0)`, `(0, ${u})`]),
          explain: `Across first, then up: x = ${r}, y = ${u} → (${r}, ${u}).` };
      }
      const k = pick([2, 3]), name = pick(KID_NAMES);
      const pts = [1, 2, 3].map((n) => ({ x: n, y: n * k }));
      const ask = ri(2, 3);
      return { q: `The graph shows ${name}'s bike ride: x = hours, y = miles. How many MILES had ${name} ridden after ${ask} hours? (Just the number)`,
        viz: vizCoordPlane(pts, { max: 10 }), type: "num", answer: String(ask * k),
        explain: `Find x = ${ask} and read the point's height: y = ${ask * k} miles.` };
    },
  },

  // ----------------------------------------------------------------- 5.G.B.3-4
  "g5-classify": {
    lesson: [
      { title: "Shape families", say: "Shapes belong to families. A parallelogram has two pairs of parallel sides. Rectangles, rhombuses, and squares are all in the parallelogram family.",
        html: `<p>Quadrilaterals come in <strong>families</strong>:</p>
               <div class="viz-row">${vizShape("parallelogram")}${vizShape("rectangle")}${vizShape("rhombus")}${vizShape("square")}</div>
               <p>Parallelogram → 2 pairs of parallel sides. Rectangle → adds 4 right angles. Rhombus → adds 4 equal sides.</p>` },
      { title: "A square IS a rectangle", say: "A square has four right angles, so it passes the rectangle test. Every square is a rectangle — but not every rectangle is a square.",
        html: `<p>A square passes <em>every</em> rectangle test (4 right angles ✔), so:</p>
               <p class="bigmath">Every square IS a rectangle</p>
               <p>But a rectangle isn't always a square — its sides don't have to be equal. Family rules flow <strong>one way</strong>.</p>` },
      { title: "The trapezoid", say: "A trapezoid is a quadrilateral with one pair of parallel sides. Its other two sides are not parallel.",
        html: `<p>The <strong>trapezoid</strong>: exactly one pair of parallel sides.</p>
               ${vizShape("trapezoid")}
               <p>It is NOT a parallelogram — that family needs <em>two</em> parallel pairs.</p>` },
    ],
    gen() {
      const kind = pick(["trueFalse", "always", "specificName", "specialKind"]);
      if (kind === "trueFalse") {
        const facts = [
          ["Every square is a rectangle.", true, "A square has 4 right angles, so it passes the rectangle test."],
          ["Every rectangle is a square.", false, "A rectangle needs 4 right angles but NOT 4 equal sides."],
          ["Every square is a rhombus.", true, "A square has 4 equal sides, so it passes the rhombus test."],
          ["Every rhombus is a square.", false, "A rhombus has equal sides but doesn't need right angles."],
          ["Every rectangle is a parallelogram.", true, "A rectangle has 2 pairs of parallel sides."],
          ["Every parallelogram is a rectangle.", false, "A parallelogram doesn't need right angles."],
          ["Every square is a parallelogram.", true, "A square has 2 pairs of parallel sides — it's in the family."],
          ["Every trapezoid is a parallelogram.", false, "A trapezoid has only ONE pair of parallel sides; parallelograms need two."],
          ["Every rhombus is a parallelogram.", true, "A rhombus has 2 pairs of parallel sides."],
        ];
        const [st, truth, why] = pick(facts);
        return { q: `True or false? &nbsp;<strong>${st}</strong>`, viz: null,
          ...mc(truth ? "True" : "False", [truth ? "False" : "True"]),
          explain: `${why} So the statement is ${truth ? "TRUE" : "FALSE"}.` };
      }
      if (kind === "always") {
        const qs = [
          ["Which shape ALWAYS has 4 right angles?", "rectangle", ["rhombus", "parallelogram", "trapezoid"], "Right angles are the rectangle's defining property. (A square has them too — it's a special rectangle!)"],
          ["Which shape ALWAYS has 4 equal sides?", "rhombus", ["rectangle", "parallelogram", "trapezoid"], "Equal sides define the rhombus. (A square is a special rhombus.)"],
          ["Which quadrilateral ALWAYS has 4 equal sides AND 4 right angles?", "square", ["rectangle", "rhombus", "parallelogram"], "Only the square requires both equal sides and right angles."],
          ["Which shape can have exactly ONE pair of parallel sides?", "trapezoid", ["parallelogram", "rectangle", "rhombus"], "Parallelograms (and their family) always have two parallel pairs — the trapezoid has just one."],
        ];
        const [q, ans, wrong, why] = pick(qs);
        return { q, viz: null, ...mc(ans, wrong), explain: why };
      }
      if (kind === "specificName") {
        const shapes = [
          ["square", ["rectangle", "rhombus", "trapezoid"], "It has 4 equal sides AND 4 right angles — 'rectangle' and 'rhombus' are true but 'square' is most specific."],
          ["rectangle", ["square", "trapezoid", "rhombus"], "It has 4 right angles but its sides aren't all equal, so 'rectangle' fits best."],
          ["rhombus", ["square", "rectangle", "trapezoid"], "It has 4 equal sides but no right angles, so 'rhombus' fits best."],
          ["parallelogram", ["rectangle", "rhombus", "trapezoid"], "It has 2 pairs of parallel sides but no right angles and no equal-side guarantee."],
          ["trapezoid", ["parallelogram", "rectangle", "rhombus"], "It has exactly one pair of parallel sides."],
        ];
        const [name, wrong, why] = pick(shapes);
        return { q: `What is the MOST SPECIFIC name for this shape?`, viz: vizShape(name),
          ...mc(name, wrong), explain: why };
      }
      const pairs = [
        ["square", "rectangle", ["triangle", "pentagon", "circle"], "A square is a rectangle whose sides happen to be equal."],
        ["square", "rhombus", ["triangle", "hexagon", "circle"], "A square is a rhombus whose angles happen to be right angles."],
        ["rectangle", "parallelogram", ["square", "rhombus", "triangle"], "A rectangle is a parallelogram with right angles — but it is NOT always a square or rhombus."],
        ["rhombus", "parallelogram", ["square", "rectangle", "triangle"], "A rhombus is a parallelogram with equal sides — but it is NOT always a square."],
      ];
      const [child, parent, wrong, why] = pick(pairs);
      return { q: `Finish the sentence: "A ${child} is always a special kind of ___."`, viz: vizShape(child),
        ...mc(parent, wrong), explain: why };
    },
  },
});

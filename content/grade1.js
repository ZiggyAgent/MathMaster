// Grade 1 content — lessons + question generators for every Grade 1 topic in
// curriculum.js (2023 NJSLS-M). Lesson slides teach with visuals and worked
// examples; gen() returns one fresh practice item each call:
//   { q, viz, type:'mc'|'num', choices?, answer, explain }
// Keep `answer` in the format the question asks for — correctness is
// normalizeAnswer(given) === normalizeAnswer(answer).

registerContent({

  // ----------------------------------------------------------------- 1.OA.A.1
  "g1-add-stories": {
    lesson: [
      { title: "Math stories", say: "Math problems can be little stories. Let's learn how to solve them!",
        html: `<p>A <strong>story problem</strong> is a little story with a math question hiding inside.</p>
               ${vizTwoGroups("🍎", 5, 3)}
               <p>Maya has <strong>5 apples</strong>. Leo gives her <strong>3 more</strong>. How many now?</p>` },
      { title: "Adding stories", say: "When the story puts things together, we add. 5 plus 3 equals 8.",
        html: `<p>The story <em>puts apples together</em> — that means we <strong>add</strong>:</p>
               <p class="bigmath">5 + 3 = 8</p>
               <p>Maya has <strong>8 apples</strong> now. 🎉</p>` },
      { title: "Taking away", say: "When the story takes things away, we subtract. 7 minus 2 equals 5.",
        html: `<p>Some stories <em>take things away</em> — that means we <strong>subtract</strong>:</p>
               <p>Sam had <strong>7 balloons</strong> 🎈 and <strong>2 flew away</strong>.</p>
               <p class="bigmath">7 − 2 = 5</p>` },
      { title: "Comparing", say: "Some stories compare. How many more is a subtraction question!",
        html: `<p>Stories can also <strong>compare</strong>:</p>
               <p>Zoe has 9 stickers. Max has 6. <em>How many more</em> does Zoe have?</p>
               <p class="bigmath">9 − 6 = 3</p>
               <p>💡 "How many more" is a subtract question!</p>` },
    ],
    gen() {
      const [word, emoji] = thing();
      const name = pick(KID_NAMES); let name2 = pick(KID_NAMES);
      while (name2 === name) name2 = pick(KID_NAMES);
      const kind = pick(["add", "take", "compare", "missing"]);
      if (kind === "add") {
        const a = ri(3, 12), b = ri(2, Math.min(8, 20 - a));
        return { q: `${name} has ${a} ${plural(word, a)}. ${name2} gives ${name} ${b} more. How many ${plural(word, 2)} does ${name} have now?`,
          viz: vizTwoGroups(emoji, a, b), type: "num", answer: String(a + b),
          explain: `The story puts ${plural(word, 2)} together, so add: ${a} + ${b} = ${a + b}.` };
      }
      if (kind === "take") {
        const a = ri(6, 18), b = ri(2, a - 1);
        return { q: `${name} had ${a} ${plural(word, a)}. ${b} ${b === 1 ? "was" : "were"} given away. How many are left?`,
          viz: vizObjects(emoji, a), type: "num", answer: String(a - b),
          explain: `Things go away, so subtract: ${a} − ${b} = ${a - b}.` };
      }
      if (kind === "compare") {
        const small = ri(3, 9), diff = ri(2, 6);
        return { q: `${name} has ${small + diff} ${plural(word, 2)}. ${name2} has ${small}. How many more does ${name} have?`,
          viz: null, type: "num", answer: String(diff),
          explain: `"How many more" means subtract: ${small + diff} − ${small} = ${diff}.` };
      }
      const total = ri(8, 16), have = ri(3, total - 2);
      return { q: `${name} wants ${total} ${plural(word, total)} and already has ${have}. How many MORE are needed?`,
        viz: null, type: "num", answer: String(total - have),
        explain: `Find the missing part: ${have} + ${total - have} = ${total}, so ${total} − ${have} = ${total - have}.` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.A.2
  "g1-three-addends": {
    lesson: [
      { title: "Three numbers!", say: "Sometimes a story has three numbers to add. Add two, then add the last one.",
        html: `<p>Some stories add <strong>three</strong> numbers:</p>
               <p>Ben saw 4 ducks 🦆, then 3 ducks, then 2 ducks. How many in all?</p>
               <p class="bigmath">4 + 3 + 2 = ?</p>` },
      { title: "Two at a time", say: "Add two numbers first: 4 plus 3 is 7. Then add the last: 7 plus 2 is 9.",
        html: `<p>Add two numbers first, then the third:</p>
               <p class="bigmath">4 + 3 = 7, then 7 + 2 = <strong>9</strong></p>` },
      { title: "Pick a smart pair", say: "Look for two numbers that make ten — that makes adding easy!",
        html: `<p>💡 Trick: look for a pair that makes <strong>10</strong>!</p>
               <p class="bigmath">6 + 4 + 5 → (6 + 4) + 5 → 10 + 5 = <strong>15</strong></p>` },
    ],
    gen() {
      const [word, emoji] = thing();
      const name = pick(KID_NAMES);
      let a, b, c;
      if (Math.random() < 0.5) { a = ri(1, 9); b = 10 - a; c = ri(2, 9); }
      else { a = ri(2, 7); b = ri(2, 7); c = ri(1, Math.min(6, 20 - a - b)); }
      const sum = a + b + c;
      const tenPair = (a + b === 10) ? `${a} + ${b} make 10, then 10 + ${c} = ${sum}` : `${a} + ${b} = ${a + b}, then ${a + b} + ${c} = ${sum}`;
      return { q: `${name} collects ${plural(word, 2)} ${emoji}: ${a} on Monday, ${b} on Tuesday, and ${c} on Wednesday. How many in all?`,
        viz: null, type: "num", answer: String(sum), explain: `Add two at a time: ${tenPair}.` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.B.3
  "g1-add-properties": {
    lesson: [
      { title: "Turn-around facts", say: "You can add numbers in any order. 3 plus 8 equals 8 plus 3.",
        html: `<p>Addition works in <strong>any order</strong>:</p>
               <p class="bigmath">3 + 8 = 8 + 3</p>
               ${vizTwoGroups("⭐", 3, 8)}
               <p>Both are <strong>11</strong> — the stars don't care which group is first!</p>` },
      { title: "Start big", say: "Turn the numbers around so you start with the bigger one. It's faster!",
        html: `<p>💡 To solve <strong>2 + 9</strong>, turn it around: think <strong>9 + 2</strong>.</p>
               <p>Start at 9, count on two: 10, 11. Done!</p>` },
      { title: "Group to make ten", say: "When adding three numbers, group the pair that makes ten first.",
        html: `<p>You can also <strong>group</strong> numbers any way you like:</p>
               <p class="bigmath">7 + 5 + 3 = (7 + 3) + 5 = 10 + 5 = 15</p>` },
    ],
    gen() {
      const kind = pick(["turnaround", "which", "group"]);
      if (kind === "turnaround") {
        const a = ri(2, 9), b = ri(2, 9);
        return { q: `Fill in the missing number: ${a} + ${b} = ${b} + ___`,
          viz: null, type: "num", answer: String(a),
          explain: `Turn-around facts: ${a} + ${b} and ${b} + ${a} are the same total.` };
      }
      if (kind === "which") {
        const a = ri(2, 9), b = ri(2, 9);
        return { q: `Which has the SAME answer as ${a} + ${b}?`,
          viz: null, ...mc(`${b} + ${a}`, [`${b} + ${a + 1}`, `${a} + ${b + 1}`, `${b + 1} + ${a + 1}`]),
          explain: `You can add in any order: ${a} + ${b} = ${b} + ${a}.` };
      }
      const a = ri(2, 8), b = 10 - a, c = ri(2, 9);
      return { q: `To solve ${a} + ${c} + ${b} the easy way, which two numbers make 10?`,
        viz: null, ...mc(`${a} and ${b}`, [`${a} and ${c}`, `${c} and ${b}`]),
        explain: `${a} + ${b} = 10, then 10 + ${c} = ${10 + c}. Making ten first is the easy path!` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.B.4
  "g1-missing-addend": {
    lesson: [
      { title: "Subtraction's secret", say: "Every subtraction hides an addition. 9 minus 6 asks: 6 plus what makes 9?",
        html: `<p><strong>9 − 6 = ?</strong> hides a secret addition:</p>
               <p class="bigmath">6 + ? = 9</p>
               <p>Think: 6 plus <strong>what</strong> makes 9?</p>` },
      { title: "Count up to solve", say: "Count up from 6 to 9: 7, 8, 9. That's 3 hops. So 9 minus 6 is 3.",
        html: `${vizNumberLine(0, 10, { marks: [{ at: 6 }, { at: 9, color: "#b45309" }], jumps: [{ from: 6, to: 9, label: "+3" }] })}
               <p>Count up from 6 to 9 — that's <strong>3</strong> hops.</p>
               <p class="bigmath">So 9 − 6 = 3 ✔</p>` },
      { title: "Use facts you know", say: "If you know 8 plus 2 is 10, then you know 10 minus 8 is 2!",
        html: `<p>Addition facts you already know solve subtraction for free:</p>
               <p class="bigmath">8 + 2 = 10 &nbsp;→&nbsp; 10 − 8 = 2</p>` },
    ],
    gen() {
      const b = ri(3, 9), missing = ri(2, 9), a = b + missing;
      if (Math.random() < 0.5) {
        return { q: `To solve ${a} − ${b}, find the missing number: ${b} + ___ = ${a}`,
          viz: null, type: "num", answer: String(missing),
          explain: `Count up from ${b} to ${a}: that's ${missing}. So ${a} − ${b} = ${missing}.` };
      }
      return { q: `You know that ${b} + ${missing} = ${a}. What is ${a} − ${b}?`,
        viz: vizNumberLine(0, Math.max(10, a), { marks: [{ at: b }, { at: a, color: "#b45309" }], labelEvery: a > 12 ? 2 : 1 }),
        type: "num", answer: String(missing),
        explain: `Subtraction is the missing addend: ${b} + ${missing} = ${a}, so ${a} − ${b} = ${missing}.` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.C.5
  "g1-count-on": {
    lesson: [
      { title: "Counting on", say: "To add, you can count on. For 8 plus 3, start at 8 and count: 9, 10, 11.",
        html: `<p>To solve <strong>8 + 3</strong>, don't start from 1 — <strong>count on</strong> from 8:</p>
               ${vizNumberLine(5, 12, { marks: [{ at: 8 }], jumps: [{ from: 8, to: 9 }, { from: 9, to: 10 }, { from: 10, to: 11 }] })}
               <p class="bigmath">9… 10… 11. So 8 + 3 = 11</p>` },
      { title: "Counting back", say: "To subtract a little number, count back. For 11 minus 2: 10, 9.",
        html: `<p>To solve <strong>11 − 2</strong>, <strong>count back</strong> from 11:</p>
               <p class="bigmath">10… 9. So 11 − 2 = 9</p>` },
    ],
    gen() {
      if (Math.random() < 0.55) {
        const a = ri(5, 15), b = ri(1, 4);
        return { q: `Count on to add: ${a} + ${b} = ?`,
          viz: vizNumberLine(Math.max(0, a - 2), a + b + 2, { marks: [{ at: a }], jumps: Array.from({ length: b }, (_, i) => ({ from: a + i, to: a + i + 1 })) }),
          type: "num", answer: String(a + b),
          explain: `Start at ${a} and count on ${b}: ${Array.from({ length: b }, (_, i) => a + i + 1).join(", ")}.` };
      }
      const a = ri(6, 16), b = ri(1, 3);
      return { q: `Count back to subtract: ${a} − ${b} = ?`,
        viz: vizNumberLine(a - b - 3, a + 1, { marks: [{ at: a }] }),
        type: "num", answer: String(a - b),
        explain: `Start at ${a} and count back ${b}: ${Array.from({ length: b }, (_, i) => a - i - 1).join(", ")}.` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.C.6
  "g1-facts-20": {
    lesson: [
      { title: "Make a ten", say: "To add 9 plus 6, move one over to make a ten: 10 plus 5 is 15.",
        html: `<p>The superstar strategy: <strong>make a ten</strong>.</p>
               <p class="bigmath">9 + 6 → 10 + 5 = 15</p>
               ${vizTenFrame(15)}
               <p>Move 1 from the 6 to fill the 9 up to 10!</p>` },
      { title: "Doubles", say: "Doubles are your friends: 6 plus 6 is 12, 7 plus 7 is 14.",
        html: `<p><strong>Doubles</strong> are easy to remember:</p>
               <p class="bigmath">6+6=12 &nbsp; 7+7=14 &nbsp; 8+8=16</p>
               <p>And near-doubles: 6 + 7 is just 6 + 6 + 1 = <strong>13</strong>.</p>` },
      { title: "Fact families", say: "8 plus 5 is 13. So 13 minus 5 is 8, and 13 minus 8 is 5. One family!",
        html: `<p>Facts come in <strong>families</strong>:</p>
               <p class="bigmath">8 + 5 = 13 &nbsp; 5 + 8 = 13<br>13 − 5 = 8 &nbsp; 13 − 8 = 5</p>` },
    ],
    gen() {
      if (Math.random() < 0.55) {
        const a = ri(3, 12), b = ri(2, Math.min(9, 20 - a));
        const strat = a + b > 10 && (a === 9 || a === 8)
          ? `Make a ten: ${a} + ${10 - a} = 10, then 10 + ${b - (10 - a)} = ${a + b}.`
          : `${a} + ${b} = ${a + b}.`;
        return { q: `${a} + ${b} = ?`, viz: null, type: "num", answer: String(a + b), explain: strat };
      }
      const ans = ri(2, 10), b = ri(2, 9), a = ans + b;
      if (a > 20) return this.gen();
      return { q: `${a} − ${b} = ?`, viz: null, type: "num", answer: String(ans),
        explain: `Think addition: ${b} + ${ans} = ${a}, so ${a} − ${b} = ${ans}.` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.D.7
  "g1-equal-sign": {
    lesson: [
      { title: "What = really means", say: "The equal sign means both sides are worth the same. It's a balance!",
        html: `<p>The <strong>=</strong> sign is a <strong>balance</strong> ⚖️ — both sides must be worth the <strong>same</strong>.</p>
               <p class="bigmath">5 + 2 = 7 ✔</p>
               <p>Left side: 7. Right side: 7. Balanced!</p>` },
      { title: "Tricky equations", say: "7 equals 7 is true! And 4 plus 1 equals 3 plus 2 is also true. Check each side.",
        html: `<p>These look weird but are <strong>TRUE</strong>:</p>
               <p class="bigmath">7 = 7</p>
               <p class="bigmath">4 + 1 = 3 + 2</p>
               <p>Check: left makes 5, right makes 5. Balanced ⚖️</p>` },
      { title: "Spot the false ones", say: "5 plus 3 equals 8 plus 1? Left is 8, right is 9. Not balanced — false!",
        html: `<p>Is <strong>5 + 3 = 8 + 1</strong> true?</p>
               <p>Left: 8. Right: 9. <strong>Not balanced → FALSE</strong> ❌</p>` },
    ],
    gen() {
      const form = pick(["plain", "same", "twoSides", "twoSidesFalse", "reversed"]);
      let eq, truth, why;
      if (form === "plain") {
        const a = ri(2, 9), b = ri(2, 9), off = pick([0, 0, 1, -1]);
        eq = `${a} + ${b} = ${a + b + off}`; truth = off === 0;
        why = `${a} + ${b} makes ${a + b}.`;
      } else if (form === "same") {
        const a = ri(3, 15), off = pick([0, 0, 1]);
        eq = `${a} = ${a + off}`; truth = off === 0;
        why = truth ? `A number always equals itself.` : `${a} and ${a + off} are different numbers.`;
      } else if (form === "twoSides") {
        const a = ri(2, 7), b = ri(2, 7);
        eq = `${a} + ${b} = ${b} + ${a}`; truth = true;
        why = `Both sides make ${a + b} — turn-around facts balance.`;
      } else if (form === "twoSidesFalse") {
        const a = ri(2, 7), b = ri(2, 7);
        eq = `${a} + ${b} = ${a + 1} + ${b + 1}`; truth = false;
        why = `Left makes ${a + b} but right makes ${a + b + 2}.`;
      } else {
        const a = ri(2, 9), b = ri(2, 9), off = pick([0, 1]);
        eq = `${a + b + off} = ${a} + ${b}`; truth = off === 0;
        why = `The right side makes ${a + b}.`;
      }
      return { q: `True or false? &nbsp; <strong>${eq}</strong>`, viz: null,
        ...mc(truth ? "True" : "False", [truth ? "False" : "True"]),
        explain: `${why} The equation is ${truth ? "TRUE" : "FALSE"}.` };
    },
  },

  // ----------------------------------------------------------------- 1.OA.D.8
  "g1-missing-number": {
    lesson: [
      { title: "Number detective", say: "A missing number hides in the equation. Use the balance to find it!",
        html: `<p>Find the mystery number:</p>
               <p class="bigmath">8 + ❓ = 11</p>
               <p>Think: 8 plus <strong>what</strong> lands on 11? Count on: 9, 10, 11 → <strong>3</strong>!</p>` },
      { title: "Missing starts", say: "The mystery can be first! What plus 4 equals 9? Think 9 minus 4.",
        html: `<p>The mystery number can hide anywhere:</p>
               <p class="bigmath">❓ + 4 = 9 &nbsp;→&nbsp; 9 − 4 = <strong>5</strong></p>
               <p class="bigmath">12 − ❓ = 7 &nbsp;→&nbsp; what jumps from 12 down to 7? <strong>5</strong></p>` },
    ],
    gen() {
      const form = pick(["a+x=c", "x+b=c", "c-x=r", "x-b=r"]);
      if (form === "a+x=c") {
        const a = ri(2, 12), x = ri(2, Math.min(8, 19 - a));
        return { q: `${a} + ❓ = ${a + x}. What is ❓?`, viz: null, type: "num", answer: String(x),
          explain: `Count on from ${a} to ${a + x}: that's ${x}.` };
      }
      if (form === "x+b=c") {
        const b = ri(2, 12), x = ri(2, Math.min(8, 19 - b));
        return { q: `❓ + ${b} = ${b + x}. What is ❓?`, viz: null, type: "num", answer: String(x),
          explain: `${b + x} − ${b} = ${x}.` };
      }
      if (form === "c-x=r") {
        const r = ri(2, 9), x = ri(2, 9);
        return { q: `${r + x} − ❓ = ${r}. What is ❓?`, viz: null, type: "num", answer: String(x),
          explain: `From ${r + x} down to ${r} is a jump of ${x}.` };
      }
      const b = ri(2, 9), r = ri(2, 9);
      return { q: `❓ − ${b} = ${r}. What is ❓?`, viz: null, type: "num", answer: String(b + r),
        explain: `Work backwards: ${r} + ${b} = ${b + r}.` };
    },
  },

  // ----------------------------------------------------------------- 1.NBT.A.1
  "g1-count-120": {
    lesson: [
      { title: "Counting past 100", say: "Numbers keep going! After 99 comes 100, 101, 102, all the way past 120.",
        html: `<p>Numbers don't stop at 100!</p>
               <p class="bigmath">…98, 99, 100, 101, 102…</p>
               <p>You can count all the way to <strong>120</strong> and beyond.</p>` },
      { title: "Start anywhere", say: "You can start counting from any number. From 87: 88, 89, 90, 91.",
        html: `<p>Start counting from <strong>any</strong> number:</p>
               <p class="bigmath">87 → 88, 89, 90, 91…</p>
               <p>💡 After a number ending in 9, the tens go up: 89 → 90, 109 → 110.</p>` },
    ],
    gen() {
      const kind = pick(["after", "before", "between", "sequence"]);
      if (kind === "after") {
        const n = pick([ri(8, 118), ri(95, 118)]);
        return { q: `What number comes right AFTER ${n}?`, viz: null, type: "num", answer: String(n + 1),
          explain: `Counting up: …${n}, ${n + 1}.` };
      }
      if (kind === "before") {
        const n = pick([ri(9, 119), ri(96, 119)]);
        return { q: `What number comes right BEFORE ${n}?`, viz: null, type: "num", answer: String(n - 1),
          explain: `Counting up: ${n - 1}, ${n}…` };
      }
      if (kind === "between") {
        const n = ri(10, 117);
        return { q: `What number is between ${n} and ${n + 2}?`, viz: null, type: "num", answer: String(n + 1),
          explain: `${n}, ${n + 1}, ${n + 2}.` };
      }
      const start = ri(10, 116);
      return { q: `Keep counting: ${start}, ${start + 1}, ${start + 2}, ___`, viz: null, type: "num", answer: String(start + 3),
        explain: `The count goes up by one each time: ${start + 3} comes next.` };
    },
  },

  // ----------------------------------------------------------------- 1.NBT.B.2
  "g1-tens-ones": {
    lesson: [
      { title: "Tens and ones", say: "Two-digit numbers are made of tens and ones. 47 is 4 tens and 7 ones.",
        html: `<p>Every two-digit number is built from <strong>tens</strong> and <strong>ones</strong>.</p>
               ${vizBaseTen(47)}
               <p class="bigmath">47 = 4 tens + 7 ones</p>` },
      { title: "Ten is a bundle", say: "A ten is a bundle of ten ones. The number 10 is 1 ten and 0 ones.",
        html: `<p><strong>10</strong> is a bundle of ten ones — 1 ten, 0 ones.</p>
               ${vizBaseTen(10)}
               <p>The teen numbers are one ten and extras: 13 = 10 + 3.</p>` },
      { title: "Read the blocks", say: "Count the rods of ten, then the single cubes. 3 rods and 6 cubes is 36.",
        html: `${vizBaseTen(36)}
               <p>3 rods of ten = 30, plus 6 ones → <strong>36</strong>.</p>` },
    ],
    gen() {
      const kind = pick(["blocks", "tens", "ones", "build"]);
      const n = ri(13, 99);
      const t = Math.floor(n / 10), o = n % 10;
      if (kind === "blocks") {
        return { q: `What number do the blocks show?`, viz: vizBaseTen(n), type: "num", answer: String(n),
          explain: `${t} ${plural("ten", t)} = ${t * 10}, plus ${o} ${plural("one", o)} → ${n}.` };
      }
      if (kind === "tens") {
        return { q: `How many TENS are in ${n}?`, viz: null, type: "num", answer: String(t),
          explain: `${n} = ${t} tens and ${o} ones.` };
      }
      if (kind === "ones") {
        return { q: `How many ONES are left over in ${n} (after the tens)?`, viz: null, type: "num", answer: String(o),
          explain: `${n} = ${t} tens and ${o} ones.` };
      }
      return { q: `What number is ${t} tens and ${o} ones?`, viz: null, type: "num", answer: String(n),
        explain: `${t} tens = ${t * 10}; ${t * 10} + ${o} = ${n}.` };
    },
  },

  // ----------------------------------------------------------------- 1.NBT.B.3
  "g1-compare": {
    lesson: [
      { title: "The hungry alligator", say: "The comparing sign is a hungry alligator — it always eats the bigger number!",
        html: `<p>To compare numbers we use <strong>&lt;</strong>, <strong>=</strong>, <strong>&gt;</strong>.</p>
               <p class="bigmath">23 &lt; 41</p>
               <p>🐊 The open mouth always points at the <strong>bigger</strong> number.</p>` },
      { title: "Check tens first", say: "Compare the tens first. 52 has 5 tens, 38 has only 3 tens, so 52 is greater.",
        html: `<p>Compare <strong>tens first</strong>:</p>
               <p class="bigmath">52 &gt; 38</p>
               <p>5 tens beats 3 tens — no need to even look at the ones!</p>` },
      { title: "Same tens? Check ones", say: "If the tens match, compare the ones. 74 and 78: same tens, 4 is less than 8.",
        html: `<p>Tens tied? Look at the <strong>ones</strong>:</p>
               <p class="bigmath">74 &lt; 78</p>
               <p>Both have 7 tens, and 4 ones &lt; 8 ones.</p>` },
    ],
    gen() {
      let a, b;
      const sameTens = Math.random() < 0.4;
      if (sameTens) { const t = ri(1, 9) * 10; a = t + ri(0, 9); b = t + ri(0, 9); }
      else { a = ri(10, 99); b = ri(10, 99); }
      if (Math.random() < 0.12) b = a;
      const sign = a < b ? "<" : a > b ? ">" : "=";
      const why = a === b ? `They are the same number.`
        : Math.floor(a / 10) !== Math.floor(b / 10)
          ? `Compare tens: ${Math.floor(a / 10)} tens vs ${Math.floor(b / 10)} tens.`
          : `Tens are equal, so compare ones: ${a % 10} vs ${b % 10}.`;
      return { q: `Which sign makes this true? &nbsp; <strong>${a} ⬜ ${b}</strong>`,
        viz: null, ...mc(sign, ["<", ">", "="].filter((s) => s !== sign)),
        explain: `${why} So ${a} ${sign} ${b}.` };
    },
  },

  // ----------------------------------------------------------------- 1.NBT.C.4
  "g1-add-100": {
    lesson: [
      { title: "Adding bigger numbers", say: "To add big numbers, add the ones to the ones, and tens to tens.",
        html: `<p>Add <strong>ones with ones</strong> and <strong>tens with tens</strong>:</p>
               <p class="bigmath">34 + 5 → 4 + 5 = 9 ones → <strong>39</strong></p>` },
      { title: "Adding tens", say: "Adding 20 just changes the tens: 43 plus 20 is 63. The ones stay put!",
        html: `<p>Adding tens leaves the ones alone:</p>
               <p class="bigmath">43 + 20 = 63</p>
               ${vizBaseTen(63)}
               <p>4 tens + 2 tens = 6 tens; the 3 ones don't move.</p>` },
      { title: "Crossing a ten", say: "Sometimes the ones overflow into a new ten: 28 plus 6 is 34.",
        html: `<p>Sometimes the ones make a <strong>new ten</strong>:</p>
               <p class="bigmath">28 + 6 → 28 + 2 = 30, then 30 + 4 = <strong>34</strong></p>` },
    ],
    gen() {
      const kind = pick(["plusOnes", "plusTens", "cross"]);
      if (kind === "plusOnes") {
        const t = ri(1, 8) * 10, o = ri(1, 4), b = ri(1, 9 - o);
        return { q: `${t + o} + ${b} = ?`, viz: null, type: "num", answer: String(t + o + b),
          explain: `Add the ones: ${o} + ${b} = ${o + b}. The tens stay: ${t + o + b}.` };
      }
      if (kind === "plusTens") {
        const a = ri(11, 79), b = ri(1, Math.floor((99 - a) / 10)) * 10;
        return { q: `${a} + ${b} = ?`, viz: null, type: "num", answer: String(a + b),
          explain: `Only the tens change: ${Math.floor(a / 10)} tens + ${b / 10} tens = ${Math.floor(a / 10) + b / 10} tens → ${a + b}.` };
      }
      const a = ri(2, 8) * 10 + ri(6, 9), b = ri(4, 9);
      if (a + b > 99) return this.gen();
      const toTen = 10 - (a % 10);
      return { q: `${a} + ${b} = ?`, viz: null, type: "num", answer: String(a + b),
        explain: `Make the next ten: ${a} + ${toTen} = ${a + toTen}, then + ${b - toTen} more → ${a + b}.` };
    },
  },

  // ----------------------------------------------------------------- 1.NBT.C.5
  "g1-ten-more": {
    lesson: [
      { title: "Ten more, ten less", say: "Ten more just bumps the tens digit up by one. No counting needed!",
        html: `<p><strong>10 more</strong> bumps the tens digit up by 1:</p>
               <p class="bigmath">47 → <strong>57</strong></p>
               <p>The ones digit doesn't move!</p>` },
      { title: "Ten less", say: "Ten less bumps the tens digit down. 62 becomes 52.",
        html: `<p><strong>10 less</strong> bumps the tens digit down by 1:</p>
               <p class="bigmath">62 → <strong>52</strong></p>
               ${vizBaseTen(52)}` },
    ],
    gen() {
      const more = Math.random() < 0.5;
      const n = more ? ri(11, 89) : ri(21, 99);
      return { q: `What is 10 ${more ? "MORE" : "LESS"} than ${n}? (No counting — use the tens digit!)`,
        viz: null, type: "num", answer: String(more ? n + 10 : n - 10),
        explain: `Just move the tens digit ${more ? "up" : "down"} one: ${n} → ${more ? n + 10 : n - 10}.` };
    },
  },

  // ----------------------------------------------------------------- 1.NBT.C.6
  "g1-subtract-tens": {
    lesson: [
      { title: "Subtracting tens", say: "70 minus 30 is just 7 tens minus 3 tens: 4 tens, which is 40.",
        html: `<p>Subtracting tens numbers is just a tens fact:</p>
               <p class="bigmath">70 − 30 → 7 tens − 3 tens = 4 tens → <strong>40</strong></p>` },
      { title: "Think small", say: "If you know 8 minus 5, you know 80 minus 50. Same fact, bigger blocks!",
        html: `<p>💡 Every tens problem hides a small fact you know:</p>
               <p class="bigmath">8 − 5 = 3 &nbsp;→&nbsp; 80 − 50 = 30</p>` },
    ],
    gen() {
      const a = ri(3, 9), b = ri(1, a - 1);
      return { q: `${a * 10} − ${b * 10} = ?`, viz: null, type: "num", answer: String((a - b) * 10),
        explain: `Think small: ${a} − ${b} = ${a - b}, so ${a * 10} − ${b * 10} = ${(a - b) * 10}.` };
    },
  },

  // ----------------------------------------------------------------- 1.M.A.1-2
  "g1-length": {
    lesson: [
      { title: "Long and short", say: "We can put things in order by length: shortest, medium, longest.",
        html: `<p>Things can be ordered by <strong>length</strong>:</p>
               <div class="viz-bars"><div style="width:30%">✏️</div><div style="width:55%">✏️</div><div style="width:85%">✏️</div></div>
               <p>Shortest → medium → <strong>longest</strong>.</p>` },
      { title: "Measure with units", say: "Lay little cubes along an object and count them. That's measuring!",
        html: `<p>To <strong>measure</strong>, lay same-size units end to end — no gaps, no overlaps — and count:</p>
               ${vizObjects("🟦", 6, 10)}
               <p>This ribbon is <strong>6 cubes</strong> long.</p>` },
      { title: "Compare without touching", say: "If a spoon is longer than a fork, and the fork is longer than a key, the spoon must be longer than the key!",
        html: `<p>🕵️ Compare two things using a <strong>third</strong>:</p>
               <p>The spoon is longer than the fork.<br>The fork is longer than the key.<br>So the spoon is longer than the key — no measuring needed!</p>` },
    ],
    gen() {
      const kind = pick(["count", "compare", "indirect"]);
      if (kind === "count") {
        const n = ri(3, 12);
        const item = pick(["ribbon", "pencil", "snake", "train", "rope"]);
        return { q: `How many cubes long is the ${item}?`, viz: vizObjects("🟦", n, 12), type: "num", answer: String(n),
          explain: `Count the cubes one by one: ${n}.` };
      }
      if (kind === "compare") {
        const lens = shuffle([ri(3, 5), ri(6, 8), ri(9, 12)]);
        const items = sampleN([["pencil", "✏️"], ["crayon", "🖍️"], ["paintbrush", "🖌️"]], 3);
        const longest = items[lens.indexOf(Math.max(...lens))][0];
        return { q: `Which is the LONGEST?`,
          viz: items.map(([w, e], i) => `<div class="viz-lenrow">${e} ${"🟦".repeat(lens[i])}</div>`).join(""),
          ...mc(longest, items.map(([w]) => w).filter((w) => w !== longest)),
          explain: `Count each row of cubes — the ${longest} has the most (${Math.max(...lens)}).` };
      }
      const [a, b, c] = sampleN(["ribbon", "scarf", "shoelace", "stick", "straw"], 3);
      return { q: `The ${a} is longer than the ${b}. The ${b} is longer than the ${c}. Which is the SHORTEST?`,
        viz: null, ...mc(c, [a, b]),
        explain: `${a} > ${b} > ${c}, so the ${c} is shortest.` };
    },
  },

  // ----------------------------------------------------------------- 1.M.B.3
  "g1-time": {
    lesson: [
      { title: "The two hands", say: "The short hand tells the hour. The long hand tells the minutes.",
        html: `<p>A clock has two hands:</p>
               <ul><li><strong>Short hand</strong> → the hour</li><li><strong>Long hand</strong> → the minutes</li></ul>
               ${vizClock(3, 0)}
               <p>Long hand on 12 = <strong>o'clock</strong>. This is <strong>3:00</strong>.</p>` },
      { title: "Half past", say: "When the long hand points at the 6, it's half past — thirty minutes.",
        html: `<p>Long hand on the <strong>6</strong> = <strong>half past</strong> (30 minutes):</p>
               ${vizClock(7, 30)}
               <p>This is <strong>7:30</strong> — half past seven. Notice the short hand is halfway between 7 and 8!</p>` },
      { title: "Writing time", say: "We write the hour, two dots, then the minutes: 7 colon 30.",
        html: `<p>Time is written <strong>hour : minutes</strong></p>
               <p class="bigmath">3:00 &nbsp; 7:30 &nbsp; 11:00</p>` },
    ],
    gen() {
      const h = ri(1, 12), half = Math.random() < 0.5;
      const ans = `${h}:${half ? "30" : "00"}`;
      if (Math.random() < 0.5) {
        return { q: `What time does the clock show? (Type it like 7:30)`, viz: vizClock(h, half ? 30 : 0),
          type: "num", answer: ans,
          explain: `Short hand ${half ? `halfway past ${h}` : `on ${h}`}, long hand on ${half ? "6 → half past" : "12 → o'clock"}: ${ans}.` };
      }
      const wrongH = h === 12 ? 1 : h + 1;
      return { q: `What time does the clock show?`, viz: vizClock(h, half ? 30 : 0),
        ...mc(ans, [`${wrongH}:${half ? "30" : "00"}`, `${h}:${half ? "00" : "30"}`, `${wrongH}:${half ? "00" : "30"}`]),
        explain: `The short hand gives the hour (${h}); the long hand on ${half ? "6 means :30" : "12 means :00"}.` };
    },
  },

  // ----------------------------------------------------------------- 1.M.C.4 (NJ)
  "g1-money": {
    lesson: [
      { title: "Meet the coins", say: "A penny is 1 cent, a nickel 5, a dime 10, and a quarter 25 cents.",
        html: `<p>Each coin has a value:</p>
               ${vizMoney([1, 5, 10, 25])}
               <p><strong>Penny 1¢ · Nickel 5¢ · Dime 10¢ · Quarter 25¢</strong></p>
               <p>💡 Size is sneaky: the dime is the smallest coin but beats the penny and nickel!</p>` },
      { title: "Bills", say: "Bills are paper money: 1, 5, 10, and 20 dollar bills.",
        html: `<p>Bills are paper money:</p>
               ${vizMoney([], [1, 5, 10, 20])}
               <p>One dollar = <strong>100 pennies</strong>!</p>` },
      { title: "Counting coins", say: "Count coins from biggest to smallest. A quarter and a dime make 35 cents.",
        html: `<p>Count from the <strong>biggest</strong> coin down:</p>
               ${vizMoney([25, 10, 1])}
               <p class="bigmath">25 → 35 → 36¢</p>` },
    ],
    gen() {
      const kind = pick(["value", "name", "count", "compareCoins"]);
      const coins = { penny: 1, nickel: 5, dime: 10, quarter: 25 };
      if (kind === "value") {
        const name = pick(Object.keys(coins));
        return { q: `How many cents is a ${name} worth?`, viz: vizMoney([coins[name]]),
          ...mc(`${coins[name]}¢`, Object.values(coins).filter((v) => v !== coins[name]).map((v) => `${v}¢`)),
          explain: `A ${name} is worth ${coins[name]}¢.` };
      }
      if (kind === "name") {
        const name = pick(Object.keys(coins));
        return { q: `Which coin is worth ${coins[name]}¢?`, viz: null,
          ...mc(name, Object.keys(coins).filter((n) => n !== name)),
          explain: `The ${name} is the ${coins[name]}¢ coin.` };
      }
      if (kind === "count") {
        const sel = [pick([25, 10]), pick([10, 5]), pick([5, 1])];
        const total = sel.reduce((s, v) => s + v, 0);
        return { q: `How many cents in all? (Just the number)`, viz: vizMoney(sel.sort((a, b) => b - a)),
          type: "num", answer: String(total),
          explain: `Count big to small: ${sel.sort((a, b) => b - a).join(" + ")} = ${total}¢.` };
      }
      const names = Object.keys(coins);
      const a = pick(names); let b = pick(names);
      while (b === a) b = pick(names);
      const bigger = coins[a] > coins[b] ? a : b;
      return { q: `Which is worth MORE: a ${a} or a ${b}?`, viz: vizMoney([coins[a], coins[b]]),
        ...mc(bigger, [bigger === a ? b : a]),
        explain: `${a} = ${coins[a]}¢, ${b} = ${coins[b]}¢ → the ${bigger} wins.` };
    },
  },

  // ----------------------------------------------------------------- 1.M.C.5 (NJ)
  "g1-money-problems": {
    lesson: [
      { title: "Shopping math", say: "Money stories are just adding and subtracting with dollars.",
        html: `<p>Money problems are stories with <strong>$</strong>:</p>
               <p>A toy costs $6 🧸 and a book costs $4 📕. Together?</p>
               <p class="bigmath">$6 + $4 = $10</p>` },
      { title: "Getting change", say: "If you pay with more than the price, you get change back. Subtract!",
        html: `<p>Pay too much? You get <strong>change</strong>:</p>
               <p>You have $15. A game costs $9.</p>
               <p class="bigmath">$15 − $9 = $6 left</p>` },
      { title: "Do I have enough?", say: "Compare what you have to the price. $8 is not enough for a $12 kite.",
        html: `<p>"Do I have enough?" → <strong>compare</strong>:</p>
               <p>You have $8. The kite costs $12. &nbsp;8 &lt; 12 → <strong>not enough</strong> 😢 — you need $4 more.</p>` },
    ],
    gen() {
      const name = pick(KID_NAMES);
      const items = [["toy car", 3, 9], ["book", 4, 10], ["puzzle", 5, 12], ["ball", 2, 8], ["game", 8, 15], ["kite", 6, 13]];
      const kind = pick(["total", "change", "enough", "save"]);
      if (kind === "total") {
        const [i1, lo1, hi1] = pick(items); let [i2, lo2, hi2] = pick(items);
        while (i2 === i1) [i2, lo2, hi2] = pick(items);
        const p1 = ri(lo1, Math.min(hi1, 9)), p2 = ri(lo2, Math.min(hi2, 20 - p1));
        return { q: `A ${i1} costs $${p1} and a ${i2} costs $${p2}. How much for both? (Type it like $9)`,
          viz: null, type: "num", answer: `$${p1 + p2}`,
          explain: `Add the prices: $${p1} + $${p2} = $${p1 + p2}.` };
      }
      if (kind === "change") {
        const have = pick([10, 15, 20]), [item, lo, hi] = pick(items);
        const price = ri(lo, Math.min(hi, have - 1));
        return { q: `${name} has $${have} and buys a ${item} for $${price}. How much is left? (Like $4)`,
          viz: null, type: "num", answer: `$${have - price}`,
          explain: `Subtract: $${have} − $${price} = $${have - price}.` };
      }
      if (kind === "enough") {
        const [item, lo, hi] = pick(items);
        const price = ri(lo + 2, hi), have = price + pick([-3, -2, 2, 3]);
        const enough = have >= price;
        return { q: `${name} has $${have}. The ${item} costs $${price}. Does ${name} have enough?`,
          viz: null, ...mc(enough ? "Yes" : "No", [enough ? "No" : "Yes"]),
          explain: `Compare: $${have} ${enough ? "≥" : "<"} $${price} → ${enough ? "enough!" : `needs $${price - have} more.`}` };
      }
      const goal = ri(10, 18), saved = ri(3, goal - 2);
      return { q: `${name} is saving for a $${goal} ${pick(["robot", "doll", "truck"])} and has $${saved}. How much MORE is needed? (Like $5)`,
        viz: null, type: "num", answer: `$${goal - saved}`,
        explain: `$${saved} + $${goal - saved} = $${goal}, so $${goal - saved} more.` };
    },
  },

  // ----------------------------------------------------------------- 1.DL.A.1
  "g1-data": {
    lesson: [
      { title: "Sorting into groups", say: "Data means information we collect, like everyone's favorite fruit.",
        html: `<p><strong>Data</strong> = information we collect and sort into groups.</p>
               ${vizPicto([{ label: "🍎 Apple", emoji: "✅", value: 5 }, { label: "🍌 Banana", emoji: "✅", value: 3 }, { label: "🍇 Grapes", emoji: "✅", value: 7 }])}
               <p>Each ✅ is one kid's vote for favorite fruit.</p>` },
      { title: "Reading data", say: "Count the marks in each row to answer questions. Grapes got 7 votes — the most!",
        html: `<p>Now we can answer questions:</p>
               <ul><li>Most votes? <strong>Grapes (7)</strong> 🏆</li>
               <li>How many more grapes than bananas? 7 − 3 = <strong>4</strong></li>
               <li>Total votes? 5 + 3 + 7 = <strong>15</strong></li></ul>` },
    ],
    gen() {
      const sets = [
        { theme: "favorite pet", cats: [["🐶 Dog"], ["🐱 Cat"], ["🐠 Fish"]] },
        { theme: "favorite fruit", cats: [["🍎 Apple"], ["🍌 Banana"], ["🍇 Grapes"]] },
        { theme: "way to get to school", cats: [["🚌 Bus"], ["🚗 Car"], ["🚶 Walk"]] },
        { theme: "favorite season", cats: [["☀️ Summer"], ["❄️ Winter"], ["🍂 Fall"]] },
      ];
      const s = pick(sets);
      const vals = [ri(2, 9), ri(2, 9), ri(2, 9)];
      while (new Set(vals).size < 3) { vals[ri(0, 2)] = ri(2, 9); }
      const rows = s.cats.map(([label], i) => ({ label, emoji: "✅", value: vals[i] }));
      const viz = vizPicto(rows);
      const kind = pick(["most", "least", "diff", "total", "count"]);
      const max = Math.max(...vals), min = Math.min(...vals);
      if (kind === "most") {
        const winner = rows[vals.indexOf(max)].label;
        return { q: `The class voted for their ${s.theme}. Which got the MOST votes?`, viz,
          ...mc(winner, rows.map((r) => r.label).filter((l) => l !== winner)),
          explain: `Count each row: ${rows.map((r) => `${r.label} ${r.value}`).join(", ")}. Most: ${winner}.` };
      }
      if (kind === "least") {
        const loser = rows[vals.indexOf(min)].label;
        return { q: `Which got the FEWEST votes for ${s.theme}?`, viz,
          ...mc(loser, rows.map((r) => r.label).filter((l) => l !== loser)),
          explain: `Smallest count is ${min} → ${loser}.` };
      }
      if (kind === "diff") {
        const hi = vals.indexOf(max), lo = vals.indexOf(min);
        return { q: `How many MORE votes did ${rows[hi].label} get than ${rows[lo].label}?`, viz,
          type: "num", answer: String(max - min),
          explain: `${max} − ${min} = ${max - min}.` };
      }
      if (kind === "total") {
        return { q: `How many kids voted in all?`, viz, type: "num", answer: String(vals[0] + vals[1] + vals[2]),
          explain: `Add all three rows: ${vals.join(" + ")} = ${vals[0] + vals[1] + vals[2]}.` };
      }
      const i = ri(0, 2);
      return { q: `How many kids picked ${rows[i].label}?`, viz, type: "num", answer: String(vals[i]),
        explain: `Count the ✅ marks in that row: ${vals[i]}.` };
    },
  },

  // ----------------------------------------------------------------- 1.G.A.1-2
  "g1-shapes": {
    lesson: [
      { title: "What makes a shape", say: "A triangle always has 3 sides and 3 corners. Color and size don't matter!",
        html: `<p>Shapes are named by what's <strong>always</strong> true:</p>
               <div class="viz-row">${vizShape("triangle")}${vizShape("square")}${vizShape("hexagon")}</div>
               <p>Triangle: <strong>3 sides</strong>. Square: <strong>4 equal sides</strong>. Hexagon: <strong>6 sides</strong>.</p>` },
      { title: "Defining or not?", say: "Sides and corners define a shape. Color, size, and direction do not.",
        html: `<p>🟦 <strong>Defining</strong>: number of sides, number of corners, closed.</p>
               <p>🎨 <strong>NOT defining</strong>: color, size, which way it's turned.</p>
               <p>A tiny red upside-down triangle is still a triangle!</p>` },
      { title: "Building new shapes", say: "Small shapes can combine into bigger shapes — two squares make a rectangle!",
        html: `<p>Shapes can <strong>combine</strong>:</p>
               <p>Two squares side by side → a <strong>rectangle</strong>. Two triangles can make a square!</p>
               <div class="viz-row">${vizShape("square")}<span class="viz-sep">+</span>${vizShape("square")}<span class="viz-sep">=</span>${vizShape("rectangle")}</div>` },
    ],
    gen() {
      const shapes = [["triangle", 3], ["square", 4], ["rectangle", 4], ["pentagon", 5], ["hexagon", 6]];
      const kind = pick(["sides", "corners", "name", "defining"]);
      if (kind === "sides" || kind === "corners") {
        const [name, n] = pick(shapes);
        return { q: `How many ${kind} does a ${name} have?`, viz: vizShape(name), type: "num", answer: String(n),
          explain: `A ${name} always has ${n} sides and ${n} corners.` };
      }
      if (kind === "name") {
        const [name, n] = pick(shapes.filter(([s]) => s !== "rectangle"));
        return { q: `Which shape has exactly ${n === 4 ? "4 EQUAL sides" : `${n} sides`}?`, viz: null,
          ...mc(name, shapes.map(([s]) => s).filter((s) => s !== name && s !== (name === "square" ? "rectangle" : ""))),
          explain: `${name === "square" ? "A square has 4 equal sides." : `A ${name} has ${n} sides.`}` };
      }
      const defining = ["how many sides it has", "how many corners it has", "whether it is closed"];
      const notDefining = ["its color", "its size", "which way it is turned"];
      const ans = pick(notDefining);
      return { q: `Which of these does NOT change what a shape is called?  Pick the one that does NOT matter.`,
        viz: null, ...mc(ans, sampleN(defining, 3)),
        explain: `Color, size, and direction never change a shape's name — sides and corners do.` };
    },
  },

  // ----------------------------------------------------------------- 1.G.A.3
  "g1-halves-fourths": {
    lesson: [
      { title: "Fair shares", say: "Splitting into equal parts makes fair shares. Two equal parts are halves.",
        html: `<p>Split a shape into <strong>equal parts</strong> = fair shares.</p>
               ${vizPartitionedCircle(2, 1)}
               <p>Two equal shares → <strong>halves</strong>. One of them is <strong>half</strong> of the circle.</p>` },
      { title: "Fourths", say: "Four equal shares are called fourths, or quarters.",
        html: `<p>Four equal shares → <strong>fourths</strong> (also called <strong>quarters</strong>):</p>
               ${vizPartitionedCircle(4, 1)}
               <p>💡 More shares = each share is <strong>smaller</strong>. A fourth is smaller than a half!</p>` },
      { title: "Equal or not?", say: "Shares must be the same size to be fair. Unequal pieces are not halves!",
        html: `<p>⚠️ Shares only count if they're <strong>equal</strong>:</p>
               ${vizFractionBar(1, 2)}
               <p>This rectangle is split into 2 equal shares — real halves.</p>` },
    ],
    gen() {
      const kind = pick(["name", "count", "bigger", "shareOf"]);
      if (kind === "name") {
        const four = Math.random() < 0.5;
        const shape = pick(["circle", "rectangle"]);
        const viz = shape === "circle" ? vizPartitionedCircle(four ? 4 : 2, 0) : vizFractionBar(0, four ? 4 : 2);
        return { q: `This ${shape} is cut into equal shares. What are the shares called?`, viz,
          ...mc(four ? "fourths" : "halves", [four ? "halves" : "fourths", "thirds"]),
          explain: `${four ? 4 : 2} equal shares are called ${four ? "fourths (quarters)" : "halves"}.` };
      }
      if (kind === "count") {
        const four = Math.random() < 0.5;
        return { q: `How many equal shares make ${four ? "fourths" : "halves"}?`, viz: null,
          type: "num", answer: four ? "4" : "2",
          explain: `${four ? "Fourths = 4" : "Halves = 2"} equal shares.` };
      }
      if (kind === "bigger") {
        return { q: `You can have HALF a cookie or a FOURTH of the same cookie. Which piece is BIGGER?`,
          viz: `<div class="viz-row">${vizPartitionedCircle(2, 1)}${vizPartitionedCircle(4, 1)}</div>`,
          ...mc("half", ["fourth", "they are equal"]),
          explain: `Fewer shares means bigger pieces — a half beats a fourth!` };
      }
      const four = Math.random() < 0.5;
      return { q: `A pizza is shared equally by ${four ? 4 : 2} friends. What share does each friend get?`,
        viz: vizPartitionedCircle(four ? 4 : 2, 1),
        ...mc(four ? "one fourth" : "one half", [four ? "one half" : "one fourth", "one whole"]),
        explain: `${four ? 4 : 2} equal shares → each gets one ${four ? "fourth" : "half"}.` };
    },
  },
});

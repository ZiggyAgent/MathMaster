// Tier A "show your work" — guided step-by-step walkthroughs for topics where
// the method matters. Each walkthrough builds a fresh problem and the exact
// sequence of steps a tutor would walk a child through, so the app can give
// feedback on the *approach* (which step went wrong), not just the final
// answer — with no AI, instant, offline. Step answers are computed, never
// hardcoded. Shape per step: { prompt, answer, hint, viz? }.

function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

registerWalkthroughs({

  // 1.OA.C.6 — the make-a-ten bridging strategy
  "g1-facts-20"() {
    const a = ri(6, 9);
    const b = ri(Math.max(2, 11 - a), Math.min(9, 18 - a)); // forces crossing 10
    const need = 10 - a, left = b - need;
    return {
      problem: `${a} + ${b}`,
      viz: vizTenFrame(a),
      answer: String(a + b),
      steps: [
        { prompt: `First make a ten. How many more does ${a} need to reach 10?`, answer: String(need),
          hint: `${a} + ${need} = 10.` },
        { prompt: `Take those ${need} from the ${b}. How many are left over?`, answer: String(left),
          hint: `${b} − ${need} = ${left}.` },
        { prompt: `Now add the easy way: 10 + ${left} = ?`, answer: String(a + b),
          hint: `Ten plus ${left} is ${a + b}.` },
      ],
    };
  },

  // 1.NBT.C.4 — two-digit + one-digit by bridging through the next ten
  "g1-add-100"() {
    const o = ri(5, 9), tens = ri(2, 8);
    const a = tens * 10 + o;
    const b = ri(11 - o, 9); // crosses the ten, leaves at least 1
    const nextTen = a + (10 - o), need = 10 - o, left = b - need;
    return {
      problem: `${a} + ${b}`,
      answer: String(a + b),
      steps: [
        { prompt: `What do we add to ${a} to reach the next ten, ${nextTen}?`, answer: String(need),
          hint: `${a} + ${need} = ${nextTen}.` },
        { prompt: `We used ${need} of the ${b}. How many are left to add?`, answer: String(left),
          hint: `${b} − ${need} = ${left}.` },
        { prompt: `Last step: ${nextTen} + ${left} = ?`, answer: String(a + b),
          hint: `${nextTen} + ${left} = ${a + b}.` },
      ],
    };
  },

  // 5.NF.A.1 — add fractions with unlike denominators
  "g5-frac-add"() {
    const dens = [2, 3, 4, 5, 6];
    let d1 = pick(dens), d2 = pick(dens.filter((d) => d !== d1));
    const a = ri(1, d1 - 1), c = ri(1, d2 - 1);
    const L = lcm(d1, d2), t1 = (a * L) / d1, t2 = (c * L) / d2;
    return {
      problem: `${a}/${d1} + ${c}/${d2}`,
      viz: vizFractionBars(a, d1, c, d2),
      answer: fracStr(t1 + t2, L),
      steps: [
        { prompt: `Find a denominator that both ${d1} and ${d2} divide into.`, answer: String(L),
          hint: `The smallest one is ${L}.` },
        { prompt: `Rename ${a}/${d1} as ${L}ths:  ${a}/${d1} = ?/${L}.  What's the new top number?`, answer: String(t1),
          hint: `Multiply top and bottom by ${L / d1}: ${a} × ${L / d1} = ${t1}.` },
        { prompt: `Rename ${c}/${d2} as ${L}ths:  ${c}/${d2} = ?/${L}.  New top?`, answer: String(t2),
          hint: `Multiply top and bottom by ${L / d2}: ${c} × ${L / d2} = ${t2}.` },
        { prompt: `Add the tops over ${L} and simplify:  (${t1} + ${t2})/${L} = ?`, answer: fracStr(t1 + t2, L),
          hint: `${t1} + ${t2} = ${t1 + t2}, so ${t1 + t2}/${L} = ${fracStr(t1 + t2, L)}.` },
      ],
    };
  },

  // 5.NF.B.4 — multiply two fractions
  "g5-frac-mult"() {
    const b = ri(2, 6), d = ri(2, 6), a = ri(1, b - 1), c = ri(1, d - 1);
    return {
      problem: `${a}/${b} × ${c}/${d}`,
      viz: vizAreaGrid(d, b, { wLabel: `${c}/${d}`, hLabel: `${a}/${b}` }),
      answer: fracStr(a * c, b * d),
      steps: [
        { prompt: `Multiply the tops (numerators): ${a} × ${c} = ?`, answer: String(a * c),
          hint: `${a} × ${c} = ${a * c}.` },
        { prompt: `Multiply the bottoms (denominators): ${b} × ${d} = ?`, answer: String(b * d),
          hint: `${b} × ${d} = ${b * d}.` },
        { prompt: `Write it as a fraction and simplify:  ${a * c}/${b * d} = ?`, answer: fracStr(a * c, b * d),
          hint: `${a * c}/${b * d} simplifies to ${fracStr(a * c, b * d)}.` },
      ],
    };
  },

  // 5.NBT.B.5 — multi-digit multiplication by place value (partial products)
  "g5-multiply"() {
    const a = ri(12, 49), b = ri(3, 9);
    const ones = (a % 10) * b, tens = Math.floor(a / 10) * 10 * b;
    return {
      problem: `${a} × ${b}`,
      answer: String(a * b),
      steps: [
        { prompt: `Multiply the ones: ${a % 10} × ${b} = ?`, answer: String(ones),
          hint: `${a % 10} × ${b} = ${ones}.` },
        { prompt: `Multiply the tens: ${Math.floor(a / 10) * 10} × ${b} = ?`, answer: String(tens),
          hint: `${Math.floor(a / 10)} tens × ${b} = ${tens}.` },
        { prompt: `Add the two parts: ${ones} + ${tens} = ?`, answer: String(a * b),
          hint: `${ones} + ${tens} = ${a * b}.` },
      ],
    };
  },

  // 5.OA.A.1 — order of operations
  "g5-expressions"() {
    const m = ri(2, 5), x = ri(1, 6), y = ri(1, 6);
    const inner = x + y, prod = m * inner, s = ri(1, prod - 1);
    return {
      problem: `${m} × (${x} + ${y}) − ${s}`,
      answer: String(prod - s),
      steps: [
        { prompt: `Do the parentheses first: ${x} + ${y} = ?`, answer: String(inner),
          hint: `${x} + ${y} = ${inner}.` },
        { prompt: `Now multiply: ${m} × ${inner} = ?`, answer: String(prod),
          hint: `${m} × ${inner} = ${prod}.` },
        { prompt: `Finally subtract: ${prod} − ${s} = ?`, answer: String(prod - s),
          hint: `${prod} − ${s} = ${prod - s}.` },
      ],
    };
  },

});

// MathMaster curriculum — 2023 New Jersey Student Learning Standards,
// Mathematics (NJSLS-M), grades 1-8. Source of truth:
// https://www.nj.gov/education/standards/math/2023/<grade>.shtml
//
// Each topic maps to one NJSLS standard (occasionally two tightly-coupled
// ones) and keeps the official code(s) so parents can cross-check.
// `nj: true` marks standards that are NJ-specific additions with no direct
// Common Core equivalent (money in grade 1, the Data Literacy "ask questions
// about data / understand variability" strand). Everything else is shared
// with Common Core — if this ever expands beyond NJ, diff on this flag.
//
// Grades with `CONTENT[topic.id]` defined (see content/gradeN.js) are fully
// playable; other grades show their topic list as "coming soon".

const CURRICULUM = {
  1: { domains: [
    { code: "OA", name: "Adding & Subtracting", icon: "➕", topics: [
      { id: "g1-add-stories",    title: "Story Problems",            standards: ["1.OA.A.1"], blurb: "Solve add and subtract stories within 20" },
      { id: "g1-three-addends",  title: "Adding Three Numbers",      standards: ["1.OA.A.2"], blurb: "Word problems with three numbers to add" },
      { id: "g1-add-properties", title: "Turn-Around Facts",         standards: ["1.OA.B.3"], blurb: "Switch and group numbers to add easier" },
      { id: "g1-missing-addend", title: "Subtraction Detective",     standards: ["1.OA.B.4"], blurb: "Solve subtraction by finding the missing addend" },
      { id: "g1-count-on",       title: "Counting On & Back",        standards: ["1.OA.C.5"], blurb: "Use counting to add and subtract" },
      { id: "g1-facts-20",       title: "Math Facts to 20",          standards: ["1.OA.C.6"], blurb: "Add and subtract within 20 with smart strategies" },
      { id: "g1-equal-sign",     title: "True or False Equations",   standards: ["1.OA.D.7"], blurb: "What the equal sign really means" },
      { id: "g1-missing-number", title: "Find the Missing Number",   standards: ["1.OA.D.8"], blurb: "Fill in the blank in + and − equations" },
    ]},
    { code: "NBT", name: "Numbers & Place Value", icon: "🔢", topics: [
      { id: "g1-count-120",      title: "Counting to 120",           standards: ["1.NBT.A.1"], blurb: "Count and write numbers up to 120" },
      { id: "g1-tens-ones",      title: "Tens and Ones",             standards: ["1.NBT.B.2"], blurb: "Two-digit numbers are tens and ones" },
      { id: "g1-compare",        title: "Comparing Numbers",         standards: ["1.NBT.B.3"], blurb: "Use <, =, > to compare two-digit numbers" },
      { id: "g1-add-100",        title: "Adding Bigger Numbers",     standards: ["1.NBT.C.4"], blurb: "Add within 100 using place value" },
      { id: "g1-ten-more",       title: "Ten More, Ten Less",        standards: ["1.NBT.C.5"], blurb: "Jump by ten in your head" },
      { id: "g1-subtract-tens",  title: "Subtracting Tens",          standards: ["1.NBT.C.6"], blurb: "Subtract 10, 20, 30… from tens numbers" },
    ]},
    { code: "M", name: "Measurement", icon: "📏", topics: [
      { id: "g1-length",         title: "Long and Short",            standards: ["1.M.A.1", "1.M.A.2"], blurb: "Order and measure lengths with units" },
      { id: "g1-time",           title: "Telling Time",              standards: ["1.M.B.3"], blurb: "Clocks: hours and half hours" },
      { id: "g1-money",          title: "Coins and Dollars",         standards: ["1.M.C.4"], nj: true, blurb: "Know what each coin and bill is worth" },
      { id: "g1-money-problems", title: "Shopping Problems",         standards: ["1.M.C.5"], nj: true, blurb: "Solve money problems up to $20" },
    ]},
    { code: "DL", name: "Data", icon: "📊", topics: [
      { id: "g1-data",           title: "Sort and Count",            standards: ["1.DL.A.1"], blurb: "Organize and read data in three categories" },
    ]},
    { code: "G", name: "Shapes", icon: "🔷", topics: [
      { id: "g1-shapes",         title: "Shape Detective",           standards: ["1.G.A.1", "1.G.A.2"], blurb: "What makes a shape a shape; build new ones" },
      { id: "g1-halves-fourths", title: "Halves and Fourths",        standards: ["1.G.A.3"], blurb: "Split circles and rectangles into equal shares" },
    ]},
  ]},

  2: { domains: [
    { code: "OA", name: "Adding & Subtracting", icon: "➕", topics: [
      { id: "g2-two-step",       title: "One & Two-Step Stories",    standards: ["2.OA.A.1"], blurb: "Add/subtract word problems within 100" },
      { id: "g2-fluency-20",     title: "Fast Facts to 20",          standards: ["2.OA.B.2"], blurb: "Mental strategies; know sums of two one-digit numbers" },
      { id: "g2-odd-even",       title: "Odd and Even",              standards: ["2.OA.C.3"], blurb: "Tell odd from even by pairing" },
      { id: "g2-arrays",         title: "Rows and Columns",          standards: ["2.OA.C.4"], blurb: "Use arrays to add equal groups" },
    ]},
    { code: "NBT", name: "Numbers & Place Value", icon: "🔢", topics: [
      { id: "g2-hundreds",       title: "Hundreds, Tens, Ones",      standards: ["2.NBT.A.1", "2.NBT.A.2"], blurb: "Three-digit place value; skip-count by 5s, 10s, 100s" },
      { id: "g2-read-write",     title: "Reading & Writing to 1000", standards: ["2.NBT.A.3", "2.NBT.A.4"], blurb: "Numerals, words, expanded form; compare with <, =, >" },
      { id: "g2-add-sub-100",    title: "Add & Subtract to 100",     standards: ["2.NBT.B.5", "2.NBT.B.6"], blurb: "Fluent two-digit addition and subtraction" },
      { id: "g2-add-sub-1000",   title: "Add & Subtract to 1000",    standards: ["2.NBT.B.7", "2.NBT.B.8", "2.NBT.B.9"], blurb: "Three-digit +/−; add or subtract 10 and 100 mentally" },
    ]},
    { code: "M", name: "Measurement", icon: "📏", topics: [
      { id: "g2-measure",        title: "Measuring Length",          standards: ["2.M.A.1", "2.M.A.2", "2.M.A.3", "2.M.A.4"], blurb: "Rulers, units, estimating, comparing lengths" },
      { id: "g2-length-math",    title: "Length Word Problems",      standards: ["2.M.B.5", "2.M.B.6"], blurb: "Add and subtract lengths; number line diagrams" },
      { id: "g2-time-money",     title: "Time and Money",            standards: ["2.M.C.7", "2.M.C.8"], blurb: "Time to 5 minutes; dollars and cents problems" },
    ]},
    { code: "DL", name: "Data", icon: "📊", topics: [
      { id: "g2-data-questions", title: "Asking Data Questions",     standards: ["2.DL.A.1", "2.DL.A.2"], nj: true, blurb: "Data answers questions; answers can vary" },
      { id: "g2-graphs",         title: "Picture & Bar Graphs",      standards: ["2.DL.B.3", "2.DL.B.4"], blurb: "Make and read line plots, picture and bar graphs" },
    ]},
    { code: "G", name: "Shapes", icon: "🔷", topics: [
      { id: "g2-shapes",         title: "Naming Shapes",             standards: ["2.G.A.1"], blurb: "Triangles, quadrilaterals, pentagons, hexagons, cubes" },
      { id: "g2-partition",      title: "Equal Shares",              standards: ["2.G.A.2", "2.G.A.3"], blurb: "Split rectangles and circles into halves, thirds, fourths" },
    ]},
  ]},

  3: { domains: [
    { code: "OA", name: "Multiplying & Dividing", icon: "✖️", topics: [
      { id: "g3-mult-meaning",   title: "What Multiplication Means", standards: ["3.OA.A.1", "3.OA.A.2"], blurb: "Equal groups, arrays; division as sharing" },
      { id: "g3-mult-stories",   title: "× and ÷ Story Problems",    standards: ["3.OA.A.3", "3.OA.A.4"], blurb: "Word problems and missing numbers within 100" },
      { id: "g3-properties",     title: "Multiplication Tricks",     standards: ["3.OA.B.5", "3.OA.B.6"], blurb: "Turn-around, grouping, distributive; ÷ as unknown factor" },
      { id: "g3-fluency",        title: "Times Tables",              standards: ["3.OA.C.7"], blurb: "Multiply and divide within 100, fast" },
      { id: "g3-two-step",       title: "Two-Step Problems",         standards: ["3.OA.D.8", "3.OA.D.9"], blurb: "All four operations; spot number patterns" },
    ]},
    { code: "NBT", name: "Numbers & Place Value", icon: "🔢", topics: [
      { id: "g3-rounding",       title: "Rounding",                  standards: ["3.NBT.A.1"], blurb: "Round to the nearest 10 or 100" },
      { id: "g3-add-sub-1000",   title: "Add & Subtract to 1000",    standards: ["3.NBT.A.2"], blurb: "Fluent three-digit addition and subtraction" },
      { id: "g3-mult-tens",      title: "Multiplying by Tens",       standards: ["3.NBT.A.3"], blurb: "One-digit × multiples of 10" },
    ]},
    { code: "NF", name: "Fractions", icon: "🍕", topics: [
      { id: "g3-frac-meaning",   title: "What Fractions Are",        standards: ["3.NF.A.1", "3.NF.A.2"], blurb: "Unit fractions; fractions on the number line" },
      { id: "g3-frac-compare",   title: "Equivalent & Comparing",    standards: ["3.NF.A.3"], blurb: "Equal fractions; compare with same top or bottom" },
    ]},
    { code: "M", name: "Measurement", icon: "📏", topics: [
      { id: "g3-time-volume",    title: "Time, Liquids & Mass",      standards: ["3.M.A.1", "3.M.A.2"], blurb: "Time to the minute; grams, kilograms, liters" },
      { id: "g3-area",           title: "Area",                      standards: ["3.M.B.3", "3.M.B.4", "3.M.B.5"], blurb: "Count unit squares; area = length × width" },
      { id: "g3-perimeter",      title: "Perimeter",                 standards: ["3.M.C.6"], blurb: "Distance around a shape; perimeter vs area" },
    ]},
    { code: "DL", name: "Data", icon: "📊", topics: [
      { id: "g3-data-questions", title: "Data Questions",            standards: ["3.DL.A.1", "3.DL.A.2"], nj: true, blurb: "Ask questions, collect and use data" },
      { id: "g3-graphs",         title: "Scaled Graphs",             standards: ["3.DL.B.3", "3.DL.B.4"], blurb: "Scaled bar/picture graphs and line plots" },
    ]},
    { code: "G", name: "Shapes", icon: "🔷", topics: [
      { id: "g3-shapes",         title: "Quadrilateral Club",        standards: ["3.G.A.1", "3.G.A.2"], blurb: "Shape categories; partition into equal areas" },
    ]},
  ]},

  4: { domains: [
    { code: "OA", name: "Operations & Patterns", icon: "✖️", topics: [
      { id: "g4-multiplicative", title: "Times-As-Many Problems",    standards: ["4.OA.A.1", "4.OA.A.2", "4.OA.A.3"], blurb: "Multiplicative comparison; multi-step problems with remainders" },
      { id: "g4-factors",        title: "Factors and Multiples",     standards: ["4.OA.B.4"], blurb: "Factor pairs, prime and composite to 100" },
      { id: "g4-patterns",       title: "Number Patterns",           standards: ["4.OA.C.5"], blurb: "Generate and analyze patterns from rules" },
    ]},
    { code: "NBT", name: "Numbers & Place Value", icon: "🔢", topics: [
      { id: "g4-place-value",    title: "Big Place Value",           standards: ["4.NBT.A.1", "4.NBT.A.2", "4.NBT.A.3"], blurb: "A digit is 10× the place to its right; compare, round" },
      { id: "g4-add-sub",        title: "Add & Subtract Big Numbers",standards: ["4.NBT.B.4"], blurb: "Fluent multi-digit addition and subtraction" },
      { id: "g4-multiply",       title: "Multi-Digit Multiplication",standards: ["4.NBT.B.5"], blurb: "Up to 4-digit × 1-digit and 2-digit × 2-digit" },
      { id: "g4-divide",         title: "Division with Remainders",  standards: ["4.NBT.B.6"], blurb: "Up to 4-digit ÷ 1-digit" },
    ]},
    { code: "NF", name: "Fractions", icon: "🍕", topics: [
      { id: "g4-equivalent",     title: "Equivalent Fractions",      standards: ["4.NF.A.1", "4.NF.A.2"], blurb: "Make and compare equivalent fractions" },
      { id: "g4-frac-add",       title: "Adding Fractions",          standards: ["4.NF.B.3", "4.NF.B.4"], blurb: "Add/subtract like denominators & mixed numbers; fraction × whole" },
      { id: "g4-decimals",       title: "Meet Decimals",             standards: ["4.NF.C.5", "4.NF.C.6", "4.NF.C.7"], blurb: "Tenths and hundredths; compare decimals" },
    ]},
    { code: "M", name: "Measurement", icon: "📏", topics: [
      { id: "g4-convert",        title: "Unit Conversions",          standards: ["4.M.A.1", "4.M.A.2", "4.M.A.3"], blurb: "km/m/cm, kg/g, lb/oz, time; area & perimeter formulas" },
      { id: "g4-angles",         title: "Measuring Angles",          standards: ["4.M.B.4", "4.M.B.5", "4.M.B.6"], blurb: "Degrees, protractors, adding angle parts" },
    ]},
    { code: "DL", name: "Data", icon: "📊", topics: [
      { id: "g4-data-viz",       title: "Data Displays",             standards: ["4.DL.A.1", "4.DL.A.2", "4.DL.A.3", "4.DL.A.4"], nj: true, blurb: "Organize data, choose and critique visualizations" },
      { id: "g4-line-plots",     title: "Fraction Line Plots",       standards: ["4.DL.B.5"], blurb: "Line plots with halves, quarters, eighths" },
    ]},
    { code: "G", name: "Geometry", icon: "🔷", topics: [
      { id: "g4-lines-angles",   title: "Lines, Angles & Symmetry",  standards: ["4.G.A.1", "4.G.A.2", "4.G.A.3"], blurb: "Parallel, perpendicular; classify shapes; symmetry" },
    ]},
  ]},

  5: { domains: [
    { code: "OA", name: "Expressions & Patterns", icon: "🧮", topics: [
      { id: "g5-expressions",      title: "Order of Operations",       standards: ["5.OA.A.1"], blurb: "Parentheses, brackets — evaluate expressions" },
      { id: "g5-write-expressions",title: "Writing Expressions",       standards: ["5.OA.A.2"], blurb: "Turn words into math without solving" },
      { id: "g5-patterns",         title: "Two Patterns at Once",      standards: ["5.OA.B.3"], blurb: "Generate patterns, compare them, graph the pairs" },
    ]},
    { code: "NBT", name: "Place Value & Decimals", icon: "🔢", topics: [
      { id: "g5-place-value",    title: "Place Value Power",         standards: ["5.NBT.A.1"], blurb: "Each place is 10× the right, 1/10 the left" },
      { id: "g5-powers-10",      title: "Powers of 10",              standards: ["5.NBT.A.2"], blurb: "Multiply/divide by 10, 100, 1000 — watch the digits shift" },
      { id: "g5-decimals-read",  title: "Decimals to Thousandths",   standards: ["5.NBT.A.3"], blurb: "Read, write, and compare decimals" },
      { id: "g5-rounding",       title: "Rounding Decimals",         standards: ["5.NBT.A.4"], blurb: "Round decimals to any place" },
      { id: "g5-multiply",       title: "Multiplication Master",     standards: ["5.NBT.B.5"], blurb: "Fluent multi-digit multiplication" },
      { id: "g5-divide",         title: "Division",                  standards: ["5.NBT.B.6"], blurb: "Divide up to 4 digits by 2 digits" },
      { id: "g5-decimal-ops",    title: "Decimal Operations",        standards: ["5.NBT.B.7"], blurb: "Add, subtract, multiply, divide decimals" },
    ]},
    { code: "NF", name: "Fractions", icon: "🍕", topics: [
      { id: "g5-frac-add",       title: "Unlike Denominators",       standards: ["5.NF.A.1"], blurb: "Add and subtract any fractions" },
      { id: "g5-frac-word",      title: "Fraction Story Problems",   standards: ["5.NF.A.2"], blurb: "+/− fraction word problems; estimate to check" },
      { id: "g5-frac-division",  title: "Fractions Are Division",    standards: ["5.NF.B.3"], blurb: "3/4 means 3 ÷ 4 — share things equally" },
      { id: "g5-frac-mult",      title: "Multiplying Fractions",     standards: ["5.NF.B.4"], blurb: "Fraction × fraction, fraction × whole" },
      { id: "g5-frac-scaling",   title: "Multiply = Resize",         standards: ["5.NF.B.5"], blurb: "Predict if a product gets bigger or smaller" },
      { id: "g5-frac-mult-word", title: "Fraction × Stories",        standards: ["5.NF.B.6"], blurb: "Real-world fraction multiplication" },
      { id: "g5-frac-div-unit",  title: "Dividing with Fractions",   standards: ["5.NF.B.7"], blurb: "Unit fraction ÷ whole and whole ÷ unit fraction" },
    ]},
    { code: "M", name: "Measurement", icon: "📦", topics: [
      { id: "g5-convert",        title: "Converting Units",          standards: ["5.M.A.1"], blurb: "cm↔m, g↔kg, oz↔lb, minutes↔hours in problems" },
      { id: "g5-volume",         title: "What Volume Is",            standards: ["5.M.B.2", "5.M.B.3"], blurb: "Count unit cubes to measure space inside" },
      { id: "g5-volume-formula", title: "Volume Formula",            standards: ["5.M.B.4"], blurb: "V = l × w × h; add volumes of combined shapes" },
    ]},
    { code: "DL", name: "Data", icon: "📊", topics: [
      { id: "g5-data-viz",       title: "Reading Data Displays",     standards: ["5.DL.A.1", "5.DL.A.2", "5.DL.A.3", "5.DL.A.4"], nj: true, blurb: "Analyze and question data visualizations" },
      { id: "g5-line-plots",     title: "Fraction Line Plots",       standards: ["5.DL.B.5"], blurb: "Line plots with fractions; use them to solve problems" },
    ]},
    { code: "G", name: "Geometry", icon: "🔷", topics: [
      { id: "g5-coord",          title: "Coordinate Plane",          standards: ["5.G.A.1", "5.G.A.2"], blurb: "Plot and read (x, y) points to solve problems" },
      { id: "g5-classify",       title: "Shape Hierarchy",           standards: ["5.G.B.3", "5.G.B.4"], blurb: "A square IS a rectangle — classify shapes by properties" },
    ]},
  ]},

  6: { domains: [
    { code: "RP", name: "Ratios & Rates", icon: "⚖️", topics: [
      { id: "g6-ratios",         title: "Ratios",                    standards: ["6.RP.A.1", "6.RP.A.2"], blurb: "Ratio language and unit rates" },
      { id: "g6-ratio-problems", title: "Ratio & Percent Problems",  standards: ["6.RP.A.3"], blurb: "Tables, unit pricing, percents, unit conversions" },
    ]},
    { code: "NS", name: "The Number System", icon: "🔢", topics: [
      { id: "g6-frac-div",       title: "Dividing Fractions",        standards: ["6.NS.A.1"], blurb: "Fraction ÷ fraction with models and stories" },
      { id: "g6-fluency",        title: "Big Number Fluency",        standards: ["6.NS.B.2", "6.NS.B.3", "6.NS.B.4"], blurb: "Long division, decimal ops, GCF & LCM" },
      { id: "g6-negatives",      title: "Negative Numbers",          standards: ["6.NS.C.5", "6.NS.C.6", "6.NS.C.7"], blurb: "Integers, opposites, absolute value, ordering" },
      { id: "g6-coord-plane",    title: "Four-Quadrant Graphing",    standards: ["6.NS.C.8"], blurb: "Plot points in all four quadrants; distances" },
    ]},
    { code: "EE", name: "Expressions & Equations", icon: "🧮", topics: [
      { id: "g6-exponents",      title: "Exponents & Expressions",   standards: ["6.EE.A.1", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4"], blurb: "Powers, variables, equivalent expressions" },
      { id: "g6-equations",      title: "Solving Equations",         standards: ["6.EE.B.5", "6.EE.B.6", "6.EE.B.7", "6.EE.B.8"], blurb: "One-step equations and inequalities" },
      { id: "g6-variables",      title: "Two Variables",             standards: ["6.EE.C.9"], blurb: "Dependent and independent variables" },
    ]},
    { code: "G", name: "Geometry", icon: "🔷", topics: [
      { id: "g6-geometry",       title: "Area, Surface Area, Volume",standards: ["6.G.A.1", "6.G.A.2", "6.G.A.3", "6.G.A.4"], blurb: "Triangles, polygons, prisms, nets, coordinates" },
    ]},
    { code: "SP", name: "Statistics", icon: "📊", topics: [
      { id: "g6-variability",    title: "Statistical Questions",     standards: ["6.SP.A.1", "6.SP.A.2", "6.SP.A.3"], blurb: "Variability, center, and spread" },
      { id: "g6-distributions",  title: "Describing Data",           standards: ["6.SP.B.4", "6.SP.B.5"], blurb: "Histograms, box plots, mean, median, IQR" },
    ]},
  ]},

  7: { domains: [
    { code: "RP", name: "Proportional Relationships", icon: "⚖️", topics: [
      { id: "g7-proportions",    title: "Proportional or Not?",      standards: ["7.RP.A.1", "7.RP.A.2"], blurb: "Unit rates with fractions; spot proportionality" },
      { id: "g7-percent",        title: "Percent Problems",          standards: ["7.RP.A.3"], blurb: "Tax, tip, discount, markup, percent error" },
    ]},
    { code: "NS", name: "The Number System", icon: "🔢", topics: [
      { id: "g7-add-sub-rational", title: "Adding Signed Numbers",   standards: ["7.NS.A.1"], blurb: "Add and subtract positive and negative numbers" },
      { id: "g7-mult-div-rational",title: "Multiplying Signed Numbers", standards: ["7.NS.A.2"], blurb: "Multiply/divide rationals; repeating decimals" },
      { id: "g7-rational-problems",title: "Rational Number Problems",standards: ["7.NS.A.3"], blurb: "All four operations in real-world problems" },
    ]},
    { code: "EE", name: "Expressions & Equations", icon: "🧮", topics: [
      { id: "g7-expressions",    title: "Equivalent Expressions",    standards: ["7.EE.A.1", "7.EE.A.2"], blurb: "Combine like terms, expand, factor linear expressions" },
      { id: "g7-equations",      title: "Two-Step Equations",        standards: ["7.EE.B.3", "7.EE.B.4"], blurb: "Multi-step problems; px + q = r and inequalities" },
    ]},
    { code: "G", name: "Geometry", icon: "🔷", topics: [
      { id: "g7-scale",          title: "Scale Drawings",            standards: ["7.G.A.1", "7.G.A.2", "7.G.A.3"], blurb: "Scale factors, constructions, slicing 3D shapes" },
      { id: "g7-circles-angles", title: "Circles & Angles",          standards: ["7.G.B.4", "7.G.B.5", "7.G.B.6"], blurb: "Circumference, area, angle pairs, composite figures" },
    ]},
    { code: "SP", name: "Statistics & Probability", icon: "🎲", topics: [
      { id: "g7-sampling",       title: "Sampling",                  standards: ["7.SP.A.1", "7.SP.A.2"], blurb: "Random samples and inferences about populations" },
      { id: "g7-compare-pops",   title: "Comparing Groups",          standards: ["7.SP.B.3", "7.SP.B.4"], blurb: "Compare two data distributions" },
      { id: "g7-probability",    title: "Probability",               standards: ["7.SP.C.5", "7.SP.C.6", "7.SP.C.7", "7.SP.C.8"], blurb: "Chance, models, compound events, simulations" },
    ]},
  ]},

  8: { domains: [
    { code: "NS", name: "The Number System", icon: "🔢", topics: [
      { id: "g8-irrational",     title: "Irrational Numbers",        standards: ["8.NS.A.1", "8.NS.A.2", "8.NS.A.3"], blurb: "Rational vs irrational; approximate √2 and friends" },
    ]},
    { code: "EE", name: "Expressions & Equations", icon: "🧮", topics: [
      { id: "g8-exponents",      title: "Exponent Rules",            standards: ["8.EE.A.1", "8.EE.A.2"], blurb: "Integer exponent properties; square and cube roots" },
      { id: "g8-scientific",     title: "Scientific Notation",       standards: ["8.EE.A.3", "8.EE.A.4"], blurb: "Very big and very small numbers" },
      { id: "g8-slope",          title: "Slope & Linear Equations",  standards: ["8.EE.B.5", "8.EE.B.6"], blurb: "Unit rate as slope; y = mx + b" },
      { id: "g8-solve-linear",   title: "Solving Linear Equations",  standards: ["8.EE.C.7"], blurb: "Variables on both sides, distributing, fractions" },
      { id: "g8-systems",        title: "Systems of Equations",      standards: ["8.EE.C.8"], blurb: "Two equations, two unknowns" },
    ]},
    { code: "F", name: "Functions", icon: "📈", topics: [
      { id: "g8-functions",      title: "What Is a Function?",       standards: ["8.F.A.1", "8.F.A.2", "8.F.A.3"], blurb: "Input → output rules; linear vs nonlinear" },
      { id: "g8-model-linear",   title: "Modeling with Functions",   standards: ["8.F.B.4", "8.F.B.5"], blurb: "Rate of change, initial value, qualitative graphs" },
    ]},
    { code: "G", name: "Geometry", icon: "🔷", topics: [
      { id: "g8-transformations",title: "Transformations",           standards: ["8.G.A.1", "8.G.A.2", "8.G.A.3", "8.G.A.4", "8.G.A.5"], blurb: "Slides, flips, turns, dilations; congruence & similarity" },
      { id: "g8-pythagorean",    title: "Pythagorean Theorem",       standards: ["8.G.B.6", "8.G.B.7", "8.G.B.8"], blurb: "a² + b² = c²; side lengths and distances" },
      { id: "g8-volume",         title: "Cones, Cylinders, Spheres", standards: ["8.G.C.9"], blurb: "Volume formulas for round solids" },
    ]},
    { code: "SP", name: "Statistics", icon: "📊", topics: [
      { id: "g8-scatter",        title: "Scatter Plots & Lines",     standards: ["8.SP.A.1", "8.SP.A.2", "8.SP.A.3", "8.SP.A.4"], blurb: "Patterns in two-variable data; lines of best fit" },
    ]},
  ]},
};

// Lessons + question generators register here, keyed by topic id
// (see content/gradeN.js). A grade is playable when all its topics have content.
const CONTENT = {};
function registerContent(map) { Object.assign(CONTENT, map); }

function gradeTopics(grade) {
  return CURRICULUM[grade].domains.flatMap((d) => d.topics);
}
function gradeIsPlayable(grade) {
  return gradeTopics(grade).every((t) => CONTENT[t.id]);
}
function topicById(id) {
  for (const g of Object.keys(CURRICULUM)) {
    for (const t of gradeTopics(Number(g))) if (t.id === id) return { ...t, grade: Number(g) };
  }
  return null;
}

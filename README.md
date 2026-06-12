# 🧮 MathMaster

Mastery-based math learning for kids, grades 1–8, aligned to the **2023 New
Jersey Student Learning Standards – Mathematics** (NJSLS-M). Part of the Kids
Arcade (see SpellMaster's `ARCADE_PLAYBOOK.md`).

**Live:** https://ziggyagent.github.io/MathMaster/

## How it works

- Pick a grade → see every topic from the NJ standards with its official codes
  (NJ-specific standards carry an `NJ` badge; the rest are Common Core-shared).
- Per topic: short illustrated **lesson** (with read-aloud) → **practice**
  (10 generated questions, ≥80% = ⭐ learned) → **next-day review** (5
  questions, ≥80% = 🏆 mastered).
- All topics mastered → the **Grade Quiz** (2 fresh questions per topic).
  ≥85% overall with no topic at zero → **level up** to the next grade.
  Weak topics drop back to 📘 for re-learning.
- Questions are generated procedurally — every set, review, and quiz is new.

Content authored so far: **Grades 1 and 5** (others show their topic list as
coming soon).

## Architecture

Static HTML/JS/CSS on GitHub Pages, shared "Kids Games" Supabase backend
(`math` schema; shared `arcade` accounts — same name+PIN as SpellMaster).
All DB access through SECURITY DEFINER RPCs; scores and mastery transitions
are computed server-side from raw per-item results. Migrations in `supabase/`.

-- MathMaster setup: `math` schema in the shared Kids Games Supabase project.
-- Follows the arcade conventions: RLS on every table, no grants to anon,
-- all client access through SECURITY DEFINER RPCs that validate player+PIN
-- via arcade.check_player. Scores and mastery-state transitions are computed
-- server-side from raw per-item results; the client never sends a total.
--
-- Mastery state machine per (player, topic):
--   (none) --practice >=80%--> learned (review unlocks next day, ET midnight)
--   learned --review >=80% after unlock--> mastered
--   learned --review <80%--> back to learning (redo practice)
--   mastered --grade quiz underscore--> back to learning
-- Grade quiz (2 questions per topic over every topic in the grade):
--   level up when overall >= 85% AND no topic scored 0 correct.
--   topics with 0 correct are always demoted; if overall < 85%, topics with
--   any miss are demoted too.

create schema if not exists math;
grant usage on schema math to anon, authenticated;

create table if not exists math.profiles (
  player_id uuid primary key references arcade.players(id) on delete cascade,
  grade smallint not null check (grade between 1 and 8),
  completed_grades smallint[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table math.profiles enable row level security;

create table if not exists math.topic_progress (
  player_id uuid not null references arcade.players(id) on delete cascade,
  topic_id text not null,
  state text not null default 'learning' check (state in ('learning','learned','mastered')),
  best_score smallint,
  last_score smallint,
  sets_done int not null default 0,
  learned_at timestamptz,
  mastered_at timestamptz,
  review_due_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (player_id, topic_id)
);
alter table math.topic_progress enable row level security;

create table if not exists math.attempts (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references arcade.players(id) on delete cascade,
  grade smallint not null check (grade between 1 and 8),
  topic_id text,                       -- null for quiz/warmup attempts
  kind text not null check (kind in ('practice','review','quiz','warmup')),
  correct int not null,
  total int not null,
  items jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists attempts_player_idx on math.attempts (player_id, created_at desc);
alter table math.attempts enable row level security;

-- Next local midnight in NJ: a review done at 8pm unlocks at 12:00am, not 24h later.
create or replace function math.next_day_et()
returns timestamptz
language sql stable
as $$
  select (((now() at time zone 'America/New_York')::date + 1)::timestamp)
         at time zone 'America/New_York';
$$;

-- Count correct items: an item is correct when its normalized given answer
-- equals the expected answer. The client normalizes (trim/lowercase/number
-- formats) before submitting; the server does a defensive trim+lower too.
create or replace function math.count_correct(p_items jsonb)
returns int
language sql immutable
as $$
  select count(*)::int from jsonb_array_elements(p_items) it
  where lower(trim(it->>'given')) = lower(trim(it->>'answer'));
$$;

-- Full state for the signed-in player: profile (or null on first visit) and
-- every topic_progress row.
create or replace function math.get_state(p_player_id uuid, p_pin text)
returns json
language sql security definer
set search_path = math, arcade, pg_temp
as $$
  select case when not arcade.check_player(p_player_id, p_pin)
    then json_build_object('ok', false, 'error', 'Invalid player credentials.')
    else json_build_object('ok', true,
      'profile', (select row_to_json(pr) from (
        select grade, completed_grades from math.profiles where player_id = p_player_id
      ) pr),
      'topics', coalesce((select json_agg(row_to_json(t)) from (
        select topic_id, state, best_score, last_score, sets_done,
               review_due_at, (review_due_at is not null and review_due_at <= now()) as review_ready
        from math.topic_progress where player_id = p_player_id
      ) t), '[]'::json))
  end;
$$;

-- Set/change the working grade (first-time setup, or a parent moving a kid).
create or replace function math.set_grade(p_player_id uuid, p_pin text, p_grade int)
returns json
language plpgsql security definer
set search_path = math, arcade, pg_temp
as $$
begin
  if not arcade.check_player(p_player_id, p_pin) then
    return json_build_object('ok', false, 'error', 'Invalid player credentials.');
  end if;
  if p_grade < 1 or p_grade > 8 then
    return json_build_object('ok', false, 'error', 'Grade must be 1-8.');
  end if;
  insert into math.profiles (player_id, grade) values (p_player_id, p_grade)
  on conflict (player_id) do update set grade = excluded.grade, updated_at = now();
  return json_build_object('ok', true, 'grade', p_grade);
end $$;

-- Save a practice/review/warmup set and advance the topic state machine.
-- Items jsonb: [{q, answer, given, topic_id?}] (topic_id per item only for warmup).
create or replace function math.submit_set(
  p_player_id uuid, p_pin text, p_grade int, p_topic_id text, p_kind text, p_items jsonb
)
returns json
language plpgsql security definer
set search_path = math, arcade, pg_temp
as $$
declare
  v_total int;
  v_correct int;
  v_pct numeric;
  v_row math.topic_progress%rowtype;
  v_state text;
  v_review timestamptz;
  v_event text := null;   -- 'learned' | 'mastered' | 'demoted' for the client to celebrate/explain
begin
  if not arcade.check_player(p_player_id, p_pin) then
    return json_build_object('ok', false, 'error', 'Invalid player credentials.');
  end if;
  v_total := jsonb_array_length(p_items);
  if p_grade < 1 or p_grade > 8 or v_total < 3 or v_total > 30
     or p_kind not in ('practice','review','warmup') then
    return json_build_object('ok', false, 'error', 'Invalid set data.');
  end if;
  v_correct := math.count_correct(p_items);
  v_pct := round(100.0 * v_correct / v_total);

  if p_kind = 'warmup' then
    insert into math.attempts (player_id, grade, topic_id, kind, correct, total, items)
    values (p_player_id, p_grade, null, 'warmup', v_correct, v_total, p_items);
    return json_build_object('ok', true, 'correct', v_correct, 'total', v_total, 'pct', v_pct);
  end if;

  if p_topic_id is null or length(p_topic_id) < 3 then
    return json_build_object('ok', false, 'error', 'Missing topic.');
  end if;

  insert into math.topic_progress (player_id, topic_id)
  values (p_player_id, p_topic_id)
  on conflict (player_id, topic_id) do nothing;
  select * into v_row from math.topic_progress
   where player_id = p_player_id and topic_id = p_topic_id for update;

  v_state := v_row.state;
  v_review := v_row.review_due_at;

  if p_kind = 'practice' then
    if v_pct >= 80 and v_state = 'learning' then
      v_state := 'learned';
      v_review := math.next_day_et();
      v_event := 'learned';
    end if;
    -- practicing an already learned/mastered topic never demotes it
  else -- review
    if v_state <> 'learned' then
      return json_build_object('ok', false, 'error', 'This topic is not waiting for a review.');
    end if;
    if v_row.review_due_at is null or v_row.review_due_at > now() then
      return json_build_object('ok', false, 'error', 'review_not_ready');
    end if;
    if v_pct >= 80 then
      v_state := 'mastered';
      v_review := null;
      v_event := 'mastered';
    else
      v_state := 'learning';
      v_review := null;
      v_event := 'demoted';
    end if;
  end if;

  update math.topic_progress set
    state = v_state,
    best_score = greatest(coalesce(best_score, 0), v_pct::smallint),
    last_score = v_pct::smallint,
    sets_done = sets_done + 1,
    learned_at = case when v_event = 'learned' then now() else learned_at end,
    mastered_at = case when v_event = 'mastered' then now() else mastered_at end,
    review_due_at = v_review,
    updated_at = now()
  where player_id = p_player_id and topic_id = p_topic_id;

  insert into math.attempts (player_id, grade, topic_id, kind, correct, total, items)
  values (p_player_id, p_grade, p_topic_id, p_kind, v_correct, v_total, p_items);

  return json_build_object('ok', true, 'correct', v_correct, 'total', v_total,
    'pct', v_pct, 'state', v_state, 'event', v_event, 'review_due_at', v_review);
end $$;

-- Grade quiz: items [{q, answer, given, topic_id}], 2 per mastered topic.
create or replace function math.submit_quiz(p_player_id uuid, p_pin text, p_grade int, p_items jsonb)
returns json
language plpgsql security definer
set search_path = math, arcade, pg_temp
as $$
declare
  v_total int;
  v_correct int;
  v_pct numeric;
  v_passed boolean;
  v_profile math.profiles%rowtype;
  v_unmastered int;
  v_zero int;
  v_demoted text[];
  v_topics json;
begin
  if not arcade.check_player(p_player_id, p_pin) then
    return json_build_object('ok', false, 'error', 'Invalid player credentials.');
  end if;
  v_total := jsonb_array_length(p_items);
  if p_grade < 1 or p_grade > 8 or v_total < 10 or v_total > 200 then
    return json_build_object('ok', false, 'error', 'Invalid quiz data.');
  end if;
  select * into v_profile from math.profiles where player_id = p_player_id for update;
  if not found or v_profile.grade <> p_grade then
    return json_build_object('ok', false, 'error', 'Quiz grade does not match your level.');
  end if;

  -- every topic in the quiz must currently be mastered (the client only
  -- offers the quiz then; this guards against stale/forged submissions)
  select count(*) into v_unmastered from (
    select distinct it->>'topic_id' as tid from jsonb_array_elements(p_items) it
  ) q left join math.topic_progress tp
    on tp.player_id = p_player_id and tp.topic_id = q.tid
  where tp.state is distinct from 'mastered';
  if v_unmastered > 0 then
    return json_build_object('ok', false, 'error', 'All topics must be mastered before the big quiz.');
  end if;

  v_correct := math.count_correct(p_items);
  v_pct := round(100.0 * v_correct / v_total);

  -- per-topic tallies
  create temp table _qt on commit drop as
    select it->>'topic_id' as tid,
           count(*) as total,
           count(*) filter (where lower(trim(it->>'given')) = lower(trim(it->>'answer'))) as correct
    from jsonb_array_elements(p_items) it group by 1;

  select count(*) into v_zero from _qt where correct = 0;
  v_passed := (v_pct >= 85) and (v_zero = 0);

  if v_passed then
    update math.profiles
       set completed_grades = (select array_agg(distinct g order by g)
                               from unnest(completed_grades || p_grade::smallint) g),
           grade = least(p_grade + 1, 8),
           updated_at = now()
     where player_id = p_player_id;
  else
    select coalesce(array_agg(tid), '{}') into v_demoted from _qt
     where correct = 0 or (v_pct < 85 and correct < total);
    update math.topic_progress
       set state = 'learning', review_due_at = null, mastered_at = null, updated_at = now()
     where player_id = p_player_id and topic_id = any(v_demoted);
  end if;

  insert into math.attempts (player_id, grade, topic_id, kind, correct, total, items)
  values (p_player_id, p_grade, null, 'quiz', v_correct, v_total, p_items);

  select json_agg(json_build_object('topic_id', tid, 'correct', correct, 'total', total,
                                    'demoted', (not v_passed and (correct = 0 or (v_pct < 85 and correct < total)))))
    into v_topics from _qt;

  return json_build_object('ok', true, 'passed', v_passed, 'correct', v_correct,
    'total', v_total, 'pct', v_pct,
    'new_grade', case when v_passed then least(p_grade + 1, 8) else p_grade end,
    'finished_grade_8', v_passed and p_grade = 8,
    'topics', coalesce(v_topics, '[]'::json));
end $$;

-- Admin: every player's math progress + recent daily activity. Admin flag is
-- checked server-side (arcade.players.is_admin).
create or replace function math.get_admin_stats(p_player_id uuid, p_pin text)
returns json
language sql security definer
set search_path = math, arcade, pg_temp
as $$
  select case when not exists (
      select 1 from arcade.players where id = p_player_id and pin = p_pin and is_admin
    )
    then json_build_object('ok', false, 'error', 'Admins only.')
    else json_build_object('ok', true,
      'players', coalesce((select json_agg(row_to_json(t)) from (
        select p.name, pr.grade, pr.completed_grades,
          count(tp.*) filter (where tp.state = 'mastered') as mastered,
          count(tp.*) filter (where tp.state = 'learned') as learned,
          count(tp.*) filter (where tp.state = 'learning') as learning,
          (select count(*) from math.attempts a where a.player_id = p.id) as sets_done,
          (select max(a.created_at)::date from math.attempts a where a.player_id = p.id) as last_active
        from math.profiles pr
        join arcade.players p on p.id = pr.player_id
        left join math.topic_progress tp on tp.player_id = pr.player_id
        group by p.id, p.name, pr.grade, pr.completed_grades
        order by p.name
      ) t), '[]'::json),
      'daily', coalesce((select json_agg(row_to_json(d)) from (
        select a.created_at::date as day, p.name, count(*) as sets,
               sum((a.correct)::int) as correct, sum(a.total) as total
        from math.attempts a join arcade.players p on p.id = a.player_id
        where a.created_at > now() - interval '14 days'
        group by 1, 2 order by 1 desc, 2
      ) d), '[]'::json))
  end;
$$;

-- Lock down: internals not callable, public RPCs are.
revoke execute on function math.next_day_et() from anon, authenticated, public;
revoke execute on function math.count_correct(jsonb) from anon, authenticated, public;
grant execute on function math.get_state(uuid, text) to anon, authenticated;
grant execute on function math.set_grade(uuid, text, int) to anon, authenticated;
grant execute on function math.submit_set(uuid, text, int, text, text, jsonb) to anon, authenticated;
grant execute on function math.submit_quiz(uuid, text, int, jsonb) to anon, authenticated;
grant execute on function math.get_admin_stats(uuid, text) to anon, authenticated;

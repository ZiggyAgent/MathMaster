// MathMaster service worker. Goal: installable + plays offline, but new
// deploys always win — a kid must never get stuck on a stale version. So we
// use NETWORK-FIRST for same-origin GETs (fetch fresh, fall back to cache when
// offline) and never touch Supabase requests (those must always hit the live
// API, and are skipped entirely here).

const CACHE = "mathmaster-v1";
const SHELL = [
  ".", "index.html", "style.css", "app.js", "gen-utils.js", "viz.js",
  "curriculum.js", "content/grade1.js", "content/grade5.js",
  "content/walkthroughs.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // Only handle same-origin GETs; let Supabase and everything else pass through.
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("index.html")))
  );
});

/* =============================================================
   Jordan Vale — Voice Over Portfolio  ·  interactions
   Vanilla JS, no dependencies.
   ============================================================= */
(function () {
  "use strict";

  /* ---------- Year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav link via scroll spy ---------- */
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navAnchors.forEach(function (a) {
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Demo tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll(".tab-panel").forEach(function (panel) {
        var show = panel.id === "panel-" + target;
        panel.classList.toggle("is-active", show);
        panel.hidden = !show;
      });
    });
  });

  /* ---------- Custom audio players ----------
     One <audio> element is shared; only one track plays at a time. */
  var audio = new Audio();
  var current = null; // the .player article currently bound to `audio`

  var fmt = function (s) {
    if (!isFinite(s)) return "--:--";
    var m = Math.floor(s / 60);
    var ss = Math.floor(s % 60);
    return m + ":" + (ss < 10 ? "0" : "") + ss;
  };

  var players = Array.prototype.slice.call(document.querySelectorAll(".player"));

  players.forEach(function (player) {
    var src = player.getAttribute("data-src");
    var playBtn = player.querySelector('[data-role="play"]');
    var timeEl = player.querySelector('[data-role="time"]');
    var bar = player.querySelector('[data-role="bar"]');
    var fill = player.querySelector('[data-role="fill"]');

    // Probe the file so we can show duration (and disable if missing).
    var probe = new Audio();
    probe.preload = "metadata";
    probe.src = src;
    probe.addEventListener("loadedmetadata", function () {
      timeEl.textContent = fmt(probe.duration);
    });
    probe.addEventListener("error", function () {
      player.classList.add("is-disabled");
      timeEl.textContent = "soon";
    });

    var setPlayingUI = function (playing) {
      playBtn.classList.toggle("is-playing", playing);
      playBtn.textContent = playing ? "❚❚" : "▶";
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    };

    playBtn.addEventListener("click", function () {
      if (player.classList.contains("is-disabled")) return;

      // Switching to a different track? reset the previous one's UI.
      if (current && current !== player) {
        current._reset();
      }

      if (current !== player) {
        audio.src = src;
        current = player;
        current._reset = function () {
          setPlayingUI(false);
          fill.style.width = "0%";
        };
        current._sync = function () {
          var pct = (audio.currentTime / audio.duration) * 100 || 0;
          fill.style.width = pct + "%";
          timeEl.textContent = fmt(audio.duration - audio.currentTime);
        };
      }

      if (audio.paused) {
        audio.play().then(function () { setPlayingUI(true); }).catch(function () {});
      } else {
        audio.pause();
        setPlayingUI(false);
      }
    });

    // Click-to-seek on the progress bar.
    bar.addEventListener("click", function (e) {
      if (current !== player || !isFinite(audio.duration)) return;
      var rect = bar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
  });

  audio.addEventListener("timeupdate", function () {
    if (current && current._sync) current._sync();
  });
  audio.addEventListener("ended", function () {
    if (current && current._reset) current._reset();
  });
})();

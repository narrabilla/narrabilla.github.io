/* =============================================================
   Voice Over Portfolio  ·  renders the whole page from content.json
   Vanilla JS, no dependencies. To change content, edit content.json.
   ============================================================= */
(function () {
  "use strict";

  /* Escape text/attribute values before putting them into HTML. */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- Load content, then render + wire up ---------- */
  fetch("content.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      render(data);
      initInteractions();
    })
    .catch(showLoadError);

  /* ============================================================
     RENDER
     ============================================================ */
  function render(d) {
    var s = d.site || {};

    /* SEO (applied from JSON, with the static <head> tags as fallback) */
    if (s.seoTitle) document.title = s.seoTitle;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && s.seoDescription) metaDesc.setAttribute("content", s.seoDescription);

    renderNav(s);
    renderHero(d.hero || {});
    renderAbout(d.about || {});
    renderProjects(d.projects || {});
    renderSamples(d.samples || {});
    renderServices(d.services || {});
    renderWhy(d.why || {});
    renderContact(d.contact || {});
    renderFooter(s);
  }

  function renderNav(s) {
    var links = (s.navLinks || []).map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.label) + "</a>";
    }).join("");
    var cta = s.navCta
      ? '<a href="' + esc(s.navCta.href) + '" class="nav__cta">' + esc(s.navCta.label) + "</a>"
      : "";

    $("navInner").innerHTML =
      '<a href="#top" class="nav__brand">' +
        '<span class="nav__mark">' + esc(s.initials) + "</span>" +
        '<span class="nav__name">' + esc(s.name) + "</span>" +
      "</a>" +
      '<nav class="nav__links" id="navLinks" aria-label="Primary">' + links + cta + "</nav>" +
      '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">' +
        "<span></span><span></span><span></span></button>";
  }

  function renderHero(h) {
    var stats = (h.stats || []).map(function (st) {
      return "<li><strong>" + esc(st.value) + "</strong><span>" + esc(st.label) + "</span></li>";
    }).join("");

    var portrait = h.photo
      ? '<div class="hero__portrait" aria-hidden="true" style="background-image:url(\'' + esc(h.photo) + '\')"></div>'
      : '<div class="hero__portrait" aria-hidden="true"><div class="hero__portrait-fallback">Your<br>photo<br>here</div></div>';

    var pCta = h.ctaPrimary || {}, sCta = h.ctaSecondary || {};

    $("heroInner").innerHTML =
      '<div class="hero__text">' +
        '<p class="eyebrow">' + esc(h.eyebrow) + "</p>" +
        '<h1 class="hero__title">' + esc(h.titleTop) + "<br /><em>" + esc(h.titleEm) + "</em></h1>" +
        '<p class="hero__lede">' + esc(h.lede) + "</p>" +
        '<div class="hero__actions">' +
          '<a href="' + esc(pCta.href) + '" class="btn btn--primary">▶ ' + esc(pCta.label) + "</a>" +
          '<a href="' + esc(sCta.href) + '" class="btn btn--ghost">' + esc(sCta.label) + "</a>" +
        "</div>" +
        '<ul class="hero__stats">' + stats + "</ul>" +
      "</div>" +
      '<div class="hero__media">' +
        portrait +
        '<div class="hero__badge"><span class="hero__badge-dot"></span> ' + esc(h.badge) + "</div>" +
      "</div>";
  }

  function renderAbout(a) {
    var paras = (a.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var chips = (a.chips || []).map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join("");
    var details = (a.details || []).map(function (dt) {
      return '<div class="detail"><h3>' + esc(dt.title) + "</h3><p>" + esc(dt.text) + "</p></div>";
    }).join("");

    $("aboutInner").innerHTML =
      '<div class="about__head"><p class="eyebrow">' + esc(a.eyebrow) + '</p>' +
        '<h2 class="section__title">' + esc(a.heading) + "</h2></div>" +
      '<div class="about__body">' +
        '<div class="about__col">' + paras + '<div class="about__qualities">' + chips + "</div></div>" +
        '<div class="about__col about__details">' + details + "</div>" +
      "</div>";
  }

  /* Reusable bits ------------------------------------------------ */
  function langPill(lang) {
    return lang ? '<span class="lang-pill">' + esc(lang) + "</span>" : "";
  }
  function metaChip(icon, val) {
    return '<span class="meta-item"><span class="meta-ic">' + icon + "</span>" + esc(val) + "</span>";
  }
  function audioPlayerHtml(t, titleOverride, setupFallback) {
    var setup = t.setup || setupFallback;
    var meta = setup ? '<div class="player__meta">' + metaChip("🎚️", setup) + "</div>" : "";
    return (
      '<article class="player" data-src="' + esc(t.src) + '">' +
        '<div class="player__top">' +
          '<div class="player__labels"><span class="player__tag">' + esc(t.tag) + "</span>" + langPill(t.language) + "</div>" +
          '<span class="player__time" data-role="time">--:--</span></div>' +
        '<h3 class="player__title">' + esc(titleOverride || t.title) + "</h3>" +
        (t.desc ? '<p class="player__desc">' + esc(t.desc) + "</p>" : "") +
        meta +
        '<div class="player__controls">' +
          '<button class="player__play" data-role="play" aria-label="Play">▶</button>' +
          '<div class="player__bar" data-role="bar"><span data-role="fill"></span></div>' +
        "</div>" +
      "</article>"
    );
  }
  function videoCardHtml(v, setupFallback) {
    var aspect = v.aspect ? ' style="aspect-ratio:' + esc(v.aspect) + '"' : "";
    var labels = (v.tag || v.language)
      ? '<div class="vcard__labels">' + (v.tag ? '<span class="player__tag">' + esc(v.tag) + "</span>" : "") + langPill(v.language) + "</div>"
      : "";
    var setup = v.setup || setupFallback;
    var meta = setup ? '<div class="vcard__meta">' + metaChip("🎚️", setup) + "</div>" : "";
    return (
      '<figure class="vcard"><div class="vcard__frame"' + aspect + ">" +
        '<video class="vcard__video" controls preload="none" playsinline poster="' + esc(v.poster) + '">' +
          '<source src="' + esc(v.src) + '" type="video/mp4" />' +
          "Your browser doesn't support embedded video." +
        "</video></div>" +
        '<figcaption class="vcard__cap">' + labels +
          "<h3>" + esc(v.title) + "</h3><p>" + esc(v.caption) + "</p>" + meta + "</figcaption>" +
      "</figure>"
    );
  }
  function sectionHead(eyebrow, heading, sub) {
    return '<div class="section__head"><p class="eyebrow">' + esc(eyebrow) + "</p>" +
      '<h2 class="section__title">' + esc(heading) + "</h2>" +
      (sub ? '<p class="section__sub">' + esc(sub) + "</p>" : "") + "</div>";
  }

  /* Projects (real client work, with process details) ------------ */
  function metaStrip(meta) {
    meta = meta || {};
    var rows = [];
    var add = function (icon, val) { if (val) rows.push(metaChip(icon, val)); };
    add("⏱", meta.turnaround);
    add("🎚️", meta.setup);
    add("🗣️", meta.language);
    add("📅", meta.year);
    add("🏷️", meta.client);
    add("📐", meta.scope);
    return rows.length ? '<div class="project__meta">' + rows.join("") + "</div>" : "";
  }

  function renderProjects(p) {
    var items = (p.items || []).map(function (it) {
      var m = it.media || {};
      var media;
      if (m.kind === "audio") {
        media = '<div class="project__media">' + audioPlayerHtml({ src: m.src, tag: it.category }, "Listen") + "</div>";
      } else {
        media =
          '<div class="project__media"><div class="project__frame">' +
            '<video controls preload="none" playsinline poster="' + esc(m.poster) + '">' +
              '<source src="' + esc(m.src) + '" type="video/mp4" />' +
              "Your browser doesn't support embedded video." +
            "</video></div></div>";
      }
      return (
        '<article class="project">' + media +
          '<div class="project__body">' +
            (it.category ? '<span class="project__cat">' + esc(it.category) + "</span>" : "") +
            '<h3 class="project__title">' + esc(it.title) + "</h3>" +
            (it.summary ? '<p class="project__summary">' + esc(it.summary) + "</p>" : "") +
            metaStrip(it.meta) +
          "</div>" +
        "</article>"
      );
    }).join("");

    $("projectsInner").innerHTML =
      sectionHead(p.eyebrow, p.heading, p.sub) +
      '<div class="projects-grid">' + items + "</div>";
  }

  /* Samples (spec pieces) ---------------------------------------- */
  function renderSamples(s) {
    var audio = (s.audio || []).map(function (t) { return audioPlayerHtml(t, null, s.setup); }).join("");
    var videos = (s.video || []).map(function (v) { return videoCardHtml(v, s.setup); }).join("");
    var videoBlock = videos ? '<div class="video-grid sample-videos">' + videos + "</div>" : "";

    $("samplesInner").innerHTML =
      sectionHead(s.eyebrow, s.heading, s.sub) +
      '<div class="audio-grid">' + audio + "</div>" +
      videoBlock;
  }

  function cardHtml(c) {
    return '<article class="card"><span class="card__icon">' + esc(c.icon) + "</span>" +
      "<h3>" + esc(c.title) + "</h3><p>" + esc(c.desc) + "</p></article>";
  }

  function renderServices(sv) {
    $("servicesInner").innerHTML =
      sectionHead(sv.eyebrow, sv.heading) +
      '<div class="cards">' + (sv.items || []).map(cardHtml).join("") + "</div>";
  }

  function renderWhy(w) {
    $("whyInner").innerHTML =
      sectionHead(w.eyebrow, w.heading, w.sub) +
      '<div class="cards">' + (w.cards || []).map(cardHtml).join("") + "</div>";
  }

  function methodHtml(icon, label, value, href, external) {
    var attrs = external ? ' target="_blank" rel="noopener"' : "";
    return '<a class="method" href="' + esc(href) + '"' + attrs + ">" +
      '<span class="method__icon">' + icon + "</span>" +
      '<span class="method__label">' + esc(label) + "</span>" +
      '<span class="method__value">' + esc(value) + "</span></a>";
  }

  function renderContact(c) {
    var m = c.methods || {};
    var ig = m.instagram || {}, wa = m.whatsapp || {};
    var html =
      '<p class="eyebrow">' + esc(c.eyebrow) + "</p>" +
      '<h2 class="section__title">' + esc(c.heading) + "</h2>" +
      '<p class="contact__lede">' + esc(c.lede) + "</p>" +
      '<div class="contact__methods">';
    if (ig.url) html += methodHtml("📸", "Instagram", ig.handle, ig.url, true);
    if (wa.url) html += methodHtml("💬", "WhatsApp", wa.display, wa.url, true);
    if (m.email) html += methodHtml("✉️", "Email", m.email, "mailto:" + m.email, false);
    html += "</div>";
    $("contactInner").innerHTML = html;
  }

  function renderFooter(s) {
    $("footerInner").innerHTML =
      '<span class="footer__brand">' + esc(s.name) + "</span>" +
      '<span class="footer__copy">© ' + new Date().getFullYear() + " " + esc(s.name) + " · " + esc(s.role) + "</span>" +
      '<a href="#top" class="footer__top">Back to top ↑</a>';
  }

  /* ============================================================
     INTERACTIONS (run after render, since the DOM is built above)
     ============================================================ */
  function initInteractions() {
    /* Sticky nav shadow */
    var nav = $("nav");
    var onScroll = function () {
      if (window.scrollY > 8) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    var toggle = $("navToggle");
    var links = $("navLinks");
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

    /* Scroll-spy: highlight the active nav link */
    var navAnchors = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
    var sections = navAnchors
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (sec) { spy.observe(sec); });
    }

    initAudioPlayers();
  }

  /* ---------- Custom audio players + "only one media at a time" ---------- */
  function initAudioPlayers() {
    var audio = new Audio();
    var current = null;

    var fmt = function (s) {
      if (!isFinite(s)) return "--:--";
      var m = Math.floor(s / 60);
      var ss = Math.floor(s % 60);
      return m + ":" + (ss < 10 ? "0" : "") + ss;
    };

    [].slice.call(document.querySelectorAll(".player")).forEach(function (player) {
      var src = player.getAttribute("data-src");
      var playBtn = player.querySelector('[data-role="play"]');
      var timeEl = player.querySelector('[data-role="time"]');
      var bar = player.querySelector('[data-role="bar"]');
      var fill = player.querySelector('[data-role="fill"]');

      var probe = new Audio();
      probe.preload = "metadata";
      probe.src = src;
      probe.addEventListener("loadedmetadata", function () { timeEl.textContent = fmt(probe.duration); });
      probe.addEventListener("error", function () {
        player.classList.add("is-disabled");
        timeEl.textContent = "soon";
      });

      // Defined on the element so the shared <audio> events below can reach them.
      player._setPlaying = function (playing) {
        playBtn.classList.toggle("is-playing", playing);
        playBtn.textContent = playing ? "❚❚" : "▶";
        playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
      };
      player._reset = function () { player._setPlaying(false); fill.style.width = "0%"; };
      player._sync = function () {
        var pct = (audio.currentTime / audio.duration) * 100 || 0;
        fill.style.width = pct + "%";
        timeEl.textContent = fmt(audio.duration - audio.currentTime);
      };

      playBtn.addEventListener("click", function () {
        if (player.classList.contains("is-disabled")) return;
        if (current && current !== player) current._reset();
        if (current !== player) {
          audio.src = src;
          current = player;
        }
        if (audio.paused) audio.play().catch(function () {});
        else audio.pause();
      });

      bar.addEventListener("click", function (e) {
        if (current !== player || !isFinite(audio.duration)) return;
        var rect = bar.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
      });
    });

    // Keep each player's button in sync with the shared <audio> — including when
    // it's paused by something else (e.g. a video starting).
    audio.addEventListener("play", function () { if (current) current._setPlaying(true); });
    audio.addEventListener("pause", function () { if (current) current._setPlaying(false); });
    audio.addEventListener("timeupdate", function () { if (current && current._sync) current._sync(); });
    audio.addEventListener("ended", function () { if (current && current._reset) current._reset(); });

    // Only one media plays at a time across the whole page: when any audio OR
    // video starts, pause every other one.
    var allMedia = [audio].concat([].slice.call(document.querySelectorAll("video")));
    allMedia.forEach(function (m) {
      m.addEventListener("play", function () {
        allMedia.forEach(function (other) {
          if (other !== m && !other.paused) other.pause();
        });
      });
    });
  }

  /* ---------- Friendly error if content.json can't be loaded ---------- */
  function showLoadError(err) {
    console.error("Could not load content.json:", err);
    var box = document.createElement("div");
    box.style.cssText =
      "max-width:620px;margin:12vh auto;padding:2rem;font-family:system-ui,-apple-system,sans-serif;" +
      "text-align:center;color:#2E2722;line-height:1.6;";
    box.innerHTML =
      '<h1 style="font-family:Georgia,serif;font-size:1.5rem;margin-bottom:.7rem;">Couldn\'t load content.json</h1>' +
      '<p style="color:#6F6258;">This page loads its content from <b>content.json</b>. Browsers block that ' +
      "when you open the HTML file directly (the <code>file://</code> address).</p>" +
      '<p style="color:#6F6258;">Run a tiny local server, then open <b>http://localhost:8000</b>:</p>' +
      '<pre style="background:#F4EADD;padding:.8rem 1rem;border-radius:10px;display:inline-block;text-align:left;">python3 -m http.server 8000</pre>' +
      '<p style="color:#6F6258;">On GitHub Pages this works automatically — no setup needed.</p>';
    document.body.appendChild(box);
  }
})();

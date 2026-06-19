# 🎙️ Voice Over Portfolio

A fast, warm, single-page voice-over portfolio built with **plain HTML, CSS & JS** —
no build step, no framework. Designed to be hosted free on **GitHub Pages**, with
videos compressed so visitors get instant playback (no 200MB downloads).

```
vo-portfolio/
├── index.html            ← all the content (edit text here)
├── css/styles.css        ← the warm & personal theme
├── js/main.js            ← nav, tabs, audio players
├── assets/
│   ├── video/            ← compressed .mp4 demo videos
│   ├── audio/            ← your audio demo reels (.mp3)
│   └── img/              ← portrait + video posters
├── compress-video.sh     ← one command to web-ready any video
├── .nojekyll             ← tells GitHub Pages to serve files as-is
└── README.md
```

---

## ✅ Make it yours (quick checklist)

Everything below is plain text in `index.html` — search and replace:

- [ ] **Your name** — replace `Jordan Vale` / `JV` everywhere
- [ ] **Hero headline & intro** — the big sentence + the paragraph under it
- [ ] **About** — bio, voice qualities (the chips), languages, studio gear
- [ ] **Stats** — "8+ yrs", "24 hr", "500+"
- [ ] **Services** — keep the cards that apply to you
- [ ] **Testimonials** — swap in real client quotes
- [ ] **Contact** — Instagram, WhatsApp & email links in the `.method` blocks
- [ ] **Your photo** — save it as `assets/img/portrait.jpg`, then in `css/styles.css`
      give `.hero__portrait` a `background-image: url("../assets/img/portrait.jpg");`
- [ ] **SEO** — the `<title>` and `<meta name="description">` at the top of `index.html`

---

## 🎬 Adding videos (the important part)

**Never put a raw camera/export file on the site.** They're huge (your D-Day Launch
clip was 207MB) and may be in a codec that won't play in Chrome/Firefox. Compress first:

```bash
brew install ffmpeg           # one-time
./compress-video.sh "Raw Clip.mov" my-clip
```

That creates `assets/video/my-clip.mp4` (~30MB, plays everywhere) and a poster image.
Then copy a video card in `index.html` (look for `<figure class="vcard">`) and point the
`<source>` and `poster` at your new files. Done.

> **Why this matters:** GitHub Pages rejects any single file over **100MB** and has a
> ~100GB/month bandwidth soft-cap. Compressed ~30MB clips stay safely under both.
> If you ever add *lots* of videos or get heavy traffic, upload them to **YouTube
> (unlisted)** or **Cloudflare Stream** and embed instead — the layout already supports it.

The videos are **vertical 9:16**, so the player is phone-shaped on purpose. Horizontal
videos will letterbox — change the card's `aspect-ratio` in `.vcard__frame` if needed.

## 🎧 Adding audio reels

Drop MP3s into `assets/audio/` using these names (or rename the `data-src` in `index.html`):

```
assets/audio/commercial-reel.mp3
assets/audio/narration-reel.mp3
assets/audio/elearning-reel.mp3
assets/audio/character-reel.mp3
```

Until a file exists, its player politely shows "soon" instead of breaking.

## ✉️ Contact details

The contact section uses direct links (no form, no backend). To update them, edit the
three `<a class="method">` blocks in `index.html`:

- **Instagram** — `https://instagram.com/narrabilla`
- **WhatsApp** — `https://wa.me/6285779983483` (international format, no `+` or spaces)
- **Email** — `mailto:nabillazahrina@gmail.com`

---

## 🚀 Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 🌐 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Voice over portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
branch → `main` / root → Save.** Your site goes live at
`https://YOUR-USERNAME.github.io/YOUR-REPO/` in a minute or two.

> Tip: name the repo `YOUR-USERNAME.github.io` to get the clean root URL
> `https://YOUR-USERNAME.github.io/`.

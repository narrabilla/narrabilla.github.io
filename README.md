# 🎙️ Voice Over Portfolio

A fast, warm, single-page voice-over portfolio built with **plain HTML, CSS & JS** —
no build step, no framework. All the content lives in one **`content.json`** file, so
you can update the whole site without ever touching the HTML.

```
vo-portfolio/
├── content.json         ← ⭐ EDIT THIS — all text, demos, contact info
├── index.html           ← page shell (rarely needs editing)
├── css/styles.css       ← the warm & personal theme
├── js/main.js           ← renders the page from content.json + interactions
├── assets/
│   ├── video/           ← compressed .mp4 demo videos
│   ├── audio/           ← your audio demo reels (.mp3)
│   └── img/             ← portrait + video posters
├── compress-video.sh    ← one command to web-ready any video
├── .nojekyll            ← tells GitHub Pages to serve files as-is
└── README.md
```

---

## ⭐ Editing your content (`content.json`)

Open **`content.json`** and change the values. Everything updates automatically —
your name, bio, demos, services, contact details. A quick map of what's inside:

| Section in the file | Controls |
|---|---|
| `site` | Your name, initials (logo), nav links, SEO title/description |
| `hero` | The big headline, intro paragraph, badge, stats, photo |
| `about` | Bio paragraphs, the quality "chips", the details panel |
| `projects` | **Real client work** — shown with process details (turnaround, setup…) |
| `samples.audio` | **Spec audio reels** — a list you add to |
| `samples.video` | **Spec video samples** — optional list |
| `services` | The "How I can help" cards |
| `why` | The "Why work with…" cards |
| `contact` | Headline, intro, and your Instagram / WhatsApp / email |

**Tip:** it's a JSON file, so keep the quotes `"` and commas `,` intact. If something
looks broken after an edit, paste the file into <https://jsonlint.com> to spot the typo.

> ⚠️ **Always view the site through a server, not by double-clicking `index.html`.**
> Because the page loads `content.json`, browsers block it on the raw `file://` path.
> Use the local preview (below) while editing — and on **GitHub Pages it just works**,
> no setup needed. (If you ever see a "Couldn't load content.json" message, that's why.)

---

## 🗂️ Projects vs. samples

The site shows two kinds of work in two sections:

- **`projects`** — real client work. Each shows **process details** (turnaround, setup,
  language, year…) so a client can predict their own timeline. As real projects come in,
  just delete old samples whenever you like.
- **`samples`** — spec pieces you recorded yourself to show range. Labelled "not client work".

## 🎬 Adding a project (real client work)

**Never put a raw camera/export file on the site.** They're huge (your first raw clip
was 207MB) and may use a codec that won't play in Chrome/Firefox. Compress first:

```bash
brew install ffmpeg           # one-time
./compress-video.sh "Raw Clip.mov" my-clip
```

That creates `assets/video/my-clip.mp4` (~30MB, plays everywhere) + a poster image.
Then add an entry to the **`projects.items`** list in `content.json`:

```json
{
  "title": "My Project",
  "category": "Commercial",
  "summary": "What you did, in one line.",
  "media": { "kind": "video", "src": "assets/video/my-clip.mp4", "poster": "assets/img/my-clip-poster.jpg" },
  "meta": {
    "turnaround": "Delivered in 3 days",
    "setup": "Mobile recording · CapCut Pro",
    "language": "Indonesian",
    "year": "2026",
    "client": "",
    "scope": ""
  }
}
```

Every `meta` field is optional — leave any `""` and it simply won't show. For an
**audio** project, use `"media": { "kind": "audio", "src": "assets/audio/my-track.mp3" }`.

> **Be honest with `turnaround`** — put the real time a project took, not a promise. One
> data point isn't a guarantee; it becomes a reliable predictor as projects add up.

> **Why compress:** GitHub Pages rejects any file over **100MB** and has a ~100GB/month
> bandwidth cap. ~30MB clips stay safely under both. For *lots* of videos or heavy
> traffic, upload to **YouTube (unlisted)** instead.

## 🎧 Adding a voice sample

1. Drop the MP3 into `assets/audio/` (e.g. `assets/audio/my-reel.mp3`).
2. Add an entry to the **`samples.audio`** list in `content.json`:

```json
{ "tag": "Commercial", "title": "My Reel", "desc": "A short description.",
  "src": "assets/audio/my-reel.mp3" }
```

(For a spec *video* sample, add to `samples.video` with `title`, `caption`, `src`, `poster`.)

Until the MP3 exists, that player politely shows "soon" instead of breaking.

## 🖼️ Adding your photo

Save your portrait as `assets/img/portrait.jpg`, then set it in `content.json`:

```json
"hero": { "photo": "assets/img/portrait.jpg", ... }
```

Leave `"photo": ""` to keep the placeholder.

## ✉️ Contact details

Edit `contact.methods` in `content.json`:

- **Instagram** — `https://instagram.com/narrabilla`
- **WhatsApp** — `https://wa.me/6285779983483` (international format, no `+` or spaces)
- **Email** — `nabillazahrina@gmail.com`

---

## 🚀 Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 🌐 Publishing updates to GitHub Pages

Your site lives at **https://narrabilla.github.io/**. After editing, push your changes:

```bash
git add -A
git commit -m "Update content"
git push
```

The live site refreshes a minute or two after each push.

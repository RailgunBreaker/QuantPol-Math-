# QuantPol Math — Native Interactive Web Edition

A **standalone interactive HTML textbook**, based on *Mathematics for Quantitative Political Science — Fourth Edition* (October 2026). Designed to replace the old PDF-iframe companion at `https://railgunbreaker.icu/QuantPol-Math-/`.

## What changed

- **NO PDF viewer** and no embedded PDF dependency. The 33 lessons, preface, original worked solutions, glossary, detailed Formula Atlas and Z-table guide appear directly as web pages.
- Textbook paragraphs, headings, research examples, methodological cautions and sample code are readable, searchable, selectable HTML.
- PDF equations involving stacked fractions, symbols or matrices are separately clipped **original typeset image assets** to prevent incorrect mathematical transcription. They are click-to-inspect with contextual text; they are not individually editable formula engines.
- Original source diagrams are reproduced where identifiable; **13 live labs** provide editable mathematical demonstrations, covering derivatives, integration, Bayes, normal distributions, OLS, DiD, CAR, matrices, sampling, optimization, hypothesis testing, AR(1), and strategic games.
- **277 multiple-choice questions**, seven reviews and the final examination. Answers and detailed explanations are displayed after each choice.
- Mark lesson sections as studied, track chapter completion, save notes, answer exercises, export/import progress and switch between light/dark themes.
- Responsive and deployable from any repository subfolder via GitHub Pages, Cloudflare Pages, Netlify, or other static hosting. No backend or npm build required.

## Deployment to existing GitHub Pages repository

The live project URL suggests repository `QuantPol-Math-`. To replace the old edition:

1. Back up or commit the previous edition first.
2. Upload **the contents of this ZIP**, not the containing directory, to the existing repository root. Overwrite old `index.html`, `app.js`, `style.css`, `data/content.json`, and add `data/book.json` and all `assets/equations/*.png`.
3. Delete the obsolete `assets/textbook.pdf` (optional if you want to retain a separate archival copy; the new web app does not reference it).
4. Ensure **Settings → Pages → Build and deployment** uses your desired branch and `/(root)`.
5. After GitHub Pages completes deployment, hard-refresh or clear website cache if the old PDF view remains visible.

Custom domains and `/QuantPol-Math-/` subpaths work because every asset URL is relative.

## Preview locally

Run a local web server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/` in your browser. Opening the HTML directly with `file://` can prevent browsers from fetching JSON files.

## Progress compatibility

Both the previous version and this version use `quantpol-v4-progress` in browser localStorage. Your saved answers, chapter completion and notes are retained on the **same origin and browser profile** when overwriting the previous deployed files. Progress is not synced across devices; use Export/Import JSON.

## Source and mathematical precision

The original 213-page PDF is the textual and mathematical source. PDF text extraction can scramble inline mathematical superscripts, long answer choices, and some table layouts, so complex display mathematics is retained as image snippets. The original source PDF is not republished as a viewer. Some visual layout and tables were reconstructed from extracted text and should be checked against the source before public academic distribution. The five factor/event-study examples and the added live experiments are **synthetic pedagogical illustrations**, never empirical observations.

This is a substantial native-web conversion, **not** a promise that each of the hundreds of printed formulas has its own independently parameterized simulation. Source-style equations are individually inspectable; 13 dedicated graphical labs are truly recalculated from user inputs. No automatic AI assistant, server-side grading, or cloud account is required.

## Files

```text
index.html              Responsive website shell
app.js                  Interactive learning engine and visual labs
style.css               Light/dark theme, textbook reading styles
.nojekyll               Disable GitHub's Jekyll processing
data/content.json       Question bank, answer key, worked solutions
 data/book.json         Native lesson content and reference sections
assets/equations/       Cropped high-resolution vector-derived source formulas and figures
```

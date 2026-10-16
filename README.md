# QuantPol Math — Native Interactive Web Edition

A **standalone interactive HTML textbook**, based on *Mathematics for Quantitative Political Science — Fourth Edition* (October 2026). Replaces the old PDF-iframe companion.

**Live site: <https://quantpol.railgunbreaker.icu/>**

## What changed

- **NO PDF viewer** and no embedded PDF dependency. The 33 lessons, preface, original worked solutions, glossary, detailed Formula Atlas and Z-table guide appear directly as web pages.
- Textbook paragraphs, headings, research examples, methodological cautions and sample code are readable, searchable, selectable HTML.
- PDF equations involving stacked fractions, symbols or matrices are separately clipped **original typeset image assets** to prevent incorrect mathematical transcription. They are click-to-inspect with contextual text; they are not individually editable formula engines.
- Original source diagrams are reproduced where identifiable; **13 live labs** provide editable mathematical demonstrations, covering derivatives, integration, Bayes, normal distributions, OLS, DiD, CAR, matrices, sampling, optimization, hypothesis testing, AR(1), and strategic games.
- **277 multiple-choice questions**, seven reviews and the final examination. Answers and detailed explanations are displayed after each choice.
- Mark lesson sections as studied, track chapter completion, save notes, answer exercises, export/import progress and switch between light/dark themes.
- Responsive and deployable from any repository subfolder via GitHub Pages, Cloudflare Pages, Netlify, or other static hosting. No backend or npm build required.

## Deployment

The site is served by GitHub Pages from `main` / `(root)` at its own subdomain, `quantpol.railgunbreaker.icu`, declared in the `CNAME` file.

It needs one DNS record in the `railgunbreaker.icu` zone:

```text
quantpol   CNAME   railgunbreaker.github.io
```

Then wait for **Settings → Pages** to report the domain as verified and finish issuing the TLS certificate.

### Why not `railgunbreaker.icu/QuantPol-Math-/`

That URL cannot serve this project. `railgunbreaker.icu` resolves to CloudFront in front of an S3 bucket holding a different site, so the path returns an `AccessDenied` XML error. `railgunbreaker.github.io/QuantPol-Math-/` does not work either: the `RailgunBreaker.github.io` repository sets `railgunbreaker.icu` as its Pages custom domain, so GitHub 301-redirects every project path to that same dead AWS path. A per-repository custom domain bypasses both hops.

Every asset URL in the app is relative, so the files also serve correctly from a domain root, a repository subpath, or any other static host (Cloudflare Pages, Netlify) with no build step.

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
CNAME                   GitHub Pages custom domain (quantpol.railgunbreaker.icu)
data/content.json       Question bank, answer key, worked solutions
 data/book.json         Native lesson content and reference sections
assets/equations/       Cropped high-resolution vector-derived source formulas and figures
```

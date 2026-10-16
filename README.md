# QuantPol Math — Interactive Fourth Edition

An interactive, static GitHub Pages companion to **Mathematics for Quantitative Political Science — Fourth Edition**. Based on the uploaded 213-page book (October 2026).

## Features

- 33 chapters with embedded **original PDF pages**, preserving equations, diagrams, examples, and research context.
- Clickable multiple-choice **chapter checkpoints and practice questions** with answer feedback and explanatory worked solutions where successfully extracted from the book.
- Seven cumulative reviews and a 24-question final exam (see extraction caveat below).
- Five browser-based explorations: normal curve, Bayes, OLS, DiD, and cumulative abnormal returns.
- Live Z-score calculator and standard normal reference table; searchable compact formula shelf and link to complete Formula Atlas.
- Notes, answers and chapter completion tracked locally (localStorage). Export/import progress as JSON. Mobile-responsive layout and dark theme.
- **No build tools, hosting service, API key, analytics or database required.**

## Preview locally

Do not open `index.html` with `file://` (the browser may block loading JSON). Use:

```bash
cd quantpol-math-site
python -m http.server 8000
```

Visit http://localhost:8000/ .

## Deploy to GitHub Pages

1. Create a new repository, for example `quantpol-math`.
2. Upload everything **inside** this folder to the repository root (including `assets/textbook.pdf`, `data/content.json`, and `.nojekyll`).
3. In the repository choose **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/(root)`, then save.
4. Open `https://YOUR-USERNAME.github.io/quantpol-math/` after GitHub reports a successful deployment.

The site uses relative URLs, so it works both for `username.github.io` and a project repository subdirectory.

## Accuracy and limitations

The **original PDF is the definitive source** for every theorem, question, equation, and worked solution. The text extraction from PDF into interactive HTML can flatten superscripts, line breaks, and matrix layouts. If an option or explanation looks odd, cross-check the corresponding original PDF page. The original 33 chapter checkpoint/practice exercises are integrated, as are the cumulative assessments; a small number of PDF questions may not appear in the quiz due to complex source typesetting. Interactive labs illustrate assumptions with simulated values and should not be described as empirical findings. Content is browser-only; progress does not synchronize across devices without exporting/importing it.

This is a learning companion and **not** a complete semantic LaTeX/HTML rewrite of all 213 pages. It preserves the full textbook in the embedded PDF reader instead. Public GitHub Pages repositories expose the PDF and site to the public. Use a private/local host instead if the book should remain private.

## Files

```
index.html           website shell
style.css            responsive design
app.js               quizzes, local progress, visual labs, navigation
assets/textbook.pdf  unmodified original fourth edition
data/content.json    extracted questions, answers and chapter index
.nojekyll            disables Jekyll processing
```

No package installation or build step is needed.

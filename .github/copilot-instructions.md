# .cursorrules — Open edX Custom Theme (Teak → Ulmo 2025)

This file is consumed by GitHub Copilot, Cursor, and similar AI code agents. It contains **every assumption, version pin, and command** required to build and maintain a custom Open edX theme during the Teak cycle (June 2025) and ahead of the Ulmo design‑tokens switchover (Dec 2025).

---

## 1. Target stack & runtime matrix

| Component            | 2025 baseline version                       | Notes                                                                                                                                                              |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Open edX**         | **Teak** (20ᵗʰ community release, Jun 2025) | `open-release/teak.master` branch                                                                                                                                  |
| **Tutor**            | **v20.*** (Teak channel)                   | `pip install "tutor[full]==20.*"`                                                                                                                                 |
| **Python**           | 3.11                                        | 3.12 is experimental; Teak hard‑pins 3.11 ([github.com](https://github.com/openedx/openedx-calc/issues/101?utm_source=chatgpt.com))                                |
| **Django**           | 4.2 LTS                                     | Pinned `<5.0` across repos ([github.com](https://github.com/openedx/edx-lint/blob/master/edx_lint/files/common_constraints.txt?utm_source=chatgpt.com))            |
| **Node.js**          | 20 LTS                                      | MFEs tested on 20; Node 18 deprecated ([github.com](https://github.com/openedx/public-engineering/issues/231?utm_source=chatgpt.com))                              |
| **React**            | 18.x                                        | React 18 supported since `@edx/frontend-platform@8.2.0` (20 Feb 2025) ([github.com](https://github.com/openedx/frontend-platform/releases?utm_source=chatgpt.com)) |
| **Yarn**             | 3.6+ (PnP)                                  | `.yarnrc.yml` present in MFE template                                                                                                                              |
| **Docker / Compose** | Docker 24+, Compose v2                      | BuildKit ≥0.11 required ([docs.tutor.edly.io](https://docs.tutor.edly.io/install.html?utm_source=chatgpt.com))                                                     |
| **OS**               | Linux/macOS; Windows via WSL 2              |                                                                                                                                                                    |

---

## 2. Local development workflow (Tutor)

```bash
# one‑time setup
brew install pyenv nodenv docker docker-compose
pyenv install 3.11.8 && pyenv virtualenv 3.11.8 openedx && pyenv activate openedx
pip install "tutor[full]==20.*"

# initialise platform – choose mode ⬇️
## A) production‑like single‑server
# (databases & persistent volumes, HTTPS termination, etc.)
tutor local launch

## B) live‑reload dev stack (mount source, watch Sass, skip TLS)
# builds the openedx‑dev image first
 tutor images build openedx-dev
 tutor dev launch

# start/stop containers after initial launch
 tutor dev start -d     # hot‑reload mode
 tutor dev stop         # stop dev containers

# iterate on theme assets
 tutor dev watch themes  # rebuild SCSS & collectstatic on change
```

**Why** `local` **vs** `dev`? `local` gives a production‑like setup; `dev` mounts local repos and disables Celery workers for faster iteration. The top‑level `launch` subcommand *always* needs a target (local / dev / k8s) as of Tutor v19+ ([docs.tutor.edly.io](https://docs.tutor.edly.io/install.html)).

---

## 3. Repository layout

```text
.
├── plugins/
│   └── acme_theme/
│       ├── plugin.py          # Tutor plugin wrapper
│       ├── patches/           # ENV_PATCHES snippets
│       ├── lms/templates/     # Django overrides
│       ├── cms/templates/
│       ├── static/
│       │   ├── sass/partials/ # SCSS vars — place brand palette here
│       │   └── images/
│       └── README.md
├── mfes/
│   └── brand-acme/            # NPM brand package consumed by MFEs
│       └── src/design-tokens.js
└── .cursorrules               # ← this file
```

---

## 4. Tutor plugin skeleton (`plugins/acme_theme/plugin.py`)

*(unchanged from earlier draft – still valid for v20)*

---

## 5. Comprehensive theme anatomy (legacy)

*(Sass, images, template overrides – same process; SCSS compiled via `tutor dev watch themes` or baked with `tutor images build openedx`)*

---

## 6. MFE theming with brand packages → tokens

- MFEs read styling from an **NPM brand package** (pre‑Ulmo).
- After Ulmo, MFEs consume **JSON design‑tokens** instead – plan to expose the *same* token map from the brand package.

Minimal brand package example (React 18, Paragon 23):

```js
export default {
  primary: "#0066ff",
  secondary: "#f37021",
  fontFamilyBase: "'Inter', sans-serif",
  radius: "6px",
};
```

Publish **scoped** package (`@acme/brand`) and pin in `plugin.py` patches.

---

## 7. Future‑proofing for Ulmo design tokens (Dec 2025)

- Keep a single source‑of‑truth `tokens.json` and generate SCSS variables **and** brand‑package JS from it during CI.
- Use CSS custom properties (`var(--brand-primary)`) inside templates now.
- Remove pre‑design‑tokens brand packages before upgrading (DEPR #23) ([docs.openedx.org](https://docs.openedx.org/en/latest/community/release_notes/teak/dev_op_release_notes.html?utm_source=chatgpt.com), [github.com](https://github.com/openedx/openedx-translations/issues/7066?utm_source=chatgpt.com)).

---

## 8. Coding standards

- **Python** – Black, isort, flake8 (<‑ Pylint optional).
- **JS/TS** – ESLint (Airbnb) + Prettier; React 18 rules.
- **SCSS** – Open edX Sass guide + BEM.
- **Commit style** – Conventional commits + semantic-release.

---

## 9. Commit / PR checklist

1. Atomic commits (`feat(theme): gradient hero`).
2. Before/after screenshots in PR.
3. CI: `tutor images build openedx mfe && yarn test && flake8`.
4. Review from a **ThemeMaintainer**.

---

## 10. Quick reference commands

| Task                               | Command                                           |
| ---------------------------------- | ------------------------------------------------- |
| Initialise **production‑like** env | `tutor local launch`                              |
| Initialise **dev** env             | `tutor dev launch`                                |
| Start containers (dev)             | `tutor dev start -d`                              |
| Stop containers (dev)              | `tutor dev stop`                                  |
| Shell into LMS (dev)               | `tutor dev run lms bash`                          |
| Rebuild images (core)              | `tutor images build openedx`                      |
| Rebuild images (MFEs)              | `tutor images build mfe`                          |
| Watch & recompile Sass             | `tutor dev watch themes`                          |
| Collect static (prod)              | `tutor local do lms -- ./manage.py collectstatic` |
| DB migrations                      | `tutor local do upgrade --latest`                 |

---

## 11. Modern npm package workflow (Node 20, 2025 best practices)

1. **Init**
   ```bash
   pnpm dlx create-package@latest                 # or `npm create` with prompts
   cd package-name
   pnpm add -D typescript tsup vitest eslint prettier commitizen cz-conventional-changelog
   ```
2. **ESM by default** (`"type":"module"`) + generate dual CJS build via `tsup`:
   ```jsonc
   // tsup.config.ts
   export default { entry: ["src/index.ts"], dts: true, format: ["esm", "cjs"], clean: true };
   ```
3. **Version & changelog** with *semantic‑release* (GitHub Actions token + npm token ≥ automation).
4. **Security** – add `npm audit --production`, `pnpm audit`, or Snyk in CI; publish with 2FA‑protected **automation token**.
5. **Publishing**
   ```bash
   pnpm publish --access public --provenance
   # provenance = Sigstore/SLSA attestations (default on npm ≥10)
   ```
6. **Docs & live demo** – generate Storybook for UI assets; deploy to GitHub Pages on merge to main.

Detailed walk‑through: Snyk “Modern npm package 2025” guide (snyk.io).

---

## 12. Build/Watch decision matrix

| Scenario                         | Command(s)                                              | When & Why                                                                                                   |
|----------------------------------|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| **1. Rebuild image in dev**      | `tutor images build openedx-dev`<br/>`tutor dev start -d`| Needed when you add **new** files/directories that are *not* already bind‑mounted (e.g., a brand‑new `static/fonts/` dir) or modify Dockerfile‑level assets. |
| **2. `watch themes` is sufficient** | `tutor dev watch themes` (already running)             | Editing existing SCSS, images, or Django templates inside a watched theme path. The watcher triggers Sass compile + collectstatic live—no container restart. |
| **3. Manual copy into env root** | `rsync -av plugins/acme_theme/ $(tutor config printroot)/env/plugins/` | Rare. Only if you disabled mounts (CI, prod‑like test) or created files *before* plugin activation. In a normal mounted dev stack, skip this. |
| **4. Compile & publish npm brand pkg for MFEs** | `pnpm build && npm publish --provenance`<br/>update version in `plugin.py` patches → `tutor images build mfe` | Do this whenever you change **design tokens / Sass** that MFEs read. For rapid local tweaks, run inside container: `tutor dev run mfe npm link @acme/brand`. |

> **Rule of thumb**: if the change lives *inside* a watched volume, `watch themes` or `npm link` is enough; if it needs to be baked into a Docker layer (new paths, new NPM version), rebuild the corresponding image.

---

## 13. Automated testing & TDD workflow

### Python / Django unit tests (theme templates)

- Add tests under `plugins/<theme>/tests/` using **pytest-django**.
- Run inside dev container:
  ```bash
  tutor dev run lms pytest plugins/acme_theme/tests
  ```
- Use Django `Client()` and `assertContains` to verify rendered HTML and CSS classes.

### SCSS & static analysis

- Lint with `stylelint "**/*.scss"` (config already in `.stylelintrc`).
- Optional pixel‑diffs using **Percy** or Chromatic in CI.

### JS / React unit tests for MFEs

- Adopt **Jest + React Testing Library** per OEP‑0067. ([docs.openedx.org](https://docs.openedx.org/projects/openedx-proposals/en/latest/best-practices/oep-0067/decisions/frontend/0003-jest-rtl.html?utm_source=chatgpt.com))
  ```bash
  tutor dev run mfe npm test -- --watch
  ```

### End-to-end (E2E)

- Community **cypress-e2e-tests** repository targets LMS & Authn MFEs. ([github.com](https://github.com/openedx/cypress-e2e-tests?utm_source=chatgpt.com))
  ```bash
  tutor dev start -d  # run platform
  docker-compose -f cy-run.yml up cypress
  ```

### Tutor-assisted pytest

- Tutor docs show how to run core edx-platform tests; same applies to theme apps. ([docs.tutor.edly.io](https://docs.tutor.edly.io/tutorials/edx-platform.html))

### Sample GitHub Actions matrix

```yaml
name: test
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install 'tutor[full]==20.*'
      - run: tutor images build openedx-dev
      - run: tutor dev run lms pytest plugins/acme_theme/tests
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci --workspace=mfes/brand-acme
      - run: npm test --workspace=mfes/brand-acme
```

---

## 14. Cookie-Cutter Scaffolds

Rather than hand-crafting your plugin or theme directory structure, leverage community-maintained cookiecutter templates to do the heavy lifting:

- **Tutor Plugin Scaffold**: Use the `overhangio/cookiecutter-tutor-plugin` template to generate a fully featured Tutor plugin with built-in test harness, linting configuration, a Makefile, and CI workflows. It prompts you for plugin metadata and outputs a ready-to-go repository with conventional commits and semantic-release support.

- **Theme Skeleton**: For a minimal comprehensive theme setup (without a Tutor plugin wrapper), the `cookiecutter-openedx/openedx-theme-example` repository provides a lightweight starting point. It includes the core directory layout for `lms/templates`, `lms/static/sass`, and basic configuration files so you can begin theming immediately.

Using these scaffolds ensures consistency, saves time, and aligns your project with community best practices.

---

*End of rules — happy theming!*


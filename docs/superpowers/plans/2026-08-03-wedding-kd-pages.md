# Wedding Site Page Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the five-page wedding site for Kata és Domi by porting the structure of the sibling `wedding-lb` project into this bare Nuxt 4 repository, recoloured with a palette sampled from the couple's save-the-date image.

**Architecture:** A statically generated Nuxt 4 site. All source lives under `app/`; `public/` stays at the repository root. One layout provides the nav; five pages provide content; small presentational components (headings, highlight strip, icon buttons) are shared between them. Every colour comes from a CSS custom property defined once in `app/assets/css/main.css` — no component hardcodes a colour value. Tests live in a top-level `test/` directory and run under plain vitest + happy-dom, with Nuxt auto-imports stubbed.

**Tech Stack:** Nuxt 4, Vue 3 (`<script setup>`), Tailwind CSS v4 (via `@tailwindcss/vite`, configured with `@theme` in CSS — not `tailwind.config.js`), vitest + happy-dom + `@vue/test-utils`, prettier, eslint, bun.

**Spec:** `docs/superpowers/specs/2026-08-03-wedding-kd-pages-design.md`

**Reference project:** `/Users/bence/repos/github.com/molnarbence/wedding-lb` — referred to below as `$REF`. It is a separate checkout on disk, not a dependency. Read from it, never write to it.

## Global Constraints

- **Language:** All user-facing copy is Hungarian. Preserve every accent exactly (`Esküvő`, `Nászajándék`, `Visszajelzés`, `Zugligeti Szent Család Plébánia`, `Lóvasút Kulturális és Rendezvényközpont`).
- **Venue spelling:** Always `Lóvasút Kulturális és Rendezvényközpont` — with `Kulturális`. The save-the-date image reads `KULTÚRÁLIS`; that spelling is wrong and must not appear in page copy.
- **Emoji:** The invitation copy's emoji (🤍 and 🎉🤍) are kept verbatim. Do not strip them.
- **Domain:** `https://kataesdomi.info` for every `ogUrl`. Sourced from `DOMAIN_NAME` in `.github/workflows/main.yaml`.
- **Colours:** Only the five tokens from Task 1 (`ivory`, `sand`, `clay`, `espresso`, `ink`). No `blue-*`, `gray-*`, `yellow-*`, or hex literals in any component or page.
- **No dark mode:** `wedding-lb` components carry `dark:` variant classes but that project never configured dark mode. Drop all `dark:` classes when porting.
- **Formatting:** prettier with `singleQuote: true`, `printWidth: 120`. Run `bun run format` before every commit.
- **Placeholders:** Unknown real-world values are written as visible `TODO:` text in the rendered page, so a human reviewing the site can see what is missing. This is intentional per the spec — it is not a plan placeholder.
- **Verification per task:** `bun run test --run`, `bun run lint`, and `bun run format:check` must all pass before each commit.

---

### Task 1: Design tokens, prettier config, and app shell

Establishes the palette every later task consumes, and converts the placeholder `app.vue` into a real Nuxt shell that renders a layout and page.

**Files:**
- Create: `.prettierrc`
- Modify: `app/assets/css/main.css` (currently one line: `@import "tailwindcss";`)
- Modify: `app/app.vue` (currently a "Jön" placeholder)
- Modify: `package.json` (the `format` and `format:check` scripts)
- Delete: `app/app.test.ts`
- Create: `test/app.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind colour utilities `bg-ivory`, `bg-sand`, `bg-clay`, `bg-espresso`, `bg-ink` plus their `text-*` / `hover:bg-*` / `focus:ring-*` counterparts, and the font utilities `font-tangerine` and `font-sans`. Also produces the CSS variables `--color-ivory` … `--color-ink` on `:root`, used directly by `app.vue`'s body style. Every later task depends on these names.

- [ ] **Step 1: Add the prettier config**

Create `.prettierrc`:

```json
{
  "singleQuote": true,
  "printWidth": 120
}
```

- [ ] **Step 2: Widen the format scripts to cover tests**

In `package.json`, replace these two lines:

```json
    "format": "prettier --write app",
    "format:check": "prettier --check app",
```

with:

```json
    "format": "prettier --write app test",
    "format:check": "prettier --check app test",
```

- [ ] **Step 3: Write the design tokens**

Replace the entire contents of `app/assets/css/main.css`:

```css
@import 'tailwindcss';

@theme {
  --font-tangerine: Tangerine, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-sans: Ysabeau, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';

  --color-ivory: #f5efe6;
  --color-sand: #c9ae8c;
  --color-clay: #8c6e4e;
  --color-espresso: #2b231b;
  --color-ink: #14110d;
}

/*
  The default border color has changed to `currentColor` in Tailwind CSS v4,
  so we've added these compatibility styles to make sure everything still
  looks the same as it did with Tailwind CSS v3.
*/
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-sand, currentColor);
  }
}
```

- [ ] **Step 4: Remove the obsolete placeholder test**

The existing test asserts the `"Jön"` placeholder that Step 6 deletes. Remove it; Step 5 replaces it.

```bash
git rm app/app.test.ts
```

- [ ] **Step 5: Write the failing test**

Create `test/app.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '../app/app.vue';

vi.stubGlobal('useHead', vi.fn());

const stubs = {
  NuxtLayout: { template: '<div class="layout-stub"><slot /></div>' },
  NuxtPage: true,
};

describe('app.vue', () => {
  it('renders a page inside a layout', () => {
    const wrapper = mount(App, { global: { stubs } });

    expect(wrapper.find('.layout-stub').exists()).toBe(true);
    expect(wrapper.find('nuxt-page-stub').exists()).toBe(true);
  });

  it('no longer renders the scaffold placeholder', () => {
    const wrapper = mount(App, { global: { stubs } });

    expect(wrapper.text()).not.toContain('Jön');
  });
});
```

`NuxtLayout` is stubbed with a real template rather than `true`. A bare `true` stub does not render its slot, so `NuxtPage` — which sits inside that slot — would never render and the second assertion would fail.

- [ ] **Step 6: Run the test to verify it fails**

Run: `bun run test --run test/app.test.ts`

Expected: FAIL. The current `app.vue` renders a `<div>` with a `<span>Jön</span>` and no `NuxtLayout`, so `nuxt-layout-stub` is not found.

- [ ] **Step 7: Write the app shell**

Replace the entire contents of `app/app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  title: 'Kata és Domi',
  htmlAttrs: { lang: 'hu' },
  bodyAttrs: {
    style: 'background-color: var(--color-ivory)',
  },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&family=Ysabeau:ital,wght@0,1..1000;1,1..1000&display=swap',
    },
  ],
});
</script>
```

Note `htmlAttrs: { lang: 'hu' }` — the site is entirely Hungarian and the scaffold did not set a language.

- [ ] **Step 8: Run the test to verify it passes**

Run: `bun run test --run test/app.test.ts`

Expected: PASS, 2 tests.

- [ ] **Step 9: Verify the whole toolchain**

```bash
bun run format
bun run format:check
bun run lint
bun run test --run
```

Expected: all four succeed.

- [ ] **Step 10: Commit**

```bash
git add .prettierrc package.json app/assets/css/main.css app/app.vue test/app.test.ts
git commit -m "Add design tokens and real app shell"
```

---

### Task 2: Default layout with navigation

**Files:**
- Create: `app/layouts/default.vue`
- Create: `test/layouts/default.test.ts`

**Interfaces:**
- Consumes: the `bg-espresso` and `text-ivory` utilities from Task 1.
- Produces: the default layout, applied automatically by `NuxtLayout` in `app.vue`. Renders its page via a default `<slot />`. Later tasks add no nav entries — all five links are created here.

- [ ] **Step 1: Write the failing test**

Create `test/layouts/default.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DefaultLayout from '../../app/layouts/default.vue';

describe('default layout', () => {
  it('links to all five pages', () => {
    const wrapper = mount(DefaultLayout);
    const links = wrapper.findAll('nav a').map((a) => [a.attributes('href'), a.text()]);

    expect(links).toEqual([
      ['/', 'Köszöntő'],
      ['/eskuvo', 'Esküvő'],
      ['/lakodalom', 'Lakodalom'],
      ['/naszajandek', 'Nászajándék'],
      ['/visszajelzes', 'Visszajelzés'],
    ]);
  });

  it('renders page content in its slot', () => {
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<p>oldal tartalom</p>' },
    });

    expect(wrapper.text()).toContain('oldal tartalom');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test --run test/layouts/default.test.ts`

Expected: FAIL with a module resolution error — `app/layouts/default.vue` does not exist yet.

- [ ] **Step 3: Write the layout**

Create `app/layouts/default.vue`:

```vue
<template>
  <div>
    <nav class="bg-espresso p-4">
      <ul class="flex flex-wrap justify-center gap-x-4 text-ivory">
        <li><a href="/">Köszöntő</a></li>
        <li><a href="/eskuvo">Esküvő</a></li>
        <li><a href="/lakodalom">Lakodalom</a></li>
        <li><a href="/naszajandek">Nászajándék</a></li>
        <li><a href="/visszajelzes">Visszajelzés</a></li>
      </ul>
    </nav>
    <slot />
  </div>
</template>
```

Plain `<a>` tags, matching `$REF/layouts/default.vue`. Full page loads are fine for a five-page static site and keep the layout trivially testable without a router.

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test --run test/layouts/default.test.ts`

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
bun run format
bun run lint
git add app/layouts/default.vue test/layouts/default.test.ts
git commit -m "Add default layout with navigation"
```

---

### Task 3: Shared presentational components

Four tiny components with no logic, used by every page.

**Files:**
- Create: `app/components/PageHeading.vue`
- Create: `app/components/MiddleHeading.vue`
- Create: `app/components/HighlightStrip.vue`
- Create: `app/components/VenuePlaceholder.vue`
- Create: `test/components/presentational.test.ts`

**Interfaces:**
- Consumes: `bg-clay`, `bg-sand`, `text-ivory`, `text-ink` from Task 1.
- Produces, all slot-only with no props:
  - `PageHeading` — `<h1>`, the title of an inner page.
  - `MiddleHeading` — centred `<h3>`, used inside `HighlightStrip`.
  - `HighlightStrip` — full-width clay band wrapping arbitrary content.
  - `VenuePlaceholder` — takes **no slot**; renders a fixed `TODO: térkép kép` block at `h-64 md:h-96`.

- [ ] **Step 1: Write the failing test**

Create `test/components/presentational.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import VenuePlaceholder from '../../app/components/VenuePlaceholder.vue';

describe('PageHeading', () => {
  it('renders its slot as an h1', () => {
    const wrapper = mount(PageHeading, { slots: { default: 'Esküvő' } });

    expect(wrapper.find('h1').text()).toBe('Esküvő');
  });
});

describe('MiddleHeading', () => {
  it('renders its slot as an h3', () => {
    const wrapper = mount(MiddleHeading, { slots: { default: 'Program' } });

    expect(wrapper.find('h3').text()).toBe('Program');
  });
});

describe('HighlightStrip', () => {
  it('renders its slot on the clay band', () => {
    const wrapper = mount(HighlightStrip, { slots: { default: '<span>Parkolás</span>' } });

    expect(wrapper.text()).toContain('Parkolás');
    expect(wrapper.classes()).toContain('bg-clay');
  });
});

describe('VenuePlaceholder', () => {
  it('marks the missing map image', () => {
    const wrapper = mount(VenuePlaceholder);

    expect(wrapper.text()).toContain('TODO: térkép kép');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test --run test/components/presentational.test.ts`

Expected: FAIL with module resolution errors — none of the four components exist.

- [ ] **Step 3: Write the components**

Create `app/components/PageHeading.vue`:

```vue
<template>
  <h1 class="text-2xl mt-4 text-ink"><slot /></h1>
</template>
```

Create `app/components/MiddleHeading.vue`:

```vue
<template>
  <h3 class="text-center text-2xl mb-4"><slot /></h3>
</template>
```

Create `app/components/HighlightStrip.vue`:

```vue
<template>
  <div class="w-full mt-5 bg-clay text-ivory p-5">
    <slot />
  </div>
</template>
```

Create `app/components/VenuePlaceholder.vue`:

```vue
<template>
  <div class="w-full h-64 md:h-96 bg-sand flex items-center justify-center">
    <span class="text-ink">TODO: térkép kép</span>
  </div>
</template>
```

`MiddleHeading` deliberately sets no text colour — it is only ever used inside `HighlightStrip`, which already sets `text-ivory` on the whole band.

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test --run test/components/presentational.test.ts`

Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
bun run format
bun run lint
git add app/components test/components
git commit -m "Add shared presentational components"
```

---

### Task 4: Icon and link-button components

**Files:**
- Create: `app/components/MapIcon.vue`, `app/components/FormsIcon.vue`, `app/components/RevolutIcon.vue` (copied from `$REF`)
- Create: `app/components/MapButton.vue`
- Create: `app/components/GoogleFormsButton.vue`
- Create: `app/components/RevolutLinkButton.vue`
- Create: `test/components/buttons.test.ts`

**Interfaces:**
- Consumes: `bg-espresso`, `hover:bg-ink`, `focus:ring-sand`, `text-ivory` from Task 1.
- Produces:
  - `MapButton` — props `lat: string`, `long: string`. Renders **two** anchors: a `geo:0,0?q={lat},{long}` link visible only below `sm`, and a `https://www.google.com/maps/search/?api=1&query={lat},{long}` link visible only at `sm` and above.
  - `GoogleFormsButton` — prop `link: string`. Single anchor to `link`.
  - `RevolutLinkButton` — props `tag: string`, `currency: string`, `amount: string`, `note: string`. Anchors to `https://revolut.me/{tag}` and displays `{{ tag }}`. Only `tag` affects output today; the other three are carried over from `$REF` because the deep-link URL will need them once real values exist.
  - `MapIcon`, `FormsIcon`, `RevolutIcon` — inline SVGs, no props.

`$REF/components/CashIcon.vue` is **not** ported: it has no consumer in `$REF` and none here.

- [ ] **Step 1: Copy the three icon components verbatim**

These are large inline SVGs (`FormsIcon` is the multi-path Google Forms logo with gradients). Copy them rather than retyping:

```bash
REF=/Users/bence/repos/github.com/molnarbence/wedding-lb
cp "$REF/components/MapIcon.vue" app/components/MapIcon.vue
cp "$REF/components/FormsIcon.vue" app/components/FormsIcon.vue
cp "$REF/components/RevolutIcon.vue" app/components/RevolutIcon.vue
```

No recolouring needed: `MapIcon` and `FormsIcon` use `text-white`, `RevolutIcon` uses `fill-white`, and all three sit on `bg-espresso` buttons where white is correct.

- [ ] **Step 2: Write the failing test**

Create `test/components/buttons.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import GoogleFormsButton from '../../app/components/GoogleFormsButton.vue';
import MapButton from '../../app/components/MapButton.vue';
import RevolutLinkButton from '../../app/components/RevolutLinkButton.vue';

describe('MapButton', () => {
  const props = { lat: '47.51687720938038', long: '18.985569587647085' };

  it('offers a native geo link on small screens', () => {
    const wrapper = mount(MapButton, { props });
    const geo = wrapper.findAll('a').find((a) => a.attributes('href')?.startsWith('geo:'));

    expect(geo?.attributes('href')).toBe('geo:0,0?q=47.51687720938038,18.985569587647085');
    expect(geo?.classes()).toContain('sm:hidden');
  });

  it('offers a Google Maps link on larger screens', () => {
    const wrapper = mount(MapButton, { props });
    const maps = wrapper.findAll('a').find((a) => a.attributes('href')?.includes('google.com'));

    expect(maps?.attributes('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=47.51687720938038,18.985569587647085',
    );
    expect(maps?.classes()).toContain('hidden');
  });
});

describe('GoogleFormsButton', () => {
  it('links to the given form', () => {
    const wrapper = mount(GoogleFormsButton, { props: { link: 'https://forms.gle/example' } });

    expect(wrapper.find('a').attributes('href')).toBe('https://forms.gle/example');
  });
});

describe('RevolutLinkButton', () => {
  it('links to the revolut.me profile and shows the tag', () => {
    const wrapper = mount(RevolutLinkButton, {
      props: { tag: 'example', currency: 'huf', amount: '1000', note: 'nászajándék' },
    });

    expect(wrapper.find('a').attributes('href')).toBe('https://revolut.me/example');
    expect(wrapper.text()).toContain('example');
  });
});
```

The icon components are auto-imported inside these buttons, so they are unresolved under plain vitest. Vue renders unresolved components as inert custom elements and logs a warning; the assertions above target anchors only and are unaffected. Do not add stubs for them.

- [ ] **Step 3: Run the test to verify it fails**

Run: `bun run test --run test/components/buttons.test.ts`

Expected: FAIL with module resolution errors — the three button components do not exist.

- [ ] **Step 4: Write the button components**

Create `app/components/MapButton.vue`:

```vue
<script setup lang="ts">
defineProps<{
  lat: string;
  long: string;
}>();
</script>

<template>
  <div>
    <a
      :href="`geo:0,0?q=${lat},${long}`"
      target="_blank"
      class="inline-flex sm:hidden text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <MapIcon />
      Navigálás
    </a>
    <a
      :href="`https://www.google.com/maps/search/?api=1&query=${lat},${long}`"
      target="_blank"
      class="hidden sm:inline-flex text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <MapIcon />
      Térkép
    </a>
  </div>
</template>
```

Create `app/components/GoogleFormsButton.vue`:

```vue
<script setup lang="ts">
defineProps<{
  link: string;
}>();
</script>

<template>
  <div>
    <a
      :href="link"
      class="inline-flex text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <FormsIcon />
      Google Forms Link
    </a>
  </div>
</template>
```

Create `app/components/RevolutLinkButton.vue`:

```vue
<script setup lang="ts">
defineProps<{
  tag: string;
  currency: string;
  amount: string;
  note: string;
}>();
</script>

<template>
  <div>
    <a
      :href="`https://revolut.me/${tag}`"
      class="inline-flex text-ivory bg-espresso hover:bg-ink focus:ring-4 focus:outline-none focus:ring-sand font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
    >
      <RevolutIcon />
      {{ tag }}
    </a>
  </div>
</template>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bun run test --run test/components/buttons.test.ts`

Expected: PASS, 4 tests. Vue may log `Failed to resolve component: MapIcon` warnings — expected, see Step 2.

- [ ] **Step 6: Confirm no stray reference colours survived the port**

```bash
grep -rnE 'blue-[0-9]|gray-[0-9]|yellow-[0-9]|dark:' app/ && echo 'FOUND — fix before committing' || echo 'clean'
```

Expected: `clean`.

- [ ] **Step 7: Commit**

```bash
bun run format
bun run lint
git add app/components test/components/buttons.test.ts
git commit -m "Add icon and link button components"
```

---

### Task 5: Generate the web image derivatives

`image.png` is 1240×1748 and 1.87 MB — far too heavy to serve. Two derivatives are generated from it with `sips` (preinstalled on macOS, no new dependency) and committed.

**Files:**
- Create: `public/images/save-the-date.jpg`
- Create: `public/images/og.jpg`

**Interfaces:**
- Consumes: `image.png` at the repository root.
- Produces: `/images/save-the-date.jpg` at **1000×1409**, referenced by `index.vue` in Task 6 with those exact `width`/`height` attributes; and `/images/og.jpg` at exactly **1200×630**, referenced as `ogImage` by all five pages.

- [ ] **Step 1: Confirm the source image is present and unmodified**

```bash
sips -g pixelWidth -g pixelHeight image.png
```

Expected: `pixelWidth: 1240`, `pixelHeight: 1748`. If this differs, stop — the crop offsets in Step 3 are calibrated to these dimensions.

- [ ] **Step 2: Generate the portrait card**

```bash
mkdir -p public/images
sips -s format jpeg -s formatOptions 82 --resampleWidth 1000 image.png --out public/images/save-the-date.jpg
```

- [ ] **Step 3: Generate the OpenGraph crop**

A centred crop cuts the vertical "SAVE the DATE" lettering into unreadable fragments. Offset the crop past the lettering (which occupies roughly the left 310px) and take a landscape band around the couple, then scale it to the exact OG size:

```bash
sips -s format jpeg -s formatOptions 85 -c 488 930 --cropOffset 480 310 image.png --out public/images/og.jpg
sips --resampleHeightWidth 630 1200 public/images/og.jpg
```

`sips -c` takes **height then width**; `--cropOffset` takes **top then left**.

- [ ] **Step 4: Verify both derivatives**

```bash
sips -g pixelWidth -g pixelHeight public/images/save-the-date.jpg public/images/og.jpg
ls -lh public/images/
```

Expected: `save-the-date.jpg` is 1000×1409 and roughly 250 KB; `og.jpg` is exactly 1200×630 and roughly 120 KB. The 1200×630 dimensions are what the `ogImageWidth` / `ogImageHeight` tags in Tasks 6–8 declare — if they differ, the tags will lie.

- [ ] **Step 5: Look at `og.jpg` and confirm it is not garbled**

Open `public/images/og.jpg`. It should show the couple on the staircase with **no partial letterforms** at the left edge. If fragments of the "SAVE the DATE" text are visible, increase the `--cropOffset` left value and repeat Step 3.

- [ ] **Step 6: Commit**

```bash
git add public/images/save-the-date.jpg public/images/og.jpg
git commit -m "Add web-sized save-the-date and OpenGraph images"
```

---

### Task 6: Köszöntő (index) page

The main page: names, the save-the-date card, the invitation copy, a where/when row, and the program strip.

**Files:**
- Create: `app/pages/index.vue`
- Create: `test/pages/index.test.ts`

**Interfaces:**
- Consumes: `HighlightStrip` and `MiddleHeading` (Task 3), `/images/save-the-date.jpg` and `/images/og.jpg` (Task 5), `font-tangerine` and `text-ink` (Task 1).
- Produces: the `ProgramItem` interface (`{ time: string; title: string }`), local to this file. No later task imports it.

Creating `app/pages/` makes Nuxt's router take over routing; `app.vue` already renders `<NuxtPage />` from Task 1, so nothing else changes.

- [ ] **Step 1: Write the failing test**

Create `test/pages/index.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import IndexPage from '../../app/pages/index.vue';

vi.stubGlobal('useSeoMeta', vi.fn());

const mountPage = () => mount(IndexPage, { global: { components: { HighlightStrip, MiddleHeading } } });

describe('index page', () => {
  it('shows the couple and the date', () => {
    const wrapper = mountPage();

    expect(wrapper.find('h1').text()).toBe('Kata és Domi');
    expect(wrapper.text()).toContain('2027. május 22.');
  });

  it('shows the save-the-date image at its real dimensions', () => {
    const img = mountPage().find('img');

    expect(img.attributes('src')).toBe('/images/save-the-date.jpg');
    expect(img.attributes('width')).toBe('1000');
    expect(img.attributes('height')).toBe('1409');
    expect(img.attributes('alt')).toBeTruthy();
  });

  it('carries the invitation copy including its emoji', () => {
    const text = mountPage().text();

    expect(text).toContain('Kedves Családunk és Barátaink!🤍');
    expect(text).toContain('hajnalig tartó mulatsággal várunk mindenkit.🎉🤍');
  });

  it('spells the reception venue with "Kulturális"', () => {
    const text = mountPage().text();

    expect(text).toContain('Lóvasút Kulturális és Rendezvényközpont');
    expect(text).not.toContain('KULTÚRÁLIS');
  });

  it('lists the program, with the known ceremony time', () => {
    const text = mountPage().text();

    expect(text).toContain('Program');
    expect(text).toContain('14:30 - Esküvő');
    expect(text).toContain('Vacsora');
    expect(text).toContain('Buli');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test --run test/pages/index.test.ts`

Expected: FAIL with a module resolution error — `app/pages/index.vue` does not exist.

- [ ] **Step 3: Write the page**

Create `app/pages/index.vue`:

```vue
<template>
  <div>
    <header class="mt-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="font-tangerine text-ink text-6xl lg:text-7xl mb-2">Kata és Domi</h1>
          <h2 class="text-ink text-xl lg:text-2xl">2027. május 22.</h2>
        </div>
      </div>
    </header>

    <div class="w-full mt-8 px-4">
      <img
        src="/images/save-the-date.jpg"
        alt="Kata és Domi save the date meghívója"
        width="1000"
        height="1409"
        class="w-full max-w-md mx-auto rounded shadow-lg"
      />
    </div>

    <div class="w-full mt-8 px-4">
      <div class="max-w-2xl mx-auto flex flex-col gap-4 text-ink">
        <p>Kedves Családunk és Barátaink!🤍</p>
        <p>
          Örömmel osztjuk meg Veletek, hogy 2027. május 22-én összeházasodunk. Nagyon sok szeretettel hívunk meg
          Benneteket a templomi szertartásra, majd az azt követő vacsorára és lakodalomba.
        </p>
        <p>
          A szertartás a Zugligeti Szent Család Plébánián kerül megrendezésre, tervezetten 14:30-kor, ezt követően pedig
          együtt folytatjuk az ünneplést a templomtól csupán pár perc sétára lévő Lóvasút Kulturális és
          Rendezvényközpontban, ahol vacsorával és hajnalig tartó mulatsággal várunk mindenkit.🎉🤍
        </p>
      </div>
    </div>

    <div class="w-full mt-8">
      <div class="flex flex-col md:flex-row gap-4 justify-center text-ink">
        <div class="text-center">
          <h3>Hol?</h3>
          <div>Zugligeti Szent Család Plébánia</div>
        </div>
        <div class="text-center">
          <h3>Mikor?</h3>
          <div>2027. május 22.</div>
          <div>14:30</div>
        </div>
      </div>
    </div>

    <HighlightStrip>
      <MiddleHeading>Program</MiddleHeading>
      <div class="flex flex-col justify-center gap-4">
        <div v-for="item in program" :key="item.title" class="flex flex-col md:flex-row gap-4 justify-center">
          <span class="text-center">{{ item.time }} - {{ item.title }}</span>
        </div>
      </div>
    </HighlightStrip>
  </div>
</template>

<script lang="ts" setup>
const title = 'Köszöntő';
const description = 'Kata és Domi esküvője — 2027. május 22.';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});

interface ProgramItem {
  time: string;
  title: string;
}

const program: ProgramItem[] = [
  { time: '14:30', title: 'Esküvő' },
  { time: 'TODO', title: 'Vacsora' },
  { time: 'TODO', title: 'Buli' },
];
</script>
```

`:key` is `item.title`, not `item.time` — two entries share the time `TODO`, so keying on time would produce duplicate keys.

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test --run test/pages/index.test.ts`

Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
bun run format
bun run lint
git add app/pages/index.vue test/pages/index.test.ts
git commit -m "Add Köszöntő page"
```

---

### Task 7: Venue pages — Esküvő and Lakodalom

Two venue pages of identical shape. The church data is real (carried over from `$REF`, which used the same church); the Lóvasút data is not yet known.

**Files:**
- Create: `app/pages/eskuvo.vue`
- Create: `app/pages/lakodalom.vue`
- Create: `test/pages/venues.test.ts`

**Interfaces:**
- Consumes: `PageHeading`, `HighlightStrip`, `MiddleHeading`, `VenuePlaceholder` (Task 3), `MapButton` (Task 4), `/images/og.jpg` (Task 5).
- Produces: routes `/eskuvo` and `/lakodalom`, already linked from the Task 2 nav.

- [ ] **Step 1: Write the failing test**

Create `test/pages/venues.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MapButton from '../../app/components/MapButton.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import VenuePlaceholder from '../../app/components/VenuePlaceholder.vue';
import EskuvoPage from '../../app/pages/eskuvo.vue';
import LakodalomPage from '../../app/pages/lakodalom.vue';

vi.stubGlobal('useSeoMeta', vi.fn());

const components = { PageHeading, HighlightStrip, MiddleHeading, VenuePlaceholder, MapButton };

describe('eskuvo page', () => {
  const mountPage = () => mount(EskuvoPage, { global: { components } });

  it('is titled Esküvő', () => {
    expect(mountPage().find('h1').text()).toBe('Esküvő');
  });

  it('gives the church name, address and planned time', () => {
    const text = mountPage().text();

    expect(text).toContain('Zugligeti Szent Család Plébánia');
    expect(text).toContain('1125. Szarvas Gábor út 52.');
    expect(text).toContain('tervezetten 14:30');
  });

  it('offers a working map link with the church coordinates', () => {
    const maps = mountPage()
      .findAll('a')
      .find((a) => a.attributes('href')?.includes('google.com'));

    expect(maps?.attributes('href')).toContain('47.51687720938038,18.985569587647085');
  });

  it('shows a parking section', () => {
    expect(mountPage().text()).toContain('Parkolás');
  });
});

describe('lakodalom page', () => {
  const mountPage = () => mount(LakodalomPage, { global: { components } });

  it('is titled Lakodalom', () => {
    expect(mountPage().find('h1').text()).toBe('Lakodalom');
  });

  it('names the venue with the correct spelling', () => {
    const text = mountPage().text();

    expect(text).toContain('Lóvasút Kulturális és Rendezvényközpont');
    expect(text).not.toContain('KULTÚRÁLIS');
  });

  it('tells guests it is walking distance from the church', () => {
    expect(mountPage().text()).toContain('pár perc sétára');
  });

  it('marks the address as still missing rather than guessing one', () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain('TODO: cím');
    expect(wrapper.findAll('a').some((a) => a.attributes('href')?.includes('google.com'))).toBe(false);
  });
});
```

The last assertion is deliberate: a map button with invented coordinates would send guests to the wrong place, so `lakodalom.vue` ships without one until the real address is known.

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test --run test/pages/venues.test.ts`

Expected: FAIL with module resolution errors — neither page exists.

- [ ] **Step 3: Write the Esküvő page**

Create `app/pages/eskuvo.vue`:

```vue
<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Esküvő</PageHeading>
    </header>
    <VenuePlaceholder class="mt-4" />
    <div class="w-full mt-5">
      <div class="flex flex-col md:flex-row gap-4 justify-center text-ink">
        <div class="text-center">
          <h3>Zugligeti Szent Család Plébánia</h3>
          <div>{{ address }}</div>
          <div class="mt-2">Kezdés: tervezetten 14:30</div>

          <MapButton class="mt-4 flex justify-center" lat="47.51687720938038" long="18.985569587647085" />
        </div>
      </div>
    </div>
    <HighlightStrip>
      <MiddleHeading>Parkolás</MiddleHeading>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <span class="text-center">
          A templom utcájában és a játszótér túloldalán, a Zugligeti úton is lehet parkolni. (TODO: megerősíteni)
        </span>
      </div>
    </HighlightStrip>
  </div>
</template>

<script lang="ts" setup>
const title = 'Esküvő helyszín';
const address = '1125. Szarvas Gábor út 52.';
const description = `Kezdés: tervezetten 14:30, cím: ${address}`;

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/eskuvo',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
```

- [ ] **Step 4: Write the Lakodalom page**

Create `app/pages/lakodalom.vue`:

```vue
<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Lakodalom</PageHeading>
    </header>
    <VenuePlaceholder class="mt-4" />
    <div class="w-full mt-5">
      <div class="flex flex-col md:flex-row gap-4 justify-center text-ink">
        <div class="text-center">
          <h3>Lóvasút Kulturális és Rendezvényközpont</h3>
          <div>{{ address }}</div>
          <div class="mt-2">A templomtól csupán pár perc sétára.</div>
          <!-- TODO: <MapButton class="mt-4 flex justify-center" lat="..." long="..." /> once the address is confirmed -->
        </div>
      </div>
    </div>
    <HighlightStrip>
      <MiddleHeading>Parkolás</MiddleHeading>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <span class="text-center">TODO: parkolási információ</span>
      </div>
    </HighlightStrip>
  </div>
</template>

<script lang="ts" setup>
const title = 'Lakodalom helyszín';
const address = 'TODO: cím';
const description = `Lóvasút Kulturális és Rendezvényközpont, cím: ${address}`;

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/lakodalom',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bun run test --run test/pages/venues.test.ts`

Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
bun run format
bun run lint
git add app/pages/eskuvo.vue app/pages/lakodalom.vue test/pages/venues.test.ts
git commit -m "Add Esküvő and Lakodalom venue pages"
```

---

### Task 8: Nászajándék and Visszajelzés pages

The two remaining pages. Every real-world value here is unknown, so both are placeholder-heavy by design.

**Files:**
- Create: `app/pages/naszajandek.vue`
- Create: `app/pages/visszajelzes.vue`
- Create: `test/pages/info.test.ts`

**Interfaces:**
- Consumes: `PageHeading` (Task 3), `RevolutLinkButton` and `GoogleFormsButton` (Task 4), `/images/og.jpg` (Task 5).
- Produces: routes `/naszajandek` and `/visszajelzes`, already linked from the Task 2 nav.

- [ ] **Step 1: Write the failing test**

Create `test/pages/info.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import GoogleFormsButton from '../../app/components/GoogleFormsButton.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import RevolutLinkButton from '../../app/components/RevolutLinkButton.vue';
import NaszajandekPage from '../../app/pages/naszajandek.vue';
import VisszajelzesPage from '../../app/pages/visszajelzes.vue';

vi.stubGlobal('useSeoMeta', vi.fn());

const components = { PageHeading, RevolutLinkButton, GoogleFormsButton };

describe('naszajandek page', () => {
  const mountPage = () => mount(NaszajandekPage, { global: { components } });

  it('is titled Nászajándék', () => {
    expect(mountPage().find('h1').text()).toBe('Nászajándék');
  });

  it('marks the bank details as still missing', () => {
    const text = mountPage().text();

    expect(text).toContain('TODO: név');
    expect(text).toContain('TODO: bankszámlaszám');
  });

  it('renders a Revolut link button', () => {
    expect(mountPage().findComponent(RevolutLinkButton).exists()).toBe(true);
  });
});

describe('visszajelzes page', () => {
  const mountPage = () => mount(VisszajelzesPage, { global: { components } });

  it('is titled Visszajelzés', () => {
    expect(mountPage().find('h1').text()).toBe('Visszajelzés');
  });

  it('marks the deadline as still missing', () => {
    expect(mountPage().text()).toContain('TODO: határidő');
  });

  it('renders a Google Forms button', () => {
    expect(mountPage().findComponent(GoogleFormsButton).exists()).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test --run test/pages/info.test.ts`

Expected: FAIL with module resolution errors — neither page exists.

- [ ] **Step 3: Write the Nászajándék page**

Create `app/pages/naszajandek.vue`:

```vue
<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Nászajándék</PageHeading>
    </header>

    <div class="w-full mt-5 px-4">
      <div class="max-w-2xl mx-auto flex flex-col gap-4 justify-center text-ink">
        <div class="text-center">
          Háztartásunk teljes, nem is vágyunk másra <br />
          Csak közös életünk kezdetén egy kis támogatásra!
        </div>
        <div class="text-center">
          <h3>TODO: név</h3>
          <div>bankszámlaszám: TODO: bankszámlaszám</div>
        </div>
        <div class="text-center">
          <h3>Revolut link/tag:</h3>
          <RevolutLinkButton
            class="mt-2 flex justify-center"
            tag="TODO"
            currency="huf"
            amount="1000"
            note="nászajándék"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const title = 'Nászajándék';
const description = 'Kata és Domi esküvője';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/naszajandek',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
```

The rhyming couplet is carried over from `$REF/pages/naszajandek.vue`. It is generic wedding verse, not couple-specific — flag it for Kata and Domi to replace if they want their own wording.

- [ ] **Step 4: Write the Visszajelzés page**

Create `app/pages/visszajelzes.vue`:

```vue
<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Visszajelzés</PageHeading>
    </header>

    <div class="w-full mt-5 px-4">
      <div class="max-w-2xl mx-auto flex flex-col justify-center gap-4 text-ink">
        <div class="text-center">
          Nagyon örülünk, hogy tudtok velünk ünnepelni! <br />
          Légyszi jelezzetek vissza ezen a linken TODO: határidő-ig.
        </div>
        <div class="text-center">
          <GoogleFormsButton class="flex justify-center" link="TODO: google forms link" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const title = 'Visszajelzés';
const description = 'Kata és Domi esküvője';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/visszajelzes',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bun run test --run test/pages/info.test.ts`

Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
bun run format
bun run lint
git add app/pages/naszajandek.vue app/pages/visszajelzes.vue test/pages/info.test.ts
git commit -m "Add Nászajándék and Visszajelzés pages"
```

---

### Task 9: Full-site verification

Everything so far was verified in isolation under plain vitest, which does not exercise Nuxt's build, auto-imports, or routing. This task proves the real site works.

**Files:**
- Modify: none expected. Fix whatever the checks surface.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: a verified static build in `.output/public/`.

- [ ] **Step 1: Run the whole test suite**

```bash
bun run test --run
```

Expected: all test files pass — `test/app.test.ts`, `test/layouts/default.test.ts`, `test/components/presentational.test.ts`, `test/components/buttons.test.ts`, `test/pages/index.test.ts`, `test/pages/venues.test.ts`, `test/pages/info.test.ts`. 31 tests total.

- [ ] **Step 2: Run lint and format checks**

```bash
bun run lint
bun run format:check
```

Expected: both clean.

- [ ] **Step 3: Confirm no reference colours or dark-mode classes leaked in**

```bash
grep -rnE 'blue-[0-9]|gray-[0-9]|yellow-[0-9]|dark:|#fffff3' app/ && echo 'FOUND — fix' || echo 'clean'
```

Expected: `clean`.

- [ ] **Step 4: Generate the static site**

```bash
bun run generate
```

Expected: succeeds. This is the real check on Nuxt auto-imports — if a component or `useSeoMeta` call is misspelled, plain vitest would not have caught it, but this will.

- [ ] **Step 5: Confirm all five routes were prerendered**

```bash
ls .output/public/ .output/public/eskuvo .output/public/lakodalom .output/public/naszajandek .output/public/visszajelzes
```

Expected: an `index.html` at the root and inside each of the four directories, plus an `images/` directory containing `save-the-date.jpg` and `og.jpg`.

- [ ] **Step 6: Spot-check the generated HTML**

```bash
grep -o 'Kata és Domi' .output/public/index.html | head -1
grep -o 'og:image[^>]*' .output/public/index.html | head -1
grep -c 'Kulturális' .output/public/lakodalom/index.html
grep -c 'KULTÚRÁLIS' .output/public/index.html || echo 'good: no wrong spelling'
```

Expected: the couple's name present, an `og:image` meta tag pointing at `https://kataesdomi.info/images/og.jpg`, at least one `Kulturális` on the Lakodalom page, and no `KULTÚRÁLIS` anywhere.

- [ ] **Step 7: Look at the running site**

```bash
bun run dev
```

Visit `http://localhost:3000` and click through all five nav links. Confirm: the espresso nav bar and ivory page background render, the Tangerine script font is applied to "Kata és Domi", the save-the-date image displays at a sensible size on both a narrow and a wide viewport, the clay program strip is legible, and the sand `TODO: térkép kép` blocks appear on both venue pages. Stop the server when done.

- [ ] **Step 8: Commit any fixes**

If Steps 1–7 required changes:

```bash
bun run format
git add -A
git commit -m "Fix issues found in full-site verification"
```

If nothing needed fixing, skip this step — there is nothing to commit.

---

## Follow-up for the couple

None of these block the build. Each is a visible `TODO:` in the rendered site:

| Where | Missing value |
| --- | --- |
| `app/pages/lakodalom.vue` | Lóvasút street address and map coordinates |
| `app/pages/lakodalom.vue` | Parking information |
| `app/pages/eskuvo.vue` | Confirm the parking text carried over from `wedding-lb` |
| `app/pages/index.vue` | Dinner and party start times |
| `app/pages/naszajandek.vue` | Account holder name, account number, Revolut tag |
| `app/pages/visszajelzes.vue` | Google Forms URL and RSVP deadline |
| `app/components/VenuePlaceholder.vue` | Real map screenshots for both venues |

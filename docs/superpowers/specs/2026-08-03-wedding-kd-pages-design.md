# Wedding site page structure — Kata & Domi

**Date:** 2026-08-03
**Status:** Approved

## Goal

Build out the wedding site for Kata és Domi (`kataesdomi.info`). The repository is
currently a bare Nuxt 4 skeleton: `app/app.vue` renders a "Jön" placeholder, and there
are no pages, layouts, or components.

Mirror the page structure of the sibling project `wedding-lb`
(`/Users/bence/repos/github.com/molnarbence/wedding-lb`), recoloured with a palette taken
from the couple's save-the-date image (`image.png`, repository root), which is also
displayed on the main page.

## Source material

The save-the-date image reads:

> SAVE THE DATE — KATA & DOMI — MÁJUS 22, 2027 — LÓVASÚT KULTÚRÁLIS ÉS RENDEZVÉNYKÖZPONT

The invitation text supplies the authoritative details:

> Kedves Családunk és Barátaink!🤍
>
> Örömmel osztjuk meg Veletek, hogy 2027. május 22-én összeházasodunk.
> Nagyon sok szeretettel hívunk meg Benneteket a templomi szertartásra, majd az azt
> követő vacsorára és lakodalomba.
>
> A szertartás a Zugligeti Szent Család Plébánián kerül megrendezésre, tervezetten
> 14:30-kor, ezt követően pedig együtt folytatjuk az ünneplést a templomtól csupán pár
> perc sétára lévő Lóvasút Kulturális és Rendezvényközpontban, ahol vacsorával és
> hajnalig tartó mulatsággal várunk mindenkit.🎉🤍

Two spellings of the venue appear. Page copy uses **"Kulturális"** (from the invitation
text), not the image's "KULTÚRÁLIS". Emoji in the invitation copy are kept verbatim.

## Design tokens

Palette sampled from `image.png` — warm sandstone walls, near-black ironwork, ivory
serif type. Defined once in `app/assets/css/main.css`; no component hardcodes a colour.

```css
@theme {
  --font-tangerine: Tangerine, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-sans: Ysabeau, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

  --color-ivory: #f5efe6;
  --color-sand: #c9ae8c;
  --color-clay: #8c6e4e;
  --color-espresso: #2b231b;
  --color-ink: #14110d;
}
```

| Token      | Role                                        | Replaces (wedding-lb) |
| ---------- | ------------------------------------------- | --------------------- |
| `ivory`    | page background                             | `#fffff3`             |
| `sand`     | borders, `VenuePlaceholder` block           | —                     |
| `clay`     | `HighlightStrip` background                 | `yellow-600`          |
| `espresso` | nav background, button background           | `gray-800`, `blue-700`|
| `ink`      | body text                                   | default               |

Typography is unchanged from `wedding-lb`: Tangerine (couple's names) and Ysabeau
(everything else), loaded from Google Fonts in `app/app.vue`. Spacing, layout classes,
and responsive breakpoints are ported as-is.

Carry over the `@layer base` border-colour compatibility block from `wedding-lb`'s
`main.css` (Tailwind v4 defaults `border-color` to `currentColor`).

## File layout

Nuxt 4 places application source under `app/`; `public/` stays at the repository root.

```
app/
  app.vue                    NuxtLayout + NuxtPage; title, ivory body, font links
  layouts/default.vue        five-item nav
  pages/
    index.vue                Köszöntő
    eskuvo.vue               Esküvő
    lakodalom.vue            Lakodalom
    naszajandek.vue          Nászajándék
    visszajelzes.vue         Visszajelzés
  components/
    PageHeading.vue
    MiddleHeading.vue
    HighlightStrip.vue
    MapButton.vue
    MapIcon.vue
    GoogleFormsButton.vue
    FormsIcon.vue
    RevolutLinkButton.vue
    RevolutIcon.vue
    VenuePlaceholder.vue     new
  assets/css/main.css
  app.test.ts
public/images/
  save-the-date.jpg          web-sized derivative of image.png
  og.jpg                     1200x630 OpenGraph crop
docs/superpowers/specs/
  2026-08-03-wedding-kd-pages-design.md
```

`image.png` (1.87 MB) stays at the repository root as the source of truth. Both
derivatives are generated from it with `sips` and committed. The raw PNG is never served.

## Components

Ported unchanged in behaviour from `wedding-lb`, with colours swapped to the tokens above:

- **`PageHeading`** — `h1`, inner-page title.
- **`MiddleHeading`** — centred `h3`, used inside `HighlightStrip`.
- **`HighlightStrip`** — full-width `clay` band with white text; wraps a heading and content.
- **`MapButton`** — props `lat`, `long`. Renders a `geo:` link on small screens and a
  Google Maps link on `sm:` and up. Uses `MapIcon`.
- **`GoogleFormsButton`** — prop `link`. Uses `FormsIcon`.
- **`RevolutLinkButton`** — props `tag`, `currency`, `amount`, `note`. Links to
  `https://revolut.me/{tag}`. Uses `RevolutIcon`.
- **`MapIcon` / `FormsIcon` / `RevolutIcon`** — inline SVGs, copied verbatim.

`wedding-lb`'s `CashIcon` is not ported: it is unused there and has no consumer here.

New:

- **`VenuePlaceholder`** — replaces `wedding-lb`'s `bg-[url('/images/maps_*.png')]` map
  screenshots, which do not exist for these venues. Renders a `sand` block at the same
  `h-64 md:h-96` dimensions with centred `TODO: térkép kép` text. Swapping in a real
  screenshot later means replacing one element per page.

## Pages

### `layouts/default.vue`

`espresso` nav bar, centred wrapping list of plain `<a>` links:
Köszöntő `/` · Esküvő `/eskuvo` · Lakodalom `/lakodalom` · Nászajándék `/naszajandek` ·
Visszajelzés `/visszajelzes`.

### `index.vue` — Köszöntő

In order:

1. `Kata és Domi` in Tangerine, `2027. május 22.` below it.
2. `save-the-date.jpg` as a centred portrait card (`max-w-md mx-auto`, rounded, shadow).
   No text overlaid — the image already carries its own.
3. The full invitation copy from **Source material**, emoji included, in two paragraphs.
4. A Hol? / Mikor? row: `Zugligeti Szent Család Plébánia` / `2027. május 22.` + `14:30`.
5. A `HighlightStrip` titled `Program`, rendering a `ProgramItem[]` via `v-for`:

   | time   | title    |
   | ------ | -------- |
   | 14:30  | Esküvő   |
   | `TODO` | Vacsora  |
   | `TODO` | Buli     |

### `eskuvo.vue` — Esküvő

Venue data carried over from `wedding-lb`; it is the same church.

- `PageHeading`: `Esküvő`
- `VenuePlaceholder`
- `Zugligeti Szent Család Plébánia`, `1125. Szarvas Gábor út 52.`
- `MapButton` with `lat="47.51687720938038" long="18.985569587647085"`
- `HighlightStrip` / `Parkolás`: "A templom utcájában és a játszótér túloldalán, a
  Zugligeti úton is lehet parkolni." Marked `TODO` to re-confirm.
- Time shown as `tervezetten 14:30`, matching the invitation's wording.

### `lakodalom.vue` — Lakodalom

- `PageHeading`: `Lakodalom`
- `VenuePlaceholder`
- `Lóvasút Kulturális és Rendezvényközpont`
- Address: `TODO` placeholder. Not guessed.
- `MapButton`: omitted until real coordinates are available; a `TODO` comment marks where
  it goes.
- A note that the venue is a few minutes' walk from the church.
- `HighlightStrip` / `Parkolás`: `TODO`.

### `naszajandek.vue` — Nászajándék

Structure ported from `wedding-lb`: a short rhyming note, an account-holder name and
account number, and a `RevolutLinkButton`. All values are `TODO` placeholders.

### `visszajelzes.vue` — Visszajelzés

A short RSVP note with a `TODO` deadline and a `GoogleFormsButton` pointing at a `TODO`
form URL.

## SEO metadata

Every page calls `useSeoMeta` following the `wedding-lb` pattern, with:

- `ogUrl`: `https://kataesdomi.info` + the page path
- `ogImage`: `https://kataesdomi.info/images/og.jpg`, `ogImageWidth` 1200, `ogImageHeight` 630
- `ogLocale`: `hu_HU`
- `ogSiteName`: `Kata és Domi esküvője`
- `ogType`: `website`

The domain comes from `DOMAIN_NAME` in `.github/workflows/main.yaml`.

`app/app.vue` sets the document title to `Kata és Domi` and the body background to the
`ivory` token.

## Testing

`app/app.test.ts` currently asserts the `"Jön"` placeholder and must be replaced. New
tests use `@vue/test-utils` `mount` with the existing `vitest` + `happy-dom` setup — no
new dependencies:

1. `layouts/default.vue` renders all five nav links with the correct `href`s.
2. `index.vue` renders the couple's names, the date, and the save-the-date `<img>`.
3. Each of the four inner pages renders its `PageHeading` text.

Nuxt auto-import composables (`useSeoMeta`) and components (`NuxtLayout`, `NuxtPage`,
`NuxtRouteAnnouncer`) are stubbed or mocked per test, as `app.test.ts` already does for
`NuxtRouteAnnouncer`.

## Tooling

Add `.prettierrc` copied from `wedding-lb`:

```json
{
  "singleQuote": true,
  "printWidth": 120
}
```

Ported code is written in that style; without the config, prettier's defaults would
reformat all of it. Existing `app/app.vue`, `app/app.test.ts`, and
`app/assets/css/main.css` are reformatted to match.

`bun run lint`, `bun run format:check`, and `bun run test` must all pass.

## Out of scope

- The stock Nuxt starter `README.md` is left unchanged.
- AWS CloudFormation templates and the deploy workflow are unchanged.
- No real map screenshots, no real Lóvasút address or coordinates, no real bank details,
  no real RSVP form. These are filled in later against the `TODO` markers.

## Open items to resolve later

Every one of these is a `TODO`-marked placeholder in the code, not a blocker for the build:

- Lóvasút street address and coordinates
- Dinner and party start times for the program timeline
- Parking information for both venues
- Bank account holder, account number, Revolut tag
- Google Forms RSVP URL and response deadline
- Real map screenshots to replace `VenuePlaceholder`

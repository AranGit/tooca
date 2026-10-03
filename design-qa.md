# Design QA

[← README](README.md) · [Product](docs/product.md) · [Development & verification](docs/development.md)

This report records earlier visual and interaction reviews. Screenshots are historical evidence, not a live rendering of the latest code. Updating this document did not rerun the application checks.

## Review overview

| Area | Recorded result | Remaining concern |
| :--- | :--- | :--- |
| Add cards | Reference comparisons and responsive spacing fixes completed | Captures predate later header and text updates |
| Sort cards | Full neutral, drag, next-card, undo, and responsive states reviewed | Supplied colors have insufficient contrast |
| Reflection | Groups, undo, reset, responsive layout, and persistence reviewed | Captures predate some background and mascot-state updates |
| Design tokens | Shared color/radius generation and raw-value audit added | Layout and typography values have separate ownership |

## Visual evidence

| Experience | Desktop | Mobile / responsive | Comparison |
| :--- | :--- | :--- | :--- |
| Add cards | [Two cards](qa/step1-desktop-1440.png) · [Ten cards](qa/step1-desktop-10-cards.png) | [Mobile](qa/step1-mobile-402x812.png) · [Tablet fix](qa/step1-tablet-fixed.png) · [Compact desktop fix](qa/step1-compact-desktop-fixed.png) | [Reference comparison](qa/comparison-full.png) |
| Sort cards | [Neutral](qa/step2-full/01-idle.png) · [Right drag](qa/step2-full/02-drag-right.png) · [Left drag](qa/step2-full/03-drag-left.png) · [Next card](qa/step2-full/04-next-card.png) | [402 px](qa/step2-full/next-402x812.png) · [320 px](qa/step2-full/next-320x667.png) · [780 px](qa/step2-full/next-780x900.png) | [Full interaction comparison](qa/step2-full/comparison.png) |
| Reflection | [Desktop](qa/step3/desktop-1440x1024.png) | [Mobile](qa/step3/mobile-402x812.png) · [Tablet](qa/step3/tablet-780x900.png) | [Reference comparison](qa/step3/comparison.png) |

The original design references were supplied outside this repository in the assignment's Setup, Categorize, and Reflection folders. The tracked comparison images above let GitHub readers inspect the recorded comparisons without those local folders. Desktop references use 1440 × 1024; mobile comparisons crop the reference's 62 px device status bar to compare a 402 × 812 app area.

## Review history

### Add cards

The initial review compared typography, artwork, form controls, list density, scrolling, and continuation-button placement. A subsequent narrow-window review found overlapping mascot/label content and insufficient bottom spacing around 780 px wide.

The fix introduced a tablet layout through 920 px, reserved mascot space between 921 and 1100 px, and restored compact-desktop bottom spacing. The recorded follow-up captures show 86 px below the button at 1000 × 930 and 84 px at 780 × 930. These are historical measurements, not universal layout guarantees.

### Sort cards

The first pass corrected mobile card text wrapping and desktop mascot geometry. The full-reference follow-up reviewed the blue neutral card and underlay, coral/teal directional colors, approximately ±12° rotation, overlap over the mascots, final-card sizing, and reserved undo space.

Recorded browser checks covered both directions, cancelled drag, next card, undo, refresh, repeated clicks, completion, reduced motion, and overflow at 1440, 780, 402, and 320 px widths. Earlier captures are also available in [the initial comparison](qa/step2/comparison.png).

### Reflection

The recorded review covered accordion layout, category counts, original card order, empty groups, undo, reset, and refresh. Desktop, tablet, and mobile captures were compared; a 320 × 667 viewport with 20 cards was also checked for overflow and action overlap.

The current implementation uses `gray/100` for the page background and changes its description and mascot according to the category split: thanks for a mixed result, happy for all In My Hands, and hugging for all Rest It Here. Older screenshots should not be used as proof of those later changes.

### Shared foundations

Application colors and recurring corner radii were migrated to design tokens. Radius tokens include 4 px (`xs`) and 12 px (`md`). Motion reads generated TypeScript colors from the same source as CSS. The header uses a translucent white gradient, and the progress connector uses primary/500 after the first step is complete.

The token-migration record reports passing typecheck, lint, unit tests, production build, and browser sorting verification. The later apostrophe update also passed typecheck, lint, and all 14 unit tests. These results describe those earlier revisions.

## Open accessibility finding

The recorded Step 2 review found insufficient contrast in the supplied primary/500 and error/500 palette combinations:

| Content | Combination | Recorded ratio | Required ratio in the review |
| :--- | :--- | :--- | :--- |
| Button label | White on coral | 2.77:1 | 4.5:1 |
| Button label | White on teal | 2.19:1 | 4.5:1 |
| Large card text while dragging | Coral on white | 2.77:1 | 3:1 |
| Large card text while dragging | Teal on white | 2.19:1 | 3:1 |

Six sorting Storybook cases previously reported contrast failures. Accessibility checks remain enabled. Resolving this requires a color or text-color revision followed by a new contrast and visual review; reference fidelity alone does not establish accessibility conformance.

## Reproduce and refresh evidence

Follow the [verification guide](docs/development.md#verification). Capture the exact viewport, input data, interaction state, and revision used. After a visual change, update the affected evidence and record the result before describing it as current.

# Tooca design QA

## Step 1

**Findings**

- No actionable P0/P1/P2 visual or interaction differences remain. The two-card desktop/mobile views and ten-card desktop view retain the mockups' composition, visual hierarchy, illustrations, form controls, card density, scrolling, and fixed continuation button.

**Evidence**

- Source visual truth: `../1 SETUP/1.1 Desktop.png` (1440 × 1024), `../1 SETUP/1.1 Mobile.png` (402 × 874), and `../1 SETUP/1.2 Desktip.png` (1440 × 1024).
- Rendered implementation: `qa/step1-desktop-1440.png` (1440 × 1024), `qa/step1-mobile-402x812.png` (402 × 812), and `qa/step1-desktop-10-cards.png` (1440 × 1024), captured from `http://127.0.0.1:4173/`.
- Side-by-side full-view comparison: `qa/comparison-full.png`. The desktop captures are displayed at 50% in both columns. The mobile source's 62-pixel device status bar is cropped, leaving the same 402 × 812 app area as the browser capture at 1:1. Source and implementation use the same two-card state for the primary comparison. The ten-card source and implementation use different concern texts because examples are deliberately randomized, but match in count and layout.
- Responsive follow-up captures: `qa/step1-compact-desktop-fixed.png` (1000 × 930) and `qa/step1-tablet-fixed.png` (780 × 930), checked against the reference's desktop bottom margin and the user-supplied narrow-window screenshot. The compact desktop button now has 86 px below it, and the tablet button has 84 px; the top-right mascot no longer covers the label.
- Focused inspection: the mobile comparison is shown at 1:1 within the combined image; headline wrapping, mascot crop, input/button dimensions, card spacing, and CTA position are legible there. The desktop ten-card region visibly preserves the list viewport and scroll treatment.

**Fidelity review**

- Fonts and typography: bundled Gotham Rounded weights render with comparable hierarchy, wrapping, and optical size. The headline wraps on the same lines in both viewports.
- Spacing and layout: desktop columns, divider, artwork, form, list, and CTA align closely. Mobile hierarchy, mascot placement, form width, and bottom CTA align closely; card content scrolls without covering the CTA.
- Colors and tokens: the supplied color and radius tokens drive controls. The background gradient and button hues are close to the references and maintain readable contrast.
- Image quality and assets: the supplied Tooca logo and Mooca artwork are used directly and remain sharp at the displayed sizes; there are no substitute illustrations.
- Copy and content: labels, help text, actions, and card-count copy match the references. Extra examples are intentionally random mock concerns.

**Open Questions**

- None for Step 1. Sorting and reflection screens are separate follow-up work; the current Sort view is a functional handoff that keeps the collected cards.

**Implementation Checklist**

- [x] Add and remove concerns, including long text.
- [x] Randomly add one example concern per click without repeating existing examples.
- [x] Preserve cards and phase across refresh in the same tab.
- [x] Keep the primary action visible when ten or more cards are present.
- [x] Verify desktop, mobile, tests, Storybook, lint, typecheck, and production build.

**Follow-up Polish**

- [P3] The rendered background reads very slightly lighter than the source in the middle of the page; this does not affect hierarchy or readability.

**Comparison history**

- Initial 1440 px desktop and 402 px mobile side-by-side pass: no P0/P1/P2 findings at those viewports.
- Follow-up narrow-window review: the user identified a P2 regression at intermediate widths. At roughly 780 px, the two-column desktop layout compressed the form and mascot into the same area, while a viewport-height calculation left no bottom margin below the CTA. The fix introduces a tablet layout through 920 px, reserves vertical mascot space from 921–1100 px, and subtracts the intended bottom margin from compact desktop stage height. The two new screenshots above show the corrected positions; the 1440 × 1024 and 402 × 812 reference sizes remain intact.

## Step 2

**Findings**

- No actionable P0/P1/P2 differences remain in the sorting screen. The card, character art, title, actions, and bottom spacing follow the desktop and mobile references.

**Evidence**

- Source visual truth: `../Step 2 - 3/2.1 CATEGORIZE/Desktop.png` (1440 × 1024) and `../Step 2 - 3/2.1 CATEGORIZE Begin/Mobile.png` (402 × 874).
- Rendered implementation: `qa/step2/desktop-1440x1024.png` (1440 × 1024) and `qa/step2/mobile-402x812.png` (402 × 812), captured from `http://127.0.0.1:4173/` with two pending cards and “Job interview tomorrow.” in front.
- Side-by-side full-view comparison: `qa/step2/comparison.png`. Desktop images are displayed at 50% in both columns. The mobile source's 62-pixel status bar is cropped; the remaining 402 × 812 app area is compared with the browser capture at 1:1. The screenshot itself allows focused inspection of mobile typography, mascot, card border, underlay, and controls.
- Responsive checks: 1101, 1100, 1000, 920, 780, and 402 px widths, plus a 402 × 667 short viewport. The card stays clear of the actions; the short viewport can scroll to them.
- Interaction checks in the browser: left and right buttons, a right swipe, a short drag that returns the card, automatic advance to the next card, refresh during sorting, return to Step 1, adding another card, and completion into reflection.

**Fidelity review**

- Typography: bundled Gotham Rounded reproduces the headline and card hierarchy; the example card fits on one line in both target viewports.
- Spacing and layout: the desktop card is 500 × 242 at x=462/y=411 versus roughly x=460/y=410 in the source. The mobile card is 330 × 172 at x=36/y=436 versus roughly x=36/y=438 in the cropped source. The controls retain clear bottom space.
- Colors and tokens: the blue card and gradient follow the supplied palette. The two action fills are darker than the reference to keep white button text at accessible contrast; the category meanings remain clear.
- Image quality: the supplied mascot SVGs are used directly; desktop art sits in the source's colored oval regions and the mobile phone mascot sits above the card.
- Copy and content: heading, guidance, category labels, and example card copy match the source.

**Comparison history**

- The first combined comparison found the mobile example text wrapping to two lines and the desktop character circles slightly high and oversized. The mobile card font/underlay and desktop art geometry were adjusted, then both implementation screenshots were recaptured and compared side by side again. No P0/P1/P2 differences remain.

**Follow-up polish**

- [P3] Mascot rendering and the background gradient differ subtly from the flattened source screenshots. The original SVG artwork is retained.

final result: passed

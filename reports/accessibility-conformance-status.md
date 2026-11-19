# Accessibility conformance status

## Target

- United States Section 508 web requirements, which incorporate WCAG 2.0 Level A and AA.
- Additional WCAG 2.2 interaction improvements: visible focus, target sizing, redundant input support, and motion preferences.

## Implemented

- Skip link and stable main-content target on every route.
- High-contrast keyboard focus across buttons, links, inputs, summaries, and programmatic focus targets.
- Keyboard-contained Study Coach dialog with Escape close and focus restoration.
- Question and lab focus transfer after each transition.
- Named answer groups, announced selected states, and correct/recovery result semantics.
- Pause/resume controls for question and lab timers.
- Named progressbar and polite live result announcements.
- Source guidance disclosure linked to its controlling button.
- 44 CSS-pixel minimum controls; 48 pixels on coarse-pointer devices.
- Compact pill controls, smooth press feedback, and touch-action support without oversized block controls.
- Reduced-motion support and non-motion state indicators.
- Light and dark themes with a dedicated high-visibility focus color.

## Automated evidence

Run:

```text
npm run qa:a11y
npm run lint
npm run build
```

The accessibility contract checks source-level presence of language, bypass, focus, timing, state, modal-keyboard, live-region, touch-target, and reduced-motion behavior. It supplements—not replaces—criterion-by-criterion testing.

## Remaining conformance work

This repository is accessibility-enhanced and test-ready; it is not a blanket Section 508 certification. Formal conformance requires a human-led test of the deployed release using the current Section 508 ICT Testing Baseline, including:

- Keyboard-only inspection at desktop and mobile breakpoints.
- Screen-reader runs with at least NVDA/Firefox or Chrome, JAWS/Chrome, and VoiceOver/Safari.
- 200% and 400% zoom, reflow, text spacing, high contrast/forced colors, and orientation checks.
- Contrast measurement for every interactive state and chart/HUD encoding.
- A documented Accessibility Conformance Report (ACR/VPAT) with exceptions, ownership, and remediation dates.

An accessibility professional should sign the final ACR before an organization claims full Section 508 conformance.

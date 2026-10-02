# Tooca

React + TypeScript starter built with Vite, Tailwind CSS, Motion, Vitest, and Storybook.

## Requirements

- Node.js 22.12 or newer
- npm 11 or newer

## Commands

```bash
npm install
npm run dev
npm run storybook
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run test:storybook
npm run build
npm run build-storybook
```

## Design foundations

The source color and radius tokens live in `../design-tokens`. `npm run tokens` converts those JSON files into `src/styles/generated-tokens.css`; it runs automatically before the app and Storybook start or build.

Gotham Rounded font files are bundled in `src/assets/fonts`. Typography and elevation values are defined in `src/styles/foundations.css` from the supplied reference sheets.

Use generated Tailwind utilities such as `bg-primary-500`, `text-gray-900`, `rounded-sm`, and `shadow-elevation-04`. The app and Storybook both import `src/index.css`, so they share the same tokens and typography.

Brand artwork is stored in `src/assets/brand`, mascot illustrations in `src/assets/mascot`, and the browser favicon in `public/favicon.svg`. Import files under `src/assets` directly from React components so Vite can fingerprint them during builds.

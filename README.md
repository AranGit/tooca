<p align="center">
  <img src="src/assets/brand/tooca-logo.svg" alt="Tooca" width="150">
</p>

# Tooca

**Make room for what is in your hands.**

A gentle, interactive space to put worries into words, sort them one at a time, and reflect on what can be acted on now.

**[Try the live demo → tooca-ooca.vercel.app](https://tooca-ooca.vercel.app/)**

[Product & experience](docs/product.md) · [Architecture & state](docs/architecture.md) · [Development & design system](docs/development.md) · [Design QA](design-qa.md)

## Why Tooca?

| The problem | The audience | The approach |
| :--- | :--- | :--- |
| Under stress, the boundary between what we can and cannot control can feel blurred. Tangled concerns can feed overthinking and overwhelm. | Working professionals and students facing immediate stressors who want a quick moment of mindfulness and a way to approach concerns one at a time. | Turn the **Circle of Control** concept into a simple card-sorting experience: write, swipe, and reflect. |

The design hypothesis is that a physical sorting action can help people move from repeatedly thinking about a worry to making a concrete choice about it. Tooca uses gentle, game-like interaction without scores or time pressure. This is the product rationale, not a measured claim of clinical effectiveness.

## The experience at a glance

| 01 · Add | 02 · Sort | 03 · Reflect |
| :---: | :---: | :---: |
| ![Add concerns screen](qa/step1-desktop-1440.png) | ![Sort a concern screen](qa/step2-full/01-idle.png) | ![Reflection screen](qa/step3/desktop-1440x1024.png) |
| **Put it into words.** | **Make one choice at a time.** | **See what is in your hands.** |
| Write a concern or try a random example. | Swipe left to rest it here, or right to keep it in your hands. Buttons offer the same choices. | Review both groups, bring a card back, or begin again. |

*Screenshots are saved design-review captures. Some colors, copy, and mascot states have changed since capture; see [Design QA](design-qa.md).*

## Core user flow

```mermaid
flowchart TD
    Start([Start]) --> Add["Add your concerns"]
    Add --> Review["Review a concern"]
    Review --> Choice{"Is this in your hands?"}
    Choice -->|Yes| Hands["In My Hands"]
    Choice -->|Not right now| Rest["Rest It Here"]
    Hands --> Complete{"All cards sorted?"}
    Rest --> Complete
    Complete -->|No| Review
    Complete -->|Yes| Reflect["Reflect on your concerns"]
    Reflect --> End([End])
    classDef action fill:#E7F6F4,stroke:#007F76,color:#163D39
    classDef decision fill:#FFF5D6,stroke:#977100,color:#493800
    class Add,Review,Hands,Rest,Reflect action
    class Choice,Complete decision
```

Rounded nodes mark the start and end, rectangles show activities, and diamonds show decisions. Optional undo and restart paths are covered in the [experience guide](docs/product.md#interaction-rules).

## Information architecture

One application page contains three experience states. The header shows **Add cards** and **Sort cards**; reflection is the outcome of sorting.

```mermaid
flowchart TB
    App["Tooca · Single page"] --> Header["Shared header"]
    Header --> Brand["Logo / Skip to main content"]
    Header --> Progress["Progress: Add cards → Sort cards"]
    App --> Main["Main experience"]
    Main --> Setup["01 · Add cards"]
    Setup --> Input["Concern input · Examples · Card list"]
    Main --> Sort["02 · Sort cards"]
    Sort --> Deck["Current card · Two categories · Undo"]
    Main --> Reflection["03 · Reflection"]
    Reflection --> Groups["Category summaries · Undo · Begin again"]
```

This is a content hierarchy, not a route map. See [state and navigation](docs/architecture.md#state-and-navigation) for implementation details.

## Run locally

Use **Node.js 22.12+** and **npm 11+**.

```bash
git clone https://github.com/AranGit/tooca.git
cd tooca
npm ci
npm run dev
```

Open the local URL printed by Vite. No environment variables, account, or backend setup are required.

| Explore | Command |
| :--- | :--- |
| Component stories | `npm run storybook` |
| Unit tests | `npm run test:run` |
| Type, lint, and token checks | `npm run typecheck && npm run lint && npm run tokens:check` |
| Production build | `npm run build` |
| Preview production build | `npm run preview` |

Browser checks and Storybook accessibility tests require Chromium. See [complete setup and verification](docs/development.md).

## Built with

| Interface | Interaction & state | Quality & tooling |
| :--- | :--- | :--- |
| React 19 · TypeScript · Tailwind CSS 4 | Motion · Zustand · sessionStorage | Vite · Vitest · Testing Library · Storybook · Playwright · Oxlint |

**Session behavior:** cards, categories, and sorting history survive refreshes in the same tab. The Add cards list shows the newest card first, while sorting and reflection retain the original entry order. Unsubmitted text and accordion expansion are temporary. The app has no backend or cross-device synchronization; **Begin again** clears the current session.

**Known accessibility issue:** the supplied sorting colors have recorded contrast failures. Automated accessibility checks remain enabled. See the [QA findings](design-qa.md#open-accessibility-finding) before treating this as accessibility-complete.

## Documentation map

| Read this | To understand |
| :--- | :--- |
| [Product & experience](docs/product.md) | Problem, audience, design rationale, interactions, and scope |
| [Architecture & state](docs/architecture.md) | Page structure, state transitions, persistence, and source ownership |
| [Development & design system](docs/development.md) | Setup, commands, tokens, fonts, assets, and verification |
| [Design QA](design-qa.md) | Saved visual evidence, review history, and unresolved contrast findings |

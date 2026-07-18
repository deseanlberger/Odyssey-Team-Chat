# Odyssey Performance — Staff Workspace

A team communication and task-management web app for **Odyssey Performance**, a
youth strength & conditioning gym. Slack's three-panel layout and polish, with a
**real task manager built in** (not bolted on), a **staff scheduler** with
recurring/alternating coach assignments, and a **research knowledge base**
organized by subject. Dark mode by default with a light toggle.

Built as a faithful, pixel-accurate recreation of the hi-fi design prototype —
**React + TypeScript + Vite**, with the prototype's state model ported onto a
React context store. Gold (`#FFD700`) is the single accent; hardware aesthetic
(2px radius, hard zero-blur shadows, square scrollbars).

## Features

- **Channels & DMs** — `#general`, `#sales`, `#front-desk`, `#coaching-staff`,
  `#programming`, `#interns`, `#research`, `#policies`, plus direct messages.
- **Messaging** — reactions, file/doc cards, threads, `@mentions`, pinned
  messages, saved items, per-message hover actions, slash commands (`/task`,
  `/remind`, `/assign`, `/schedule`).
- **Task manager** — channel Task Boards + personal **My Tasks** (Today /
  Upcoming / Recurring / Overdue / Done). Silent-by-default task creation with an
  independent "Notify on" reminder and recurring reschedule.
- **Scheduler** — day & week views of recurring classes with **fixed or
  alternating** coach rotations (Head → Secondary → Support), biweekly cadence,
  per-day time overrides, a rotation-week stepper, and "Post to #coaching".
- **Research knowledge base** — `#research` topics grouped by collapsible
  Subject, each its own thread, with optional media attachments.
- **Admin** — member × channel access matrix.
- **Command bar** (`⌘K`), notifications, theme toggle, and a mobile preview.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  data/          seed data + domain types
  store/         WorkspaceContext (state + actions) + useDerived (view-model)
  lib/           Icon (Lucide-equivalent line icons)
  ui/            shared atoms (Avatar)
  components/    view components (sidebar, chat, schedule, modals, overlays…)
  theme.css      design tokens (dark/light) + keyframes + base styles
```

The state layer (`store/WorkspaceContext.tsx`) mirrors the prototype's component
state 1:1 and is structured so a realtime backend (e.g. Supabase) can slot in
behind the same action surface later.

## Deployment

Configured for **Vercel** (`vercel.json`, Vite framework preset). The build is a
static SPA in `dist/`.

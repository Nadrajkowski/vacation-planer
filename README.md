# Vacation Planner

A single-page trip planning app built with React 19, TypeScript, and Vite. No backend — everything lives in your browser's localStorage.

---

## Features

### Timeline view

The main view is a vertical timeline divided into **days**. Days are implicitly created by the sleep places between them.

- **Arrival** is always the first event (pinned, marked in green)
- **Flight home** is always the last event (pinned, marked in orange)
- Between events, **travel time connectors** show and let you edit the minutes it takes to move between them
- All event start times are **calculated on the fly**: change a duration or travel gap and every downstream time updates immediately

### Events

Each event card shows and lets you edit:

- **Name** — inline text input
- **Start time** — derived from the chain; editing adjusts the travel gap before the event
- **End time** — editing recalculates the duration
- **Duration** — direct minute input; updates the end time display
- **Details section** (collapsible):
  - **Location** — paste a Google Maps link; a "Preview" button opens the map panel (see below); an external link opens Maps in a new tab
  - **Price** — enter in € or zł, toggle the currency with one click; the converted amount is shown live using the current exchange rate
  - **Notes** — freeform textarea

### Sleep places

Sleep cards mark the end of a day and the start of the next.

- **Check-in** and **check-out** times are editable; check-out becomes the start time of the next day's first event
- Same **Details section** as events (location, price, notes)

### Arrival & departure dates

Set the full trip range in the sticky header:

- **Arrival** date + time — sets the start of the chain
- **Flight home** date + time — pins the departure event to a specific datetime; changing the departure date **auto-populates** the missing nights with default sleep cards so you always have the right number of day sections

### Drag and drop

Every card — events, sleep places, and travel connectors — can be reordered by dragging the grip handle. The arrival and departure events are protected and cannot be moved from their positions.

### Left outline

A sticky sidebar on the left lists every day and its items:

- Click a **day header** to scroll the timeline to that day
- Click any **event or sleep item** to scroll directly to that card
- The **active day** is highlighted as you scroll through the timeline

### Map panel

Clicking **Preview** on any card that has a Google Maps link opens a full-height map panel on the right side of the screen. The panel shows:

- The item name and an "Open in Google Maps" link
- A live Google Maps iframe
- A close button to dismiss it

The panel works with standard Google Maps URLs that contain coordinates (`@lat,lng`) or a place name (`/place/Name/`). Short links (`maps.app.goo.gl`) cannot be embedded without resolving the redirect.

### Currency & cost tracking

- Set the **EUR → PLN exchange rate** in the header (persisted across sessions)
- Enter prices on any event or sleep card in either currency
- The header shows a **running total** in both € and zł whenever at least one price is entered

### JSON export

Click **Export JSON** in the header to download the full vacation data as a `.json` file. The exported structure mirrors the internal data model and can be used for backups or sharing.

### Persistence

All data is saved to **localStorage** (`vacation-planner-v1`) on every change. Refreshing the page restores your trip exactly as you left it. A default sample trip is created on first load.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 with React Compiler |
| Language | TypeScript 6 (strict) |
| Build tool | Vite 8 |
| Drag and drop | @dnd-kit/core + @dnd-kit/sortable |
| Icons | lucide-react |
| Styling | Plain CSS with custom properties (light + dark mode) |
| Storage | Browser localStorage |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build   # production build
npm run lint    # ESLint check
```

# Alert & Event Dispatch Center

A Svelte prototype for a mobile surveillance trailer **Alert & Event Dispatch Center**. The project turns the approved visual concept into an interactive, developer-ready interface.

## Product Goal

Mobile surveillance trailers are often installed at construction sites and other remote locations. The current monitoring experience shows sites and camera streams, but it needs an operational way to manage alerts and events.

This prototype introduces an **Alarms & Events** experience that helps an operator:

- See new events in a prioritized queue.
- Identify the most urgent security and equipment issues first.
- Review event context, camera evidence, and trailer location from one workspace.
- Assess trailer health while reviewing an event.
- Recognize recurring trailer-level issues through alert history.
- Take clear follow-up actions without leaving the event workflow.

## Main Experience

The interface contains two top-level tabs:

- **Overview**
- **Alarms & Events** (active in this prototype)

### Incident Queue

The left panel separates alerts into:

- **Unreviewed** - New events that still need attention.
- **In Progress** - Events that have been acknowledged and are being handled.

Each event displays its site, trailer ID, timestamp, type, and priority.

### Priority Levels

| Priority | Example events |
| --- | --- |
| Critical | Intrusion detected, active security event |
| High | Camera offline, major communication issue |
| Medium | Low fuel level, degraded network signal |
| Low | Battery maintenance reminder |

Priority is communicated with an explicit text label and color treatment, so the experience does not depend on color alone.

### Event Details and Evidence

Selecting an event updates the main workspace with:

- Customer, site, trailer, severity, timestamp, and elapsed time.
- Camera evidence with playback/live-view behavior.
- Trailer location on a map.
- Equipment health values for battery, fuel, network, storage, and temperature.

### Trailer Alert History

The right-side history is intentionally **trailer-focused**, not operator-focused. It shows recent security and equipment alerts for the same trailer so teams can spot repeat failures and decide whether proactive service is needed.

### Event Actions

The prototype includes the following actions:

- **Acknowledge** - Moves the selected event into the In Progress queue.
- **View Live** - Toggles the camera area into live-view mode.
- **Send to Mobile** - Simulates sending the event to a configured mobile device.
- **Email Alert** - Simulates emailing configured recipients.
- **Resolve** - Removes the selected event from the active queue.

All actions currently use local prototype state and confirmation messages. They are designed to be connected to real APIs later.

## Technology

- Svelte 5
- TypeScript
- Tailwind CSS
- Vite

## Project Structure

```text
src/
  App.svelte                 Main application state and dashboard layout
  main.ts                    Svelte application entry point
  app.css                    Tailwind imports and global styles
  lib/
    Info.svelte              Compact event-information display component
    QueueSection.svelte      Reusable incident queue section
```

## Run Locally

This project uses **pnpm** because the generated lockfile uses pnpm workspace links.

```powershell
cd D:\SiteStream
pnpm install
pnpm dev
```

If `pnpm` is not installed on the machine:

```powershell
npm install -g pnpm
```

Then reopen PowerShell and repeat the install and run commands above.

## Validation

```powershell
pnpm check
pnpm build
```

Both commands completed successfully for the current prototype.

## Recommended Next Steps

1. Replace mock incidents and trailer telemetry with API data.
2. Connect each action to the appropriate notification, email, and resolution workflows.
3. Add role-based permissions and audit logging if the product requires them.
4. Integrate actual live and recorded camera streams.
5. Add filters for priority, customer, site, trailer, event type, and time range.
6. Define service rules for recurring alerts and trailer-health thresholds.

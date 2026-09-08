# Alert & Event Dispatch Center — Diagram Prompts

Use these prompts to generate implementation-facing diagrams for the Alert & Event Dispatch Center. Keep labels in English because the product interface and API terminology are in English.

## Shared visual direction

Apply this direction to every diagram:

> Clean technical product diagram for a security-operations web application. White background, dark navy text (#102A4C), primary blue (#087FE8), green for successful states, amber for warning states, red for critical states. Use the Inter font or a similar modern sans-serif. Thin rounded cards, consistent line weights, clear arrowheads, generous whitespace, and concise labels. Avoid decorative illustrations, gradients, 3D effects, and tiny text. The result must be readable by software engineers in a technical design review.

## 1. Event lifecycle state machine

Use this to define the states an event may have and the actions that move it between states.

```text
Create a state-machine diagram for an "Alert & Event Dispatch Center" used to monitor mobile surveillance trailers. Use the shared visual direction.

Show these states as large rounded cards:
1. Unreviewed — a newly received event requiring operator attention.
2. In Progress — an event that has been acknowledged and is being handled.
3. Resolved History — an event that has been closed but remains available for audit and review.

Show directed transitions:
- New alert received → Unreviewed.
- Acknowledge → In Progress.
- Resolve → Resolved History.
- Optional Reopen → In Progress, represented with a dashed arrow and marked as future capability.

Under the In Progress state, include attached action chips: View Live, Send to Mobile, Email Alert, Add Note. Explain in a small note that these actions do not change the event state; each creates an Activity Log entry.

Include a compact legend: red = critical priority, blue = operator workflow, green = resolved/auditable state. Do not show a database schema.
```

## 2. Operator event-handling flow

Use this to explain the operator's end-to-end workflow in the interface.

```text
Create a left-to-right user-flow diagram for an Alert & Event Dispatch Center. Use the shared visual direction.

Start with "Alert received". Then show these connected steps:
1. Event enters Incident Queue under Unreviewed.
2. Operator filters queue by one or more trailer units using a multi-select filter. The filter options appear as "0014T · Copper Ridge" and are ordered by trailer number.
3. Operator selects an event and reviews event details, camera evidence, map location, and equipment health.
4. Operator acknowledges the event; it moves to In Progress and an activity-log entry is created.
5. Operator can perform any combination of View Live, Send to Mobile, Email Alert, and Add Note. Every action appends a timestamped event-activity entry.
6. Operator resolves the event; it moves to Resolved History and preserves its details, notes, and full activity log.

Add a side branch from step 3 to "Last Critical Events" to show that global critical events remain visible regardless of the selected trailer. Add a small callout that Camera health displays a count such as "3 / 4 online, 1 offline".
```

## 3. Action and audit-log sequence

Use this to guide API and event-log implementation.

```text
Create a sequence diagram for the Alert & Event Dispatch Center. Use the shared visual direction and standard sequence-diagram lanes.

Participants from left to right: Operator, Web UI, Event API, Notification Service, Activity Log Store, Mobile Device / Email Recipient.

Show these interaction scenarios in separate grouped sections:

Acknowledge:
- Operator clicks Acknowledge.
- Web UI sends updateEventStatus(eventId, "In Progress") to Event API.
- Event API saves the new status.
- Event API writes an activity log entry with action "Event acknowledged", timestamp, and user ID.
- API returns the updated event and the UI refreshes the Incident Queue and Event Activity timeline.

Send to Mobile:
- Operator clicks Send to Mobile.
- Web UI requests sendMobileNotification(eventId).
- Event API requests Notification Service delivery.
- Notification Service delivers to the mobile device.
- Event API records "Event sent to mobile" in the Activity Log Store.
- UI receives success and appends the entry to Event Activity.

Add Note:
- Operator writes a note and clicks Add Note.
- UI sends createEventNote(eventId, noteText).
- API stores the note and writes an audit entry formatted as `Note added: “<note text>”`.
- UI clears the note field and updates Event Activity.

Resolve:
- Operator clicks Resolve.
- UI requests updateEventStatus(eventId, "Resolved").
- API stores the status and logs "Event resolved".
- UI removes the event from active queues and displays it in Resolved History.

Make it explicit that notification delivery failures create a failed activity-log entry and return an actionable error to the UI.
```

## 4. Domain data model

Use this as the starting point for an API contract and database design discussion.

```text
Create an entity-relationship diagram for the Alert & Event Dispatch Center. Use the shared visual direction. Show entity names, key fields, and cardinalities. Do not include implementation-specific SQL types.

Entities:

Trailer
- trailerId (example: 0026T)
- customerId
- siteId
- operationalStatus
- lastCommunicationAt

Site
- siteId
- name
- customerId
- address / coordinates

Camera
- cameraId
- trailerId
- name
- onlineStatus
- lastSeenAt

Event
- eventId
- trailerId
- cameraId (optional)
- type
- priority: Critical, High, Medium, Low
- status: Unreviewed, In Progress, Resolved
- detectedAt
- resolvedAt (optional)
- assignedUserId (optional)

EventActivityLog
- activityId
- eventId
- actorUserId
- actionType
- description
- createdAt
- deliveryStatus (optional)

EventNote
- noteId
- eventId
- authorUserId
- content
- createdAt

User
- userId
- displayName
- role

Show relationships: Customer has many Sites; Site has many Trailers; Trailer has many Cameras and Events; Event has many EventActivityLogs and EventNotes; User creates many logs and notes. Clearly mark Camera-to-Event and assigned User-to-Event as optional.
```

## 5. Frontend component and data-flow map

Use this to split the prototype into implementation components.

```text
Create a frontend component and data-flow diagram for a Svelte Alert & Event Dispatch Center. Use the shared visual direction.

Top-level component: DispatchCenterPage.

Child components:
- IncidentQueue: owns the multi-select trailer/site filter and renders queue sections.
- QueueSection: renders Unreviewed, In Progress, and Resolved History event lists.
- EventDetails: renders selected event metadata, priority, camera evidence, map location, and equipment health.
- EventActions: Acknowledge, View Live, Send to Mobile, Email Alert, Resolve.
- EventActivity: timestamped audit timeline for the selected event.
- EventNotes: create and display event notes.
- CriticalEventsPanel: global list of latest critical events across all units.

Shared client state:
- selectedEventId
- events
- selectedTrailerIds
- eventActivityLogs
- eventNotes
- cameraHealth
- notification / request status

Show one-way data inputs from DispatchCenterPage to child components, and labeled callback outputs back to the parent: selectEvent, updateFilter, acknowledgeEvent, sendNotification, addNote, resolveEvent. Show API calls grouped behind an Event API client. Mark local prototype state as replaceable by server state.
```


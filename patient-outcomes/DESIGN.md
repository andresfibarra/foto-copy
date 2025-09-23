## Patient Outcomes – Design Document

### Overview
A web app for a physical therapy clinic to track patient outcomes. Each Patient (identified by MRN) has one or more Encounters (an injury/care episode). Each Encounter has one or more Snapshots (surveys) with computed Scores. The landing page centers the title "Patient outcomes" and provides search by MRN or name. Users can view a patient's encounters, create a new encounter via modal, view an encounter's snapshots, and create a new snapshot via a dedicated survey page.

### Goals
- Fast search by MRN or name and quick navigation to a patient's encounters.
- Simple, consistent workflows for creating encounters and snapshots.
- Store raw survey responses and derived/computed scores per snapshot.
- Foundation for analytics across encounters and time.

### Non-Goals (v1)
- Authentication/authorization beyond placeholders.
- Billing or scheduling features.
- EHR integration.

## Domain Model

### Entities
- Patient
  - id (UUID)
  - mrn (string, unique)
  - firstName (string)
  - lastName (string)
  - dateOfBirth (date, optional)
  - createdAt, updatedAt (timestamps)

- Clinician
  - id (UUID)
  - firstName (string)
  - lastName (string)
  - npi (string, optional)
  - createdAt, updatedAt (timestamps)

- Encounter
  - id (UUID)
  - patientId (FK → Patient)
  - clinicianId (FK → Clinician)
  - bodyPart (string; e.g., "knee", "shoulder")
  - careType (enum: ORTHOPEDIC | NEUROLOGIC | PELVIC_FLOOR)
  - injuryType (string)
  - startedAt (date)
  - closedAt (date, nullable)
  - createdAt, updatedAt (timestamps)

- Snapshot
  - id (UUID)
  - encounterId (FK → Encounter)
  - surveySchemaId (FK → SurveySchema)
  - responses (JSON; raw answers)
  - computedScore (number)
  - takenAt (datetime)
  - createdAt, updatedAt (timestamps)

- SurveySchema (optional, for extensibility)
  - id (UUID)
  - name (string; e.g., "LEFS", "DASH")
  - version (string)
  - definition (JSON; questions, weighting)
  - computeFunction (string identifier; scoring algorithm key)

### Relationships
- Patient 1—N Encounter
- Clinician 1—N Encounter
- Encounter 1—N Snapshot
- Snapshot N—1 SurveySchema

## Data Storage
- Start with a simple REST/JSON API (Node/Express). DB could be SQLite/Postgres. For local prototyping, a JSON store or SQLite is sufficient.
- Indexes: Patient.mrn; Patient.lastName + Patient.firstName; Encounter.patientId; Snapshot.encounterId.

## Scoring
- Each SurveySchema defines how to compute a score from responses.
- Store both responses (immutable) and computedScore (derived) on Snapshot at creation; recompute if schema changes (future migration).
- Example: sum of weighted answers, normalized 0–100.

## Frontend

### Tech
- React + Vite
- Routing: React Router
- Data fetching/cache: React Query (TanStack Query)
- Styling: CSS modules or utility CSS; accessible components

### Routes
- `/` Landing: centered title, patient search by MRN or name
- `/patients/:patientId` Patient detail: list encounters, button "Create new encounter" (modal)
- `/encounters/:encounterId` Encounter detail: list snapshots, score per snapshot, button "Create snapshot"
- `/encounters/:encounterId/snapshots/new` Snapshot create page: survey form and submit

### Key Screens & UX
- Landing
  - Title "Patient outcomes" centered at top
  - Search input placeholder "Search by MRN or name"
  - Debounced input; results list with patient name and MRN; selecting navigates to patient detail

- Patient Detail
  - Heading with patient name and MRN
  - Encounters listed with: bodyPart, careType, injuryType, clinician, startedAt, latest score
  - Action: "Create new encounter" (modal)
    - Fields: clinician (select), bodyPart (text/select), careType (select: orthopedic/neurologic/pelvic floor), injuryType (text)

- Encounter Detail
  - Header: patient name, encounter summary
  - Snapshots list/table: takenAt, computedScore, quick view
  - Action: "Create snapshot" → navigates to snapshot form

- Snapshot Create
  - Survey form based on selected SurveySchema (for v1, a single built-in schema is fine)
  - On submit: compute score on client for preview, send to API; show confirmation and return to Encounter detail

### Components (initial)
- SearchBar
- PatientList / PatientListItem
- EncounterList / EncounterListItem
- CreateEncounterModal
- SnapshotList / SnapshotListItem
- SnapshotSurveyForm
- Layout: PageHeader, Container

### State & Data Flow
- Server state via React Query; local UI state via React state
- Optimistic updates for create actions; invalidate lists after success
- Client-side validation; server validates again

## API (REST Sketch)
- Patients
  - GET `/api/patients?query=<mrn-or-name>` → [{ id, mrn, firstName, lastName, ... }]
  - GET `/api/patients/:id` → Patient
- Encounters
  - GET `/api/patients/:id/encounters` → Encounter[]
  - POST `/api/patients/:id/encounters` { clinicianId, bodyPart, careType, injuryType } → Encounter
  - GET `/api/encounters/:id` → Encounter
- Snapshots
  - GET `/api/encounters/:id/snapshots` → Snapshot[]
  - POST `/api/encounters/:id/snapshots` { surveySchemaId, responses } → Snapshot (with computedScore)
  - GET `/api/snapshots/:id` → Snapshot
- Survey Schemas
  - GET `/api/surveys` → SurveySchema[] (optional)

### Validation
- MRN: required, unique, sanitized
- Encounter: careType in enum; bodyPart and injuryType required; clinicianId exists
- Snapshot: responses conform to survey schema; score computed on server for trust

### Security & Privacy
- Treat MRN and names as sensitive PII; minimize exposure
- For production: add auth (OIDC) and RBAC; enforce HTTPS; audit logs

## Testing
- Unit: scoring functions, form validation
- Integration: search flow, create encounter, create snapshot
- E2E: Cypress/Playwright basic journeys

## Performance
- Server-side pagination on patient search
- Debounce search input (300–500ms)
- Lazy-load encounter snapshots

## Accessibility
- Form fields with labels, proper roles
- Keyboard navigable modal and buttons
- Color contrast and focus styles

## Deployment
- Dev: Vite dev server (`npm run dev`)
- Prod: Static build (`npm run build`) served by CDN or simple server; API deployed separately

## Open Questions
- Authentication provider and roles?
- Which surveys are required (LEFS, DASH, PROMIS, etc.)?
- Score normalization rules and display preferences (graphs, trend lines)?
- Do encounters ever span multiple clinicians or locations?

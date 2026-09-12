# MathHub Mock Examination Portal — Database Starter

This package is a fresh CI4 database design for rebuilding the legacy CI3 examination portal.

## Source reviewed

The legacy `mathhub.sql` is a MariaDB 10.4.27 dump and contains tables such as:
- `candidate_response_tbl`
- `cand_score_tbl`
- `questions_bank_tbl`
- `test_series_candidates_tbl`
- `test_series_tbl`
- `ts_qset_tbl`
- `ts_section_tbl`
- category/topic tables

The new schema deliberately does not copy the old fixed five-section design.

## Files

- `mock_portal_schema.sql` — complete SQL schema.
- `2026-09-04-000001_CreateMockPortalSchema.php` — CI4 migration.
- `api-endpoints.md` — API contract and exam-engine endpoints.
- `README.md` — architecture/deployment notes.

## Core relationship

```text
User
 ├── Course Enrollment ──> Course ──> Course Exam ──> Exam
 └── Order ──> Product ──> Product Exam ──> Exam

Exam
 ├── Category
 ├── Exam Sections
 │    └── Question Set
 │         └── Question Set Questions
 │              └── Questions
 │                   └── Options
 └── Proctoring Settings

Exam Attempt
 ├── Attempt Sections
 ├── Attempt Questions
 ├── Attempt Answers
 ├── Exam Events
 └── Proctoring Events

Attempt
 └── Result
      └── Result Sections
```

## Why question sets are separate

A question is reusable. A question set is a curated ordered collection of questions. An exam section points to a question set. This allows the same question set to be reused by sectional tests and full tests.

The exam section, not the global section table, owns:
- question set
- question count
- section order
- duration
- positive marks
- negative marks

Therefore an exam can have any number of sections without columns such as `section_1` through `section_5`.

## Full test

A full test is simply an `exams` row with multiple `exam_sections`. Do not physically merge or duplicate questions.

## Timing

`exam_attempts.started_at` and `expires_at` are authoritative. The browser countdown is only a display.

For sectional timing, `exam_attempt_sections.started_at` and `expires_at` are used.

## Published exam immutability

Do not modify the rules of an already-published/started exam just because a template changes. Create a new template version or clone the exam. `exam_attempts.settings_snapshot` preserves the effective rules for an attempt.

## Real-time answers

The normal state is one row per attempt/question in `exam_attempt_answers`.

The browser keeps state in Alpine.js and sends changed answers in batches to:

`POST /api/v1/attempts/{attemptToken}/sync`

The database uses:

`UNIQUE(attempt_id, attempt_question_id)`

so the API can safely upsert answer state.

`client_sequence` prevents stale browser requests from overwriting newer state.

## Proctoring

Do not store continuous camera video in MySQL or on shared hosting.

Recommended first version:

```text
Browser camera
   ↓
browser-side detection
   ↓
proctoring event API
   ↓
MySQL
```

Store the initial verification photo as a file path. Store detection metadata as JSON in `proctoring_events.event_data`.

## Shared hosting

This schema is intentionally compatible with a normal CI4 + PHP + MariaDB/MySQL shared-hosting deployment.

Start without Redis/WebSockets. Add Redis or a dedicated real-time service only after actual concurrency measurements show the need.

## Installation

### Option A — SQL

Create/select an empty database and import:

`mock_portal_schema.sql`

### Option B — CI4

Copy the migration into:

`app/Database/Migrations/`

Then run:

```bash
php spark migrate
```

Before production, make a database backup and test the migration on a fresh staging database.

## Important implementation rule

Never trust the client for:
- candidate ID
- exam ID
- section ID
- question ownership
- selected option ownership
- marks
- timer
- remaining time
- correct answer
- final score

The server/database must derive or verify all of these.

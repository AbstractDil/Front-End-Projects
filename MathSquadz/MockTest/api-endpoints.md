# MathHub Mock Examination Portal — API Contract

Base URL:
`/api/v1`

Authentication:
- JWT access token in `Authorization: Bearer <access_token>`
- Public exam identifiers use `exams.public_id`, not database IDs.
- Attempt APIs use the opaque `attempt_token`.

## 1. Authentication

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Login and issue JWT |
| POST | `/auth/refresh` | Refresh token | Rotate/refresh JWT |
| POST | `/auth/logout` | JWT | Revoke refresh token |
| GET | `/auth/me` | JWT | Current user |

## 2. User / candidate panel

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/me/profile` | Candidate profile |
| PUT | `/me/profile` | Update profile |
| GET | `/me/exams` | Exams accessible through purchase/course/admin entitlement |
| GET | `/me/exams?category=...&type=...&status=...` | Filter candidate exams |
| GET | `/me/attempts` | Candidate attempt history |
| GET | `/me/results` | Candidate results |

## 3. Public exam/catalog APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/categories` | Exam category tree |
| GET | `/categories/{slug}/exams` | Exams in a category |
| GET | `/exams` | Published exam catalogue |
| GET | `/exams/{publicId}` | Public exam details |
| GET | `/exams/{publicId}/access` | Check whether current user can start |
| GET | `/exams/{publicId}/sections` | Section metadata; never return answer keys |

## 4. Products / purchases

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Products/test series |
| GET | `/products/{slug}` | Product details |
| POST | `/orders` | Create order |
| GET | `/orders/{orderNo}` | Order status |
| POST | `/payments/create` | Create gateway payment |
| POST | `/payments/webhook/{provider}` | Gateway webhook |
| GET | `/orders` | User order history |

After a payment is verified server-side, create `user_entitlements`. Never grant access from a client-side success response.

## 5. Course/LMS integration

These endpoints are designed so the mock portal can remain separate from your LMS if necessary.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/integration/lms/course/sync` | Integration key | Create/update course mapping |
| POST | `/integration/lms/course-exam/sync` | Integration key | Map course to exam |
| POST | `/integration/lms/enrollment/sync` | Integration key | Create/update user course enrollment |
| POST | `/integration/lms/enrollment/revoke` | Integration key | Revoke enrollment |
| POST | `/integration/lms/user/sync` | Integration key | Create/update portal user mapping |

For a separate LMS, `courses.external_course_id` is the stable LMS-side ID. Do not create a hard foreign key to the LMS database.

## 6. Exam attempt lifecycle — critical path

### Create attempt

`POST /exams/{publicId}/attempts`

Server must:
1. Verify entitlement/access.
2. Check attempt limit.
3. Load published exam configuration.
4. Create `exam_attempts`.
5. Copy exam sections into `exam_attempt_sections`.
6. Resolve question sets.
7. Generate the ordered attempt question list in `exam_attempt_questions`.
8. Snapshot question/options for live or proctored exams.
9. Store a `settings_snapshot`.
10. Return only candidate-safe question data.

Example response:

```json
{
  "attempt_token": "opaque-64-character-token",
  "status": "ready",
  "server_time": "2026-09-04T12:00:00Z",
  "exam": {
    "public_id": "01J...",
    "title": "SSC CGL Full Mock 01"
  },
  "sections": [
    {
      "id": 11,
      "name": "English",
      "position": 1,
      "question_count": 25,
      "duration_seconds": 900
    }
  ]
}
```

### Bootstrap

`GET /attempts/{attemptToken}/bootstrap`

Returns:
- server time
- attempt status
- `started_at`
- `expires_at`
- current section
- section deadlines
- question list
- candidate's saved answers/statuses
- palette state

Do not return `is_correct` or correct answer information.

### Start

`POST /attempts/{attemptToken}/start`

Server:
- validates status
- sets `started_at`
- calculates `expires_at`
- activates first section
- increments/records an exam event
- returns authoritative timestamps

### Heartbeat

`POST /attempts/{attemptToken}/heartbeat`

Recommended client interval: 15–30 seconds.

Payload:

```json
{
  "client_time": "2026-09-04T12:05:10Z",
  "current_question_id": 501,
  "current_section_id": 10,
  "client_sequence": 145
}
```

Server updates `last_activity_at` and returns authoritative `server_time`, `expires_at`, status and current section.

### Answer synchronization

`POST /attempts/{attemptToken}/sync`

This is the most important high-traffic endpoint.

Payload:

```json
{
  "client_sequence": 146,
  "changes": [
    {
      "attempt_question_id": 901,
      "selected_option_id": 3501,
      "answer_status": "answered",
      "marked_for_review": 0,
      "visited": 1
    },
    {
      "attempt_question_id": 902,
      "selected_option_id": null,
      "answer_status": "unanswered",
      "marked_for_review": 1,
      "visited": 1
    }
  ]
}
```

Rules:
- Use `attempt_token` to identify the attempt.
- Never trust `question_id`, option ownership, marks, or section from the browser.
- Verify every `attempt_question_id` belongs to this attempt.
- Verify the selected option belongs to that question.
- Upsert `exam_attempt_answers` using `(attempt_id, attempt_question_id)`.
- Update `exam_attempts.server_sequence`.
- Reject stale sequences when appropriate.
- Keep the operation idempotent.
- Return `server_sequence`, `server_time`, `expires_at`, and accepted/rejected changes.

Do NOT insert a new answer row for every click. One row per attempt/question is the normal state. Optional audit events can go to `exam_events`.

### Clear answer

`POST /attempts/{attemptToken}/answers/{attemptQuestionId}/clear`

Can also be represented as a change in `/sync`.

### Visit question

`POST /attempts/{attemptToken}/questions/{attemptQuestionId}/visit`

Can also be batched in `/sync`.

### Mark/unmark review

`POST /attempts/{attemptToken}/questions/{attemptQuestionId}/review`

Can also be batched in `/sync`.

### Switch section

`POST /attempts/{attemptToken}/sections/{examSectionId}/activate`

Server decides whether switching is legal. For sectional-timed exams, the client must not be able to jump to a locked section.

### Pause/resume

`POST /attempts/{attemptToken}/pause`
`POST /attempts/{attemptToken}/resume`

Only allowed when `exams.allow_pause = 1`.

For live/proctored exams, return `409`/business error such as `PAUSE_NOT_ALLOWED`.

### Submit

`POST /attempts/{attemptToken}/submit`

Server must:
1. Lock the attempt logically.
2. Re-read authoritative answer state.
3. Stop accepting answer updates.
4. Calculate score from database state, not client data.
5. Create `exam_results`.
6. Create `exam_result_sections`.
7. Mark attempt `submitted`.
8. Record submission event.
9. Return result if `show_result_immediately = 1`.

### Auto-submit

A scheduled job/cron can process expired attempts:
`expires_at <= UTC_TIMESTAMP()` and `status IN ('started','paused','security_locked')`.

The browser may also call submit when its local countdown reaches zero, but the server remains authoritative.

## 7. Proctoring

### Initial live photo

`POST /attempts/{attemptToken}/proctoring/verification-photo`

Multipart upload.

Store the file path in `exam_attempts.verification_photo`; do not store image binaries in MySQL.

### Proctoring event

`POST /attempts/{attemptToken}/proctoring/events`

Example:

```json
{
  "event_type": "multiple_face_detected",
  "severity": "violation",
  "event_data": {
    "face_count": 2,
    "confidence": 0.93,
    "duration_seconds": 7
  }
}
```

The server determines whether this counts as a violation. Do not let the browser submit `violation_number` as authoritative.

### Proctoring heartbeat

`POST /attempts/{attemptToken}/proctoring/heartbeat`

Send camera/fullscreen/tab state periodically.

### Candidate violation status

`GET /attempts/{attemptToken}/proctoring/status`

Returns:
- current violation count
- max violations
- locked/blocked state
- camera requirement
- current proctoring status

### Admin unlock

`POST /admin/attempts/{attemptToken}/unlock`

Server:
- verifies admin permission
- records resolver in `proctoring_events`
- sets attempt back to `started` only if policy allows
- records an `exam_events` entry

## 8. Results

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/attempts/{attemptToken}/result` | Candidate result |
| GET | `/attempts/{attemptToken}/result/sections` | Section-wise result |
| GET | `/results/{id}` | Result by result ID |
| GET | `/exams/{publicId}/leaderboard` | Published leaderboard, if enabled |

## 9. Admin — exam management

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/exams` | List exams |
| POST | `/admin/exams` | Create exam |
| GET | `/admin/exams/{id}` | Exam detail |
| PUT | `/admin/exams/{id}` | Update draft exam |
| POST | `/admin/exams/{id}/publish` | Publish |
| POST | `/admin/exams/{id}/pause` | Pause new starts |
| POST | `/admin/exams/{id}/archive` | Archive |
| POST | `/admin/exams/{id}/clone` | Clone an exam |
| POST | `/admin/exams/from-template/{templateId}` | Create exam from template |
| PUT | `/admin/exams/{id}/sections` | Replace draft section configuration |

Published/started exams should normally be immutable. Clone or create a new template version rather than changing rules for existing attempts.

## 10. Admin — templates

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/exam-templates` | List templates |
| POST | `/admin/exam-templates` | Create template |
| GET | `/admin/exam-templates/{id}` | Template detail |
| PUT | `/admin/exam-templates/{id}` | Edit draft template |
| POST | `/admin/exam-templates/{id}/clone-version` | New version |

A template change should affect new exams created from that version, not already published exams.

## 11. Admin — sections/categories

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/admin/categories` | Category CRUD |
| PUT/DELETE | `/admin/categories/{id}` | Category update/delete |
| GET/POST | `/admin/sections` | Section CRUD |
| PUT/DELETE | `/admin/sections/{id}` | Section update/delete |

## 12. Admin — question bank

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/questions` | Search/filter questions |
| POST | `/admin/questions` | Create question |
| GET | `/admin/questions/{id}` | Question detail |
| PUT | `/admin/questions/{id}` | Update question |
| DELETE | `/admin/questions/{id}` | Archive/delete |
| POST | `/admin/questions/{id}/duplicate` | Duplicate |
| GET | `/admin/question-sets` | List question sets |
| POST | `/admin/question-sets` | Create question set |
| PUT | `/admin/question-sets/{id}` | Update set |
| POST | `/admin/question-sets/{id}/questions` | Add/reorder questions |
| DELETE | `/admin/question-sets/{id}/questions/{questionId}` | Remove question |

Question content should support HTML plus canonical LaTeX/source. KaTeX is a rendering layer, not the canonical database format.

## 13. Question import

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/admin/import/questions` | Upload JSON/CSV/XLSX |
| GET | `/admin/imports/{batchToken}` | Import status |
| GET | `/admin/imports/{batchToken}/errors` | Row-level errors |
| POST | `/admin/imports/{batchToken}/commit` | Commit validated import |

Recommended import flow:

`upload -> parse -> validate -> preview -> commit`

Do not insert thousands of rows directly from the browser one at a time.

## 14. Admin — live monitoring

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/live/exams` | Live exams |
| GET | `/admin/live/exams/{examId}/attempts` | Active candidates |
| GET | `/admin/live/attempts/{attemptToken}` | Candidate live state |
| GET | `/admin/live/attempts/{attemptToken}/events` | Exam/proctor events |
| POST | `/admin/live/attempts/{attemptToken}/unlock` | Unlock security lock |
| POST | `/admin/live/attempts/{attemptToken}/terminate` | Terminate attempt |

## 15. Admin — products/access

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/admin/products` | Product CRUD |
| PUT | `/admin/products/{id}` | Product update |
| POST | `/admin/products/{id}/exams` | Add exams to product |
| DELETE | `/admin/products/{id}/exams/{examId}` | Remove exam |
| POST | `/admin/exams/{id}/grant-access` | Manual entitlement |
| POST | `/admin/exams/{id}/revoke-access` | Revoke entitlement |

## 16. Important HTTP/business errors

Use consistent JSON errors, for example:

```json
{
  "success": false,
  "error": {
    "code": "ATTEMPT_EXPIRED",
    "message": "This exam attempt has expired."
  }
}
```

Recommended codes:
- `AUTH_REQUIRED`
- `FORBIDDEN`
- `EXAM_NOT_FOUND`
- `EXAM_NOT_AVAILABLE`
- `ACCESS_DENIED`
- `ATTEMPT_LIMIT_REACHED`
- `ATTEMPT_NOT_FOUND`
- `ATTEMPT_EXPIRED`
- `ATTEMPT_LOCKED`
- `ATTEMPT_SUBMITTED`
- `PAUSE_NOT_ALLOWED`
- `SECTION_LOCKED`
- `INVALID_OPTION`
- `STALE_SEQUENCE`
- `INVALID_SYNC`
- `PROCTORING_REQUIRED`

## 17. High-concurrency rules

For the answer-sync endpoint:
- Keep transactions short.
- Use indexed lookups.
- Upsert one row per attempt/question.
- Batch multiple changed answers into one request.
- Do not write the complete answer array on every heartbeat.
- Do not query the entire question bank for every answer.
- Never calculate the final score on every answer.
- Use `client_sequence` for ordering/idempotency.
- Use `exam_events` only for important audit events, not every UI repaint.
- Keep candidate APIs separate from admin analytics queries.

## 18. Candidate-safe exam payload

Candidate endpoints may return:

```text
question_id
attempt_question_id
position
section
question_html
options
marks
negative_marks
```

They must NOT return:

```text
is_correct
correct_option
explanation
answer key
```

until the result/solution policy allows it.

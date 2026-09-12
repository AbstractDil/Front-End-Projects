-- ============================================================
-- Run this BEFORE deploying the new controller/model/JS.
-- Take a backup first (see backup block below) since this
-- truncates previous attempt data, per your earlier confirmation.
-- ============================================================

-- 1. Backup existing tables (safety net, drop these after the exam if unneeded)
CREATE TABLE IF NOT EXISTS candidate_response_tbl_backup_20260905 LIKE candidate_response_tbl;
INSERT INTO candidate_response_tbl_backup_20260905 SELECT * FROM candidate_response_tbl;

CREATE TABLE IF NOT EXISTS test_series_candidates_tbl_backup_20260905 LIKE test_series_candidates_tbl;
INSERT INTO test_series_candidates_tbl_backup_20260905 SELECT * FROM test_series_candidates_tbl;

CREATE TABLE IF NOT EXISTS cand_score_tbl_backup_20260905 LIKE cand_score_tbl;
INSERT INTO cand_score_tbl_backup_20260905 SELECT * FROM cand_score_tbl;

-- 2. Wipe previous attempt data (candidate_response_tbl has a known bad row from the
--    "answered but status=1" bug, so a clean slate avoids inheriting corrupted rows)
TRUNCATE TABLE candidate_response_tbl;
TRUNCATE TABLE cand_score_tbl;
TRUNCATE TABLE ts_feedback_tbl;

UPDATE test_series_candidates_tbl
SET is_submitted = 0,
    is_login = 0,
    cand_confirm = 0,
    disclaimer = 0,
    score_uploaded = 0,
    submitted_feedback = 0;

-- 3. Unique key that makes upsert (REPLACE INTO) safe for real-time autosave.
--    Without this, save_batch_responses() will silently start inserting
--    duplicate rows per question instead of updating them.
ALTER TABLE candidate_response_tbl
ADD UNIQUE KEY `uniq_token_ques` (`exam_token_key`, `ques_id`);

-- 4. Column to persist remaining exam time server-side, so a refresh/crash
--    resumes the countdown instead of restarting the full duration.
ALTER TABLE test_series_candidates_tbl
ADD COLUMN `remaining_seconds` INT NULL DEFAULT NULL AFTER `security_msg`;

-- MathHub Mock Examination Portal - Fresh Schema
-- Target: MariaDB 10.4+ / MySQL 8+
-- Generated from review of the legacy mathhub.sql.
-- This is a NEW schema; it intentionally does not alter the legacy tables.
-- Import this file after selecting your target database.
--
-- Main design:
--   users -> access (products/courses) -> exams -> sections -> question sets -> questions
--   users -> exam_attempts -> attempt_questions -> attempt_answers -> results
--   proctoring_settings/events handle live/proctored exams.
--
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET time_zone = '+00:00';
SET NAMES utf8mb4;

START TRANSACTION;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `public_id` CHAR(26) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NULL,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(30) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','teacher','student') NOT NULL DEFAULT 'student',
  `status` ENUM('active','inactive','blocked','pending') NOT NULL DEFAULT 'active',
  `avatar` VARCHAR(500) NULL,
  `email_verified_at` DATETIME NULL,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_public_id` (`public_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_phone` (`phone`),
  KEY `idx_users_role_status` (`role`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `token_hash` CHAR(64) NOT NULL,
  `token_type` ENUM('refresh','email_verification','password_reset','api') NOT NULL,
  `expires_at` DATETIME NULL,
  `revoked_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_tokens_hash` (`token_hash`),
  KEY `idx_user_tokens_user_type` (`user_id`,`token_type`),
  KEY `idx_user_tokens_expires` (`expires_at`),
  CONSTRAINT `fk_user_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` BIGINT UNSIGNED NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(180) NOT NULL,
  `description` TEXT NULL,
  `image` VARCHAR(500) NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_categories_slug` (`slug`),
  KEY `idx_exam_categories_parent` (`parent_id`),
  CONSTRAINT `fk_exam_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `exam_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(180) NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sections_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_templates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `code` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `version` INT UNSIGNED NOT NULL DEFAULT 1,
  `status` ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_templates_code_version` (`code`,`version`),
  KEY `idx_exam_templates_created_by` (`created_by`),
  CONSTRAINT `fk_exam_templates_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_template_sections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `template_id` BIGINT UNSIGNED NOT NULL,
  `section_id` BIGINT UNSIGNED NOT NULL,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  `question_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `duration_seconds` INT UNSIGNED NULL,
  `positive_marks` DECIMAL(8,3) NOT NULL DEFAULT 1.000,
  `negative_marks` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `is_timed` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_template_section` (`template_id`,`section_id`),
  KEY `idx_template_sections_order` (`template_id`,`position`),
  CONSTRAINT `fk_template_sections_template` FOREIGN KEY (`template_id`) REFERENCES `exam_templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_template_sections_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `question_sets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `code` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `status` ENUM('draft','active','archived') NOT NULL DEFAULT 'draft',
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_question_sets_code` (`code`),
  KEY `idx_question_sets_created_by` (`created_by`),
  CONSTRAINT `fk_question_sets_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `question_groups` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  `group_type` ENUM('passage','caselet','data_interpretation','common') NOT NULL DEFAULT 'common',
  `content_html` LONGTEXT NULL,
  `content_latex` LONGTEXT NULL,
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_question_groups_type` (`group_type`),
  CONSTRAINT `fk_question_groups_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `public_id` CHAR(26) NOT NULL,
  `group_id` BIGINT UNSIGNED NULL,
  `question_type` ENUM('single_choice','multiple_choice','true_false','numerical','descriptive') NOT NULL DEFAULT 'single_choice',
  `question_html` LONGTEXT NOT NULL,
  `question_latex` LONGTEXT NULL,
  `explanation_html` LONGTEXT NULL,
  `explanation_latex` LONGTEXT NULL,
  `difficulty` ENUM('easy','medium','hard') NULL,
  `language` VARCHAR(20) NOT NULL DEFAULT 'en',
  `positive_marks` DECIMAL(8,3) NULL,
  `negative_marks` DECIMAL(8,3) NULL,
  `source` VARCHAR(255) NULL,
  `source_reference` VARCHAR(255) NULL,
  `metadata_json` JSON NULL,
  `status` ENUM('draft','active','archived','reported') NOT NULL DEFAULT 'draft',
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_questions_public_id` (`public_id`),
  KEY `idx_questions_group` (`group_id`),
  KEY `idx_questions_status_type` (`status`,`question_type`),
  KEY `idx_questions_difficulty` (`difficulty`),
  CONSTRAINT `fk_questions_group` FOREIGN KEY (`group_id`) REFERENCES `question_groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_questions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `question_options` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_id` BIGINT UNSIGNED NOT NULL,
  `option_key` CHAR(1) NOT NULL,
  `option_html` LONGTEXT NOT NULL,
  `option_latex` LONGTEXT NULL,
  `is_correct` TINYINT(1) NOT NULL DEFAULT 0,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_question_option_key` (`question_id`,`option_key`),
  KEY `idx_question_options_question_order` (`question_id`,`position`),
  CONSTRAINT `fk_question_options_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `question_set_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_set_id` BIGINT UNSIGNED NOT NULL,
  `question_id` BIGINT UNSIGNED NOT NULL,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_question_set_question` (`question_set_id`,`question_id`),
  UNIQUE KEY `uq_question_set_position` (`question_set_id`,`position`),
  KEY `idx_qsq_question` (`question_id`),
  CONSTRAINT `fk_qsq_set` FOREIGN KEY (`question_set_id`) REFERENCES `question_sets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_qsq_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exams` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `public_id` CHAR(26) NOT NULL,
  `category_id` BIGINT UNSIGNED NULL,
  `template_id` BIGINT UNSIGNED NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(280) NOT NULL,
  `description` LONGTEXT NULL,
  `exam_type` ENUM('sectional','full','live','proctored','previous_year','practice') NOT NULL DEFAULT 'practice',
  `mode` ENUM('practice','scheduled','live') NOT NULL DEFAULT 'practice',
  `status` ENUM('draft','published','paused','archived','completed') NOT NULL DEFAULT 'draft',
  `duration_seconds` INT UNSIGNED NOT NULL DEFAULT 0,
  `available_from` DATETIME NULL,
  `available_until` DATETIME NULL,
  `allow_pause` TINYINT(1) NOT NULL DEFAULT 0,
  `allow_resume` TINYINT(1) NOT NULL DEFAULT 1,
  `max_attempts` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `shuffle_questions` TINYINT(1) NOT NULL DEFAULT 0,
  `shuffle_options` TINYINT(1) NOT NULL DEFAULT 0,
  `show_result_immediately` TINYINT(1) NOT NULL DEFAULT 1,
  `result_published_at` DATETIME NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` CHAR(3) NOT NULL DEFAULT 'INR',
  `is_free` TINYINT(1) NOT NULL DEFAULT 1,
  `settings_json` JSON NULL,
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exams_public_id` (`public_id`),
  UNIQUE KEY `uq_exams_slug` (`slug`),
  KEY `idx_exams_category_status` (`category_id`,`status`),
  KEY `idx_exams_availability` (`available_from`,`available_until`),
  CONSTRAINT `fk_exams_category` FOREIGN KEY (`category_id`) REFERENCES `exam_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exams_template` FOREIGN KEY (`template_id`) REFERENCES `exam_templates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exams_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_sections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `section_id` BIGINT UNSIGNED NOT NULL,
  `question_set_id` BIGINT UNSIGNED NULL,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  `question_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `duration_seconds` INT UNSIGNED NULL,
  `positive_marks` DECIMAL(8,3) NOT NULL DEFAULT 1.000,
  `negative_marks` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `is_timed` TINYINT(1) NOT NULL DEFAULT 1,
  `is_optional` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_section` (`exam_id`,`section_id`),
  KEY `idx_exam_sections_order` (`exam_id`,`position`),
  CONSTRAINT `fk_exam_sections_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_exam_sections_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exam_sections_question_set` FOREIGN KEY (`question_set_id`) REFERENCES `question_sets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(280) NOT NULL,
  `product_type` ENUM('single_exam','test_series','bundle') NOT NULL DEFAULT 'single_exam',
  `description` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` CHAR(3) NOT NULL DEFAULT 'INR',
  `validity_days` INT UNSIGNED NULL,
  `status` ENUM('draft','active','inactive','archived') NOT NULL DEFAULT 'draft',
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  CONSTRAINT `fk_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_exams` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_exam` (`product_id`,`exam_id`),
  CONSTRAINT `fk_product_exams_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_exams_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `courses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `external_course_id` VARCHAR(100) NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(280) NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_courses_external_id` (`external_course_id`),
  UNIQUE KEY `uq_courses_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_exams` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  `available_from` DATETIME NULL,
  `available_until` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_exam` (`course_id`,`exam_id`),
  CONSTRAINT `fk_course_exams_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_course_exams_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_enrollments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('active','inactive','expired','cancelled') NOT NULL DEFAULT 'active',
  `starts_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_enrollment` (`course_id`,`user_id`),
  KEY `idx_course_enrollments_user_status` (`user_id`,`status`,`expires_at`),
  CONSTRAINT `fk_course_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_course_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(40) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` CHAR(3) NOT NULL DEFAULT 'INR',
  `status` ENUM('pending','paid','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_order_no` (`order_no`),
  KEY `idx_orders_user_status` (`user_id`,`status`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `provider` VARCHAR(50) NOT NULL,
  `provider_order_id` VARCHAR(150) NULL,
  `provider_payment_id` VARCHAR(150) NULL,
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` CHAR(3) NOT NULL DEFAULT 'INR',
  `status` ENUM('created','authorized','captured','failed','refunded') NOT NULL DEFAULT 'created',
  `payload_json` JSON NULL,
  `paid_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payments_provider_payment` (`provider`,`provider_payment_id`),
  KEY `idx_payments_order` (`order_id`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_entitlements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `source_type` ENUM('purchase','course','admin','promotion','manual') NOT NULL,
  `source_id` VARCHAR(100) NULL,
  `starts_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NULL,
  `status` ENUM('active','expired','revoked') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_exam_source` (`user_id`,`exam_id`,`source_type`,`source_id`),
  KEY `idx_entitlements_user_status` (`user_id`,`status`,`expires_at`),
  KEY `idx_entitlements_exam` (`exam_id`),
  CONSTRAINT `fk_entitlements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_entitlements_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_attempts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_token` CHAR(64) NOT NULL,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `candidate_id` BIGINT UNSIGNED NOT NULL,
  `attempt_no` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `status` ENUM('created','ready','started','paused','security_locked','submitted','expired','blocked','terminated') NOT NULL DEFAULT 'created',
  `started_at` DATETIME NULL,
  `last_activity_at` DATETIME NULL,
  `expires_at` DATETIME NULL,
  `submitted_at` DATETIME NULL,
  `current_section_id` BIGINT UNSIGNED NULL,
  `current_question_id` BIGINT UNSIGNED NULL,
  `server_sequence` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `pause_count` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `total_paused_seconds` INT UNSIGNED NOT NULL DEFAULT 0,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(500) NULL,
  `device_fingerprint` VARCHAR(255) NULL,
  `verification_photo` VARCHAR(500) NULL,
  `settings_snapshot` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_attempt_token` (`attempt_token`),
  UNIQUE KEY `uq_exam_candidate_attempt_no` (`exam_id`,`candidate_id`,`attempt_no`),
  KEY `idx_attempts_exam_status` (`exam_id`,`status`),
  KEY `idx_attempts_candidate_status` (`candidate_id`,`status`),
  KEY `idx_attempts_expires` (`expires_at`),
  CONSTRAINT `fk_attempts_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_attempts_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_attempt_sections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `exam_section_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('locked','active','completed') NOT NULL DEFAULT 'locked',
  `started_at` DATETIME NULL,
  `expires_at` DATETIME NULL,
  `completed_at` DATETIME NULL,
  `remaining_seconds` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attempt_section` (`attempt_id`,`exam_section_id`),
  KEY `idx_attempt_sections_status` (`attempt_id`,`status`),
  CONSTRAINT `fk_attempt_sections_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_sections_exam_section` FOREIGN KEY (`exam_section_id`) REFERENCES `exam_sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_attempt_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `exam_section_id` BIGINT UNSIGNED NOT NULL,
  `question_id` BIGINT UNSIGNED NOT NULL,
  `position` INT UNSIGNED NOT NULL,
  `question_snapshot` LONGTEXT NULL,
  `options_snapshot` JSON NULL,
  `positive_marks` DECIMAL(8,3) NOT NULL DEFAULT 1.000,
  `negative_marks` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attempt_question` (`attempt_id`,`question_id`),
  UNIQUE KEY `uq_attempt_question_position` (`attempt_id`,`position`),
  KEY `idx_attempt_questions_section` (`attempt_id`,`exam_section_id`,`position`),
  KEY `idx_attempt_questions_question` (`question_id`),
  CONSTRAINT `fk_attempt_questions_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_questions_exam_section` FOREIGN KEY (`exam_section_id`) REFERENCES `exam_sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_questions_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_attempt_answers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `attempt_question_id` BIGINT UNSIGNED NOT NULL,
  `selected_option_id` BIGINT UNSIGNED NULL,
  `response_value` TEXT NULL,
  `answer_status` ENUM('unanswered','answered','cleared') NOT NULL DEFAULT 'unanswered',
  `marked_for_review` TINYINT(1) NOT NULL DEFAULT 0,
  `visited` TINYINT(1) NOT NULL DEFAULT 0,
  `answered_at` DATETIME NULL,
  `last_synced_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `client_sequence` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attempt_answer` (`attempt_id`,`attempt_question_id`),
  KEY `idx_attempt_answers_option` (`selected_option_id`),
  KEY `idx_attempt_answers_sync` (`attempt_id`,`last_synced_at`),
  CONSTRAINT `fk_attempt_answers_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_answers_question` FOREIGN KEY (`attempt_question_id`) REFERENCES `exam_attempt_questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_answers_option` FOREIGN KEY (`selected_option_id`) REFERENCES `question_options` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `event_type` VARCHAR(60) NOT NULL,
  `event_sequence` BIGINT UNSIGNED NOT NULL,
  `event_data` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_event_sequence` (`attempt_id`,`event_sequence`),
  KEY `idx_exam_events_type` (`attempt_id`,`event_type`,`created_at`),
  CONSTRAINT `fk_exam_events_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_results` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `candidate_id` BIGINT UNSIGNED NOT NULL,
  `total_questions` INT UNSIGNED NOT NULL DEFAULT 0,
  `answered` INT UNSIGNED NOT NULL DEFAULT 0,
  `unanswered` INT UNSIGNED NOT NULL DEFAULT 0,
  `marked_for_review` INT UNSIGNED NOT NULL DEFAULT 0,
  `correct` INT UNSIGNED NOT NULL DEFAULT 0,
  `incorrect` INT UNSIGNED NOT NULL DEFAULT 0,
  `marks_obtained` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `maximum_marks` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `percentage` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `rank` INT UNSIGNED NULL,
  `percentile` DECIMAL(8,3) NULL,
  `result_status` ENUM('processing','published','hidden') NOT NULL DEFAULT 'processing',
  `calculated_at` DATETIME NULL,
  `published_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_result_attempt` (`attempt_id`),
  KEY `idx_exam_results_exam_rank` (`exam_id`,`rank`),
  KEY `idx_exam_results_candidate` (`candidate_id`),
  CONSTRAINT `fk_exam_results_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_exam_results_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exam_results_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_result_sections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `result_id` BIGINT UNSIGNED NOT NULL,
  `section_id` BIGINT UNSIGNED NOT NULL,
  `total_questions` INT UNSIGNED NOT NULL DEFAULT 0,
  `answered` INT UNSIGNED NOT NULL DEFAULT 0,
  `unanswered` INT UNSIGNED NOT NULL DEFAULT 0,
  `correct` INT UNSIGNED NOT NULL DEFAULT 0,
  `incorrect` INT UNSIGNED NOT NULL DEFAULT 0,
  `marks_obtained` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `maximum_marks` DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  `percentage` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_result_section` (`result_id`,`section_id`),
  CONSTRAINT `fk_result_sections_result` FOREIGN KEY (`result_id`) REFERENCES `exam_results` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_result_sections_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `proctoring_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `camera_required` TINYINT(1) NOT NULL DEFAULT 1,
  `live_photo_required` TINYINT(1) NOT NULL DEFAULT 1,
  `fullscreen_required` TINYINT(1) NOT NULL DEFAULT 1,
  `tab_switch_detection` TINYINT(1) NOT NULL DEFAULT 1,
  `multiple_face_detection` TINYINT(1) NOT NULL DEFAULT 1,
  `max_violations` SMALLINT UNSIGNED NOT NULL DEFAULT 3,
  `lock_on_violation` TINYINT(1) NOT NULL DEFAULT 1,
  `admin_unlock_required` TINYINT(1) NOT NULL DEFAULT 1,
  `detection_grace_seconds` SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  `settings_json` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_proctoring_exam` (`exam_id`),
  CONSTRAINT `fk_proctoring_settings_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `proctoring_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `event_type` VARCHAR(60) NOT NULL,
  `severity` ENUM('info','warning','violation','critical') NOT NULL DEFAULT 'warning',
  `violation_number` SMALLINT UNSIGNED NULL,
  `event_data` JSON NULL,
  `detected_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` DATETIME NULL,
  `resolved_by` BIGINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  KEY `idx_proctoring_attempt_time` (`attempt_id`,`detected_at`),
  KEY `idx_proctoring_attempt_type` (`attempt_id`,`event_type`),
  CONSTRAINT `fk_proctoring_events_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_proctoring_events_resolved_by` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_access_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `exam_id` BIGINT UNSIGNED NULL,
  `attempt_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(60) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(500) NULL,
  `metadata_json` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_access_logs_user_time` (`user_id`,`created_at`),
  KEY `idx_access_logs_exam_time` (`exam_id`,`created_at`),
  KEY `idx_access_logs_attempt_time` (`attempt_id`,`created_at`),
  CONSTRAINT `fk_access_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_access_logs_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_access_logs_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `feedback` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `exam_id` BIGINT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NULL,
  `comments` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_feedback_exam` (`exam_id`),
  KEY `idx_feedback_user` (`user_id`),
  CONSTRAINT `fk_feedback_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_feedback_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `question_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_id` BIGINT UNSIGNED NOT NULL,
  `attempt_id` BIGINT UNSIGNED NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `reason` VARCHAR(100) NOT NULL,
  `comments` TEXT NULL,
  `status` ENUM('open','reviewing','resolved','rejected') NOT NULL DEFAULT 'open',
  `resolved_by` BIGINT UNSIGNED NULL,
  `resolved_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_question_reports_question_status` (`question_id`,`status`),
  CONSTRAINT `fk_question_reports_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_question_reports_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_question_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_question_reports_resolved_by` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `import_batches` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `batch_token` CHAR(32) NOT NULL,
  `created_by` BIGINT UNSIGNED NOT NULL,
  `source_type` ENUM('json','csv','xlsx','manual') NOT NULL,
  `file_name` VARCHAR(255) NULL,
  `total_rows` INT UNSIGNED NOT NULL DEFAULT 0,
  `success_rows` INT UNSIGNED NOT NULL DEFAULT 0,
  `failed_rows` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('processing','completed','completed_with_errors','failed') NOT NULL DEFAULT 'processing',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_import_batches_token` (`batch_token`),
  CONSTRAINT `fk_import_batches_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `import_batch_errors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `batch_id` BIGINT UNSIGNED NOT NULL,
  `row_number` INT UNSIGNED NULL,
  `error_code` VARCHAR(60) NULL,
  `error_message` TEXT NOT NULL,
  `row_data` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_import_errors_batch` (`batch_id`,`row_number`),
  CONSTRAINT `fk_import_errors_batch` FOREIGN KEY (`batch_id`) REFERENCES `import_batches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

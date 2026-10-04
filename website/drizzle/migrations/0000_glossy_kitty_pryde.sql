CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text DEFAULT 'system' NOT NULL,
	`is_auto` integer DEFAULT false NOT NULL,
	`target_id` text,
	`media_urls_json` text DEFAULT '[]',
	`created_at` text NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`description` text NOT NULL,
	`condition` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `batch_enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`batch_id` text NOT NULL,
	`course_id` text NOT NULL,
	`access_code_used` text NOT NULL,
	`enrolled_at` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `batches` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`batch_code` text NOT NULL,
	`title` text NOT NULL,
	`access_code` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`mentor_id` text,
	`max_students` integer DEFAULT 50,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `batches_access_code_unique` ON `batches` (`access_code`);--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`title` text NOT NULL,
	`event_type` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`meeting_url` text,
	`description` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`cover_image` text,
	`tagline` text,
	`level` text DEFAULT 'Beginner',
	`category` text DEFAULT 'AI & Productivity',
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'video' NOT NULL,
	`content` text,
	`video_url` text,
	`order_index` integer NOT NULL,
	`target` text,
	`has_materials` integer DEFAULT false,
	`slide_url` text,
	`study_note_url` text,
	`key_concepts_json` text DEFAULT '[]',
	`supporting_resources_json` text DEFAULT '[]',
	`assignment_description` text,
	`assignment_rubric_json` text DEFAULT '[]',
	`created_at` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `nautical_miles_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`batch_id` text,
	`amount` integer NOT NULL,
	`action_type` text NOT NULL,
	`reference_id` text,
	`description` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`user_id` text NOT NULL,
	`facebook_post_url` text,
	`submission_note` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`feedback_text` text,
	`graded_by` text,
	`submitted_at` text NOT NULL,
	`graded_at` text,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`graded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text NOT NULL,
	`avatar_url` text,
	`role` text DEFAULT 'student' NOT NULL,
	`admin_role` text,
	`phone_number` text,
	`facebook_url` text,
	`industry` text,
	`current_job` text,
	`product_idea` text,
	`is_profile_completed` integer DEFAULT false NOT NULL,
	`nautical_miles` integer DEFAULT 0 NOT NULL,
	`visits` integer DEFAULT 0 NOT NULL,
	`referral_source` text,
	`current_role` text,
	`work_field` text,
	`living_region` text,
	`gender` text,
	`age_group` text,
	`onboarding_tasks_json` text DEFAULT '{}',
	`liveclass_tasks_json` text DEFAULT '{}',
	`badges_json` text DEFAULT '[]',
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE TABLE `onboarding_days` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`batch_id` text,
	`day` integer NOT NULL,
	`title` text NOT NULL,
	`intro` text,
	`objective` text,
	`checklist` text NOT NULL,
	`takeaway` text,
	`email_subject` text,
	`email_body` text,
	`companion_hint` text,
	`bonus_resources` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `recurring_bills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`category_id` text NOT NULL,
	`account_id` text DEFAULT 'cash' NOT NULL,
	`cadence` text NOT NULL,
	`start_date` text NOT NULL,
	`last_paid_date` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

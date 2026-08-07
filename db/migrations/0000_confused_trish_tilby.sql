CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`category_id` text NOT NULL,
	`account_id` text DEFAULT 'cash' NOT NULL,
	`date` text NOT NULL,
	`note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);
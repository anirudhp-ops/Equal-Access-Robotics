CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`starts_at` integer NOT NULL,
	`tutor_name` text NOT NULL,
	`program` text NOT NULL,
	`capacity` integer DEFAULT 10 NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`program` text NOT NULL,
	`attendance_rate` integer DEFAULT 100 NOT NULL
);

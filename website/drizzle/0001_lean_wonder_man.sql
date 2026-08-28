CREATE TABLE `advertisements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`message` varchar(500) NOT NULL,
	`linkUrl` varchar(1000),
	`status` enum('draft','scheduled','published','paused','expired') NOT NULL DEFAULT 'draft',
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`priority` int NOT NULL DEFAULT 0,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submission_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`storageUrl` varchar(1000) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`byteSize` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `submission_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('employment','realEstateOffer','realEstateRequest','productOffer','productRequest','software') NOT NULL,
	`status` enum('pending','inReview','approved','rejected','archived','sold') NOT NULL DEFAULT 'pending',
	`title` varchar(220) NOT NULL,
	`description` text NOT NULL,
	`fullName` varchar(180) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`address` varchar(300),
	`organizationName` varchar(220),
	`profession` varchar(180),
	`requirements` text,
	`propertyType` varchar(80),
	`productType` varchar(100),
	`price` varchar(80),
	`publishedAt` timestamp,
	`reviewedAt` timestamp,
	`reviewedBy` int,
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `advertisements_window_idx` ON `advertisements` (`status`,`startsAt`,`endsAt`);--> statement-breakpoint
CREATE INDEX `advertisements_priority_idx` ON `advertisements` (`priority`);--> statement-breakpoint
CREATE INDEX `submission_attachments_submission_idx` ON `submission_attachments` (`submissionId`);--> statement-breakpoint
CREATE INDEX `submissions_status_idx` ON `submissions` (`status`);--> statement-breakpoint
CREATE INDEX `submissions_category_idx` ON `submissions` (`category`);--> statement-breakpoint
CREATE INDEX `submissions_created_at_idx` ON `submissions` (`createdAt`);
CREATE TABLE `site_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` enum('image','banner','icon') NOT NULL,
	`name` varchar(160) NOT NULL,
	`url` varchar(1000) NOT NULL,
	`altText` varchar(220) NOT NULL,
	`isPublished` int NOT NULL DEFAULT 0,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_sections_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_themes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`config` json NOT NULL,
	`isActive` int NOT NULL DEFAULT 0,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_themes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `site_assets_kind_idx` ON `site_assets` (`kind`);--> statement-breakpoint
CREATE INDEX `site_assets_published_idx` ON `site_assets` (`isPublished`);--> statement-breakpoint
CREATE INDEX `site_sections_sort_idx` ON `site_sections` (`sortOrder`);--> statement-breakpoint
CREATE INDEX `site_sections_published_idx` ON `site_sections` (`isPublished`);
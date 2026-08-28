CREATE TABLE `site_content_revisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('asset','theme','section') NOT NULL,
	`entityId` int NOT NULL,
	`action` enum('create','update','publish') NOT NULL,
	`snapshot` json NOT NULL,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `site_content_revisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `site_content_revisions_entity_idx` ON `site_content_revisions` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `site_content_revisions_created_idx` ON `site_content_revisions` (`createdAt`);
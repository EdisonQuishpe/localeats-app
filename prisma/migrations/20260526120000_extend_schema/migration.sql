-- Migration: extend_schema
-- MySQL DDL to create tables for extended Prisma schema

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `Category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_unique` (`name`),
  UNIQUE KEY `Category_slug_unique` (`slug`)
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191),
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `role` ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_unique` (`email`)
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `Profile` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `bio` TEXT NULL,
  `avatarUrl` VARCHAR(1024) NULL,
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Profile_userId_unique` (`userId`),
  CONSTRAINT `Profile_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `Address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(100) NULL,
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NULL,
  `postalCode` VARCHAR(50) NULL,
  `country` VARCHAR(100) NOT NULL,
  `isPrimary` TINYINT(1) NOT NULL DEFAULT 0,
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Address_user_idx` (`userId`),
  CONSTRAINT `Address_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `Product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NULL,
  `description` TEXT NOT NULL,
  `price` DOUBLE NOT NULL,
  `sku` VARCHAR(191) NULL,
  `quantity` INT NULL DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `categoryId` INT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_unique` (`slug`)
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

ALTER TABLE `Product`
  ADD CONSTRAINT `Product_category_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE `ProductImage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(1024) NOT NULL,
  `altText` VARCHAR(512) NULL,
  `productId` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ProductImage_product_idx` (`productId`),
  CONSTRAINT `ProductImage_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `Order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `status` ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `total` DOUBLE NOT NULL,
  `shippingToId` INT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  KEY `Order_user_idx` (`userId`),
  KEY `Order_shipping_idx` (`shippingToId`),
  CONSTRAINT `Order_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

ALTER TABLE `Order`
  ADD CONSTRAINT `Order_shipping_fk` FOREIGN KEY (`shippingToId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE `OrderItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderId` INT NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unitPrice` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_order_idx` (`orderId`),
  KEY `OrderItem_product_idx` (`productId`),
  CONSTRAINT `OrderItem_order_fk` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `Review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `productId` INT NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Review_user_idx` (`userId`),
  KEY `Review_product_idx` (`productId`),
  CONSTRAINT `Review_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `ChatMessage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `senderId` INT NULL,
  `content` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ChatMessage_sender_idx` (`senderId`),
  CONSTRAINT `ChatMessage_sender_fk` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ENGINE=InnoDB;

-- Optional: populate some initial categories (example)
INSERT INTO `Category` (`name`, `slug`) VALUES ('Comida', 'comida') ON DUPLICATE KEY UPDATE `name`=`name`;

SET FOREIGN_KEY_CHECKS = 1;

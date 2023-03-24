DROP DATABASE IF EXISTS `foodblog`;
CREATE DATABASE IF NOT EXISTS `foodblog` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `foodblog`;

-- Dumping structure for table foodblog.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.users: ~6 rows (approximately)
REPLACE INTO `users` (`id`, `fullName`, `userPassword`, `email`, `isAdmin`) VALUES
	(1, 'Admin', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'admin@gmail.com', 1),
	(2, 'test1', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'test1@gmail.com', 0),
	(3, 'test2', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'test2@gmail.com', 0),
	(4, 'test3', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'test3@gmail.com', 0),
	(5, 'test4', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'test4@gmail.com', 0),
	(6, 'test5', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'test5@gmail.com', 0);

-- Dumping structure for table foodblog.recipes
DROP TABLE IF EXISTS `recipes`;
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `instructions` longtext NOT NULL,
  `personorstk` varchar(255) NOT NULL,
  `totalAmount` int NOT NULL,
  `dateCreated` date NOT NULL,
  `img` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.recipes: ~4 rows (approximately)
REPLACE INTO `recipes` (`id`, `userId`, `title`, `instructions`, `personorstk`, `totalAmount`, `dateCreated`, `img`) VALUES
	(1, 3, 'Lemon cake', 'bake it on 200degrade ovn', 'person', 20, '2023-03-23', '/img/recapiesImg/madBilled2.png'),
	(2, 2, 'Le cake', 'bake it on 200degrade ovn', 'person', 20, '2023-03-23', '/img/recapiesImg/madBilled2.png'),
	(3, 2, 'L cake', 'bake it on 200degrade ovn', 'person', 20, '2023-03-25', '/img/recapiesImg/madBilled2.png'),
	(5, 3, 'Lem cake', 'bake it on 200degrade ovn', 'person', 20, '2023-03-23', '/img/recapiesImg/madBilled2.png');

-- Dumping structure for table foodblog.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.sessions: ~1 rows (approximately)
REPLACE INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('c6cnIP614fHromGaKyQp6RJNe2_9t67F', 1679656634, '{"cookie":{"originalMaxAge":7200000,"expires":"2023-03-24T10:16:17.797Z","secure":false,"httpOnly":true,"path":"/","sameSite":true},"userId":2,"isAdmin":0}');
	
-- Dumping structure for table foodblog.comments
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipeId` int NOT NULL,
  `userId` int NOT NULL,
  `userComment` longtext NOT NULL,
  `stars` int NOT NULL,
  `commentDate` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipeId` (`recipeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.comments: ~2 rows (approximately)
REPLACE INTO `comments` (`id`, `recipeId`, `userId`, `userComment`, `stars`) VALUES
	(1, 3, 4, 'gggggggggggggggggg', 3),
	(2, 3, 4, 'jk', 5);

-- Dumping structure for table foodblog.ingredients
DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipeId` int NOT NULL,
  `ingredient` varchar(255) NOT NULL,
  `measuringUnit` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipeId` (`recipeId`),
  CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=UTF8MB4_UNICODE_CI;
-- Dumping data for table foodblog.ingredients: ~2 rows (approximately)

REPLACE INTO `ingredients` (`id`, `recipeId`, `ingredient`, `measuringUnit`, `amount`) VALUES
	(1, 3, 'drvgrg', 'fes', 3),
	(2, 3, 'awda', 'fff', 222);
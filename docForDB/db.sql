-- --------------------------------------------------------
-- Vært:                         127.0.0.1
-- Server-version:               10.4.27-MariaDB - mariadb.org binary distribution
-- ServerOS:                     Win64
-- HeidiSQL Version:             12.4.0.6659
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for foodblog
DROP DATABASE IF EXISTS `foodblog`;
CREATE DATABASE IF NOT EXISTS `foodblog` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `foodblog`;

-- Dumping structure for tabel foodblog.comments
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `userComment` longtext NOT NULL,
  `stars` int(11) NOT NULL,
  `commentDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `recipeId` (`recipeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.comments: ~6 rows (tilnærmelsesvis)
REPLACE INTO `comments` (`id`, `recipeId`, `userId`, `userComment`, `stars`, `commentDate`) VALUES
	(1, 31, 11, 'Fantastisk opskrift', 3, '2023-03-25 14:31:02'),
	(2, 33, 11, 'Nemt at gå til og gøre', 5, '2023-03-25 14:31:26'),
	(3, 31, 12, 'Værste opskrift', 1, '2023-03-25 14:31:50'),
	(4, 32, 12, 'klart anbefalde', 2, '2023-03-25 14:32:03'),
	(5, 32, 10, 'mangler mere salt ellers god', 4, '2023-03-25 14:32:46'),
	(6, 31, 10, 'Perfekt lige det jeg manglede', 5, '2023-03-25 14:33:04');

-- Dumping structure for tabel foodblog.ingredients
DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipeId` int(11) NOT NULL,
  `ingredient` varchar(255) NOT NULL,
  `measuringUnit` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipeId` (`recipeId`),
  CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.ingredients: ~25 rows (tilnærmelsesvis)
REPLACE INTO `ingredients` (`id`, `recipeId`, `ingredient`, `measuringUnit`, `amount`) VALUES
	(133, 31, 'vand', 'deciliter', 3),
	(134, 31, 'smør', 'gram', 125),
	(135, 31, 'hvedemel', 'gram', 125),
	(136, 32, 'hvedemel', 'deciliter', 3),
	(137, 32, 'Vaniljesukker', 'spiseskefuld', 1),
	(138, 32, 'Stødt kardemomme', 'teskefuld', 2),
	(139, 32, 'Groft salt', 'teskefuld', 1),
	(140, 32, 'Citronskal (usprøjtet) - skal herfra', 'stk', 1),
	(141, 32, 'mælk', 'deciliter', 4),
	(142, 32, 'smør', 'gram', 50),
	(143, 32, 'æg', 'stk', 3),
	(144, 33, 'hakket svinekød', 'gram', 500),
	(145, 33, 'hvedemel', 'spiseskefuld', 2),
	(146, 33, 'havregryn, finvalset', 'spiseskefuld', 2),
	(147, 33, 'mælk', 'deciliter', 1),
	(148, 33, 'æggehvide', 'stk', 1),
	(149, 33, 'æg', 'stk', 1),
	(150, 33, 'løg, finthakket', 'stk', 1),
	(151, 33, 'fed hvidløg, finthakket', 'stk', 1),
	(152, 33, 'stødt spidskommen', 'teskefuld', 1),
	(153, 33, 'timian, tørret', 'teskefuld', 1),
	(154, 33, 'salt', 'teskefuld', 2),
	(155, 33, 'sort peber, friskkværnet', 'gram', 2),
	(156, 33, 'olivenolie, til stegning', 'spiseskefuld', 3),
	(157, 33, 'smør, til stegning', 'spiseskefuld', 1);

-- Dumping structure for tabel foodblog.recipes
DROP TABLE IF EXISTS `recipes`;
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `instructions` longtext NOT NULL,
  `personorstk` varchar(255) NOT NULL,
  `totalAmount` int(11) NOT NULL,
  `dateCreated` date NOT NULL,
  `img` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.recipes: ~3 rows (tilnærmelsesvis)
REPLACE INTO `recipes` (`id`, `userId`, `title`, `instructions`, `personorstk`, `totalAmount`, `dateCreated`, `img`) VALUES
	(31, 10, 'Vandbakkelse', 'Kom vand og smør i en kasserolle og kog det op. Når det koger, sigter du hurtigt melet ned i gryden. På den måde undgår du klumper i dejen.\r\nPisk det hurtigt sammen mens kasserollen stadig står på kogepladen, og tag så gryden af.\r\nJeg plejer at lave dejen til vandbakkelser ved hjælp af et piskeris, fordi på den måde er nemmest at få pisket dejen godt sammen. Men det kræver nogle kræfter i armen. Du kan også bruge en elpisker, det er nemmere.\r\nLad nu dejen køle af i 15 minutter.\r\nPisk så et æg i dejen et ad gangen, så du får en let og glat vandbakkelsesdej, der dog heller ikke må være for tynd. Men denne opskrift plejer ar passe helt præcist. Brug gerne piskeris eller elpisker.\r\nTil sidst kan du røre dejen sammen med en grydeske af træ, så dejen samles let.\r\nNu kan du så putte din dej til vandbakkelse over i en sprøjtepose, eller en frysepose, hvor du klipper hul i det ene hjørne.\r\nTænd ovnen ved 200 °C almindelig luft (over- og undervarme), og læg et stykke bagepapir på en bageplade. Sprøjt så dejen ud på bagepapiret i den form du ønsker. Du kan jo bage en kagemand, eller bare bage små, lækre vandbakkelser, som du så kan fylde med en lækker flødecreme.\r\nDu kan også smøre en bageplade, og bage vandbakkelserne direkte på bagepladen. Det fungerer også godt.\r\nHusk at holde god afstand, da vandbakkelser hæver rigtig meget under bagning. Du skal regne med, at de vokser ud til dobbelt størrelse på alle led. Mindst.\r\nBagetiden varierer selvfølgelig meget, afhængig af hvor stor en vandbakkelse du vil bage. Almindelige "boller" af vandbakkelsesdej tager cirka 30 minutter. Klik her for at tænde minutur med korrekt tid.\r\nGenerelt er din vandbakkelse færdig, når den er flot og gylden (se billedet). De må IKKE blive for mørke.', 'Stk', 16, '2023-03-25', '/img/recapiesImg/1679754128373SkÃ¦rmbillede (11).png'),
	(32, 11, 'Pandekager', '\r\nKom mel, vaniljesukker, kardemomme, salt og citronskal i en skål og tilsæt halvdelen af mælken.\r\nPisk dejen glat og fri for klumper - og tilsæt resten af mælken. Smelt smørret i en pande og kom det i blandingen.\r\nTilsæt æg og pisk dejen godt igennem. Bag pandekagerne til er de gyldne.\r\nDer bliver 8-12 stk. pandekager alt efter størrelse og tykkelse.', 'Stk', 10, '2023-03-25', '/img/recapiesImg/1679754370636SkÃ¦rmbillede (15).png'),
	(33, 11, 'Frikadeller', 'Rør alle ingredienserne med en håndmikser i 2-3 minutter.\r\n\r\nLad frikadellefarsen hvile i minimum en halv time i køleskabet.\r\n\r\nForm frikadellerne og steg dem på en pande med smør og olie ved middelvarme i cirka 5 minutter på hver side, til de er gennemstegte.', 'Person', 4, '2023-03-25', '/img/recapiesImg/1679754629628SkÃ¦rmbillede (16).png');

-- Dumping structure for tabel foodblog.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(10) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.sessions: ~1 rows (tilnærmelsesvis)
REPLACE INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('SL5Q7-j-fQ7MuiVrn3clloPFmZ2Q9NsO', 1679762012, '{"cookie":{"originalMaxAge":7200000,"expires":"2023-03-25T16:33:20.542Z","secure":false,"httpOnly":true,"path":"/","sameSite":true},"userId":1,"isAdmin":1}');

-- Dumping structure for tabel foodblog.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table foodblog.users: ~4 rows (tilnærmelsesvis)
REPLACE INTO `users` (`id`, `fullName`, `userPassword`, `email`, `isAdmin`) VALUES
	(1, 'Admin', '$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2', 'admin@gmail.com', 1),
	(10, 'Gert Pedersen', '$2b$10$minIcOcZpCM3LzWfjvAZEuZKwav6IVFRQw5K7Wx4KepynZV36SnRu', 'gertpedersen@gmail.com', 0),
	(11, 'Gitte madsen', '$2b$10$PVcNW4tILWWscWtq.AH49uirPPjG9hvbvg4HQh5bbSBDtkZbtAO52', 'gittemadsen@gmail.com', 0),
	(12, 'Karl Sørensen', '$2b$10$kl76soqAUaXMCpvXbwKnPOSoKAxXxCJY.NagDS/o76zj89usNdh/u', 'karlsørensen@gmail.com', 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

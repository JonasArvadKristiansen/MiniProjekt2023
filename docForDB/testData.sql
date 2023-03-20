INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES ("Admin", "$2a$10$On5YDVAUWuXlsRu0o9pIY.mrJOVMSkyPpIwKuQMOA2vylUMmXiClG", "admin@gmail.com", true);
INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES ("test1", "$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2", "test1@gmail.com", FALSE);
INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES ("test2", "$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2", "test2@gmail.com", FALSE);
INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES ("test3", "$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2", "test3@gmail.com", FALSE);
INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES ("test4", "$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2", "test4@gmail.com", FALSE);
INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES ("test5", "$2a$10$kF1VK457DLpi3mg.ERI5duVMDIHgrklayYg6I2/G6bmJN339sIsR2", "test5@gmail.com", FALSE);

INSERT INTO recipes(userId, title, instructions, personorstk, amount, dateCreated) VALUES (1, "Lemon cake", "bake it on 200degrade ovn", "person", 20, NOW());
INSERT INTO recipes(userId, title, instructions, personorstk, amount, dateCreated) VALUES (2, "Le cake", "bake it on 200degrade ovn", "person", 20,NOW());
INSERT INTO recipes(userId, title, instructions, personorstk, amount, dateCreated) VALUES (1, "L cake", "bake it on 200degrade ovn", "person", 20, NOW());
INSERT INTO recipes(userId, title, instructions, personorstk, amount, dateCreated) VALUES (1, "Leon cake", "bake it on 200degrade ovn", "person", 20, NOW());
INSERT INTO recipes(userId, title, instructions, personorstk, amount, dateCreated) VALUES (3, "Lem cake", "bake it on 200degrade ovn", "person", 20, NOW());
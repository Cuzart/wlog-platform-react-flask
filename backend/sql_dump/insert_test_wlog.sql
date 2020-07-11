INSERT INTO `users` (username, email, password, name, surname) VALUES 
('test_user', 'test@mail.com', '$pbkdf2-sha256$29000$h1CKEcK4t1aqVeod4zwnxA$TkqOSbiekO5SUEFmquG9zSrTUOHaVzAn29/7h02ktUM', 'Max', 'Muster');

INSERT INTO `trips` (`user_id`, `title`, `country`, `description`, `thumbnail`, `created_at`) VALUES
(1, 'Work&Travel', 'New Zealand', 'reisen und arbeiten im schönsten Land der Welt', '/images/000001_thumbnail_nichtVorhanden', '2020-07-10 00:42:00');

INSERT INTO `posts` (`trip_id`, `subtitle`, `location_label`, `location_longitude`, `location_latitude`, `text`, `created_at`) VALUES
(1, 'Auckland', 'Mount Eden', 174.772358, -36.868682, 'Des einzig schöne an Auckland. Lorem ipsum dolor sit amet.', '2020-07-10 00:42:00');
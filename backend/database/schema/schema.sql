CREATE TABLE IF NOT EXISTS `role` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(50)  NOT NULL UNIQUE,
  `created_at` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `role` (`name`) VALUES ('admin'), ('user');

CREATE TABLE IF NOT EXISTS `user` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `FirstName`  VARCHAR(50)  NOT NULL,
  `LastName`   VARCHAR(50)  NOT NULL,
  `username`   VARCHAR(50)  NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_role_link` (
  `user_id`     INT       NOT NULL,
  `role_id`     INT       NOT NULL,
  `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_url_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_url_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `session` (
  `id`         VARCHAR(128) NOT NULL,
  `user_id`    INT          NOT NULL,
  `expires_at` DATETIME     NOT NULL,
  `created_at` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `category` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100) NOT NULL,
  `colour`     VARCHAR(255) NOT NULL DEFAULT '#6366f1',
  `created_at` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `task` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `user_id`     INT          NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT         NULL,
  `done`        TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `task_category` (
  `task_id`     INT NOT NULL,
  `category_id` INT NOT NULL,
  `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`, `category_id`),
  CONSTRAINT `fk_tc_task`     FOREIGN KEY (`task_id`)     REFERENCES `task`     (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tc_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

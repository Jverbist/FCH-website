-- 01-create-users.sql

-- ensure the table exists
CREATE TABLE IF NOT EXISTS users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  email    VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255)       NOT NULL
);

-- seed your test accounts
INSERT INTO users (email, password) VALUES
  ('alice@example.com','alice123'),
  ('bob@example.com',  'secret42'),
  ('carol@foo.com',    'hunter2')
ON DUPLICATE KEY UPDATE email = email;

USE taskmanager;

INSERT INTO users (name, email, password, role)
VALUES
('Admin User', 'admin@example.com', '$2b$10$PlBKNJFkKdMeLn7hytkCF.q892FHQb/Ig3wxlqOiHWIxnaSu8gdta', 'admin'),
('Member User', 'member@example.com', '$2b$10$PlBKNJFkKdMeLn7hytkCF.q892FHQb/Ig3wxlqOiHWIxnaSu8gdta', 'member')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role);

INSERT INTO projects (id, name, description, owner_id)
VALUES
(1, 'Product Redesign', 'Refresh task manager dashboard experience', 1),
(2, 'API Stability Sprint', 'Harden backend reliability and docs', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

INSERT INTO project_members (project_id, user_id, role)
VALUES
(1, 1, 'admin'),
(1, 2, 'member'),
(2, 1, 'admin'),
(2, 2, 'member')
ON DUPLICATE KEY UPDATE role = VALUES(role);

INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date)
VALUES
('Create dashboard wireframes', 'First pass for redesigned dashboard', 'in_progress', 'high', 1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
('Audit old components', 'Inventory reusable components', 'todo', 'medium', 1, 2, DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
('Finalize color tokens', 'Define neutral and accent palette', 'in_review', 'medium', 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('Fix auth edge cases', 'Handle stale token and logout race conditions', 'todo', 'high', 2, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Write dashboard API tests', 'Manual verification plus regression checklist', 'done', 'low', 2, 1, DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Tune DB indexes', 'Optimize common task filtering queries', 'in_progress', 'medium', 2, 1, DATE_ADD(CURDATE(), INTERVAL 4 DAY));

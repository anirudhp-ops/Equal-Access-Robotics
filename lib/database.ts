import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "ear.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('student','tutor','admin')),
 country TEXT NOT NULL DEFAULT '', age INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS classes (
 id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, program TEXT NOT NULL,
 description TEXT NOT NULL, starts_at TEXT NOT NULL, duration INTEGER NOT NULL DEFAULT 60,
 capacity INTEGER NOT NULL DEFAULT 10, tutor_id INTEGER, meeting_url TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'scheduled', FOREIGN KEY(tutor_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS enrollments (
 id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER NOT NULL, student_id INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'enrolled', attendance TEXT NOT NULL DEFAULT 'pending',
 enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(class_id, student_id), FOREIGN KEY(class_id) REFERENCES classes(id), FOREIGN KEY(student_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS notifications (
 id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, title TEXT NOT NULL,
 message TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'info', is_read INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS lessons (
 id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER NOT NULL, title TEXT NOT NULL,
 resource_url TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
 FOREIGN KEY(class_id) REFERENCES classes(id)
);
`);

const userCount = (db.prepare("SELECT COUNT(*) count FROM users").get() as {count:number}).count;
if (!userCount) {
  const addUser = db.prepare("INSERT OR IGNORE INTO users (name,email,password_hash,role,country,age) VALUES (?,?,?,?,?,?)");
  const password = bcrypt.hashSync("demo1234", 10);
  addUser.run("Anirudh Admin", "admin@equalaccess.org", password, "admin", "United States", null);
  addUser.run("Maya Chen", "maya@equalaccess.org", password, "tutor", "Canada", null);
  addUser.run("Amara Kamau", "amara@example.com", password, "student", "Kenya", 12);
}

const classCount = (db.prepare("SELECT COUNT(*) count FROM classes").get() as {count:number}).count;
if (!classCount) {
  const tutor = db.prepare("SELECT id FROM users WHERE role='tutor' LIMIT 1").get() as {id:number};
  const add = db.prepare("INSERT INTO classes (title,program,description,starts_at,duration,capacity,tutor_id,meeting_url) VALUES (?,?,?,?,?,?,?,?)");
  add.run("Python Pioneers", "Python", "Build games and solve real-world challenges with Python.", "2026-07-14T16:00:00-07:00", 60, 10, tutor.id, "https://meet.google.com/example-python");
  add.run("Web Builders", "Web Development", "Create and publish an accessible personal website.", "2026-07-15T17:30:00-07:00", 75, 8, tutor.id, "https://meet.google.com/example-web");
  add.run("Robotics Lab", "Robotics", "Program sensors and motors through team challenges.", "2026-07-16T16:00:00-07:00", 90, 12, tutor.id, "https://meet.google.com/example-robotics");
  const student = db.prepare("SELECT id FROM users WHERE role='student' LIMIT 1").get() as {id:number};
  db.prepare("INSERT OR IGNORE INTO enrollments (class_id,student_id) VALUES (1,?)").run(student.id);
  db.prepare("INSERT INTO notifications (user_id,title,message,kind) VALUES (?,?,?,?)").run(student.id,"Welcome to EAR","Your student portal is ready. Explore upcoming classes and continue learning!","success");
}

export default db;

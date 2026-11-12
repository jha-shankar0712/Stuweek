import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const dataDir=path.resolve(here,'../data');
fs.mkdirSync(dataDir,{recursive:true});
const db=new Database(path.join(dataDir,'stuweek.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,title TEXT NOT NULL,subject TEXT,due_date TEXT,done INTEGER DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP,priority TEXT DEFAULT 'Medium',estimated_minutes INTEGER DEFAULT 45,planned_date TEXT,task_type TEXT DEFAULT 'Concept learning',FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,title TEXT NOT NULL,body TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS focus_sessions(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,duration INTEGER NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
`);
export default db;

// Safe additive migrations for existing Stuweek databases. Existing tasks and users are preserved.
const taskColumns = db.prepare('PRAGMA table_info(tasks)').all().map(column => column.name);
for (const [name, definition] of [['priority', "TEXT DEFAULT 'Medium'"], ['estimated_minutes', 'INTEGER DEFAULT 45'], ['planned_date', 'TEXT'], ['task_type', "TEXT DEFAULT 'Concept learning'"]]) {
 if (!taskColumns.includes(name)) db.exec(`ALTER TABLE tasks ADD COLUMN ${name} ${definition}`);
}

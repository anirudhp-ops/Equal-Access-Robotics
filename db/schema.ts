import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  startsAt: integer("starts_at", { mode: "timestamp" }).notNull(),
  tutorName: text("tutor_name").notNull(),
  program: text("program").notNull(),
  capacity: integer("capacity").notNull().default(10),
  status: text("status").notNull().default("scheduled"),
});

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  country: text("country").notNull(),
  program: text("program").notNull(),
  attendanceRate: integer("attendance_rate").notNull().default(100),
});

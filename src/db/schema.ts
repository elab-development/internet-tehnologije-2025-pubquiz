import { pgTable, serial, text, timestamp, integer, uuid, pgEnum, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabela SEZONA 
export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(), 
  endDate: timestamp("end_date").notNull(), 
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela DOGAĐAJI 
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.id).notNull(), // spoljni kljuc
  title: text("title").notNull(), 
  dateTime: timestamp("date_time").notNull(), 
  location: text("location").notNull(), 
  description: text("description"), 
});


//uloge
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "TEAM", "GUEST"]);


export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("GUEST"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(), 
  teamLeader: text("team_leader").notNull(),
  teamName: text("team_name").notNull().unique(), 
  members: text("members"), 
  createdAt: timestamp("created_at").defaultNow(),
});



export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  points: integer("points").notNull(),
}, (t) => ({
  // Ograničenje: Jedan tim može imati samo jedan rezultat po kvizu 
  unq: unique().on(t.eventId, t.teamId),
}));


export const usersRelations = relations(users, ({ one }) => ({
  teamProfile: one(teams, {
    fields: [users.id],
    references: [teams.userId],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  user: one(users, {
    fields: [teams.userId],
    references: [users.id],
  }),
  results: many(results), 
}));

export const seasonsRelations = relations(seasons, ({ many }) => ({
  events: many(events), 
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  season: one(seasons, {
    fields: [events.seasonId],
    references: [seasons.id],
  }),
  results: many(results),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  event: one(events, {
    fields: [results.eventId],
    references: [events.id],
  }),
  team: one(teams, {
    fields: [results.teamId],
    references: [teams.id],
  }),
}));
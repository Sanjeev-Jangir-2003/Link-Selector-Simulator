import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const simulationSettings = pgTable("simulation_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  weightThroughput: real("weight_throughput").notNull().default(0.4), // w1
  weightDelay: real("weight_delay").notNull().default(0.3),      // w2
  weightLoss: real("weight_loss").notNull().default(0.3),        // w3
  switchingMargin: real("switching_margin").notNull().default(5.0), // Delta
  decisionInterval: integer("decision_interval").notNull().default(1000), // Tdec in ms
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSimulationSettingsSchema = createInsertSchema(simulationSettings).omit({ 
  id: true, 
  createdAt: true 
});

export type SimulationSetting = typeof simulationSettings.$inferSelect;
export type InsertSimulationSetting = z.infer<typeof insertSimulationSettingsSchema>;

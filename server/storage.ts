import { simulationSettings, type SimulationSetting, type InsertSimulationSetting } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getSettings(): Promise<SimulationSetting[]>;
  getSetting(id: number): Promise<SimulationSetting | undefined>;
  createSetting(setting: InsertSimulationSetting): Promise<SimulationSetting>;
  updateSetting(id: number, setting: Partial<InsertSimulationSetting>): Promise<SimulationSetting>;
  deleteSetting(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSettings(): Promise<SimulationSetting[]> {
    return await db.select().from(simulationSettings);
  }

  async getSetting(id: number): Promise<SimulationSetting | undefined> {
    const [setting] = await db.select().from(simulationSettings).where(eq(simulationSettings.id, id));
    return setting;
  }

  async createSetting(insertSetting: InsertSimulationSetting): Promise<SimulationSetting> {
    const [setting] = await db.insert(simulationSettings).values(insertSetting).returning();
    return setting;
  }

  async updateSetting(id: number, updates: Partial<InsertSimulationSetting>): Promise<SimulationSetting> {
    const [updated] = await db
      .update(simulationSettings)
      .set(updates)
      .where(eq(simulationSettings.id, id))
      .returning();
    return updated;
  }

  async deleteSetting(id: number): Promise<void> {
    await db.delete(simulationSettings).where(eq(simulationSettings.id, id));
  }
}

export const storage = new DatabaseStorage();

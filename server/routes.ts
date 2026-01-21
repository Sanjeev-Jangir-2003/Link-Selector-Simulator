import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Settings Routes
  app.get(api.settings.list.path, async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.get(api.settings.get.path, async (req, res) => {
    const setting = await storage.getSetting(Number(req.params.id));
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(setting);
  });

  app.post(api.settings.create.path, async (req, res) => {
    try {
      const input = api.settings.create.input.parse(req.body);
      const setting = await storage.createSetting(input);
      res.status(201).json(setting);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.settings.update.path, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const setting = await storage.updateSetting(Number(req.params.id), input);
      res.json(setting);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      // If record not found, generic error for now or handle specifically
      res.status(500).json({ message: 'Internal server error' }); 
    }
  });

  app.delete(api.settings.delete.path, async (req, res) => {
    await storage.deleteSetting(Number(req.params.id));
    res.status(204).send();
  });

  // Seed default settings if empty
  const existingSettings = await storage.getSettings();
  if (existingSettings.length === 0) {
    await storage.createSetting({
      name: "Default Balanced",
      weightThroughput: 0.4,
      weightDelay: 0.3,
      weightLoss: 0.3,
      switchingMargin: 5.0,
      decisionInterval: 1000,
      isDefault: true
    });
    await storage.createSetting({
      name: "Throughput Priority",
      weightThroughput: 0.8,
      weightDelay: 0.1,
      weightLoss: 0.1,
      switchingMargin: 2.0,
      decisionInterval: 500,
      isDefault: false
    });
  }

  return httpServer;
}

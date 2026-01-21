import { z } from 'zod';
import { insertSimulationSettingsSchema, simulationSettings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  settings: {
    list: {
      method: 'GET' as const,
      path: '/api/settings',
      responses: {
        200: z.array(z.custom<typeof simulationSettings.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/settings/:id',
      responses: {
        200: z.custom<typeof simulationSettings.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/settings',
      input: insertSimulationSettingsSchema,
      responses: {
        201: z.custom<typeof simulationSettings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/settings/:id',
      input: insertSimulationSettingsSchema.partial(),
      responses: {
        200: z.custom<typeof simulationSettings.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/settings/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

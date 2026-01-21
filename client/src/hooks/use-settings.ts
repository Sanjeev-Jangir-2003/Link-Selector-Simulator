import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSimulationSetting } from "@shared/routes";

export function useSettings() {
  return useQuery({
    queryKey: [api.settings.list.path],
    queryFn: async () => {
      const res = await fetch(api.settings.list.path);
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.settings.list.responses[200].parse(await res.json());
    },
  });
}

export function useSetting(id: number) {
  return useQuery({
    queryKey: [api.settings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.settings.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch setting");
      return api.settings.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSimulationSetting) => {
      const res = await fetch(api.settings.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create setting");
      return api.settings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path] });
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertSimulationSetting>) => {
      const url = buildUrl(api.settings.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update setting");
      return api.settings.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path] });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.settings.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete setting");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path] });
    },
  });
}

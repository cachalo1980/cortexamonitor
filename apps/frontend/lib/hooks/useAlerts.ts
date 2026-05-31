'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Alert {
  id: string;
  type: 'SERVICE_DOWN' | 'TUNNEL_DOWN' | 'CPU_HIGH' | 'RAM_HIGH';
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  title: string;
  message: string;
  source: string;
  resolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
}

export function useAlerts(intervalMs = 30000) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unresolved, setUnresolved] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const [allRes, unresolvedRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/alerts?limit=20`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/alerts/unresolved`),
      ]);
      if (allRes.ok) setAlerts(await allRes.json());
      if (unresolvedRes.ok) setUnresolved(await unresolvedRes.json());
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveAlert = useCallback(async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alerts/${id}/resolve`, { method: 'PATCH' });
    fetchAlerts();
  }, [fetchAlerts]);

  const resolveAll = useCallback(async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alerts/resolve-all`, { method: 'PATCH' });
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    fetchAlerts();
    const id = setInterval(fetchAlerts, intervalMs);
    return () => clearInterval(id);
  }, [fetchAlerts, intervalMs]);

  return { alerts, unresolved, loading, lastUpdate, resolveAlert, resolveAll, refetch: fetchAlerts };
}

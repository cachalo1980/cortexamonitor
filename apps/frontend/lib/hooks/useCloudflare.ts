'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TunnelRoute {
  hostname: string;
  service: string;
  path: string;
}

export interface HealthCheck {
  hostname: string;
  status: 'up' | 'down' | 'degraded';
  httpCode: number | null;
  latencyMs: number | null;
  checkedAt: string;
}

export interface CloudflareStatus {
  tunnel: {
    id: string;
    name: string;
    status: string;
  } | null;
  connections: any[];
  routes: TunnelRoute[];
}

export function useCloudflare(intervalMs = 30000) {
  const [status, setStatus] = useState<CloudflareStatus | null>(null);
  const [health, setHealth] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [statusRes, healthRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cloudflare/status`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cloudflare/health`),
      ]);

      if (!statusRes.ok) throw new Error('Error al obtener estado de Cloudflare');

      const statusData = await statusRes.json();
      const healthData = healthRes.ok ? await healthRes.json() : [];

      setStatus(statusData);
      setHealth(healthData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, intervalMs);
    return () => clearInterval(id);
  }, [fetchAll, intervalMs]);

  return { status, health, loading, error, lastUpdate, refetch: fetchAll };
}

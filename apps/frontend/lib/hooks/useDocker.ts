'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ContainerStats {
  id: string;
  cpu_pct: number;
  mem_used: number;
  mem_limit: number;
  mem_pct: number;
  net_rx: number;
  net_tx: number;
}

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  created: number;
  ports: any[];
  stats: ContainerStats | null;
}

export function useDocker(intervalMs = 20000) {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/docker/containers`);
      if (!res.ok) throw new Error('Error al obtener contenedores Docker');
      const data = await res.json();
      setContainers(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContainers();
    const id = setInterval(fetchContainers, intervalMs);
    return () => clearInterval(id);
  }, [fetchContainers, intervalMs]);

  return { containers, loading, error, lastUpdate, refetch: fetchContainers };
}

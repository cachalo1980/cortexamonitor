'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Container {
  vmid: number;
  name: string;
  status: string;
  type: string;
  cpu: number;
  mem: number;
  maxmem: number;
  disk: number;
  maxdisk: number;
  uptime: number;
  cpus: number;
}

export interface Storage {
  storage: string;
  type: string;
  used: number;
  total: number;
  used_fraction: number;
  active: number;
}

export interface ProxmoxNode {
  name: string;
  status: string;
  cpu: number;
  maxcpu: number;
  mem: number;
  maxmem: number;
  disk: number;
  maxdisk: number;
  uptime: number;
  detail: any;
  vms: any[];
  containers: Container[];
  storage: Storage[];
}

export function useProxmox(intervalMs = 15000) {
  const [nodes, setNodes] = useState<ProxmoxNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchNodes = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proxmox/nodes`);
      if (!res.ok) throw new Error('Error al obtener datos de Proxmox');
      const data = await res.json();
      setNodes(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
    const id = setInterval(fetchNodes, intervalMs);
    return () => clearInterval(id);
  }, [fetchNodes, intervalMs]);

  return { nodes, loading, error, lastUpdate, refetch: fetchNodes };
}

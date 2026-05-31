import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);
  private client: AxiosInstance;

  constructor(private config: ConfigService) {
    const host = this.config.get('DOCKER_HOST');
    const port = this.config.get('DOCKER_PORT') || 2375;

    this.client = axios.create({
      baseURL: `http://${host}:${port}`,
      timeout: 10000,
    });
  }

  async getInfo() {
    const res = await this.client.get('/info');
    return res.data;
  }

  async getContainers() {
    const res = await this.client.get('/containers/json?all=true');
    return res.data.map((c: any) => ({
      id: c.Id.slice(0, 12),
      name: c.Names[0]?.replace('/', '') || 'unnamed',
      image: c.Image,
      status: c.Status,
      state: c.State,
      created: c.Created,
      ports: c.Ports,
      labels: c.Labels,
    }));
  }

  async getContainerStats(id: string) {
    const res = await this.client.get(`/containers/${id}/stats?stream=false`);
    const s = res.data;

    const cpuDelta = s.cpu_stats.cpu_usage.total_usage - s.precpu_stats.cpu_usage.total_usage;
    const systemDelta = s.cpu_stats.system_cpu_usage - s.precpu_stats.system_cpu_usage;
    const cpus = s.cpu_stats.online_cpus || s.cpu_stats.cpu_usage.percpu_usage?.length || 1;
    const cpuPct = systemDelta > 0 ? (cpuDelta / systemDelta) * cpus * 100 : 0;

    const memUsed = s.memory_stats.usage - (s.memory_stats.stats?.cache || 0);
    const memLimit = s.memory_stats.limit;
    const memPct = memLimit > 0 ? (memUsed / memLimit) * 100 : 0;

    return {
      id,
      cpu_pct: Math.round(cpuPct * 100) / 100,
      mem_used: memUsed,
      mem_limit: memLimit,
      mem_pct: Math.round(memPct * 100) / 100,
      net_rx: s.networks?.eth0?.rx_bytes || 0,
      net_tx: s.networks?.eth0?.tx_bytes || 0,
    };
  }

  async getAllContainersWithStats() {
    const containers = await this.getContainers();

    const running = containers.filter((c: any) => c.state === 'running');

    const stats = await Promise.allSettled(
      running.map((c: any) => this.getContainerStats(c.id)),
    );

    return containers.map((c: any) => {
      const statResult = stats.find((_, i) => running[i]?.id === c.id);
      const stat = statResult?.status === 'fulfilled' ? statResult.value : null;
      return { ...c, stats: stat };
    });
  }
}

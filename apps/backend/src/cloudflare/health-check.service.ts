import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface HealthCheckResult {
  hostname: string;
  status:   'up' | 'down' | 'degraded';
  httpCode: number | null;
  latencyMs: number | null;
  checkedAt: string;
}

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);

  async checkUrl(hostname: string): Promise<HealthCheckResult> {
    const url = `https://${hostname}`;
    const start = Date.now();

    try {
      const res = await axios.get(url, {
        timeout: 8000,
        maxRedirects: 3,
        validateStatus: () => true,
        headers: { 'User-Agent': 'CortexaMonitor/1.0' },
      });

      const latencyMs = Date.now() - start;
      const httpCode  = res.status;
      const status    = httpCode < 400 ? 'up' : httpCode < 500 ? 'degraded' : 'down';

      return { hostname, status, httpCode, latencyMs, checkedAt: new Date().toISOString() };
    } catch {
      return {
        hostname,
        status:    'down',
        httpCode:  null,
        latencyMs: null,
        checkedAt: new Date().toISOString(),
      };
    }
  }

  async checkAll(hostnames: string[]): Promise<HealthCheckResult[]> {
    const results = await Promise.allSettled(
      hostnames.map(h => this.checkUrl(h)),
    );
    return results
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => r.value);
  }
}

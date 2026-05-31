import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
  private client: AxiosInstance;
  private accountId: string;
  private tunnelId: string;
  private zoneId: string;

  constructor(private config: ConfigService) {
    this.accountId = this.config.get('CF_ACCOUNT_ID')!;
    this.tunnelId  = this.config.get('CF_TUNNEL_ID')!;
    this.zoneId    = this.config.get('CF_ZONE_ID')!;

    this.client = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4',
      headers: {
        Authorization: `Bearer ${this.config.get('CF_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async getTunnelStatus() {
    const res = await this.client.get(
      `/accounts/${this.accountId}/cfd_tunnel/${this.tunnelId}`,
    );
    const t = res.data.result;
    return {
      id:        t.id,
      name:      t.name,
      status:    t.status,
      createdAt: t.created_at,
      deletedAt: t.deleted_at,
    };
  }

  async getTunnelConnections() {
    const res = await this.client.get(
      `/accounts/${this.accountId}/cfd_tunnel/${this.tunnelId}/connections`,
    );
    return res.data.result || [];
  }

  async getTunnelRoutes() {
    const res = await this.client.get(
      `/accounts/${this.accountId}/cfd_tunnel/${this.tunnelId}/configurations`,
    );
    const ingress = res.data.result?.config?.ingress || [];
    return ingress
      .filter((r: any) => r.hostname)
      .map((r: any) => ({
        hostname: r.hostname,
        service:  r.service,
        path:     r.path || '/',
      }));
  }

  async getDNSRecords() {
    const res = await this.client.get(
      `/zones/${this.zoneId}/dns_records?per_page=100`,
    );
    return (res.data.result || []).map((r: any) => ({
      id:      r.id,
      name:    r.name,
      type:    r.type,
      content: r.content,
      proxied: r.proxied,
    }));
  }

  async getFullStatus() {
    const [tunnel, connections, routes] = await Promise.allSettled([
      this.getTunnelStatus(),
      this.getTunnelConnections(),
      this.getTunnelRoutes(),
    ]);

    return {
      tunnel:      tunnel.status === 'fulfilled' ? tunnel.value : null,
      connections: connections.status === 'fulfilled' ? connections.value : [],
      routes:      routes.status === 'fulfilled' ? routes.value : [],
    };
  }
}

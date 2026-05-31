import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ProxmoxService } from '../proxmox/proxmox.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { HealthCheckService } from '../cloudflare/health-check.service';
import { AlertType, Severity } from '@prisma/client';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private prisma: PrismaService,
    private proxmoxService: ProxmoxService,
    private cloudflareService: CloudflareService,
    private healthCheckService: HealthCheckService,
  ) {}

  async getAlerts(limit = 50) {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUnresolvedAlerts() {
    return this.prisma.alert.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveAlert(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { resolved: true, resolvedAt: new Date() },
    });
  }

  async resolveAll() {
    return this.prisma.alert.updateMany({
      where: { resolved: false },
      data: { resolved: true, resolvedAt: new Date() },
    });
  }

  private async createAlertIfNotExists(
    type: AlertType,
    source: string,
    title: string,
    message: string,
    severity: Severity,
  ) {
    const existing = await this.prisma.alert.findFirst({
      where: { type, source, resolved: false },
    });
    if (existing) return;

    await this.prisma.alert.create({
      data: { type, severity, title, message, source },
    });
    this.logger.warn(`Nueva alerta: [${severity}] ${title}`);
  }

  private async autoResolve(type: AlertType, source: string) {
    await this.prisma.alert.updateMany({
      where: { type, source, resolved: false },
      data: { resolved: true, resolvedAt: new Date() },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAll() {
    this.logger.log('Ejecutando chequeo de alertas...');
    await Promise.allSettled([
      this.checkProxmox(),
      this.checkCloudflare(),
    ]);
  }

  private async checkProxmox() {
    try {
      const nodes = await this.proxmoxService.getAllNodesData();
      for (const node of nodes) {
        const cpuPct = Math.round(node.cpu * 100);
        const ramPct = Math.round((node.mem / node.maxmem) * 100);

        if (cpuPct > 85) {
          await this.createAlertIfNotExists(
            AlertType.CPU_HIGH, `proxmox:${node.name}`,
            `CPU alta en ${node.name}`,
            `CPU al ${cpuPct}% (umbral: 85%)`,
            Severity.WARN,
          );
        } else {
          await this.autoResolve(AlertType.CPU_HIGH, `proxmox:${node.name}`);
        }

        if (ramPct > 85) {
          await this.createAlertIfNotExists(
            AlertType.RAM_HIGH, `proxmox:${node.name}`,
            `RAM alta en ${node.name}`,
            `RAM al ${ramPct}% (umbral: 85%)`,
            Severity.WARN,
          );
        } else {
          await this.autoResolve(AlertType.RAM_HIGH, `proxmox:${node.name}`);
        }
      }
    } catch (err) {
      this.logger.error('Error chequeando Proxmox:', err.message);
    }
  }

  private async checkCloudflare() {
    try {
      const tunnel = await this.cloudflareService.getTunnelStatus();
      if (tunnel.status !== 'healthy') {
        await this.createAlertIfNotExists(
          AlertType.TUNNEL_DOWN, `cloudflare:${tunnel.id}`,
          `Tunnel caído: ${tunnel.name}`,
          `Estado del tunnel: ${tunnel.status}`,
          Severity.CRITICAL,
        );
      } else {
        await this.autoResolve(AlertType.TUNNEL_DOWN, `cloudflare:${tunnel.id}`);
      }

      const routes = await this.cloudflareService.getTunnelRoutes();
      const hostnames = routes.map((r: any) => r.hostname).filter(Boolean);
      const checks = await this.healthCheckService.checkAll(hostnames);

      for (const check of checks) {
        if (check.status === 'down') {
          await this.createAlertIfNotExists(
            AlertType.SERVICE_DOWN, `service:${check.hostname}`,
            `Servicio caído: ${check.hostname}`,
            `HTTP ${check.httpCode || 'timeout'} — servicio no responde`,
            Severity.CRITICAL,
          );
        } else {
          await this.autoResolve(AlertType.SERVICE_DOWN, `service:${check.hostname}`);
        }
      }
    } catch (err) {
      this.logger.error('Error chequeando Cloudflare:', err.message);
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { HealthCheckService } from './health-check.service';

@Controller('cloudflare')
export class CloudflareController {
  constructor(
    private cloudflareService: CloudflareService,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get('status')
  getStatus() {
    return this.cloudflareService.getFullStatus();
  }

  @Get('tunnel')
  getTunnel() {
    return this.cloudflareService.getTunnelStatus();
  }

  @Get('routes')
  getRoutes() {
    return this.cloudflareService.getTunnelRoutes();
  }

  @Get('dns')
  getDNS() {
    return this.cloudflareService.getDNSRecords();
  }

  @Get('health')
  async getHealth() {
    const routes = await this.cloudflareService.getTunnelRoutes();
    const hostnames = routes.map((r: any) => r.hostname).filter(Boolean);
    const checks = await this.healthCheckService.checkAll(hostnames);
    return checks;
  }
}

import { Module } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { CloudflareController } from './cloudflare.controller';
import { HealthCheckService } from './health-check.service';

@Module({
  providers: [CloudflareService, HealthCheckService],
  controllers: [CloudflareController],
  exports: [CloudflareService, HealthCheckService],
})
export class CloudflareModule {}

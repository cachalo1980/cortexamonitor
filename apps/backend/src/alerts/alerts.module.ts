import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { ProxmoxModule } from '../proxmox/proxmox.module';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProxmoxModule,
    CloudflareModule,
  ],
  providers: [AlertsService],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class AlertsModule {}

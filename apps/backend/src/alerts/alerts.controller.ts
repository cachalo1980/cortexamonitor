import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  getAlerts(@Query('limit') limit?: string) {
    return this.alertsService.getAlerts(limit ? parseInt(limit) : 50);
  }

  @Get('unresolved')
  getUnresolved() {
    return this.alertsService.getUnresolvedAlerts();
  }

  @Patch(':id/resolve')
  resolveAlert(@Param('id') id: string) {
    return this.alertsService.resolveAlert(id);
  }

  @Patch('resolve-all')
  resolveAll() {
    return this.alertsService.resolveAll();
  }
}

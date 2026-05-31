import { Controller, Get, Param } from '@nestjs/common';
import { DockerService } from './docker.service';

@Controller('docker')
export class DockerController {
  constructor(private dockerService: DockerService) {}

  @Get('info')
  getInfo() {
    return this.dockerService.getInfo();
  }

  @Get('containers')
  getContainers() {
    return this.dockerService.getAllContainersWithStats();
  }

  @Get('containers/:id/stats')
  getStats(@Param('id') id: string) {
    return this.dockerService.getContainerStats(id);
  }
}

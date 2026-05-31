import { Controller, Get, Param } from '@nestjs/common';
import { ProxmoxService } from './proxmox.service';

@Controller('proxmox')
export class ProxmoxController {
  constructor(private proxmoxService: ProxmoxService) {}

  @Get('nodes')
  getNodes() {
    return this.proxmoxService.getAllNodesData();
  }

  @Get('nodes/:node/vms')
  getVMs(@Param('node') node: string) {
    return this.proxmoxService.getNodeVMs(node);
  }

  @Get('nodes/:node/containers')
  getContainers(@Param('node') node: string) {
    return this.proxmoxService.getNodeContainers(node);
  }

  @Get('nodes/:node/storage')
  getStorage(@Param('node') node: string) {
    return this.proxmoxService.getNodeStorage(node);
  }

  @Get('cluster')
  getCluster() {
    return this.proxmoxService.getClusterStatus();
  }
}

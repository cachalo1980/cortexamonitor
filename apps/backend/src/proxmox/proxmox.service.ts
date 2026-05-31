import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';

@Injectable()
export class ProxmoxService {
  private readonly logger = new Logger(ProxmoxService.name);
  private client: AxiosInstance;

  constructor(private config: ConfigService) {
    const host = this.config.get('PROXMOX_HOST');
    const tokenId = this.config.get('PROXMOX_TOKEN_ID');
    const tokenSecret = this.config.get('PROXMOX_TOKEN_SECRET');
    const verifySSL = this.config.get('PROXMOX_VERIFY_SSL') !== 'false';

    this.client = axios.create({
      baseURL: `${host}/api2/json`,
      headers: {
        Authorization: `PVEAPIToken=${tokenId}=${tokenSecret}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: verifySSL }),
      timeout: 10000,
    });
  }

  async getNodes() {
    const res = await this.client.get('/nodes');
    return res.data.data;
  }

  async getNodeStatus(node: string) {
    const res = await this.client.get(`/nodes/${node}/status`);
    return res.data.data;
  }

  async getNodeVMs(node: string) {
    const res = await this.client.get(`/nodes/${node}/qemu`);
    return res.data.data;
  }

  async getNodeContainers(node: string) {
    const res = await this.client.get(`/nodes/${node}/lxc`);
    return res.data.data;
  }

  async getNodeStorage(node: string) {
    const res = await this.client.get(`/nodes/${node}/storage`);
    return res.data.data;
  }

  async getClusterStatus() {
    const res = await this.client.get('/cluster/status');
    return res.data.data;
  }

  async getAllNodesData() {
    const nodes = await this.getNodes();

    const nodesData = await Promise.allSettled(
      nodes.map(async (node: any) => {
        const [status, vms, containers, storage] = await Promise.allSettled([
          this.getNodeStatus(node.node),
          this.getNodeVMs(node.node),
          this.getNodeContainers(node.node),
          this.getNodeStorage(node.node),
        ]);

        return {
          name: node.node,
          status: node.status,
          uptime: node.uptime,
          cpu: node.cpu,
          maxcpu: node.maxcpu,
          mem: node.mem,
          maxmem: node.maxmem,
          disk: node.disk,
          maxdisk: node.maxdisk,
          detail: status.status === 'fulfilled' ? status.value : null,
          vms: vms.status === 'fulfilled' ? vms.value : [],
          containers: containers.status === 'fulfilled' ? containers.value : [],
          storage: storage.status === 'fulfilled' ? storage.value : [],
        };
      }),
    );

    return nodesData
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => r.value);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProxmoxModule } from './proxmox/proxmox.module';
import { DockerModule } from './docker/docker.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProxmoxModule,
    DockerModule,
    CloudflareModule,
  ],
})
export class AppModule {}

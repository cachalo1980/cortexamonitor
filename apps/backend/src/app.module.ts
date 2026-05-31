import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProxmoxModule } from './proxmox/proxmox.module';
import { DockerModule } from './docker/docker.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProxmoxModule,
    DockerModule,
    CloudflareModule,
    AlertsModule,
  ],
})
export class AppModule {}

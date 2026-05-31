import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@cortexacloud.com' },
    update: {},
    create: {
      email: 'admin@cortexacloud.com',
      password,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario admin creado:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

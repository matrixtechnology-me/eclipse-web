import { EMembershipRole, PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "users",
      "tenants",
      "tenant_memberships"
    RESTART IDENTITY CASCADE;
  `);

  const user = await prisma.user.create({
    data: {
      name: "Wallace Melo",
      email: "wallacegmelo.dev@gmail.com",
      password: "$2b$12$trB5BToBNm9UZ3Grp//68.0xCguOegVICIjrNxMj3O4F.77pl/Rfi",
      role: "common",
      active: true,
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      name: "Matrix Store",
      description: "Loja para testes internos durante o desenvolvimento",
      memberships: {
        create: {
          membership: {
            create: {
              role: EMembershipRole.Owner,
              userId: user.id,
            },
          },
        },
      },
    },
  });

  await prisma.userTenantSettings.create({
    data: {
      doNotDisturb: false,
      tenantId: tenant.id,
      userId: user.id,
    },
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .then(async () => {
    const prisma = new PrismaClient();
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    const prisma = new PrismaClient();
    await prisma.$disconnect();
    process.exit(1);
  });

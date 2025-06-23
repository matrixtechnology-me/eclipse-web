import { EMembershipRole, PrismaClient } from "@prisma/client";
import { seedProductModule } from "./seed/products";
import { seedStockModule } from "./seed/stocks";
import { seedCustomerModule } from "./seed/customers";
import { seedSaleModule } from "./seed/sales";
import { seedPosModule } from "./seed/pos";
import { seedPosSaleModule } from "./seed/pos-sale";

async function main() {
  const prisma = new PrismaClient();

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "addresses",
      "customers",
      "documents",
      "memberships",
      "notifications",
      "notification_targets",
      "pos",
      "pos_events",
      "pos_event_entries",
      "pos_event_outputs",
      "pos_event_sales",
      "pos_event_sale_movements",
      "pos_event_sale_movement_payments",
      "pos_event_sale_movement_changes",
      "pos_event_sale_products",
      "products",
      "product_categories",
      "product_specifications",
      "sales",
      "sale_movement_payments",
      "sale_movement_changes",
      "sale_products",
      "stocks",
      "stock_events",
      "stock_event_entries",
      "stock_event_outputs",
      "stock_lots",
      "tenants",
      "tenant_memberships",
      "users",
      "user_tenant_settings"
    RESTART IDENTITY CASCADE;
  `);

  const user = await prisma.user.create({
    data: {
      name: "Wallace Melo",
      email: "wallacegmelo.dev@gmail.com",
      password: "$2b$12$trB5BToBNm9UZ3Grp//68.0xCguOegVICIjrNxMj3O4F.77pl/Rfi",
      role: "common",
      active: true,
      firstAccess: false,
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      id: "1a6b1e60-aaae-4ba2-9b0f-f67529049900",
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

  // Seed order matters for database constraints.
  await seedProductModule(tenant.id, prisma);
  await seedStockModule(tenant.id, prisma);
  await seedCustomerModule(tenant.id, prisma);
  await seedSaleModule(tenant.id, prisma);
  await seedPosModule(tenant.id, prisma);
  await seedPosSaleModule(tenant.id, prisma);

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

import { EMembershipRole, PrismaClient } from "@prisma/client";

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

  await prisma.productCategory.create({
    data: {
      id: "85376591-0e1e-4770-b640-25ee7aedccbf",
      name: "Vestuário",
      tenantId: tenant.id,
      description: "Peças de roupa como camisetas, calças, vestidos, casacos, entre outros itens para uso cotidiano ou ocasiões especiais.",
      subcategories: {
        createMany: {
          data: [
            {
              name: "Infantil",
              description: "Roupas confortáveis e resistentes para crianças, com modelos que acompanham o crescimento e o dia a dia dos pequenos.",
              tenantId: tenant.id,
            },
            {
              name: "Calçados",
              description: "Tênis, sandálias, botas e outros tipos de calçados para todas as idades e estilos, ideais para complementar qualquer look.",
              tenantId: tenant.id,
            },
          ]
        }
      }
    }
  });

  await prisma.productCategory.create({
    data: {
      id: "61b93de2-afaf-4cfb-9abb-f0bcb60c43be",
      name: "Brinquedos",
      tenantId: tenant.id,
      description: "Jogos, bonecos, blocos de montar, pelúcias e outros produtos voltados para lazer e entretenimento infantil.",
      subcategories: {
        createMany: {
          data: [
            {
              name: "Educativos",
              description: "Brinquedos que estimulam o raciocínio, coordenação motora e criatividade, como jogos de lógica, quebra-cabeças e blocos de montar.",
              tenantId: tenant.id,
            },
            {
              name: "Ao ar livre",
              description: "Itens para brincadeiras em ambientes externos, como bolas, bicicletas, patinetes, escorregadores e kits de praia.",
              tenantId: tenant.id,
            },
          ]
        }
      }
    }
  })

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

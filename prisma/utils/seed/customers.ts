import { PrismaClient } from "@prisma/client";

export const seedCustomerModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  await prisma.customer.createMany({
    data: [
      {
        id: "c025f2fd-9c95-4b90-b5bc-140bf60b5ef7",
        name: "Robert C. Martin",
        phoneNumber: "32423423423",
        active: true,
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2018e419-5834-42d9-8541-f0549bbc341b",
        name: "Martin Fowler",
        phoneNumber: "87383713212",
        active: true,
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  });
}
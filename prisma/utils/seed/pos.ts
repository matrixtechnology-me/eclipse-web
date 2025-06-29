import { EPosStatus, PrismaClient } from "@prisma/client";

export const seedPosModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  await prisma.pos.createMany({
    data: [{
      id: "e7a63a06-cb88-4ab5-882c-77d91476b690",
      name: "PDV#001",
      description: "Ponto de venda padrão do estabelecimento.",
      status: EPosStatus.Opened,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  });
}
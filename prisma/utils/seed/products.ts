import { PrismaClient } from "@prisma/client";

export const seedProductModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  await prisma.productCategory.create({
    data: {
      id: "85376591-0e1e-4770-b640-25ee7aedccbf",
      name: "Vestuário",
      tenantId,
      description: "Peças de roupa como camisetas, calças, vestidos, casacos, entre outros itens para uso cotidiano ou ocasiões especiais.",
      subcategories: {
        createMany: {
          data: [
            {
              id: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
              name: "Infantil",
              description: "Roupas confortáveis e resistentes para crianças, com modelos que acompanham o crescimento e o dia a dia dos pequenos.",
              tenantId,
            },
            {
              name: "Calçados",
              description: "Tênis, sandálias, botas e outros tipos de calçados para todas as idades e estilos, ideais para complementar qualquer look.",
              tenantId,
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
      tenantId,
      description: "Jogos, bonecos, blocos de montar, pelúcias e outros produtos voltados para lazer e entretenimento infantil.",
      subcategories: {
        createMany: {
          data: [
            {
              name: "Educativos",
              description: "Brinquedos que estimulam o raciocínio, coordenação motora e criatividade, como jogos de lógica, quebra-cabeças e blocos de montar.",
              tenantId,
            },
            {
              name: "Ao ar livre",
              description: "Itens para brincadeiras em ambientes externos, como bolas, bicicletas, patinetes, escorregadores e kits de praia.",
              tenantId,
            },
          ]
        }
      }
    }
  });

  await prisma.product.create({
    data: {
      id: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
      name: "Tênis Infantil ColorFlex",
      description: "Tênis leve, com solado emborrachado e design colorido, desenvolvido especialmente para crianças em fase escolar. Oferece conforto e segurança nas atividades diárias.",
      active: true,
      skuCode: "4191f90e4c80",
      salePrice: 139.9,
      tenantId,
      barCode: "0749775870729",
      internalCode: "f8c933",
      categoryId: "85376591-0e1e-4770-b640-25ee7aedccbf",
      subcategoryId: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
    }
  });
}
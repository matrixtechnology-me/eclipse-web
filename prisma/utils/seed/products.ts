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
              id: "9e52d5ad-3f84-4c71-8e5a-4ef9a3ec8c4d",
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
              id: "b713f894-1347-47af-97a8-25bfcf07a00e",
              name: "Educativos",
              description: "Brinquedos que estimulam o raciocínio, coordenação motora e criatividade, como jogos de lógica, quebra-cabeças e blocos de montar.",
              tenantId,
            },
            {
              id: "c2f8e1b6-0dc1-41b9-9952-098b5e23df47",
              name: "Ao ar livre",
              description: "Itens para brincadeiras em ambientes externos, como bolas, bicicletas, patinetes, escorregadores e kits de praia.",
              tenantId,
            },
          ]
        }
      }
    }
  });

  await prisma.product.createMany({
    data: [
      {
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
      },
      {
        id: "d5c7a1f2-3bfa-46e0-8b22-12f34c56d789",
        name: "Quebra-Cabeça Alfabeto Divertido",
        description: "Quebra-cabeça educativo com peças em madeira que ajudam as crianças a aprender o alfabeto brincando. Estimula a coordenação motora e o raciocínio lógico.",
        active: true,
        skuCode: "7a9e2b1c3d4f",
        salePrice: 59.9,
        tenantId,
        barCode: "0987654321123",
        internalCode: "abc123",
        categoryId: "61b93de2-afaf-4cfb-9abb-f0bcb60c43be",
        subcategoryId: "b713f894-1347-47af-97a8-25bfcf07a00e",
      },
    ],
  });
}
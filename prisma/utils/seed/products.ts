import { PrismaClient } from "@prisma/client";

export const seedProductModule = async (
  tenantId: string,
  prisma: PrismaClient
) => {
  const vestuarioSubcategories =
    await prisma.productSubcategory.createManyAndReturn({
      data: [
        {
          id: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
          name: "Infantil",
          description:
            "Roupas confortáveis e resistentes para crianças, com modelos que acompanham o crescimento e o dia a dia dos pequenos.",
          tenantId,
        },
        {
          id: "9e52d5ad-3f84-4c71-8e5a-4ef9a3ec8c4d",
          name: "Calçados",
          description:
            "Tênis, sandálias, botas e outros tipos de calçados para todas as idades e estilos, ideais para complementar qualquer look.",
          tenantId,
        },
      ],
    });

  await prisma.productCategory.create({
    data: {
      id: "85376591-0e1e-4770-b640-25ee7aedccbf",
      name: "Vestuário",
      tenantId,
      description:
        "Peças de roupa como camisetas, calças, vestidos, casacos, entre outros itens para uso cotidiano ou ocasiões especiais.",
      productCategorySubcategories: {
        createMany: {
          data: vestuarioSubcategories.map((sc) => ({
            subcategoryId: sc.id,
          })),
        },
      },
    },
  });

  const brinquedosSubcategories =
    await prisma.productSubcategory.createManyAndReturn({
      data: [
        {
          id: "b713f894-1347-47af-97a8-25bfcf07a00e",
          name: "Educativos",
          description:
            "Brinquedos que estimulam o raciocínio, coordenação motora e criatividade, como jogos de lógica, quebra-cabeças e blocos de montar.",
          tenantId,
        },
        {
          id: "c2f8e1b6-0dc1-41b9-9952-098b5e23df47",
          name: "Ao ar livre",
          description:
            "Itens para brincadeiras em ambientes externos, como bolas, bicicletas, patinetes, escorregadores e kits de praia.",
          tenantId,
        },
      ],
    });

  await prisma.productCategory.create({
    data: {
      id: "61b93de2-afaf-4cfb-9abb-f0bcb60c43be",
      name: "Brinquedos",
      tenantId,
      description:
        "Jogos, bonecos, blocos de montar, pelúcias e outros produtos voltados para lazer e entretenimento infantil.",
      productCategorySubcategories: {
        createMany: {
          data: brinquedosSubcategories.map((sc) => ({
            subcategoryId: sc.id,
          })),
        },
      },
    },
  });

  await prisma.product.createMany({
    data: [
      {
        id: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
        name: "Tênis Infantil ColorFlex",
        description:
          "Tênis leve, com solado emborrachado e design colorido, desenvolvido especialmente para crianças em fase escolar. Oferece conforto e segurança nas atividades diárias.",
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
        description:
          "Quebra-cabeça educativo com peças em madeira que ajudam as crianças a aprender o alfabeto brincando. Estimula a coordenação motora e o raciocínio lógico.",
        active: true,
        skuCode: "7a9e2b1c3d4f",
        salePrice: 59.9,
        tenantId,
        barCode: "0987654321123",
        internalCode: "abc123",
        categoryId: "85376591-0e1e-4770-b640-25ee7aedccbf",
        subcategoryId: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
      },
      {
        id: "e8c35d6a-2c7e-4c87-bf91-6a3489e302e1",
        name: "Vestido Infantil Floral Dreams",
        description:
          "Vestido leve e colorido com estampa floral, ideal para passeios e festas. Tecido macio que garante conforto durante todo o dia.",
        active: true,
        skuCode: "1f2e3d4c5b6a",
        salePrice: 91.75,
        tenantId,
        barCode: "1234567890128",
        internalCode: "vest001",
        subcategoryId: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
      },
      {
        id: "a1b2c3d4-e5f6-47a8-91b2-c3d4e5f67890",
        name: "Sandália Kids Star Light",
        description:
          "Sandália com tiras ajustáveis e detalhe brilhante, perfeita para passeios em dias quentes. Solado antiderrapante.",
        active: true,
        skuCode: "6b7c8d9e0f1a",
        salePrice: 68.45,
        tenantId,
        barCode: "1122334455667",
        internalCode: "sand002",
        categoryId: "85376591-0e1e-4770-b640-25ee7aedccbf",
        subcategoryId: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
      },
      {
        id: "b9e1c2d3-4f5a-6789-8b1c-2d3e4f5a6789",
        name: "Blocos de Montar Criativos 120 peças",
        description:
          "Kit de blocos de montar coloridos que estimulam a imaginação e a criatividade das crianças, ideal para brincadeiras educativas.",
        active: true,
        skuCode: "2c3d4e5f6g7h",
        salePrice: 77.3,
        tenantId,
        barCode: "2233445566778",
        internalCode: "block003",
        subcategoryId: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
      },
      {
        id: "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
        name: "Patinete Divertix 3 Rodas",
        description:
          "Patinete estável com 3 rodas, ideal para o desenvolvimento do equilíbrio e coordenação motora. Indicado para crianças a partir de 3 anos.",
        active: true,
        skuCode: "4d5e6f7g8h9i",
        salePrice: 197.65,
        tenantId,
        barCode: "3344556677889",
        internalCode: "pat004",
        categoryId: "85376591-0e1e-4770-b640-25ee7aedccbf",
        subcategoryId: "c2eef2d6-a051-4bcb-bac2-f08c6d14e0c5",
      },
    ],
  });
};

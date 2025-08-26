import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  //Warehouses
  const warehouses = [
    {
      code: "BLR-A",
      name: "Bengaluru A",
      city: "Bengaluru",
      country: "IN",
    },
    {
      code: "PNQ-C",
      name: "Pune C",
      city: "Pune",
      country: "IN",
    },
    {
      code: "DEL-B",
      name: "Delhi B",
      city: "New Delhi",
      country: "IN",
    },
  ];
  await prisma.warehouse.createMany({ data: warehouses, skipDuplicates: true });

  //Products
  const prods = [
    {
      id: "P-1001",
      name: "12mm Hex Bolt",
      sku: "HEX-12-100",
    },
    {
      id: "P-1002",
      name: "Steel Washer",
      sku: "WSR-08-500",
    },
    {
      id: "P-1003",
      name: "M8 Nut",
      sku: "NUT-08-200",
    },
    {
      id: "P-1004",
      name: "Bearing 608ZZ",
      sku: "BRG-608-50",
    },
  ];
  await prisma.product.createMany({ data: prods, skipDuplicates: true });

  //Inventory
  const inventory = [
    {
      productId: "P-1001",
      warehouseCode: "BLR-A",
      stock: 180,
      demand: 120,
    },
    {
      productId: "P-1002",
      warehouseCode: "BLR-A",
      stock: 50,
      demand: 80,
    },
    {
      productId: "P-1003",
      warehouseCode: "PNQ-C",
      stock: 80,
      demand: 80,
    },
    {
      productId: "P-1004",
      warehouseCode: "DEL-B",
      stock: 24,
      demand: 120,
    },
  ];

  for (const row of inventory) {
    await prisma.inventory.upsert({
      where: {
        productId_warehouseCode: {
          productId: row.productId,
          warehouseCode: row.warehouseCode,
        },
      },
      update: row,
      create: row,
    });
  }

  // Simple KPI snapshots for 30 days (mock trend)
  const today = new Date();
  for (let i = 29; i > 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Compute from inventory with some tiny daily noise
    const all = await prisma.inventory.findMany();
    const totalStock =
      all.reduce((s, r) => s + r.stock, 0) +
      Math.round((Math.random() - 0.5) * 10);
    const totalDemand =
      all.reduce((s, r) => s + r.demand, 0) +
      Math.round((Math.random() - 0.5) * 10);
    await prisma.kpiSnapshot.upsert({
      where: { date: d },
      update: {
        stock: totalStock,
        demand: totalDemand,
      },
      create: {
        date: d,
        stock: totalStock,
        demand: totalDemand,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());

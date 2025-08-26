import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const typeDefs = readFileSync(
  join(process.cwd(), "src/schema.graphql"),
  "utf8"
);

type GQLProduct = {
  id: String;
  name: String;
  sku: String;
  warehouse: String;
  stock: number;
  demand: number;
};

function toGQLProduct(inv: any & { product: any }): GQLProduct {
  return {
    id: inv.productId,
    name: inv.product.name,
    sku: inv.product.sku,
    warehouse: inv.warehouseCode,
    stock: inv.stock,
    demand: inv.demand,
  };
}

function statusOf(stock: number, demand: number) {
  if (stock > demand) return "Healthy";
  if (stock === demand) return "Low";
  return "Critical";
}

const resolvers = {
  Query: {
    warehouses: async () => prisma.warehouse.findMany(),
    products: async (
      _: unknown,
      args: { search?: string; status?: string; warehouse?: string }
    ) => {
      const where: any = {};
      if (args.warehouse) where.warehouseCode = args.warehouse;

      // Join with product for search
      const invs = await prisma.inventory.findMany({
        where,
        include: { product: true },
        orderBy: { updatedAt: "desc" },
      });

      let rows = invs;

      if (args.search && args.search.trim()) {
        const q = (args.search ?? "").toString().trim().toLowerCase();
        rows = rows.filter(
          (r) =>
            r.product.name.toLowerCase().includes(q) ||
            r.product.sku.toLowerCase().includes(q) ||
            r.productId.toLowerCase().includes(q)
        );
      }
      if (args.status) {
        rows = rows.filter(
          (r) =>
            statusOf(r.stock, r.demand).toLowerCase() ===
            args.status!.toLowerCase()
        );
      }
      return rows.map(toGQLProduct);
    },
    kpis: async (_: unknown, args: { range: string }) => {
      // Accept "7d" | "30d" | "90d" ; default 30d
      const days = /^\d+d$/.test(args.range) ? parseInt(args.range) : 30;
      const since = new Date();
      since.setDate(since.getDate() - days + 1);

      const snaps = await prisma.kpiSnapshot.findMany({
        where: { date: { gte: since } },
        orderBy: { date: "desc" },
      });

      return snaps.map((s) => ({
        date: s.date.toISOString().slice(0, 10),
        stock: s.stock,
        demand: s.demand,
      }));
    },
  },
  Mutation: {
    updateDemand: async (
      _: unknown,
      args: { id: string; warehouse: string; demand: number }
    ) => {
      if (args.demand < 0) throw new Error("Demand must be >= 0");
      // Update ALL warehouses for that product? Your UI shows per-warehouse rows,
      // so update the single inventory row with that product id (assumes one row per product visible).
      // If multiple rows exist for same product in different warehouses, the UI sends the specific row id via warehouse too.

      const updated = await prisma.inventory.update({
        where: {
          // uses the compound unique/primary key
          productId_warehouseCode: {
            productId: args.id,
            warehouseCode: args.warehouse,
          },
        },
        data: { demand: args.demand },
        include: { product: true },
      });
      return {
        id: updated.productId,
        name: updated.product.name,
        sku: updated.product.sku,
        warehouse: updated.warehouseCode,
        stock: updated.stock,
        demand: updated.demand,
      };
    },
    transferStock: async (
      _: unknown,
      args: { id: string; from: string; to: string; qty: number }
    ) => {
      if (args.qty <= 0) throw new Error("Quantity must be > 0");
      if (args.from === args.to)
        throw new Error("From/To cannot be same warehouse");

      return await prisma.$transaction(async (tx) => {
        const fromRow = await tx.inventory.findUnique({
          where: {
            productId_warehouseCode: {
              productId: args.id,
              warehouseCode: args.from,
            },
          },
          include: { product: true },
        });
        if (!fromRow) throw new Error("Source inventory not found");
        if (fromRow.stock < args.qty)
          throw new Error("Insufficient stock at source");

        // Ensure dest exists
        let toRow = await tx.inventory.findUnique({
          where: {
            productId_warehouseCode: {
              productId: args.id,
              warehouseCode: args.to,
            },
          },
          include: { product: true },
        });
        if (!toRow) {
          await tx.inventory.create({
            data: {
              productId: args.id,
              warehouseCode: args.to,
              stock: 0,
              demand: fromRow.demand,
            },
          });

          toRow = await tx.inventory.findUnique({
            where: {
              productId_warehouseCode: {
                productId: args.id,
                warehouseCode: args.to,
              },
            },
            include: { product: true },
          });
        }

        // Move stock
        await tx.inventory.update({
          where: { id: fromRow.id },
          data: { stock: fromRow.stock - args.qty },
        });
        const updatedTo = await tx.inventory.update({
          where: { id: toRow!.id },
          data: { stock: toRow!.stock + args.qty },
          include: { product: true },
        });

        // Return the destination row (so UI can reflect the latest where the qty arrived)
        return toGQLProduct(updatedTo);
      });
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function main() {
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4000,
      host: "0.0.0.0",
    },
  });
  console.log(`SupplySight GraphQL running at ${url}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

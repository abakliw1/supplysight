export type Warehouse = { code: string; name: string };
export type KPI = { date: string; stock: number; demand: number };
export type Product = {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
};
export type Status = "Healthy" | "Low" | "Critical";

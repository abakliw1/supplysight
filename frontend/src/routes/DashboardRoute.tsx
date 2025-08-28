import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
    GET_KPIS, GET_PRODUCTS, GET_WAREHOUSES,
    TRANSFER_STOCK, UPDATE_DEMAND
} from "../connection/graphql/operations";
import type { KPI, Product, Warehouse } from "../types";
import { KPI as KPIBox } from "../components/KPI";
import { TopBar } from "../components/TopBar";
import { TrendChart } from "../components/TrendChart";
import { ProductsTable } from "../components/ProductsTable";
import { Pagination } from "../components/Pagination";
import { Drawer } from "../components/Drawer";

type WareHouseQuery = { warehouses: Warehouse[] };
type KPIsQuery = { kpis: KPI[] };
type ProductsQuery = { products: Product[] };
type ProductsVars = { search?: string | null; warehouse?: string | null; status?: string | null };

export default function DashboardRoute() {
    const [range, setRange] = useState<string>("30d");
    const [search, setSearch] = useState<string>("");
    const [warehouse, setWarehouse] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;

    const {data: warehousesData} = useQuery<WareHouseQuery>(GET_WAREHOUSES);
    const {data: kpisData} = useQuery<KPIsQuery>(GET_KPIS, {variables: {range}});
    const {data: productsData, loading: productsLoading, refetch: productsRefetch} = useQuery<ProductsQuery,ProductsVars>(GET_PRODUCTS, {
        variables: {search: search || null, warehouse: warehouse || null, status: status || null, },
        fetchPolicy: "network-only",
        nextFetchPolicy: "cache-first",
    });

    const [updateDemand, {loading: updatingDemand}] = useMutation(UPDATE_DEMAND, {onCompleted: () => productsRefetch()});
    const [transferStock, {loading: transferring}] = useMutation(TRANSFER_STOCK, {onCompleted: () => productsRefetch()});

    const products: Product[] = (productsData?.products ?? []) as Product[];
    const kpiSeries = kpisData?.kpis ?? [];
    const asOfKpi = kpiSeries.length ? kpiSeries[kpiSeries.length - 1] : undefined;

    const totals = useMemo(() => {
        if (products.length > 0){
            const stock = products.reduce((s, r) => s + Number(r.stock ?? 0), 0);
            const demand = products.reduce((s, r) => s + Number(r.demand ?? 0), 0);
            const fillNum = products.reduce((s, r) => s + Math.min(Number(r.stock ?? 0), Number(r.demand ?? 0)), 0);
            const fillRate = demand > 0 ? Math.round((fillNum / demand) * 100) : 100;
            return { stock, demand, fillRate };
        }
        if (asOfKpi) {
            const stock = Number(asOfKpi.stock ?? 0);
            const demand = Number(asOfKpi.demand ?? 0);
            const fillRate = demand > 0 ? Math.round((Math.min(stock, demand) / demand) * 100) : 0;
            return { stock, demand, fillRate };
        }
        const last = kpiSeries[kpiSeries.length - 1];
        if (last){
            const stock = Number(last.stock ?? 0);
            const demand = Number(last.demand ?? 0);
            const fillRate = demand > 0 ? Math.round((Math.min(stock, demand) / demand) * 100) : 0;
            return { stock, demand, fillRate };
        }
        return { stock: 0, demand: 0, fillRate: 0 };
    }, [products,asOfKpi]);
    useEffect(() => {setPage(1);}, [search, warehouse, status]);
    useEffect(() => {
        // products query isn't time-based yet, but this keeps things in sync UI-wise
        productsRefetch()
    }, [range, productsRefetch]);
    
    const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
    const paged = products.slice((page - 1) * pageSize, page * pageSize);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState<null | Product>(null);
    const selectedKey = selected ? `${selected.id}:${selected.warehouse}`:undefined;
    function openDrawer(row: Product) {
        setSelected(row);
        setDrawerOpen(true);
    }
    function closeDrawer(){
        setDrawerOpen(false);
        setSelected(null);
    }

    const [newDemand, setNewDemand] = useState<string>("");
    const [xferTo, setXferTo] = useState<string>("");
    const [xferQty, setXferQty] = useState<string>("");
    useEffect(() => {
        if(selected){
            setNewDemand(String(selected.demand));
            setXferTo("");
            setXferQty("");
        }
    }, [selected]);

    const whOptions: Warehouse[] = (warehousesData?.warehouses ?? []) as Warehouse[];

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar range={range} setRange={setRange} />
            <div className="mx-auto max-w-7xl space-y-6 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KPIBox label="Total Stock" value={totals.stock.toLocaleString()} info={asOfKpi ? `Sum of Stocks in the Inventory as of ${asOfKpi.date}` : undefined} />
                    <KPIBox label="Total Demand" value={totals.demand.toLocaleString()} info={asOfKpi ? `Sum of Demands by the vendors as of ${asOfKpi.date}` : undefined} />
                    <KPIBox label="Fill Rate" value={`${totals.fillRate}%`} info={asOfKpi ? `Fill Rate As of ${asOfKpi.date} ((sum(min(stock, demand)) / sum(demand)) * 100%)` : undefined} />
                </div>
                <TrendChart data={kpiSeries} />

                <div className="text-sm text-gray-500 px-1">
                    {asOfKpi ? `Products (as of ${asOfKpi.date})` : "Products"}
                </div>
                <ProductsTable 
                    rows={paged} 
                    loading={productsLoading} 
                    onRowClick={openDrawer} 
                    selectedKey={selectedKey} 
                    filters={{
                        search,
                        setSearch,
                        warehouse,
                        setWarehouse,
                        status,
                        setStatus,
                        warehouses:whOptions,
                    }}
                    indexOffset={(page - 1) * pageSize}
                />
                <div className="px-4"><Pagination page={page} pageCount={pageCount} setPage={setPage} /></div>
            </div>

            <Drawer open={drawerOpen} onClose={closeDrawer} title={selected ? `${selected.name} - ${selected.sku}` : "Details"}>
                {selected && (
                    <div className="space-y-6">
                        <section className="rounded-xl border border-gray-200 p-4">
                            <div className="text-sm text-gray-500">Product Details</div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-gray-500">ID:</span><span className="font-medium">{selected.id}</span></div>
                                <div><span className="text-gray-500">SKU:</span><span className="font-medium">{selected.sku}</span></div>
                                <div><span className="text-gray-500">Warehouse:</span><span className="font-medium">{selected.warehouse}</span></div>
                                <div><span className="text-gray-500">Stock:</span><span className="font-medium">{selected.stock}</span></div>
                                <div><span className="text-gray-500">Demand:</span><span className="font-medium">{selected.demand}</span></div>
                            </div>
                        </section>
                        <section className="rounded-xl border border-gray-200 p-4">
                            <div className="mb-3 text-sm font-medium text-gray-700">Update Demand</div>
                            <form 
                                className="flex items-end gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const n = parseInt(newDemand, 10);
                                    if(Number.isNaN(n) || n<0) return alert("Enter a valid non-negative number!");
                                    updateDemand({variables: {id: selected.id, warehouse: selected.warehouse, demand: n}})
                                    .then(() => closeDrawer())
                                    .catch((err) => alert(err.message));
                                }}
                            >
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs text-gray-500">Demand</label>
                                    <input type="number" min={0} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" value={newDemand} onChange={(e) => setNewDemand(e.target.value)} />
                                </div>
                                <button type="submit" disabled={updatingDemand} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{updatingDemand ? "Saving…" : "Save"}</button>
                            </form>
                        </section>

                        <section className="rounded-xl border border-gray-200 p-4">
                            <div className="mb-3 text-sm font-medium text-gray-700">Transfer Stock</div>
                            <form 
                                className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const qty = parseInt(xferQty, 10);
                                    if (!xferTo) return alert("Choose destination warehouse");
                                    if (Number.isNaN(qty) || qty <= 0) return alert("Enter a valid quantity > 0");
                                    transferStock({variables: {id: selected.id, from: selected.warehouse, to: xferTo, qty}})
                                    .then(() => closeDrawer())
                                    .catch((err) => alert(err.message));
                                }}
                            >
                                <div>
                                    <label className="mb-1 block text-xs text-gray-500">To Warehouse</label>
                                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" value={xferTo} onChange={(e) => setXferTo(e.target.value)}>
                                        <option value="">Select...</option>
                                        {whOptions.filter((w) => w.code !== selected.warehouse).map((w) => (
                                            <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-gray-500">Quantity</label>
                                    <input type="number" min={1} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" value={xferQty} onChange={(e) => setXferQty(e.target.value)} />
                                </div>
                                <div className="flex items-end">
                                    <button type="submit" disabled={transferring} className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{transferring ? "Transferring…" : "Transfer"}</button>
                                </div>
                            </form>
                        </section>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

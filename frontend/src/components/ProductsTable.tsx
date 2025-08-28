import React from "react";
import type { Product, Warehouse } from "../types";
import { statusOf, cx } from "../utils";
import { StatusPill } from "./StatusPill";

type FilterProps = {
    search: string;
    setSearch: (v: string) => void;
    warehouse: string;
    setWarehouse: (v: string) => void;
    status: string;
    setStatus: (v: string) => void;
    warehouses: Warehouse[];
}

export function ProductsTable({
    rows,
    loading,
    onRowClick,
    selectedKey,
    filters,
    indexOffset = 0,
}:{
    rows: Product[];
    loading?: boolean;
    onRowClick: (row: Product) => void;
    selectedKey?:string;
    filters: FilterProps;
    indexOffset?:number;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {filters && (
                        <tr className="bg-white">
                            <th className="px-3 py-2" colSpan={3}>
                                <label className="sr-only" htmlFor="tbl-search">Search</label>
                                <input 
                                    id="tbl-search"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 font-normal text-sm outline-none focus:border-gray-500"
                                    placeholder="Search by name, SKU, ID"
                                    value={filters.search}
                                    onChange={(e) => filters.setSearch(e.target.value)}
                                />
                            </th>
                            <th className="px-3 py-2">
                                <label htmlFor="tbl-warehouse" className="sr-only">Warehouse</label>
                                <select 
                                    id="tbl-warehouse"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 font-normal text-sm outline-none focus:border-gray-500"
                                    value={filters.warehouse}
                                    onChange={(e) => filters.setWarehouse(e.target.value)}
                                >
                                    <option value="">All Warehouses</option>
                                    {filters.warehouses.map((w) => (
                                        <option key={w.code} value={w.code}>
                                            {w.code} - {w.name}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-3 py-2">
                                <label htmlFor="tbl-status" className="sr-only">Status</label>
                                <select 
                                    id="tbl-status"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 font-normal text-sm outline-none focus:border-gray-500"
                                    value={filters.status}
                                    onChange={(e) => filters.setStatus(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Healthy">Healthy</option>
                                    <option value="Low">Low</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </th>
                            <th className="px-3 py-2" />
                        </tr>
                    )}
                    <tr>
                        {["#","Products","SKU", "Warehouse", "Stock", "Demand", "Status"].map((h) => (
                            <th 
                                key={h}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading && (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                                Loading...
                            </td>
                        </tr>
                    )}
                    {!loading && rows.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                                No Results
                            </td>
                        </tr>
                    )}
                    {rows.map((row, idx) => {
                        const s = statusOf(row.stock, row.demand);
                        const key = `${row.id}:${row.warehouse}`;
                        const isSelected = selectedKey === key;
                        const displayIndex = indexOffset + idx + 1;
                        return (
                            <tr
                                key={`${row.id}:${row.warehouse}`}
                                aria-selected={isSelected || undefined}
                                className={cx("cursor-pointer", "[&>td]:transition-colors [&>td]:duration-150", "hover:[&>td]:bg-blue-100 active:[&>td]:bg-blue-100", isSelected && "[&>td]:!bg-sky-50 ring-1 ring-sky-200/50")}
                                onClick={() => onRowClick(row)}
                            >
                                <td className="px-4 py-3 text-sm tabular-nums text-gray-500">{displayIndex}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.sku}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.warehouse}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.stock.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.demand.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm">
                                    <StatusPill status={s} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
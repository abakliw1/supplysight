import React from "react";
import type { Product } from "../types";
import { statusOf, cx } from "../utils";
import { StatusPill } from "./StatusPill";

export function ProductsTable({
    rows,
    loading,
    onRowClick,
}:{
    rows: Product[];
    loading?: boolean;
    onRowClick: (row: Product) => void;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {["Products","SKU", "Warehouse", "Stock", "Demand", "Status"].map((h) => (
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
                    {rows.map((row) => {
                        const s = statusOf(row.stock, row.demand);
                        return (
                            <tr
                                key={`${row.id}:${row.warehouse}`}
                                className={cx("cursor-pointer hover:bg-gray-50", s === "Critical" && "bg-red-50")}
                                onClick={() => onRowClick(row)}
                            >
                                <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.sku}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.warehouse}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.stock.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{row.demand.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
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
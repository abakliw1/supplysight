import React from "react";
import type { Warehouse } from "../types";

export function Filters({
    search,
    setSearch,
    warehouse,
    setWarehouse,
    status,
    setStatus,
    warehouses,
}:{
    search: string;
    setSearch: (v: string) => void;
    warehouse: string;
    setWarehouse: (v: string) => void;
    status: string;
    setStatus: (v: string) => void;
    warehouses: Warehouse[];
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" 
                    placeholder="Search by name, SKU, ID"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}>
                        <option value="">All Warehouses</option>
                        {warehouses.map((w) => (
                            <option key={w.code} value={w.code}>
                                {w.code} — {w.name}
                            </option>
                        ))}
                    </select>
                    <select 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Low">Low</option>
                        <option value="Critical">Critical</option>
                    </select>
            </div>
        </div>
    );
}
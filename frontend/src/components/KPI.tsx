import React from "react";

export function KPI({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
            {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
        </div>
    );
}
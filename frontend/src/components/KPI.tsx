import React from "react";
import { Infocon } from "./Infocon";

export function KPI({ label, value, info }: { label: string; value: string | number; info?: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">
                <span className="inline-flex items-center gap-1 align-middle">
                    <span>{label}</span>
                    {info && <Infocon text={info} className="-mt-px" />}
                </span>
            </div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
    );
}
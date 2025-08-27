import React from "react";
import type { Status } from "../types";
import { cx } from "../utils";

export function StatusPill({ status }: { status: Status }) {
    const map: Record<Status,string> = {
        Healthy: "bg-green-100 text-green-800 border-green-200",
        Low: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Critical: "bg-red-100 text-red-800 border-red-200",
    };

    return (
        <span className={cx(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            map[status]
        )}>{status}</span>
    );
}
import React from "react";
import { cx } from "../utils";

export function TopBar ({range,setRange}:{ range: string; setRange: (r: string) => void }){
    const chips: Array<"7d" | "14d" | "30d"> = ["7d", "14d", "30d"];

    return (
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
            <div className="text-xl font-semibold">SupplySight</div>
            <div className="flex items-center gap-2">
                {chips.map((r)=>(
                    <button
                        key={r}
                        onClick={()=>setRange(r)}
                        className={cx(
                            "px-3 py-1 rounded-full text-sm border",
                            range === r
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        )}
                    >
                        {r}
                    </button>
                ))}
            </div>
        </div>
    );
}
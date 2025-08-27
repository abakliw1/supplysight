import React from "react";
import { cx } from "../utils";

export function Drawer({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cx("fixed inset-0 z-50", open ? "" : "pointer-events-none")}>
            <div
                className={cx("absolute inset-0 bg-black/30 transition-opacity", open ? "opacity-100" : "opacity-0")}
                onClick={onClose} 
            />
            <div
                className={cx(
                    "absolute right-0 top-0 h-full w-full max-w-lg transform bg-white shadow-xl transition-transform",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="text-lg font-semibold">{title}</div>
                        <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
                            x
                        </button>
                    <div className="h-[calc(100%-56px)] overflow-auto p-4">{children}</div>
                </div>
            </div>
        </div>
    );
}
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
            <aside 
                role = "dialog"
                aria-modal = "true"
                className={cx("absolute right-0 top-0 h-full w-full max-w-lg transform bg-white shadow-xl transition-transform", open ? "translate-x-0" : "translate-x-full")}
            >
                <button 
                    type="button" 
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    x
                </button>
                <div className="border-b px-4 py-3 pr-12">
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <div className="h-[calc(100%-56px)] overflow-auto p-4">{children}</div>
            </aside>
        </div>
    );
}
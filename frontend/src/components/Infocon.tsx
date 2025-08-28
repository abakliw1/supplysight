import React from "react";
import { cx } from "../utils";
import { FcInfo } from "react-icons/fc";

export function Infocon({
    text,
    className,
} : {
    text: string;
    className?: string
}) {
    return (
        <span className={cx("relative inline-flex group", className)}>
            <button
                type="button"
                aria-label="More Info"
                className={cx(
                    "inline-flex items-center justify-center rounded-full",
                    "text-gray-500 hover:text-gray-700",
                    //"hover:text-gray-700 hover:bg-gray-50",
                    "focus:outline-none focus:ring-2 focus:ring-sky-300"
                )}
                tabIndex={0}
            >
                <FcInfo size={18} aria-hidden="true" className="shrink-0" />
            </button>

            <span role="tooltip" className={cx(
                    "pointer-events-none absolute z-20 -left-1 origin-top-left",
                    "mt-2 w-max max-w-[16rem] rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg",
                    "opacity-0 translate-y-1 transition-all duration-150",
                    "group-hover:opacity-100 group-hover:translate-y-0",
                    "group-focus-within:opacity-100 group-focus-within:translate-y-0"
                )}>{text}</span>
        </span>
    )
}
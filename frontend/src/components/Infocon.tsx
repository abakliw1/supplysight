import React from "react";
import { cx } from "../utils";

export function Infocon({
    text,
    className,
    weight = 400,
    grade = 0,
    opsz = 24,
} : {
    text: string;
    className?: string;
    size?: number;
    filled?: 0 | 1;
    weight?: number;
    grade?: number;
    opsz?: number;
}) {
    const axes = (fill: 0 | 1) =>
        `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`;
    return (
        <span className={cx("relative inline-flex group align-middle", className)}>
            <button
                type="button"
                aria-label="More Info"
                className="inline-flex items-center justify-center rounded-full p-0 leading-none
                   opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                tabIndex={0}
            >
                <span
                    className="material-symbols-outlined transition-opacity duration-150"
                    style={{ lineHeight: 1, fontVariationSettings: axes(0) }}
                    aria-hidden="true"
                >
                    info
                </span>
                <span
                    className="material-symbols-outlined absolute inset-0 flex items-center justify-center
                                opacity-0 transition-opacity duration-150
                                group-hover:opacity-100 group-focus-within:opacity-100"
                    style={{ lineHeight: 1, fontVariationSettings: axes(1) }}
                    aria-hidden="true"
                >
                    info
                </span>
            </button>

            <span
                role="tooltip"
                className="pointer-events-none absolute z-20 -left-1 mt-2 origin-top-left
                        w-max max-w-[16rem] rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg
                        opacity-0 translate-y-1 transition-all duration-150
                        group-hover:opacity-100 group-hover:translate-y-0
                        group-focus-within:opacity-100 group-focus-within:translate-y-0"
            >
                {text}
            </span>
        </span>
    );
}
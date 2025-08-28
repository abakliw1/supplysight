import React from "react";
import { cx } from "../utils";

export function Infocon({
    text,
    className,
    weight = 400,
    grade = 0,
    opsz = 24,
    size,
} : {
    text: string;
    className?: string;
    size?: number;
    filled?: 0 | 1;
    weight?: number;
    grade?: number;
    opsz?: number;
}) {
    const [visible, setVisible] = React.useState(false);
    const [post, setPos] = React.useState<{left: number; top: number} | null>(null);
    const wrapRef = React.useRef<HTMLSpanElement | null>(null);
    
    const axes = (fill: 0 | 1) =>
        `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`;

    const handleMove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if(!rect) return;
        const left = e.clientX - rect.left + 12;
        const top = e.clientY - rect.top - 8;
        setPos({left, top});
    }

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    return (
        <span ref={wrapRef} className={cx("relative inline-flex group align-middle", className)}>
            <button
                type="button"
                aria-label="More Info"
                onMouseEnter={show}
                onMouseMove={handleMove}
                onMouseLeave={hide}
                onFocus={() => {
                    if(wrapRef.current){
                        const rect = wrapRef.current.getBoundingClientRect();
                        setPos({ left: rect.width + 8, top: rect.height / 2 - 10 });
                    }
                    show();
                }}
                className="relative inline-flex h-[1em] w-[1em] items-center justify-center rounded-full p-0 leading-none
                   opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                style={{fontSize: size, width: 15, height: 15}}
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
            
            {visible && post && (
                <span 
                    role="tooltip"
                    className="pointer-events-none absolute z-20 w-max max-w-[18rem] rounded-md bg-gray-900 px-2 py-1
                     text-xs text-white shadow-lg"
                    style={{
                        left: post.left,
                        top: post.top,
                        transform: "translateY(-50%)",
                    }}
                >
                    {text}
                </span>
            )}
        </span>
    );
}
import React from "react";

export function Pagination ({
    page,
    pageCount,
    setPage,
}:{
    page: number;
    pageCount: number;
    setPage: (p: number) => void;
}) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="text-sm text-gray-500">
                Page {page} of {pageCount}
            </div>
            <div className="flex gap-2">
                <button 
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
                    onClick={()=>setPage(1)}
                    disabled={page === 1}
                >
                    First
                </button>
                <button
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
                    onClick={()=>setPage(page-1)}
                    disabled={page <= 1}
                >
                    Prev
                </button>
                <button
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
                    onClick={()=>setPage(page+1)}
                    disabled={page >= pageCount}
                >
                    Next
                </button>
                <button 
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
                    onClick={()=>setPage(pageCount)}
                    disabled={page === pageCount}
                >
                    Last
                </button>
            </div>
        </div>
    );
}
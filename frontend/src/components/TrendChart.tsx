import React from 'react';
import type { KPI } from '../types';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

const COLORS = {
  stock: "#0ea5e9",   // tailwind sky-500
  demand: "#ef4444",  // tailwind red-500
};

export function TrendChart({data}:{data:KPI[]}) {
    return (
        <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
            <div className='mb-2 text-sm font-medium text-gray-700'>Stock vs Demand Trend</div>
            <div className='h-64 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="stock" dot={false} stroke={COLORS.stock} strokeWidth={2} />
                        <Line type="monotone" dataKey="demand" dot={false} stroke={COLORS.demand} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
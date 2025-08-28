import React from 'react';
import type { KPI } from '../types';
import {
    ResponsiveContainer,
    // LineChart,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    Label,
    Area,
} from "recharts";

const COLORS = {
  stock: "#949892ff",   
  demand: "#ff6b01e4",  // tailwind red-500
};

function ordinal(n:number){
    const v = n % 100;
    if(v>=11 && v<=13) return `${n}th`;
    switch(n%10) {
        case 1: return `${n}st`;
        case 2: return `${n}nd`;
        case 3: return `${n}rd`;
        default: return `${n}th`;
    }
}

function formatMonthDay(dateStr: string) {
    const d = new Date(dateStr);
    if(Number.isNaN(d.getTime()))   return dateStr;
    const m = d.toLocaleString("en-US", {month: "short"});
    return `${m} ${ordinal(d.getDate())}`;
}

export function TrendChart({data}:{data:KPI[]}) {
    
    const chartData = React.useMemo(
        () => 
        (data ?? []).map((d) => ({
            ...d,
            stock: Number(d.stock ?? 0),
            demand: Number(d.demand ?? 0),
        })), [data]
    );
    
    return (
        <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
            <div className='mb-2 text-sm font-medium text-gray-700'>
                <span className='inline-flex'>
                    <span>Stock vs Demand Trend</span>
                </span>
            </div>
            <div className='h-64 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 16, bottom: 10 }}>
                        <defs>
                            <linearGradient id='demandFill' x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={COLORS.demand} stopOpacity={0.22} />
                                <stop offset="100%" stopColor={COLORS.demand} stopOpacity={0.3} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            minTickGap={16}
                            tickFormatter={(v) => formatMonthDay(String(v))}
                        >
                            <Label value="Date" position="insideBottom" offset={-10} />
                        </XAxis>

                        <YAxis width={56} tick={{ fontSize: 12 }}>
                            <Label
                                value="Number of items"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: "middle" }}
                            />
                        </YAxis>

                        <Tooltip labelFormatter={(label) => formatMonthDay(String(label))} />
                        <Legend verticalAlign="top" align="right" wrapperStyle={{paddingBottom: 10 }} />

                        <Area type='monotone' dataKey="demand" name='demandGap' stroke='none' fill='url(#demandFill)' isAnimationActive={false} legendType='none' />
                        <Line type="monotone" dataKey="stock" name="Stock" dot={false} stroke={COLORS.stock} strokeWidth={2} />
                        <Line type="monotone" dataKey="demand" name="Demand" dot={false} stroke={COLORS.demand} strokeWidth={2} />
                    </ComposedChart>
                    
                </ResponsiveContainer>
            </div>
        </div>
    );
}
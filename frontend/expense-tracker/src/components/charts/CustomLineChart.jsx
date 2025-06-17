import React from 'react'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    AreaChart,
    ResponsiveContainer,
} from 'recharts'

const CustomLineChart = ({data}) => {

    const customToolTip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                    <p className='text-xs font-semibold text-purple-800 mt-1'>{payload[0].category}</p>
                    <p className='text-sm text-gray-600'>
                        Amount: <span className='text-sm text-gray-600'>₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            )
        }
        return null;
    }
    return (
        <div className='bg-white'>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id='incomeGradiant' x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor='#B75CF5' stopOpacity={0.4} />
                            <stop offset="95%" stopColor='#B75CF5' stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke='none' />

                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke='none' />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke='none' />

                    <Tooltip content={customToolTip} />

                    <Area type="monotone" dataKey="amount"  stroke="#B75CF5" fill="url(#incomeGradiant)" strokeWidth={3} dot={{r:3,fill:"abbdf8"}}/>
                </AreaChart>

            </ResponsiveContainer>

        </div>
    )
}

export default CustomLineChart

import React from 'react'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,Label
} from 'recharts'
import CustomToolTip from './CustomToolTip'
import CustomLegend from './CustomLegend'



const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
    
    const renderCenterText = () => {
        return (
            <>
                <text
                    x="50%"
                    y="50%"
                    dy={-10}
                    textAnchor="middle"
                    fill="#666"
                    fontSize="14px"
                >
                    {label || 'Label'}
                </text>
                <text
                    x="50%"
                    y="50%"
                    dy={15}
                    textAnchor="middle"
                    fill="#333"
                    fontSize="24px"
                    fontWeight="600"
                >
                    {totalAmount || '0'}
                </text>
            </>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}

                    {/* This renders custom content in the center */}
                    {showTextAnchor && (
                        <Label
                            content={renderCenterText}
                            position="center"
                        />
                    )}
                </Pie>
                <Tooltip content={CustomToolTip} />
                <Legend content={CustomLegend} />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default CustomPieChart

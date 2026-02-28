"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
    name: string
    points: number
}

export default function TeamChart({ data }: { data: ChartData[] }) {

    const lastTenQuizzes = data.slice(-9);
    return (
        <div className="h-[300px] w-full bg-neutral-950 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-white">Team stats</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lastTenQuizzes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="points"
                        stroke="#eab308"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
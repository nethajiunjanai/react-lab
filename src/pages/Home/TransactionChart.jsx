import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

import {
    selectTotalDeposits,
    selectTotalWithdrawals,
} from '../../store/slices/transactionSlice';

function TransactionChart() {
    const totalDeposits = useSelector(
        selectTotalDeposits,
    );
    const totalWithdrawals = useSelector(
        selectTotalWithdrawals,
    );

    const chartData = useMemo(
        () => [
            {
                name: 'Deposits',
                value: totalDeposits,
            },
            {
                name: 'Withdrawals',
                value: totalWithdrawals,
            },
        ],
        [totalDeposits, totalWithdrawals],
    );

    return (
        <div className="card">
            <h2 className="text-xl font-semibold mt-0 mb-4">
                Transaction Summary
            </h2>

            <div
                style={{
                    width: '100%',
                    height: 350,
                }}
            >
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                `$${Number(value).toFixed(2)}`
                            }
                        />

                        <Bar
                            dataKey="value"
                            fill="#3B82F6"
                            radius={[
                                6,
                                6,
                                0,
                                0,
                            ]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TransactionChart;
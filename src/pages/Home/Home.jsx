import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@primereact/ui/button';
import { Card } from '@primereact/ui/card';

import {
    selectTransactionCount,
    selectTotalDeposits,
    selectTotalWithdrawals,
    selectNetBalance,
} from '../../store/slices/transactionSlice';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value));

function Home() {
    const navigate = useNavigate();

    const count = useSelector(selectTransactionCount);
    const deposits = useSelector(selectTotalDeposits);
    const withdrawals = useSelector(selectTotalWithdrawals);
    const net = useSelector(selectNetBalance);

    const positiveBalance = net >= 0;

    return (
        <main className="p-3 md:p-4 lg:p-5">
            <div className="w-full">

                {/* Header */}
                <section className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-5">
                    <div>
                        <span className="text-primary font-semibold text-sm">
                            Banking Overview
                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold m-0 mt-2">
                            Transaction Dashboard
                        </h1>

                        <p className="text-color-secondary mt-2 mb-0">
                            Monitor your deposits, withdrawals,
                            and current balance.
                        </p>
                    </div>

                    <Button
                        type="button"
                        label="Create Transaction"
                        icon="pi pi-plus"
                        onClick={() =>
                            navigate('/create-transaction')
                        }
                    >Create Transaction</Button>
                </section>

                {/* Statistics */}
                <section className="grid">
                    {/* Transactions */}
                    <div className="col-12 sm:col-6 lg:col-3">
                        <Card.Root className="h-full">
                            <Card.Body>
                                <Card.Caption>
                                    <Card.Subtitle>
                                        Banking Activity
                                    </Card.Subtitle>

                                    <Card.Title>
                                        Transactions
                                    </Card.Title>
                                </Card.Caption>

                                <Card.Content>
                                    <div className="flex align-items-center gap-3 mt-3">
                                        <span className="text-primary text-3xl font-bold">
                                            ↕
                                        </span>

                                        <span className="text-2xl font-bold">
                                            {count}
                                        </span>
                                    </div>
                                </Card.Content>
                            </Card.Body>
                        </Card.Root>
                    </div>

                    {/* Deposits */}
                    <div className="col-12 sm:col-6 lg:col-3">
                        <Card.Root className="h-full">
                            <Card.Body>
                                <Card.Caption>
                                    <Card.Subtitle>
                                        Money In
                                    </Card.Subtitle>

                                    <Card.Title>
                                        Total Deposits
                                    </Card.Title>
                                </Card.Caption>

                                <Card.Content>
                                    <div className="flex align-items-center gap-3 mt-3">
                                        <span className="text-green-500 text-3xl font-bold">
                                            ↑
                                        </span>

                                        <span className="text-2xl font-bold">
                                            {formatCurrency(
                                                deposits,
                                            )}
                                        </span>
                                    </div>
                                </Card.Content>
                            </Card.Body>
                        </Card.Root>
                    </div>

                    {/* Withdrawals */}
                    <div className="col-12 sm:col-6 lg:col-3">
                        <Card.Root className="h-full">
                            <Card.Body>
                                <Card.Caption>
                                    <Card.Subtitle>
                                        Money Out
                                    </Card.Subtitle>

                                    <Card.Title>
                                        Total Withdrawals
                                    </Card.Title>
                                </Card.Caption>

                                <Card.Content>
                                    <div className="flex align-items-center gap-3 mt-3">
                                        <span className="text-red-500 text-3xl font-bold">
                                            ↓
                                        </span>

                                        <span className="text-2xl font-bold">
                                            {formatCurrency(
                                                withdrawals,
                                            )}
                                        </span>
                                    </div>
                                </Card.Content>
                            </Card.Body>
                        </Card.Root>
                    </div>

                    {/* Net Balance */}
                    <div className="col-12 sm:col-6 lg:col-3">
                        <Card.Root className="h-full">
                            <Card.Body>
                                <Card.Caption>
                                    <Card.Subtitle>
                                        Current Position
                                    </Card.Subtitle>

                                    <Card.Title>
                                        Net Balance
                                    </Card.Title>
                                </Card.Caption>

                                <Card.Content>
                                    <div className="flex align-items-center gap-3 mt-3">
                                        <span
                                            className={
                                                positiveBalance
                                                    ? 'text-green-500 text-3xl font-bold'
                                                    : 'text-red-500 text-3xl font-bold'
                                            }
                                        >
                                            $
                                        </span>

                                        <span
                                            className={
                                                positiveBalance
                                                    ? 'text-green-500 text-2xl font-bold'
                                                    : 'text-red-500 text-2xl font-bold'
                                            }
                                        >
                                            {formatCurrency(net)}
                                        </span>
                                    </div>
                                </Card.Content>
                            </Card.Body>
                        </Card.Root>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="mt-5">
                    <Card.Root>
                        <Card.Body>
                            <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
                                <div>
                                    <Card.Title>
                                        Manage your transactions
                                    </Card.Title>

                                    <Card.Subtitle className="mt-2">
                                        Create new transactions or
                                        view and manage your existing
                                        transaction history.
                                    </Card.Subtitle>
                                </div>

                                <Button
                                    type="button"
                                    label="View Transactions"
                                    icon="pi pi-list"
                                    severity="secondary"
                                    variant="outlined"
                                    onClick={() =>
                                        navigate('/transactions')
                                    }
                                >View transactions</Button>
                            </div>
                        </Card.Body>
                    </Card.Root>
                </section>
            </div>
        </main>
    );
}

export default Home;
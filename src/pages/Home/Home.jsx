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
import "./home.css"
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

    return (
        <main className="home-page">
            <div className="home-container">

                {/* Header */}
                <section className="home-header">
                    <div className="home-header-content">
                        <span className="home-eyebrow">
                            Banking Overview
                        </span>

                        <h1>Transaction Dashboard</h1>

                        <p>
                            Monitor your deposits, withdrawals,
                            and current balance.
                        </p>
                    </div>

                    <div className="home-actions">
                        <Button
                            onClick={() =>
                                navigate('/create-transaction')
                            }
                        >
                            Create Transaction
                        </Button>
                    </div>
                </section>

                {/* Statistics */}
                <section className="stats-grid">

                    {/* Transactions */}
                    <Card.Root className="stat-card">
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
                                <div className="stat-card-content">
                                    <div className="stat-icon stat-icon--blue">
                                        ↕
                                    </div>

                                    <div className="stat-value">
                                        {count}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

                    {/* Deposits */}
                    <Card.Root className="stat-card stat-card--deposit">
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
                                <div className="stat-card-content">
                                    <div className="stat-icon stat-icon--green">
                                        ↑
                                    </div>

                                    <div className="stat-value stat-value--deposit">
                                        {formatCurrency(deposits)}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

                    {/* Withdrawals */}
                    <Card.Root className="stat-card stat-card--withdrawal">
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
                                <div className="stat-card-content">
                                    <div className="stat-icon stat-icon--red">
                                        ↓
                                    </div>

                                    <div className="stat-value stat-value--withdrawal">
                                        {formatCurrency(withdrawals)}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

                    {/* Net Balance */}
                    <Card.Root
                        className={
                            net >= 0
                                ? 'stat-card stat-card--balance-positive'
                                : 'stat-card stat-card--balance-negative'
                        }
                    >
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
                                <div className="stat-card-content">
                                    <div
                                        className={
                                            net >= 0
                                                ? 'stat-icon stat-icon--green'
                                                : 'stat-icon stat-icon--red'
                                        }
                                    >
                                        $
                                    </div>

                                    <div
                                        className={
                                            net >= 0
                                                ? 'stat-value stat-value--positive'
                                                : 'stat-value stat-value--negative'
                                        }
                                    >
                                        {formatCurrency(net)}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

                </section>

                {/* Bottom CTA */}
                <section className="home-info">
                    <div>
                        <h2>Manage your transactions</h2>

                        <p>
                            Create new transactions or view and
                            manage your existing transaction history.
                        </p>
                    </div>

                    <Button
                        severity="secondary"
                        variant="outlined"
                        onClick={() =>
                            navigate('/transactions')
                        }
                    >
                        View Transactions
                    </Button>
                </section>

            </div>
        </main>
    );
}

export default Home;
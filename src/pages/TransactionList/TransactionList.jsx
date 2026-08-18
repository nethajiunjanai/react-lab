import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';

import { AgGridReact } from 'ag-grid-react';
import "./transactionList.css";
import {
    removeTransaction,
    selectAllTransactions,
} from '../../store/slices/transactionSlice';

const maskAccount = (num) => {
    const s = String(num);

    return s.length > 4
        ? '•'.repeat(s.length - 4) + s.slice(-4)
        : s;
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value));

const formatDate = (value) =>
    new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value));

function TransactionList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const transactions = useSelector(selectAllTransactions);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    const filteredTransactions = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return transactions.filter((transaction) => {
            const matchesType =
                typeFilter === 'ALL' ||
                transaction.accountType === typeFilter;

            const matchesSearch =
                !searchValue ||
                String(transaction.name ?? '')
                    .toLowerCase()
                    .includes(searchValue) ||
                String(transaction.accountNumber ?? '')
                    .includes(searchValue);

            return matchesType && matchesSearch;
        });
    }, [transactions, search, typeFilter]);

    const handleDelete = (id) => {
        dispatch(removeTransaction(id));
    };

    const handleCreate = () => {
        navigate('/create-transaction');
    };

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'Name',
                field: 'name',
                flex: 1,
                minWidth: 150,
                cellRenderer: (params) => (
                    <strong>{params.value}</strong>
                ),
            },
            {
                headerName: 'Gender',
                field: 'gender',
                flex: 1,
                minWidth: 120,
                valueFormatter: (params) =>
                    params.value === 'MALE'
                        ? '♂ Male'
                        : '♀ Female',
            },
            {
                headerName: 'Account Number',
                field: 'accountNumber',
                flex: 1.3,
                minWidth: 160,
                valueFormatter: (params) =>
                    maskAccount(params.value),
            },
            {
                headerName: 'Type',
                field: 'accountType',
                flex: 1,
                minWidth: 120,
                cellRenderer: (params) => {
                    const isDeposit =
                        params.value === 'DEPOSIT';

                    return (
                        <span
                            className={
                                isDeposit
                                    ? 'transaction-badge transaction-badge--deposit'
                                    : 'transaction-badge transaction-badge--withdraw'
                            }
                        >
                            {params.value}
                        </span>
                    );
                },
            },
            {
                headerName: 'Amount',
                field: 'amount',
                flex: 1.2,
                minWidth: 140,
                cellClass: (params) =>
                    params.data?.accountType === 'DEPOSIT'
                        ? 'amount amount--deposit'
                        : 'amount amount--withdraw',
                valueFormatter: (params) => {
                    const isDeposit =
                        params.data?.accountType === 'DEPOSIT';

                    const prefix = isDeposit ? '+' : '−';

                    return `${prefix}${formatCurrency(params.value)}`;
                },
            },
            {
                headerName: 'Date',
                field: 'createdAt',
                flex: 1.3,
                minWidth: 170,
                valueFormatter: (params) =>
                    formatDate(params.value),
            },
            {
                headerName: 'Delete',
                field: 'id',
                width: 120,
                minWidth: 120,
                sortable: false,
                filter: false,
                cellRenderer: (params) => (
                    <Button
                        type="button"
                        label="Delete"
                        severity="danger"
                        variant="outlined"
                        size="small"
                        onClick={() =>
                            handleDelete(params.data.id)
                        }
                        aria-label={`Delete transaction for ${params.data.name}`}
                    >Delete</Button>
                ),
            },
        ],
        [],
    );

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            resizable: true,
        }),
        [],
    );

    if (transactions.length === 0) {
        return (
            <main className="transaction-list-page">
                <div className="transaction-list-container">
                    <div className="empty-state">
                        <h1>No transactions</h1>

                        <p>
                            You haven't created any transactions yet.
                        </p>

                        <Button
                            label="Create first transaction"
                            onClick={handleCreate}
                        >Create first transaction</Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="transaction-list-page">
            <div className="transaction-list-container">
               <div className="page-header">
    <div>
        <h1>Transactions</h1>

        <p>
            {transactions.length}{' '}
            {transactions.length === 1
                ? 'transaction'
                : 'transactions'}
        </p>
    </div>

    <div className="page-header-actions">
        <Button
            type="button"
            severity="secondary"
            variant="outlined"
            onClick={() => navigate('/')}
        >
            Home
        </Button>

        <Button
            type="button"
            onClick={handleCreate}
        >
            Create Transaction
        </Button>
    </div>
</div>

                <div className="transaction-toolbar">
                    <InputText
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by name or account number"
                        aria-label="Search transactions"
                    />

                    <div
                        className="transaction-filters"
                        role="group"
                        aria-label="Transaction type filter"
                    >
                        <Button
                            type="button"
                            label="ALL"
                            severity={
                                typeFilter === 'ALL'
                                    ? 'primary'
                                    : 'secondary'
                            }
                            variant={
                                typeFilter === 'ALL'
                                    ? undefined
                                    : 'outlined'
                            }
                            onClick={() => setTypeFilter('ALL')}
                        >All </Button>

                        <Button
                            type="button"
                            label="DEPOSIT"
                            severity={
                                typeFilter === 'DEPOSIT'
                                    ? 'success'
                                    : 'secondary'
                            }
                            variant={
                                typeFilter === 'DEPOSIT'
                                    ? undefined
                                    : 'outlined'
                            }
                            onClick={() => setTypeFilter('DEPOSIT')}
                        >Deposit</Button>

                        <Button
                            type="button"
                            label="WITHDRAW"
                            severity={
                                typeFilter === 'WITHDRAW'
                                    ? 'danger'
                                    : 'secondary'
                            }
                            variant={
                                typeFilter === 'WITHDRAW'
                                    ? undefined
                                    : 'outlined'
                            }
                            onClick={() => setTypeFilter('WITHDRAW')}
                        >Withdraw</Button>
                    </div>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="empty-state">
                        <h2>No matching transactions</h2>

                        <p>
                            Try changing your search or filter.
                        </p>

                        <Button
                            label="Clear filters"
                            severity="secondary"
                            variant="outlined"
                            onClick={() => {
                                setSearch('');
                                setTypeFilter('ALL');
                            }}
                        >Clear filters</Button>
                    </div>
                ) : (
                    <div
                        className="ag-theme-quartz transaction-grid"
                        style={{
                            width: '100%',
                            height: '500px',
                        }}
                    >
                        <AgGridReact
                            rowData={filteredTransactions}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            getRowId={(params) =>
                                String(params.data.id)
                            }
                            animateRows
                            pagination
                            paginationPageSize={10}
                            paginationPageSizeSelector={[
                                10,
                                20,
                                50,
                            ]}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

export default TransactionList;
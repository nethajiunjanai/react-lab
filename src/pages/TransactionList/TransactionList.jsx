import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';

import { AgGridReact } from 'ag-grid-react';

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
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'
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
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold',
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
                        severity="danger"
                        variant="outlined"
                        size="small"
                        onClick={() =>
                            handleDelete(params.data.id)
                        }
                        aria-label={`Delete transaction for ${params.data.name}`}
                    >
                        Delete
                    </Button>
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

    /*
     * Empty state
     */
    if (transactions.length === 0) {
        return (
            <main className="p-3 md:p-5">
                <div className="w-full max-w-70rem mx-auto">
                    <div className="flex flex-column align-items-center justify-content-center text-center min-h-20rem">
                        <i className="pi pi-inbox text-5xl text-color-secondary mb-3" />

                        <h1 className="text-3xl font-bold m-0">
                            No transactions
                        </h1>

                        <p className="text-color-secondary mt-2 mb-4">
                            You haven't created any transactions yet.
                        </p>

                        <Button
                            type="button"
                            onClick={handleCreate}
                        >
                            Create First Transaction
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-3 md:p-5">
            <div className="w-full max-w-90rem mx-auto">

                {/* Header */}
                <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between gap-3 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold m-0">
                            Transactions
                        </h1>

                        <p className="text-color-secondary mt-2 mb-0">
                            {transactions.length}{' '}
                            {transactions.length === 1
                                ? 'transaction'
                                : 'transactions'}
                        </p>
                    </div>

                    <div className="flex flex-column sm:flex-row gap-2 w-full md:w-auto">
                        <Button
                            type="button"
                            severity="secondary"
                            variant="outlined"
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto"
                        >
                            Home
                        </Button>

                        <Button
                            type="button"
                            onClick={handleCreate}
                            className="w-full sm:w-auto"
                        >
                            Create Transaction
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-column lg:flex-row gap-3 justify-content-between mb-4">
                    <InputText
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by name or account number"
                        aria-label="Search transactions"
                        className="w-full lg:w-25rem"
                    />

                    <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Transaction type filter"
                    >
                        <Button
                            type="button"
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
                            onClick={() =>
                                setTypeFilter('ALL')
                            }
                        >
                            All
                        </Button>

                        <Button
                            type="button"
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
                            onClick={() =>
                                setTypeFilter('DEPOSIT')
                            }
                        >
                            Deposit
                        </Button>

                        <Button
                            type="button"
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
                            onClick={() =>
                                setTypeFilter('WITHDRAW')
                            }
                        >
                            Withdraw
                        </Button>
                    </div>
                </div>

                {/* Grid / No results */}
                {filteredTransactions.length === 0 ? (
                    <div className="flex flex-column align-items-center justify-content-center text-center min-h-20rem">
                        <i className="pi pi-search text-4xl text-color-secondary mb-3" />

                        <h2 className="text-2xl font-semibold m-0">
                            No matching transactions
                        </h2>

                        <p className="text-color-secondary mt-2 mb-4">
                            Try changing your search or filter.
                        </p>

                        <Button
                            type="button"
                            severity="secondary"
                            variant="outlined"
                            onClick={() => {
                                setSearch('');
                                setTypeFilter('ALL');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div
                        className="ag-theme-quartz w-full"
                        style={{
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

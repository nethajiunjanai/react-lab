import { useMemo, useRef, useState } from 'react';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    themeQuartz
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';

import { useUsers } from '../../hooks/useUsers';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
]);

const BLOOD_COLORS = {
    'A+': '#fce8e8',
    'A-': '#fce8e8',
    'B+': '#e8f0fc',
    'B-': '#e8f0fc',
    'AB+': '#f0ebfa',
    'AB-': '#f0ebfa',
    'O+': '#e8f5ec',
    'O-': '#e8f5ec',
};

const EmailCellRenderer = ({ value }) => {
    if (!value) {
        return '-';
    }

    return (
        <a
            href={`mailto:${value}`}
            onClick={(event) => event.stopPropagation()}
        >
            ✉ {value}
        </a>
    );
};

const PhoneCellRenderer = ({ value }) => {
    if (!value) {
        return '-';
    }

    return (
        <a
            href={`tel:${value}`}
            onClick={(event) => event.stopPropagation()}
        >
            📞 {value}
        </a>
    );
};

const NameCellRenderer = ({ data }) => {
    if (!data) {
        return null;
    }

    const fullName = `${data.firstName || ''} ${
        data.lastName || ''
    }`.trim();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '100%',
            }}
        >
            <img
                src={data.image}
                width="32"
                height="32"
                alt={fullName}
                style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                }}
            />

            <span>{fullName}</span>
        </div>
    );
};

const BloodGroupRenderer = ({ value }) => {
    return (
        <span
            style={{
                background:
                    BLOOD_COLORS[value] || '#f1f3f5',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
            }}
        >
            {value || '-'}
        </span>
    );
};

function UsersList() {
    const {
        data: users = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useUsers(20);

    // AG Grid reference
    const gridRef = useRef(null);

    // Quick filter input value
    const [quickFilter, setQuickFilter] = useState('');

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'Name',

                valueGetter: (params) =>
                    `${params.data?.firstName || ''} ${
                        params.data?.lastName || ''
                    }`.trim(),

                editable: true,

                valueSetter: (params) => {
                    const value = (params.newValue || '').trim();

                    const [first, ...rest] =
                        value.split(/\s+/);

                    params.data.firstName = first || '';
                    params.data.lastName = rest.join(' ');

                    return true;
                },

                flex: 1.4,
                minWidth: 220,

                cellRenderer: NameCellRenderer,
            },

            {
                headerName: 'Username',
                field: 'username',
                flex: 1,
                minWidth: 140,
            },

            {
                headerName: 'Email',
                field: 'email',
                flex: 1.5,
                minWidth: 250,
                cellRenderer: EmailCellRenderer,
            },

            {
                headerName: 'Phone',
                field: 'phone',
                flex: 1.2,
                minWidth: 180,
                cellRenderer: PhoneCellRenderer,
            },

            {
                headerName: 'Address',

                valueGetter: (params) =>
                    `${params.data?.address?.address || ''}, ${
                        params.data?.address?.city || ''
                    }, ${
                        params.data?.address?.state || ''
                    }`,

                flex: 1.4,
                minWidth: 300,
            },

            // Age formatter
            {
                headerName: 'Age',
                field: 'age',

                valueFormatter: (params) =>
                    `${params.value} yrs`,

                width: 100,
            },

            {
                headerName: 'Gender',
                field: 'gender',
                width: 120,

                valueFormatter: (params) => {
                    if (params.value === 'male') {
                        return '♂ Male';
                    }

                    if (params.value === 'female') {
                        return '♀ Female';
                    }

                    return '-';
                },
            },

            // Blood group renderer
            {
                headerName: 'Blood Group',
                field: 'bloodGroup',
                width: 140,
                cellRenderer: BloodGroupRenderer,
            },

            {
                headerName: 'Bank Card',

                valueGetter: (params) =>
                    params.data?.bank
                        ? `${params.data.bank.cardType} ••••${
                              params.data.bank.cardNumber?.slice(
                                  -4,
                              ) || ''
                          }`
                        : 'N/A',

                flex: 1.2,
                minWidth: 240,
            },
        ],
        [],
    );

    const defaultColDef = useMemo(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
            floatingFilter: true,
        }),
        [],
    );

    // Global quick filter
    const onFilterChange = (event) => {
        const value = event.target.value;

        setQuickFilter(value);

        gridRef.current?.api?.setGridOption(
            'quickFilterText',
            value,
        );
    };

    // Clear quick filter
    const clearQuickFilter = () => {
        setQuickFilter('');

        gridRef.current?.api?.setGridOption(
            'quickFilterText',
            '',
        );
    };

    // Export CSV
    const exportCsv = () => {
        gridRef.current?.api?.exportDataAsCsv({
            fileName: 'users-export.csv',
            columnSeparator: ',',
        });
    };

    if (isLoading) {
        return (
            <main
                style={{
                    minHeight: '100vh',
                    padding: '2rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        textAlign: 'center',
                    }}
                >
                    <h2>Loading users...</h2>
                    <p>Fetching 20 users...</p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main
                style={{
                    minHeight: '100vh',
                    padding: '2rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        textAlign: 'center',
                        gap: '1rem',
                    }}
                >
                    <h2>Unable to load users</h2>

                    <p>
                        {error?.message ||
                            'Something went wrong.'}
                    </p>

                    <Button
                        type="button"
                        icon="pi pi-refresh"
                        onClick={refetch}
                    >
                        Try Again
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main
            style={{
                minHeight: '100vh',
                padding: '2rem',
            }}
        >
            {/* Page Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: '1.75rem',
                        }}
                    >
                        Users
                    </h1>

                    <p
                        style={{
                            margin: '0.5rem 0 0',
                            color: '#6b7280',
                        }}
                    >
                        Showing {users.length} users
                    </p>
                </div>

                <Button
                    type="button"
                    icon="pi pi-refresh"
                    onClick={refetch}
                >
                    Refresh
                </Button>
            </div>

            {/* Search + Export */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                }}
            >
                <InputText
                    value={quickFilter}
                    onChange={onFilterChange}
                    placeholder="Search all columns..."
                    className="w-full"
                    style={{
                        maxWidth: '400px',
                    }}
                />

                <Button
                    type="button"
                    severity="secondary"
                    variant="outlined"
                    icon="pi pi-times"
                    onClick={clearQuickFilter}
                    disabled={!quickFilter}
                >
                    Clear
                </Button>

                <Button
                    type="button"
                    icon="pi pi-download"
                    onClick={exportCsv}
                >
                    Export CSV
                </Button>
            </div>

            {/* AG Grid */}
            <div
                style={{
                    width: '100%',
                }}
            >
                <AgGridReact
                    ref={gridRef}
                    theme={themeQuartz}
                    modules={[ClientSideRowModelModule]}
                    rowData={users}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    paginationPageSize={20}
                    paginationPageSizeSelector={[
                        20,
                        50,
                        100,
                    ]}
                    rowHeight={52}
                    animateRows
                    domLayout="autoHeight"
                    getRowId={(params) =>
                        String(params.data.id)
                    }
                    onCellValueChanged={(params) => {
                        if (
                            params.colDef.headerName ===
                            'Name'
                        ) {
                            console.log(
                                'Updated user:',
                                params.data,
                            );

                            console.log(
                                'firstName:',
                                params.data.firstName,
                            );

                            console.log(
                                'lastName:',
                                params.data.lastName,
                            );
                        }
                    }}
                />
            </div>
        </main>
    );
}

export default UsersList;
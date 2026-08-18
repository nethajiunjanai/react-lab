import { useMemo } from 'react';
import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@primereact/ui/button';

import { useUsers } from '../../hooks/useUsers';

ModuleRegistry.registerModules([AllCommunityModule]);

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

function UsersList() {
    const {
        data: users = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useUsers(20);

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

            {
                headerName: 'Age',
                field: 'age',
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

            {/* AG Grid */}
            <div
                style={{
                    width: '100%',
                }}
            >
                <AgGridReact
                    theme={themeQuartz}
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
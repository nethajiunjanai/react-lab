import { useMemo } from 'react';
import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useUsers } from '../../hooks/useUsers';
import './usersList.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const EmailCellRenderer = ({ value }) => {
    if (!value) {
        return '-';
    }
    return (
        <a
            href={`mailto:${value}`}
            className="user-link"
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
            className="user-link"
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
    const fullName = `${data.firstName || ''} ${data.lastName || ''
        }`.trim();

    return (
        <div className="user-name-cell">
            <img
                src={data.image}
                width="32"
                height="32"
                alt={fullName}
                className="user-avatar"
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
            // 1. Full name from firstName + lastName
            {
                headerName: 'Name',

                valueGetter: (params) =>
                    `${params.data?.firstName || ''} ${params.data?.lastName || ''
                        }`.trim(),

                editable: true,

                valueSetter: (params) => {
                    const value = (params.newValue || '').trim();

                    const [first, ...rest] = value.split(/\s+/);

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

            // 2. Address from nested object
            {
                headerName: 'Address',
                valueGetter: (params) =>
                    `${params.data?.address?.address || ''}, ${params.data?.address?.city || ''
                    }, ${params.data?.address?.state || ''
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

            // 3. Bank summary from nested object
            {
                headerName: 'Bank Card',
                valueGetter: (params) => {
                    if (!params.data?.bank) {
                        return 'N/A';
                    }

                    const cardType = params.data.bank.cardType;
                    const lastFour =
                        params.data.bank.cardNumber?.slice(-4);

                    return `${cardType} ••••${lastFour || ''}`;
                },
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
            <main className="users-list-page">
                <div className="users-state">
                    <div className="users-spinner" />

                    <h2>Loading users...</h2>

                    <p>Fetching 20 users...</p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="users-list-page">
                <div className="users-state users-state--error">
                    <h2>Unable to load users</h2>

                    <p>
                        {error?.message ||
                            'Something went wrong.'}
                    </p>

                    <button
                        type="button"
                        className="retry-button"
                        onClick={refetch}
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }
    return (
        <main className="users-list-page">
            <div className="users-list-container">
                <div className="users-page-header">
                    <div>
                        <h1>Users</h1>
                        <p>
                            Showing {users.length} users
                        </p>
                    </div>
                    <button
                        type="button"
                        className="refresh-button"
                        onClick={refetch}
                    >
                        Refresh
                    </button>
                </div>
                <div className="users-grid">
                    <AgGridReact
                        theme={themeQuartz}
                        rowData={users}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[
                            20,
                            50,
                            100,
                        ]}
                        rowHeight={52}
                        animateRows={true}
                        getRowId={(params) =>
                            String(params.data.id)
                        }
                        onCellValueChanged={(params) => {
                            if (params.colDef.headerName === 'Name') {
                                console.log('Saving user:', params.data);
                            }
                        }}
                    />
                </div>
            </div>
        </main>
    );
}

export default UsersList;
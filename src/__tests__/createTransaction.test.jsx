import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import transactionReducer from '../store/slices/transactionSlice';

// Mock PrimeReact UI components so Jest does not have to parse
// their ESM .mjs implementation.
jest.mock('@primereact/ui/button', () => ({
    Button: ({ children, ...props }) => (
        <button {...props}>{children}</button>
    ),
}));

jest.mock('@primereact/ui/inputtext', () => ({
    InputText: (props) => (
        <input {...props} />
    ),
}));

jest.mock('@primereact/ui/select', () => {
    const Select = ({ children }) => (
        <div>{children}</div>
    );

    Select.Root = ({
        children,
        value,
        options,
        onValueChange,
    }) => (
        <div>
            <button
                type="button"
                aria-label="Select account type"
                onClick={() => {
                    onValueChange({
                        value: options[0].value,
                    });
                }}
            >
                {value || 'Select account type'}
            </button>
            {children}
        </div>
    );

    Select.Trigger = ({ children, ...props }) => (
        <button {...props}>{children}</button>
    );

    Select.Value = ({ placeholder }) => (
        <span>{placeholder}</span>
    );

    Select.Indicator = () => null;

    Select.Portal = ({ children }) => (
        <div>{children}</div>
    );

    Select.Positioner = ({ children }) => (
        <div>{children}</div>
    );

    Select.Popup = ({ children }) => (
        <div>{children}</div>
    );

    Select.List = () => null;

    return {
        Select,
    };
});

const mockNavigate = jest.fn();
const mockMutate = jest.fn();
const mockReset = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/useSaveTransaction', () => ({
    useSaveTransaction: () => ({
        mutate: mockMutate,
        isPending: false,
        error: null,
        reset: mockReset,
    }),
}));

import CreateTransaction from '../pages/CreateTransaction/CreateTransaction';

const makeStore = () =>
    configureStore({
        reducer: {
            transactionReducer,
        },
    });

const renderForm = (store = makeStore()) =>
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CreateTransaction />
            </MemoryRouter>
        </Provider>,
    );

const fillValidForm = () => {
    fireEvent.change(
        screen.getByLabelText('Name'),
        {
            target: { value: 'Alice' },
        },
    );

    fireEvent.click(
        screen.getByLabelText('MALE'),
    );

    fireEvent.change(
        screen.getByLabelText('Account Number'),
        {
            target: { value: '1234567890' },
        },
    );

    fireEvent.click(
        screen.getByRole('button', {
            name: 'Select account type',
        }),
    );

    fireEvent.change(
        screen.getByLabelText('Amount'),
        {
            target: { value: '500' },
        },
    );
};

describe('CreateTransaction form', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockMutate.mockReset();
        mockReset.mockClear();
    });

    test('shows validation errors when the empty form is submitted', async () => {
        renderForm();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Save Transaction',
            }),
        );

        await waitFor(() => {
            expect(
                screen.getByText('Name is required.'),
            ).toBeInTheDocument();

            expect(
                screen.getByText('Select a gender.'),
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'Account number is required.',
                ),
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'Select an account type.',
                ),
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'Enter an amount greater than zero.',
                ),
            ).toBeInTheDocument();
        });

        expect(mockMutate).not.toHaveBeenCalled();
    });

    test('dispatches a PENDING transaction when valid form is submitted', async () => {
        const store = makeStore();

        renderForm(store);

        fillValidForm();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Save Transaction',
            }),
        );

        await waitFor(() => {
            const transactions =
                store.getState().transactionReducer
                    .transactions;

            expect(transactions).toHaveLength(1);
            expect(transactions[0].name).toBe('Alice');
            expect(transactions[0].gender).toBe('MALE');
            expect(transactions[0].accountNumber).toBe(
                '1234567890',
            );
            expect(transactions[0].accountType).toBe(
                'DEPOSIT',
            );
            expect(transactions[0].amount).toBe(500);
            expect(transactions[0].status).toBe('PENDING');
        });

        expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    test('updates the transaction after a mocked successful API response', async () => {
        const store = makeStore();

        mockMutate.mockImplementation((payload, { onSuccess }) => {
            onSuccess({
                data: {
                    ...payload,
                    status: 'SUCCESS',
                },
            });
        });

        renderForm(store);
        fillValidForm();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Save Transaction',
            }),
        );

        await waitFor(() => {
            const transactions =
                store.getState().transactionReducer.transactions;

            expect(transactions).toHaveLength(1);
            expect(transactions[0].status).toBe('SUCCESS');
            expect(
                screen.getByText('Transaction saved successfully.'),
            ).toBeInTheDocument();
        });
    });

    test('removes non-digit characters from account number', () => {
        renderForm();

        const accountNumber =
            screen.getByLabelText('Account Number');

        fireEvent.change(accountNumber, {
            target: {
                value: '12abc34!@56',
            },
        });

        expect(accountNumber).toHaveValue('123456');
    });

    test('limits account number to ten digits', () => {
        renderForm();

        const accountNumber =
            screen.getByLabelText('Account Number');

        fireEvent.change(accountNumber, {
            target: {
                value: '123456789012345',
            },
        });

        expect(accountNumber).toHaveValue(
            '1234567890',
        );
    });

    test('limits name to thirty characters', () => {
        renderForm();

        const name = screen.getByLabelText('Name');

        fireEvent.change(name, {
            target: {
                value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
            },
        });

        expect(name).toHaveValue(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234',
        );

        expect(
            screen.getByText('30/30'),
        ).toBeInTheDocument();
    });

    test('Cancel clears the form and navigates to home', () => {
        renderForm();

        const name = screen.getByLabelText('Name');

        fireEvent.change(name, {
            target: {
                value: 'Alice',
            },
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Cancel',
            }),
        );

        expect(mockReset).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(name).toHaveValue('');
    });
});
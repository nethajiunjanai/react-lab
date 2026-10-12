import React from 'react';
import {
    render,
    screen,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import transactionReducer, {
    addTransaction,
} from '../store/slices/transactionSlice';

// Mock PrimeReact Button
jest.mock('@primereact/ui/button', () => ({
    Button: ({ children, ...props }) => (
        <button {...props}>{children}</button>
    ),
}));

// Mock PrimeReact Card
jest.mock('@primereact/ui/card', () => {
    const Card = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    Card.Root = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    Card.Body = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    Card.Caption = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    Card.Subtitle = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    Card.Title = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    Card.Content = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    return {
        Card,
    };
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

import Home from '../pages/Home/Home';

const makeStore = () =>
    configureStore({
        reducer: {
            transactionReducer,
        },
    });

const renderHome = (store = makeStore()) =>
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        </Provider>,
    );

describe('Home page', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders the transaction dashboard heading and navigation buttons', () => {
        renderHome();

        expect(
            screen.getByRole('heading', {
                name: 'Transaction Dashboard',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Create Transaction',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'View transactions',
            }),
        ).toBeInTheDocument();
    });

    test('Create Transaction button navigates to /create-transaction', () => {
        renderHome();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Create Transaction',
            }),
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            '/create-transaction',
        );
    });

    test('View transactions button navigates to /transactions', () => {
        renderHome();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'View transactions',
            }),
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            '/transactions',
        );
    });

    test('displays zero transactions and zero balances for an empty store', () => {
        renderHome();

        expect(screen.getByText('0')).toBeInTheDocument();

        expect(
            screen.getAllByText('$0.00'),
        ).toHaveLength(3);
    });

    test('displays seeded transaction count and calculated financial totals', () => {
        const store = makeStore();

        store.dispatch(
            addTransaction({
                id: 'deposit-1',
                name: 'Alice',
                amount: 1500,
                accountType: 'DEPOSIT',
            }),
        );

        store.dispatch(
            addTransaction({
                id: 'withdraw-1',
                name: 'Bob',
                amount: 300,
                accountType: 'WITHDRAW',
            }),
        );

        renderHome(store);

        expect(
            screen.getByText('2'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('$1,500.00'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('$300.00'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('$1,200.00'),
        ).toBeInTheDocument();
    });
});
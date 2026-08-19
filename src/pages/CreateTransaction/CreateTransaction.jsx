import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Select } from '@primereact/ui/select';

import {
    addTransaction,
    removeTransaction,
    selectNetBalance,
    updateTransactionStatus,
} from '../../store/slices/transactionSlice';

import { useSaveTransaction } from '../../hooks/useSaveTransaction';

const INITIAL_FORM = {
    name: '',
    gender: '',
    accountNumber: '',
    accountType: '',
    amount: '',
};

const ACCOUNT_TYPES = [
    { label: 'DEPOSIT', value: 'DEPOSIT' },
    { label: 'WITHDRAW', value: 'WITHDRAW' },
];

function validate(form) {
    const errors = {};

    if (!form.name?.trim()) {
        errors.name = 'Name is required.';
    } else if (form.name.trim().length > 30) {
        errors.name = 'Name must be 30 characters or fewer.';
    }

    if (!form.gender) {
        errors.gender = 'Select a gender.';
    }

    if (!form.accountNumber?.trim()) {
        errors.accountNumber = 'Account number is required.';
    } else if (!/^\d+$/.test(form.accountNumber)) {
        errors.accountNumber = 'Digits only.';
    }

    if (!form.accountType) {
        errors.accountType = 'Select an account type.';
    }

    if (
        form.amount === '' ||
        form.amount === null ||
        Number.parseFloat(form.amount) <= 0
    ) {
        errors.amount = 'Enter an amount greater than zero.';
    }

    return errors;
}

export default function CreateTransaction() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        mutate,
        isPending,
        error,
        reset,
    } = useSaveTransaction();

    const netBalance = useSelector(selectNetBalance);

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const updateField = (field, value) => {
        // Clear the previous TanStack Query mutation error.
        reset();

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = { ...current };
            delete next[field];

            return next;
        });

        setSuccessMessage('');
    };

    const handleNameChange = (event) => {
        const value = event.target.value.slice(0, 30);

        updateField('name', value);
    };

    const handleAccountNumberChange = (event) => {
        const value = event.target.value
            .replace(/\D/g, '')
            .slice(0, 10);

        updateField('accountNumber', value);
    };

    const handleAmountChange = (event) => {
        let value = event.target.value;

        // Allow only digits and decimal point.
        value = value.replace(/[^\d.]/g, '');

        // Allow only one decimal point.
        const parts = value.split('.');

        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        // Maximum two decimal places.
        if (value.includes('.')) {
            const [whole, decimal] = value.split('.');

            value = `${whole}.${decimal.slice(0, 2)}`;
        }

        updateField('amount', value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 1. Validate form.
        const validationErrors = validate(form);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSuccessMessage('');
            return;
        }

        const amount = Number.parseFloat(form.amount);

        // Check withdrawal balance before optimistic update.
        if (
            form.accountType === 'WITHDRAW' &&
            amount > netBalance
        ) {
            setErrors({
                amount: `Insufficient balance. Available balance is ${netBalance.toFixed(
                    2,
                )}.`,
            });

            setSuccessMessage('');
            return;
        }

        // Generate the ID before adding the optimistic record.
        const optimisticId = Date.now();

        const payload = {
            id: optimisticId,
            ...form,
            name: form.name.trim(),
            amount,
            status: 'PENDING',
        };

        // Clear validation/success messages.
        setErrors({});
        setSuccessMessage('');

        // 2. Optimistic update.
        // The transaction immediately appears as PENDING.
        dispatch(addTransaction(payload));

        // 3. Fire the mock mutation.
        mutate(payload, {
            // 4. Success → PENDING becomes SUCCESS.
            onSuccess: () => {
                dispatch(
                    updateTransactionStatus({
                        id: optimisticId,
                        status: 'SUCCESS',
                    }),
                );

                setForm(INITIAL_FORM);
                setSuccessMessage(
                    'Transaction saved successfully.',
                );
            },

            // 5. Error → rollback.
            // TanStack Query stores the error in `error`.
            onError: () => {
                dispatch(removeTransaction(optimisticId));
            },
        });
    };

    const handleCancel = () => {
        reset();
        setForm(INITIAL_FORM);
        setErrors({});
        setSuccessMessage('');

        navigate('/');
    };

    return (
        <main className="p-3 md:p-5">
            <div className="w-full max-w-30rem mx-auto">

                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-3xl font-bold m-0">
                        Create Transaction
                    </h1>

                    <p className="text-color-secondary mt-2 mb-0">
                        Enter the transaction details below.
                    </p>
                </div>

                {/* Current Balance */}
                <div className="mb-4 p-3 border-round bg-primary-50">
                    <div className="text-sm text-color-secondary">
                        Available Balance
                    </div>

                    <div className="text-2xl font-bold text-primary mt-1">
                        $
                        {Number(netBalance).toFixed(2)}
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-column gap-4"
                >
                    {/* Name */}
                    <div className="flex flex-column gap-2">
                        <label
                            htmlFor="transaction-name"
                            className="font-semibold"
                        >
                            Name
                        </label>

                        <InputText
                            id="transaction-name"
                            value={form.name}
                            onChange={handleNameChange}
                            maxLength={30}
                            invalid={Boolean(errors.name)}
                            placeholder="Enter name"
                            className="w-full"
                        />

                        <div className="flex justify-content-between">
                            {errors.name ? (
                                <small className="text-red-500">
                                    {errors.name}
                                </small>
                            ) : (
                                <span />
                            )}

                            <small className="text-color-secondary">
                                {form.name.length}/30
                            </small>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-column gap-2">
                        <span className="font-semibold">
                            Gender
                        </span>

                        <div className="flex flex-wrap gap-4">
                            <label className="flex align-items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={
                                        form.gender === 'MALE'
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            'gender',
                                            event.target.value,
                                        )
                                    }
                                />

                                <span>MALE</span>
                            </label>

                            <label className="flex align-items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={
                                        form.gender === 'FEMALE'
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            'gender',
                                            event.target.value,
                                        )
                                    }
                                />

                                <span>FEMALE</span>
                            </label>
                        </div>

                        {errors.gender && (
                            <small className="text-red-500">
                                {errors.gender}
                            </small>
                        )}
                    </div>

                    {/* Account Number */}
                    <div className="flex flex-column gap-2">
                        <label
                            htmlFor="account-number"
                            className="font-semibold"
                        >
                            Account Number
                        </label>

                        <InputText
                            id="account-number"
                            value={form.accountNumber}
                            onChange={handleAccountNumberChange}
                            inputMode="numeric"
                            maxLength={10}
                            invalid={Boolean(errors.accountNumber)}
                            placeholder="Enter account number"
                            className="w-full"
                        />

                        {errors.accountNumber && (
                            <small className="text-red-500">
                                {errors.accountNumber}
                            </small>
                        )}
                    </div>

                    {/* Account Type */}
                    <div className="flex flex-column gap-2">
                        <label
                            htmlFor="account-type"
                            className="font-semibold"
                        >
                            Account Type
                        </label>

                        <Select.Root
                            value={form.accountType}
                            options={ACCOUNT_TYPES}
                            optionLabel="label"
                            optionValue="value"
                            onValueChange={(event) =>
                                updateField(
                                    'accountType',
                                    event.value,
                                )
                            }
                            invalid={Boolean(errors.accountType)}
                        >
                            <Select.Trigger
                                id="account-type"
                                type="button"
                                className="w-full"
                            >
                                <Select.Value placeholder="Select account type" />
                                <Select.Indicator />
                            </Select.Trigger>

                            <Select.Portal>
                                <Select.Positioner>
                                    <Select.Popup>
                                        <Select.List />
                                    </Select.Popup>
                                </Select.Positioner>
                            </Select.Portal>
                        </Select.Root>

                        {errors.accountType && (
                            <small className="text-red-500">
                                {errors.accountType}
                            </small>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="flex flex-column gap-2">
                        <label
                            htmlFor="transaction-amount"
                            className="font-semibold"
                        >
                            Amount
                        </label>

                        <InputText
                            id="transaction-amount"
                            type="text"
                            inputMode="decimal"
                            value={form.amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            invalid={Boolean(errors.amount)}
                            className="w-full"
                        />

                        {errors.amount && (
                            <small className="text-red-500">
                                {errors.amount}
                            </small>
                        )}
                    </div>

                    {/* TanStack Mutation Error */}
                    {error && (
                        <div
                            role="alert"
                            className="p-3 border-round bg-red-50 text-red-700"
                        >
                            {error.message ||
                                'Failed to save transaction.'}
                        </div>
                    )}

                    {/* Success */}
                    {successMessage && (
                        <div
                            role="status"
                            className="p-3 border-round bg-green-50 text-green-700"
                        >
                            {successMessage}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-column sm:flex-row justify-content-end gap-2 pt-2">
                        <Button
                            type="button"
                            severity="secondary"
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            severity="secondary"
                            onClick={() =>
                                navigate('/transactions')
                            }
                            disabled={isPending}
                            className="w-full sm:w-auto"
                        >
                            Transaction List
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto"
                        >
                            Save Transaction
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
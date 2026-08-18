import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Select } from '@primereact/ui/select';

import { addTransaction } from '../../store/slices/transactionSlice';
import "./createTransaction.css";

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

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        // Clear the field error as the user corrects it.
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validate(form);

        setErrors(validationErrors);
        setSuccessMessage('');

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        dispatch(
            addTransaction({
                ...form,
                name: form.name.trim(),
                amount: Number.parseFloat(form.amount),
            }),
        );

        setForm(INITIAL_FORM);
        setErrors({});
        setSuccessMessage('Transaction saved');
    };

    const handleCancel = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setSuccessMessage('');

        navigate('/');
    };

    return (
        <main className="create-transaction-page">
            <div className="create-transaction-container">
                <div className="page-header">
                    <h1>Create Transaction</h1>
                    <p>Enter the transaction details below.</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="transaction-form"
                >
                    {/* Name */}
                    <div className="form-field">
                        <label htmlFor="transaction-name">
                            Name
                        </label>

                        <InputText
                            id="transaction-name"
                            value={form.name}
                            onChange={handleNameChange}
                            maxLength={30}
                            invalid={Boolean(errors.name)}
                            placeholder="Enter name"
                        />

                        <div className="character-count">
                            {form.name.length}/30
                        </div>

                        {errors.name && (
                            <small className="field-error">
                                {errors.name}
                            </small>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="form-field">
                        <span className="field-label">
                            Gender
                        </span>

                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={form.gender === 'MALE'}
                                    onChange={(event) =>
                                        updateField('gender', event.target.value)
                                    }
                                />

                                <span>MALE</span>
                            </label>

                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={form.gender === 'FEMALE'}
                                    onChange={(event) =>
                                        updateField('gender', event.target.value)
                                    }
                                />

                                <span>FEMALE</span>
                            </label>
                        </div>

                        {errors.gender && (
                            <small className="field-error">
                                {errors.gender}
                            </small>
                        )}
                    </div>

                    {/* Account Number */}
                    <div className="form-field">
                        <label htmlFor="account-number">
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
                        />

                        {errors.accountNumber && (
                            <small className="field-error">
                                {errors.accountNumber}
                            </small>
                        )}
                    </div>

                    {/* Account Type */}
                    <div className="form-field">
                        <label htmlFor="account-type">
                            Account Type
                        </label>

                        <Select.Root
                            value={form.accountType}
                            options={ACCOUNT_TYPES}
                            optionLabel="label"
                            optionValue="value"
                            onValueChange={(event) => {
                                updateField('accountType', event.value);
                            }}
                            invalid={Boolean(errors.accountType)}
                        >
                            <Select.Trigger
                                id="account-type"
                                type="button"
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
                            <small className="field-error">
                                {errors.accountType}
                            </small>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="form-field">
                        <label htmlFor="transaction-amount">
                            Amount
                        </label>

                        <InputText
                            id="transaction-amount"
                            type="text"
                            inputMode="decimal"
                            value={form.amount}
                            onChange={(event) => {
                                let value = event.target.value;

                                // Allow only digits and one decimal point.
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
                            }}
                            placeholder="0.00"
                            invalid={Boolean(errors.amount)}
                        />

                        {errors.amount && (
                            <small className="field-error">
                                {errors.amount}
                            </small>
                        )}
                    </div>
                    {/* Success */}
                    {successMessage && (
                        <div
                            role="status"
                            className="success-message"
                        >
                            {successMessage}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="form-actions">
                        <Button
                            type="button"
                            label="Cancel"
                            variant="outlined"
                            severity="secondary"
                            onClick={handleCancel}
                        >Cancel</Button>

                        <Button
                            label="Transcation list"
                            onClick={() =>
                                navigate('/transactions')
                            }>
                            Transcation list
                        </Button>

                        <Button
                            type="submit"
                            label="Save Transaction"
                        >Submit</Button>
                    </div>
                </form>
            </div>
        </main>
    );
}


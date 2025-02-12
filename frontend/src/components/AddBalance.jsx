import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddBalance = () => {
    const { user } = useAuth();
    const [amounts, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        amount: amounts,
        currency: 'ETB',
        email: user.email,
        first_name: user.username,
        last_name: user.username,
        phone_number: "0918181818",
    });

    const handleInputChange = (e) => {
        const newAmount = e.target.value;
        console.log(newAmount);
        setAmount(newAmount);
        setForm((prevForm) => ({
            ...prevForm,
            amount: newAmount,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tx_ref = `${Date.now()}`;
        const amount = amounts;
        // Assuming you have an API endpoint to add balance
        try {
            console.log(form)

            const response = await fetch("/api/users/final-payment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...form,
                    tx_ref,
                    amount
                }),
            })

            const result = await response.json();
            console.log(result);
            window.location.href = result.data?.checkout_url;
        } catch (error) {
            console.log(error)
            console.error('Payment initiation failed', error);
        }

    };

    return (
        <div className='max-w-2xl mx-auto min-h-screen '>
            <div className=' p-6 bg-gray-800 text-white shadow-md rounded-lg mt-8'>
                <h2 className="text-2xl font-semibold mb-4 text-center">Add Balance</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <input onChange={handleInputChange}
                            className="w-full px-4 py-2 border bg-slate-500 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="number"
                            id="amount"
                            value={amounts}

                            required
                        />
                    </div>
                    <button type="submit"
                        className='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300'
                    >Add Balance</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>

    );
};

export default AddBalance;
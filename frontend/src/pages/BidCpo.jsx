import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const BidCpo = () => {
  const { user } = useAuth()
  const { amount } = useParams()
  const [form, setForm] = useState({
    amount: amount,
    currency: 'ETB',
    email: user.email,
    first_name: user.username,
    last_name: user.username,
    phone_number: user.phone,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx_ref = `${form.first_name}-${Date.now()}`;

    try {
      const res = await axios.post('/api/users/accept-payment', {
        ...form,
        tx_ref,
      });
      window.location.href = res.data.data.checkout_url;
    } catch (error) {
      console.log(error)
      console.error('Payment initiation failed', error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto min-h-screen '>
      <div className=' p-6 bg-gray-800 text-white shadow-md rounded-lg mt-8'>
        <h2 className="text-2xl font-semibold mb-4 text-center">Bid Security Payment page</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Input fields for amount, email, first name, last name, phone number */}

          <div>
            <p>amount: {amount}birr</p>
          </div>
          <button type="submit"
            className='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300'>Pay</button>
        </form>
      </div>

    </div>

  );
};

export default BidCpo;

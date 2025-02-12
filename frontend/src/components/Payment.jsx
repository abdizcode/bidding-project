import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const Payment = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const [amount, setAmount] = useState()
  //   const { amount } = useParams()
  const [form, setForm] = useState({
    amount: 888,
    currency: 'ETB',
    email: user.email,
    first_name: user.username,
    last_name: user.username,
    phone_number: "0918181818",
  });

  useEffect(() => {
    const fechAuction = async () => {
      try {
        const auctionRes = await axios.get(`/api/auctions/${id}`);
        const res = await axios.get(`/api/bids/${id}`);
        const bids = res.data;
        const highestBid = Math.max(...bids.map((bid) => bid.bidAmount))
        const endDate = new Date(auctionRes.endDate);
        const now = new Date();
        const timeDiff = endDate - now;
        if (timeDiff > 0) {
          const bidCpo = (auctionRes.startingBid * 10) / 100;
          setAmount(bidCpo);
        } else {
          setAmount(highestBid);
        }

      } catch (error) {
        console.error(error)
      }
    }
    fechAuction();
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx_ref = `${form.first_name}-${Date.now()}`;

    try {
      // const res = await axios.post('/api/users/accept-payment', {
      //   ...form,
      //   tx_ref,
      // });

      console.log(form)

      const response = await fetch("/api/users/final-payment", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          tx_ref
        }),
      })

      const result = await response.json();
      console.log(result);
      window.location.href = result.data?.checkout_url;
      
    } catch (error) {
      console.log(error)
      console.error('Payment initiation failed in frontend', error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto min-h-screen '>
      <div className=' p-6 bg-gray-800 text-white shadow-md rounded-lg mt-8'>
        <h2 className="text-2xl font-semibold mb-4 text-center">Payment Page</h2>
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

export default Payment;

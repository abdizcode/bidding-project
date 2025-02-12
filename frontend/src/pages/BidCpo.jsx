import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const BidCpo = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [bidAmount, setBidAmount] = useState("")
  const [auction, setAuction] = useState("")
  const [message, setmessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
          amount: bidAmount,
          currency: 'ETB',
          email: user.email,
          first_name: user.username,
          last_name: user.username,
          phone_number: "0918181818",
      });

  useEffect(() => {
    const fechAuction = async () => {
      try {
        const res = await axios.get(`/api/auctions/${id}`);
        setAuction(res.data)
        const amount = (res.data.startingBid * 10) / 100;
        setBidAmount(amount)
        setForm((prevForm) => ({
          ...prevForm,
          amount: amount,
      }));
      } catch (error) {
        console.error(error)
      }
    }
    fechAuction();
  }, [])

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!bidAmount) return;

  //   try {
  //     setLoading(true);
  //     const response = await axios.post("/api/users/cpo-payment", {
  //       bidAmount, aucId: id, userId: user._id,
  //     });

  //     if (response) {
  //       navigate(`/auction/${id}`);
  //     } else {
  //       setmessage(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Payment initiation failed:", error);
  //     setmessage(error.response?.data?.message || "An error occurred");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx_ref = `${Date.now()}`;
    const amount = bidAmount;
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
                amount,
                auctionId: id,
            }),
        })

        const result = await response.json();
        console.log(result);
        window.location.href = result.data?.checkout_url;
    } catch (error) {
        console.log(error)
        console.error('Payment initiation failed', error);
        setmessage(error.response?.data?.message || "An error occurred"); 
    }

};

  return (
    <div className='max-w-2xl mx-auto min-h-screen '>
      <div className=' p-6 bg-gray-800 text-white shadow-md rounded-lg mt-8'>
        <h2 className="text-2xl font-semibold mb-6 text-center">Bid Security Payment page</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Input fields for amount, email, first name, last name, phone number */}
          <p className='text-sm'>You are going to pay a bidding Security. It's a 10% of the auction starting amount!</p>
          <div>
            <p>Auction name: <span className='text-gray-400'>{auction.title}</span></p>
          </div>
          <div>
            <p>Starting Bid amount: <span className='text-gray-400'>{auction.startingBid}birr</span></p>
          </div>
          <div>
            <p>CPO Amount: <span className='text-gray-400'>{bidAmount}birr</span></p>
          </div>
          <button type="submit"
            className='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300'>Pay</button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Pay"
            )}
          </button>
          {message && <p className='text-red-500'>{message}</p>}
        </form>
      </div>

    </div>

  );
};

export default BidCpo;

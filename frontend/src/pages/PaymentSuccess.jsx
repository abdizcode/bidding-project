import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { tx_ref } = useParams();
    const location = useLocation();
    const { fetchUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(null);


    // Function to get query parameters
    const getQueryParams = (search) => {
        return new URLSearchParams(search);
    };
    const queryParams = getQueryParams(location.search);
    const auctionId = queryParams.get('aucId');
    useEffect(() => {
        const checkTransaction = async () => {

            console.log(tx_ref, auctionId);

            try {
                // const response = await axios.post(`/api/users/verifyTransaction/${tx_ref}`);

                const response = await fetch("/api/users/verifyTransaction", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tx_ref,
                        auctionId,
                    }),
                });
                console.log(response);

                setTransactionStatus(response.status);
            } catch (error) {
                console.error('Error checking transaction:', error);
            } finally {
                setLoading(false);
            }
        };

        checkTransaction();
    }, [tx_ref, location.search]);

    const handleGoBack = () => {
        fetchUser();
        navigate(`/auction/${auctionId}`);
    };

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    return (
        <div className="text-center mt-20">
            {transactionStatus === 200 ? (
                <>
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="mt-4">Thank you for your payment. Your transaction has been completed successfully.</p>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-bold">Payment Failed</h1>
                    <p className="mt-4">There was an issue with your payment. Please try again.</p>
                </>
            )}
            <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={handleGoBack}
            >
                Go to Home
            </button>
        </div>
    );
};

export default PaymentSuccess;
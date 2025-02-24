import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Terms of Use & Privacy Policy</h1>
            
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">1. Introduction</h2>
                <p className="text-gray-600 mt-2">Welcome to our auction platform. By using our services, you agree to these terms and conditions. These terms outline the rights and obligations of all users, including admins, vendors, and bidders.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">2. User Responsibilities</h2>
                <ul className="list-disc ml-6 text-gray-600">
                    <li>Users must provide accurate information during registration.</li>
                    <li>Bidders must ensure they have the necessary funds before placing a bid.</li>
                    <li>Vendors must ensure the authenticity of listed items.</li>
                    <li>The highest bidder must complete payment within three days, or the next highest bidder will be contacted.</li>
                    <li>Users must comply with all applicable local and international laws regarding auctions.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">3. Auction Rules (Ethiopia)</h2>
                <p className="text-gray-600 mt-2">According to Ethiopian auction laws:</p>
                <ul className="list-disc ml-6 text-gray-600">
                    <li>All auctions must be conducted fairly and transparently.</li>
                    <li>Local products may receive preference in bidding.</li>
                    <li>In case of a tie, the winner may be determined by drawing lots.</li>
                    <li>Payments must be verified before awarding the final bid.</li>
                    <li>All bids must be legally binding and cannot be withdrawn after submission.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">4. Privacy Policy</h2>
                <p className="text-gray-600 mt-2">We value your privacy and ensure your data is protected.</p>
                <ul className="list-disc ml-6 text-gray-600">
                    <li>Your personal data will only be used for auction-related purposes.</li>
                    <li>We do not share your information with third parties without consent.</li>
                    <li>Secure payment processing is enforced through Chapa.</li>
                    <li>Users can request data deletion by contacting support.</li>
                    <li>We implement stringent security measures to protect user data from breaches.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">5. Payment & Refund Policy</h2>
                <p className="text-gray-600 mt-2">All payments are final and must be completed within the specified time frame. Refunds will only be issued in cases where:</p>
                <ul className="list-disc ml-6 text-gray-600">
                    <li>The vendor fails to deliver the promised item.</li>
                    <li>The item received does not match the auction description.</li>
                    <li>Fraudulent activity is detected and verified by our team.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">6. Dispute Resolution</h2>
                <p className="text-gray-600 mt-2">Any disputes must be resolved in accordance with Ethiopian contract laws. If an agreement cannot be reached, arbitration may be pursued under the appropriate legal framework.</p>
            </section>

            <footer className="text-center text-gray-500 text-sm mt-8">&copy; 2025 Auction System. All rights reserved.</footer>
        </div>
    );
};

export default PrivacyPolicy;
